# 🚀 Deploy Big Two Game on Render.com

## Step-by-Step Deployment Guide

### 1. Sign Up / Log In to Render
- Go to: https://render.com
- Click **"Get Started"** or **"Sign In"**
- Use your **GitHub account** to sign in (easiest option)

### 2. Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** to link your GitHub (if not already connected)

### 3. Select Your Repository
1. Find and select: **`michaelelalam-glitch/big-2`**
2. Click **"Connect"**

### 4. Configure Service (Auto-detected from render.yaml)
Render will automatically detect these settings from your `render.yaml`:

- **Name:** `big-two-game`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Select **"Free"**

### 5. Deploy!
1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait 2-3 minutes for the initial deployment
4. You'll see the build logs in real-time

### 6. Get Your Live URL
Once deployed, your game will be live at:
```
https://big-two-game.onrender.com
```

Or whatever custom name Render assigns.

### 7. Test Your Deployment
1. Open your live URL in 4 different browser tabs/windows
2. First player creates a room
3. Share the room code with 3 friends
4. Play Big Two online! 🎮

---

## Important Notes

### Free Tier Limitations:
- ✅ **Perfect for this game** - full Socket.io support
- ⚠️ **Sleeps after 15 minutes** of inactivity
- ⏱️ **30 seconds wake-up time** on first visit after sleep
- 🔄 **Automatic wake-up** when someone visits

### Custom Domain (Optional):
1. Go to your service settings on Render
2. Click **"Custom Domain"**
3. Add your domain and follow DNS instructions

### Environment Variables (If needed later):
You can add environment variables in:
- **Dashboard** → Your Service → **Environment** tab

---

## Troubleshooting

### Build Failed?
- Check the build logs in Render dashboard
- Ensure `package.json` has all dependencies
- Verify Node version compatibility

### Can't Connect?
- Check if service is running (Render dashboard)
- Look for error logs
- Ensure Socket.io is configured correctly (already done ✅)

### Players Not Syncing?
- Verify all players are using the same room code
- Check browser console for errors (F12)
- Ensure WebSocket connections are working

---

## Updating Your Deployment

Render automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push origin main

# Render will automatically detect and redeploy! 🚀
```

---

## Monitoring

### View Logs:
1. Go to Render dashboard
2. Click on your service
3. Click **"Logs"** tab
4. See real-time server logs

### View Metrics:
- **Events** tab: Deployment history
- **Metrics** tab: CPU, memory, requests
- **Settings** tab: Configuration

---

## Next Steps After Deployment

1. **Share your game URL** with friends
2. **Monitor usage** in Render dashboard
3. **Upgrade to paid plan** if you need:
   - No sleep/instant wake
   - More resources
   - Custom SSL

---

**Your game is ready to deploy! Follow the steps above.** 🎮

Repository: https://github.com/michaelelalam-glitch/big-2
