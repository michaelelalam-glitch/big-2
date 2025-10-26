const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

// Default route - redirect to the multiplayer game
app.get('/', (req, res) => {
    res.redirect('/big2-multiplayer.html');
});

const rooms = new Map();

class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
    getValue() {
        const values = {'3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14, '2': 15};
        return values[this.rank];
    }
    getSuitValue() {
        const suitValues = { '♦': 1, '♣': 2, '♥': 3, '♠': 4 };
        return suitValues[this.suit];
    }
    getCompareValue() {
        return this.getValue() * 10 + this.getSuitValue();
    }
}

class GameRoom {
    constructor(roomCode, hostSocketId, hostName) {
        this.roomCode = roomCode;
        this.players = [{socketId: hostSocketId, name: hostName, position: 0, hand: [], isReady: false}];
        this.gameStarted = false;
        this.currentPlayer = 0;
        this.lastPlay = [];
        this.lastPlayPlayer = -1;
        this.consecutivePasses = 0;
        this.round = 1;
        this.scores = [0, 0, 0, 0];
        this.gameOver = false;
    }
    addPlayer(socketId, playerName) {
        if (this.players.length >= 4) return false;
        this.players.push({socketId: socketId, name: playerName, position: this.players.length, hand: [], isReady: false});
        return true;
    }
    removePlayer(socketId) {
        const index = this.players.findIndex(p => p.socketId === socketId);
        if (index !== -1) {
            this.players.splice(index, 1);
            this.players.forEach((player, idx) => { player.position = idx; });
            return true;
        }
        return false;
    }
    canStart() {
        return this.players.length === 4 && !this.gameStarted;
    }
    createDeck() {
        const suits = ['♠', '♥', '♣', '♦'];
        const ranks = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
        const deck = [];
        for (const suit of suits) {
            for (const rank of ranks) { deck.push(new Card(suit, rank)); }
        }
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }
    dealCards(findFirstPlayer = true) {
        const deck = this.createDeck();
        for (let i = 0; i < 52; i++) {
            const playerIndex = i % 4;
            if (!this.players[playerIndex].hand) { this.players[playerIndex].hand = []; }
            this.players[playerIndex].hand.push(deck[i]);
        }
        this.players.forEach(player => {
            player.hand.sort((a, b) => a.getCompareValue() - b.getCompareValue());
        });
        if (findFirstPlayer) {
            for (let p = 0; p < this.players.length; p++) {
                for (const card of this.players[p].hand) {
                    if (card.rank === '3' && card.suit === '♦') {
                        this.currentPlayer = p;
                        return;
                    }
                }
            }
        }
    }
    startGame() {
        this.gameStarted = true;
        this.dealCards(true);
        this.gameOver = false;
    }
    getGameState() {
        return {
            roomCode: this.roomCode,
            currentPlayer: this.currentPlayer,
            lastPlay: this.lastPlay,
            lastPlayPlayer: this.lastPlayPlayer,
            consecutivePasses: this.consecutivePasses,
            round: this.round,
            scores: this.scores,
            gameOver: this.gameOver,
            players: this.players.map(player => ({
                name: player.name,
                position: player.position,
                cardCount: player.hand ? player.hand.length : 0,
                hand: player.hand || []
            }))
        };
    }
    handlePlay(position, cards) {
        if (position !== this.currentPlayer) return { success: false, error: 'Not your turn' };
        const player = this.players[position];
        cards.forEach(card => {
            const index = player.hand.findIndex(c => c.suit === card.suit && c.rank === card.rank);
            if (index !== -1) { player.hand.splice(index, 1); }
        });
        this.lastPlay = cards;
        this.lastPlayPlayer = position;
        this.consecutivePasses = 0;
        if (player.hand.length === 0) {
            this.endRound(position);
        } else {
            this.currentPlayer = (this.currentPlayer + 1) % 4;
        }
        return { success: true };
    }
    handlePass(position) {
        if (position !== this.currentPlayer) return { success: false, error: 'Not your turn' };
        this.consecutivePasses++;
        if (this.consecutivePasses >= 3) {
            this.lastPlay = [];
            this.consecutivePasses = 0;
            if (this.lastPlayPlayer >= 0) { this.currentPlayer = this.lastPlayPlayer; }
            this.lastPlayPlayer = -1;
        } else {
            this.currentPlayer = (this.currentPlayer + 1) % 4;
        }
        return { success: true };
    }
    endRound(winner) {
        for (let p = 0; p < 4; p++) {
            if (p !== winner) {
                const cardsLeft = this.players[p].hand.length;
                let points = cardsLeft <= 4 ? cardsLeft : (cardsLeft <= 9 ? cardsLeft * 2 : cardsLeft * 3);
                this.scores[p] += points;
            }
        }
        if (Math.max(...this.scores) >= 100) {
            this.gameOver = true;
        } else {
            this.round++;
            this.lastPlay = [];
            this.lastPlayPlayer = -1;
            this.consecutivePasses = 0;
            this.currentPlayer = winner;
            this.dealCards(false);
        }
    }
}

function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) { code += chars.charAt(Math.floor(Math.random() * chars.length)); }
    return code;
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('createRoom', (data) => {
        const roomCode = generateRoomCode();
        const room = new GameRoom(roomCode, socket.id, data.playerName);
        rooms.set(roomCode, room);
        socket.join(roomCode);
        socket.emit('roomCreated', {roomCode: roomCode, position: 0, players: room.players.map(p => ({ name: p.name, position: p.position }))});
        console.log(`Room ${roomCode} created by ${data.playerName}`);
    });
    socket.on('joinRoom', (data) => {
        const room = rooms.get(data.roomCode);
        if (!room) { socket.emit('error', { message: 'Room not found!' }); return; }
        if (room.players.length >= 4) { socket.emit('error', { message: 'Room is full!' }); return; }
        if (room.gameStarted) { socket.emit('error', { message: 'Game already started!' }); return; }
        const success = room.addPlayer(socket.id, data.playerName);
        if (success) {
            socket.join(data.roomCode);
            const playerPosition = room.players.length - 1;
            socket.emit('roomCreated', {roomCode: data.roomCode, position: playerPosition, players: room.players.map(p => ({ name: p.name, position: p.position }))});
            io.to(data.roomCode).emit('playerJoined', {players: room.players.map(p => ({ name: p.name, position: p.position })), newPlayer: data.playerName});
            console.log(`${data.playerName} joined room ${data.roomCode}`);
        }
    });
    socket.on('startGame', (data) => {
        const room = rooms.get(data.roomCode);
        if (!room) { socket.emit('error', { message: 'Room not found!' }); return; }
        if (!room.canStart()) { socket.emit('error', { message: 'Need 4 players to start!' }); return; }
        room.startGame();
        
        // Send individualized game state to each player
        room.players.forEach((player, index) => {
            io.to(player.socketId).emit('gameStarted', {
                position: index,
                players: room.players.map(p => ({ name: p.name, position: p.position })),
                gameState: room.getGameState()
            });
        });
        console.log(`Game started in room ${data.roomCode}`);
    });
    socket.on('gameAction', (data) => {
        const room = rooms.get(data.roomCode);
        if (!room) { socket.emit('error', { message: 'Room not found!' }); return; }
        
        // Find the player's position by socket ID
        const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
        if (playerIndex === -1) {
            socket.emit('error', { message: 'Player not found in room!' });
            return;
        }
        
        let result;
        if (data.action === 'play') { 
            result = room.handlePlay(playerIndex, data.cards); 
        } else if (data.action === 'pass') { 
            result = room.handlePass(playerIndex); 
        }
        
        if (result && result.success) { 
            io.to(data.roomCode).emit('gameState', room.getGameState()); 
        } else { 
            socket.emit('error', { message: result.error }); 
        }
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        rooms.forEach((room, roomCode) => {
            if (room.removePlayer(socket.id)) {
                if (room.players.length === 0) {
                    rooms.delete(roomCode);
                    console.log(`Room ${roomCode} deleted`);
                } else {
                    io.to(roomCode).emit('playerLeft', {players: room.players.map(p => ({ name: p.name, position: p.position }))});
                }
            }
        });
    });
});

http.listen(PORT, () => {
    console.log(`🎮 Big Two Server on http://localhost:${PORT}`);
});
