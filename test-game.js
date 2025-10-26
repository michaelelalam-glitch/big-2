// Test Big Two game logic - validates all combination scenarios

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
    toString() {
        return `${this.rank}${this.suit}`;
    }
}

class BigTwoGame {
    constructor() {
        this.players = [[], [], [], []];
        this.currentPlayer = 0;
        this.lastPlay = null;
        this.lastPlayType = null;
        this.gameStarted = false;
        this.consecutivePasses = 0;
    }

    createDeck() {
        const suits = ['♠', '♥', '♣', '♦'];
        const ranks = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
        const deck = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push(new Card(suit, rank));
            }
        }
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    dealCards() {
        const deck = this.createDeck();
        this.players = [[], [], [], []];
        for (let i = 0; i < 52; i++) {
            this.players[i % 4].push(deck[i]);
        }
        for (let i = 0; i < 4; i++) {
            this.players[i].sort((a, b) => a.getCompareValue() - b.getCompareValue());
        }
        for (let p = 0; p < 4; p++) {
            for (const card of this.players[p]) {
                if (card.rank === '3' && card.suit === '♦') {
                    this.currentPlayer = p;
                    return;
                }
            }
        }
    }

    getCombinationType(cards) {
        if (!cards || cards.length === 0) return null;
        const sortedCards = [...cards].sort((a, b) => a.getValue() - b.getValue());
        if (cards.length === 1) {
            return { type: 'single', strength: cards[0].getCompareValue() };
        }
        if (cards.length === 2) {
            if (sortedCards[0].getValue() === sortedCards[1].getValue()) {
                return { type: 'pair', strength: sortedCards[1].getCompareValue() };
            }
            return null;
        }
        if (cards.length === 3) {
            if (sortedCards[0].getValue() === sortedCards[1].getValue() && sortedCards[1].getValue() === sortedCards[2].getValue()) {
                return { type: 'triple', strength: sortedCards[2].getCompareValue() };
            }
            return null;
        }
        if (cards.length === 5) {
            return this.getFiveCardType(sortedCards);
        }
        return null;
    }

    getFiveCardType(sortedCards) {
        const values = sortedCards.map(card => card.getValue());
        const suits = sortedCards.map(card => card.suit);
        const valueCounts = {};
        for (const value of values) {
            valueCounts[value] = (valueCounts[value] || 0) + 1;
        }
        const counts = Object.values(valueCounts).sort((a, b) => b - a);
        const isFlush = suits.every(suit => suit === suits[0]);
        let isStraight = false;
        let straightHigh = 0;
        const valueStr = values.join(',');
        if (valueStr === '3,4,5,14,15') {
            isStraight = true;
            straightHigh = 5;
        } else if (valueStr === '10,11,12,13,14') {
            isStraight = true;
            straightHigh = 14;
        } else if (values[4] - values[0] === 4 && new Set(values).size === 5) {
            isStraight = true;
            straightHigh = values[4];
        }
        if (isStraight && isFlush) {
            return { type: 'straight-flush', strength: straightHigh * 10 + sortedCards[4].getSuitValue(), rank: 5 };
        }
        if (counts[0] === 4) {
            const fourValue = Object.keys(valueCounts).find(k => valueCounts[k] === 4);
            return { type: 'four-kind', strength: fourValue * 10, rank: 4 };
        }
        if (counts[0] === 3 && counts[1] === 2) {
            const threeValue = Object.keys(valueCounts).find(k => valueCounts[k] === 3);
            return { type: 'full-house', strength: threeValue * 10, rank: 3 };
        }
        if (isFlush) {
            return { type: 'flush', strength: sortedCards[4].getCompareValue(), rank: 2 };
        }
        if (isStraight) {
            return { type: 'straight', strength: straightHigh * 10 + sortedCards[4].getSuitValue(), rank: 1 };
        }
        return null;
    }

    isValidPlay(cards) {
        if (!cards || cards.length === 0) return false;
        const playType = this.getCombinationType(cards);
        if (!playType) return false;
        if (!this.lastPlay) {
            if (!this.gameStarted) {
                return cards.some(card => card.rank === '3' && card.suit === '♦');
            }
            return true;
        }
        if (cards.length === 5 && this.lastPlay.length === 5) {
            if (playType.rank !== this.lastPlayType.rank) {
                return playType.rank > this.lastPlayType.rank;
            }
            return playType.strength > this.lastPlayType.strength;
        }
        if (this.lastPlayType.type !== playType.type) {
            return false;
        }
        return playType.strength > this.lastPlayType.strength;
    }

    playCards(playerIndex, cards) {
        if (!this.isValidPlay(cards)) return false;
        for (const card of cards) {
            const index = this.players[playerIndex].indexOf(card);
            if (index !== -1) {
                this.players[playerIndex].splice(index, 1);
            }
        }
        this.lastPlay = [...cards];
        this.lastPlayType = this.getCombinationType(cards);
        this.consecutivePasses = 0;
        if (!this.gameStarted) this.gameStarted = true;
        if (this.players[playerIndex].length === 0) {
            return true;
        }
        this.currentPlayer = (this.currentPlayer + 1) % 4;
        return true;
    }

    pass(playerIndex) {
        if (this.currentPlayer !== playerIndex) return false;
        this.consecutivePasses++;
        if (this.consecutivePasses >= 3) {
            this.lastPlay = null;
            this.lastPlayType = null;
            this.consecutivePasses = 0;
        } else {
            this.currentPlayer = (this.currentPlayer + 1) % 4;
        }
        return true;
    }

    getAIPlay(playerIndex) {
        const hand = this.players[playerIndex];
        if (hand.length === 0) return null;
        if (!this.lastPlay) {
            const fiveCardPlay = this.findBestFiveCardCombo(hand);
            if (fiveCardPlay) return fiveCardPlay;
            const pairPlay = this.findLowestPair(hand);
            if (pairPlay) return pairPlay;
            return [hand[0]];
        }
        const validPlays = this.findValidPlays(hand, this.lastPlayType);
        if (validPlays.length === 0) return null;
        return validPlays[0];
    }

    findValidPlays(hand, lastPlayType) {
        const validPlays = [];
        if (lastPlayType.type === 'single') {
            for (const card of hand) {
                if (card.getCompareValue() > lastPlayType.strength) {
                    validPlays.push([card]);
                }
            }
        } else if (lastPlayType.type === 'pair') {
            const pairs = this.findAllPairs(hand);
            for (const pair of pairs) {
                const pairType = this.getCombinationType(pair);
                if (pairType.strength > lastPlayType.strength) {
                    validPlays.push(pair);
                }
            }
        } else if (lastPlayType.type === 'triple') {
            const triples = this.findAllTriples(hand);
            for (const triple of triples) {
                const tripleType = this.getCombinationType(triple);
                if (tripleType.strength > lastPlayType.strength) {
                    validPlays.push(triple);
                }
            }
        } else {
            const fiveCards = this.findAllFiveCardCombos(hand);
            for (const combo of fiveCards) {
                if (this.isValidPlay(combo)) {
                    validPlays.push(combo);
                }
            }
        }
        return validPlays;
    }

    findAllPairs(hand) {
        const pairs = [];
        for (let i = 0; i < hand.length - 1; i++) {
            for (let j = i + 1; j < hand.length; j++) {
                if (hand[i].getValue() === hand[j].getValue()) {
                    pairs.push([hand[i], hand[j]]);
                }
            }
        }
        return pairs;
    }

    findAllTriples(hand) {
        const triples = [];
        for (let i = 0; i < hand.length - 2; i++) {
            for (let j = i + 1; j < hand.length - 1; j++) {
                for (let k = j + 1; k < hand.length; k++) {
                    if (hand[i].getValue() === hand[j].getValue() && hand[j].getValue() === hand[k].getValue()) {
                        triples.push([hand[i], hand[j], hand[k]]);
                    }
                }
            }
        }
        return triples;
    }

    findAllFiveCardCombos(hand) {
        const combos = [];
        for (let i = 0; i < hand.length - 4; i++) {
            for (let j = i + 1; j < hand.length - 3; j++) {
                for (let k = j + 1; k < hand.length - 2; k++) {
                    for (let l = k + 1; l < hand.length - 1; l++) {
                        for (let m = l + 1; m < hand.length; m++) {
                            const combo = [hand[i], hand[j], hand[k], hand[l], hand[m]];
                            if (this.getCombinationType(combo)) {
                                combos.push(combo);
                            }
                        }
                    }
                }
            }
        }
        return combos;
    }

    findLowestPair(hand) {
        const pairs = this.findAllPairs(hand);
        return pairs.length > 0 ? pairs[0] : null;
    }

    findBestFiveCardCombo(hand) {
        const combos = this.findAllFiveCardCombos(hand);
        return combos.length > 0 ? combos[0] : null;
    }
}

function runTestGames(numGames = 100) {
    console.log(`\n🎮 Testing ${numGames} games with 4 AI players...\n`);
    let completedGames = 0;
    let errors = [];
    let totalMoves = 0;

    for (let gameNum = 0; gameNum < numGames; gameNum++) {
        try {
            const testGame = new BigTwoGame();
            testGame.dealCards();
            let moves = 0;
            const maxMoves = 500;
            while (testGame.players.every(p => p.length > 0) && moves < maxMoves) {
                const currentPlayer = testGame.currentPlayer;
                const aiPlay = testGame.getAIPlay(currentPlayer);
                if (aiPlay) {
                    const isValid = testGame.isValidPlay(aiPlay);
                    if (!isValid) {
                        const playType = testGame.getCombinationType(aiPlay);
                        const error = `Player ${currentPlayer} invalid: ${aiPlay.map(c => c.toString()).join(',')} (${playType ? playType.type : 'invalid'}) vs ${testGame.lastPlayType ? testGame.lastPlayType.type : 'none'}`;
                        console.error('❌', error);
                        errors.push({ game: gameNum + 1, error, move: moves });
                        break;
                    }
                    testGame.playCards(currentPlayer, aiPlay);
                } else {
                    testGame.pass(currentPlayer);
                }
                moves++;
            }
            if (moves >= maxMoves) {
                errors.push({ game: gameNum + 1, error: 'Exceeded max moves', move: moves });
            } else {
                totalMoves += moves;
                completedGames++;
                if ((gameNum + 1) % 20 === 0) {
                    console.log(`✓ ${gameNum + 1}/${numGames} games completed`);
                }
            }
        } catch (e) {
            console.error(`❌ Game ${gameNum + 1}:`, e.message);
            errors.push({ game: gameNum + 1, error: e.message });
        }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`📊 RESULTS: ${completedGames}/${numGames} completed`);
    console.log(`❌ Errors: ${errors.length}`);
    console.log(`📈 Avg moves: ${(totalMoves / completedGames).toFixed(1)}`);
    console.log(`${'='.repeat(50)}`);
    
    if (errors.length > 0) {
        console.log('\n❌ ERROR DETAILS:');
        errors.slice(0, 10).forEach(err => {
            console.error(`Game ${err.game}: ${err.error}`);
        });
        if (errors.length > 10) {
            console.error(`... and ${errors.length - 10} more errors`);
        }
        return false;
    } else {
        console.log('\n✅ ALL TESTS PASSED!');
        return true;
    }
}

runTestGames(100);
