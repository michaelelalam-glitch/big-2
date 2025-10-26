# 🚀 Deployment Guide - Big Two Multiplayer Game

Your game is now on GitHub! Here's how to deploy it online for FREE:

## Option 1: Render.com (Recommended - Easiest)

1. **Sign up at [Render.com](https://render.com)** (free account)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select the `big-2` repository
4. Render will auto-detect the settings from `render.yaml`
5. Click **"Create Web Service"**
6. Wait 2-3 minutes for deployment
7. Your game will be live at: `https://big-two-game.onrender.com`

**Note:** Free tier sleeps after 15 min of inactivity (wakes up in ~30 seconds on first visit)

---

## Option 2: Railway.app

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your `big-2` repository
5. Railway auto-detects Node.js and deploys
6. Get your live URL from the dashboard

---

## Option 3: Glitch.com (Instant)

1. Go to [Glitch.com](https://glitch.com)
2. Click **"New Project"** → **"Import from GitHub"**
3. Paste: `https://github.com/michaelelalam-glitch/big-2`
4. Glitch will import and host instantly
5. Your URL: `https://your-project-name.glitch.me`

---

## Option 4: Heroku (Classic)

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Run these commands:
```bash
cd "/Users/michaelalam/Desktop/Desktop/Coding/Coding/Big 2"
heroku login
heroku create big-two-game
git push heroku main
heroku open
```

---

## 🎮 After Deployment

Share your game URL with friends and play together!

**Room-based multiplayer:**
- Player 1 creates a room and gets a 6-digit code
- Other players join using that code
- Need 4 players to start a game

---

## 🔧 Local Development

```bash
npm install
npm start
# Visit http://localhost:3000
```

---

## 📝 Technical Details

- **Framework:** Express.js + Socket.io
- **Real-time:** WebSocket communication
- **Players:** 4 players per game
- **No Database:** Rooms stored in memory (resets on server restart)
