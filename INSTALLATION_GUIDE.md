# 🚀 Installation & Setup Guide

Complete step-by-step guide to get your modernized Big Two game running.

---

## 📋 Prerequisites Check

Before starting, ensure you have:
- [ ] A modern web browser (Chrome, Firefox, Safari, or Edge)
- [ ] Terminal/Command Prompt access
- [ ] Internet connection for downloading Node.js

---

## 1️⃣ Install Node.js

### For macOS:

**Option A: Using Official Installer (Recommended)**
1. Visit https://nodejs.org/
2. Download the **LTS version** (Long Term Support)
3. Open the downloaded `.pkg` file
4. Follow the installation wizard
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**Option B: Using Homebrew**
```bash
brew install node
```

### For Windows:

1. Visit https://nodejs.org/
2. Download the **LTS version** for Windows
3. Run the installer (`.msi` file)
4. Follow the installation wizard
5. Restart your computer
6. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

### For Linux:

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Fedora:**
```bash
sudo dnf install nodejs
```

---

## 2️⃣ Install Project Dependencies

1. **Open Terminal/Command Prompt**

2. **Navigate to project directory:**
   ```bash
   cd "/Users/michaelalam/Desktop/Desktop/Coding/Coding/Big 2"
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - Express (web server)
   - Socket.IO (real-time communication)

4. **Wait for installation to complete**
   You should see something like:
   ```
   added 50 packages in 3s
   ```

---

## 3️⃣ Start the Server

### Simple Method:
```bash
npm start
```

### Alternative Method:
```bash
node server.js
```

### Expected Output:
```
🎮 Big Two Server on http://localhost:3000
```

---

## 4️⃣ Open the Game

1. **Open your web browser**

2. **Navigate to:**
   ```
   http://localhost:3000/big2-multiplayer.html
   ```

3. **You should see the lobby screen!** 🎉

---

## 5️⃣ Test Multiplayer

### Local Testing (Same Computer):

1. **Open multiple browser tabs/windows**
2. Go to `http://localhost:3000/big2-multiplayer.html` in each
3. Create a room in one tab
4. Copy the room code
5. Join with the same code in other tabs

### Network Testing (Different Devices):

1. **Find your local IP address:**

   **macOS/Linux:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

   **Windows:**
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" (usually starts with 192.168.x.x)

2. **Start the server on your computer**

3. **On other devices (same WiFi):**
   ```
   http://YOUR_IP_ADDRESS:3000/big2-multiplayer.html
   ```
   Example: `http://192.168.1.100:3000/big2-multiplayer.html`

---

## 🔧 Troubleshooting

### Problem: "node: command not found"

**Solution:**
- Node.js is not installed or not in PATH
- Reinstall Node.js
- Restart your terminal/computer
- Check installation: `node --version`

---

### Problem: "npm install" fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

---

### Problem: "Port 3000 is already in use"

**Solution:**

**Option 1: Use a different port**
Edit `server.js` and change:
```javascript
const PORT = process.env.PORT || 3000;
```
to:
```javascript
const PORT = process.env.PORT || 3001;
```

**Option 2: Find and kill the process**

**macOS/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

---

### Problem: Can't connect from other devices

**Checklist:**
- [ ] Server is running on host computer
- [ ] Both devices on same WiFi network
- [ ] Firewall allows port 3000
- [ ] Using correct IP address
- [ ] Using http:// (not https://)

**macOS Firewall:**
```bash
# Allow Node.js through firewall
System Preferences → Security & Privacy → Firewall → Firewall Options
→ Add Node.js
```

**Windows Firewall:**
```
Control Panel → Windows Defender Firewall 
→ Allow an app through firewall 
→ Add Node.js
```

---

### Problem: Game looks broken/unstyled

**Solutions:**
1. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
2. Try a different browser
3. Check browser console for errors (F12)
4. Ensure JavaScript is enabled
5. Update your browser to latest version

---

## 📱 Mobile Installation

### iOS (iPhone/iPad):

1. Open Safari and navigate to the game URL
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Name it "Big Two"
5. Tap **Add**
6. App icon now on your home screen!

### Android:

1. Open Chrome and navigate to the game URL
2. Tap the **menu** (three dots)
3. Tap **Add to Home screen**
4. Name it "Big Two"
5. Tap **Add**
6. App icon now on your home screen!

---

## 🎮 First Game Setup

1. **Player 1:** Create a new room
2. **Share the room code** (6-character code)
3. **Players 2-4:** Join with the code
4. **Wait** for all 4 players
5. **Host clicks "Start Game"**
6. **Play!** 🎉

---

## 🔄 Updating

To update the game in the future:

```bash
cd "/Users/michaelalam/Desktop/Desktop/Coding/Coding/Big 2"
git pull  # If using version control
npm install  # Update dependencies
npm start
```

---

## 🛡️ Security Notes

- **Local network only:** Server is not secure for internet access
- **Private games:** Don't share room codes publicly
- **Firewall:** Only allow port 3000 on local network
- **Development mode:** Not recommended for production use

---

## 💡 Tips for Best Experience

### Performance:
- Close unused browser tabs
- Use latest browser version
- Ensure stable WiFi connection

### Mobile:
- Rotate to landscape for better layout
- Add to home screen for app-like experience
- Use on WiFi (not cellular data)

### Gameplay:
- Use keyboard shortcuts (Tab, Enter, Space)
- Double-tap status message to dismiss
- Enable notifications for turn alerts

---

## 📊 System Requirements

### Minimum:
- Node.js v14+
- 2GB RAM
- Modern browser (2020+)
- WiFi connection

### Recommended:
- Node.js v18+ (LTS)
- 4GB RAM
- Chrome/Firefox/Safari (latest)
- Stable broadband connection

---

## 🆘 Getting Help

### Still having issues?

1. **Check the README.md** for detailed documentation
2. **Read QUICKSTART.md** for quick solutions
3. **Check CHANGELOG.md** for known issues
4. **Browser console** (F12) for error messages
5. **Server logs** in terminal for backend issues

### Common Error Messages:

| Error | Meaning | Solution |
|-------|---------|----------|
| EADDRINUSE | Port in use | Use different port |
| Cannot GET | Wrong URL | Check URL spelling |
| Connection refused | Server not running | Start server |
| 404 Not Found | File missing | Check file exists |

---

## ✅ Installation Complete!

If you've made it here, congratulations! 🎉

You should now have:
- ✅ Node.js installed
- ✅ Dependencies installed
- ✅ Server running
- ✅ Game accessible in browser

**Enjoy playing Big Two!** 🎮🃏

---

*Last updated: October 26, 2025*
*Version: 2.0.0*
*For support: Check README.md and QUICKSTART.md*
