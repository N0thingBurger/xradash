# XRADASH v1.0
A professional, real-time multi-account Bybit trading dashboard optimized for mobile and desktop.

## Features
*   **Unified Account Monitoring:** Aggregates Main and Sub-accounts into one screen.
*   **Real-Time Data:** High-speed WebSocket integration for Prices and Positions.
*   **BTC Price Ticker:** Live Bitcoin price feed from Bybit public stream.
*   **USDT-Focused:** Automatically sorts positions by PnL value (USDT).
*   **Mobile Optimized:** Standalone "Condensed View" with Portrait/Landscape support.
*   **Single-Process:** Optimized backend serves the frontend directly (saves RAM/Battery).

---

## Installation & Setup (Ubuntu 24.04 PC)

### 1. Prerequisites
Ensure you have Node.js (v18+) and Git installed:
```bash
sudo apt update
sudo apt install nodejs npm git -y
```

### 2. Clone and Install
```bash
git clone https://github.com/your-username/xradash.git
cd xradash

# Install Backend dependencies
cd server && npm install

# Install Frontend dependencies
cd ../client && npm install
```

### 3. Configure API Keys
Edit the `.env` file in the `server` folder:
```bash
nano ../server/.env
```
Fill in your Bybit API Key and Secret for at least one account. Save with `Ctrl+O`, `Enter`, `Ctrl+X`.

### 4. Build the Frontend (One-time)
This compiles the code for maximum speed and efficiency:
```bash
cd /home/xralier/xradash/client
npm run build
```

---

## How to Run
Since the backend now serves the website, you only need **one** terminal session.

```bash
cd /home/xralier/xradash/server
node index.js
```

**Access the Dashboard:**
*   **Local PC:** Open `http://localhost:3001`
*   **Other devices (Phone):** Open `http://YOUR_PC_IP:3001`

---

## Mobile/Android Usage (24/7 Display)
1.  Open the dashboard in **Chrome Android**.
2.  Tap the **Three Dots (⋮)** -> **Add to Home Screen**.
3.  Open the **XRADASH** icon from your home screen.
4.  Rotate to **Landscape** and tap the **Maximize (Square)** icon for true fullscreen.

### Pro-Tip: Keeping it 24/7
If running on a VPS or a dedicated machine, use `pm2` to keep it alive forever:
```bash
sudo npm install -g pm2
cd /home/xralier/xradash/server
pm2 start index.js --name xradash
```

---

## Security
If running on a public VPS, your data is visible to anyone with your IP. It is recommended to run this on a local network or add a firewall rule to only allow your specific IP.
