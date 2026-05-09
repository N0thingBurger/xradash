=== FOR ANDROID ===

Step 1: Install Termux
  Do not use the Play Store version (it is outdated). 
   1. Download Termux from F-Droid (https://f-droid.org/en/packages/com.termux/)
      (click "Download APK").
   2. Install the APK and open Termux.

  Step 2: Prepare the Environment
  Inside Termux, type these commands one by one (press Enter after each):
   1 # Update the system
   2 pkg update && pkg upgrade
   3
   4 # Install Node.js (this includes npm)
   5 pkg install nodejs
   6
   7 # Install Git (to pull your code)
   8 pkg install git

  Step 3: Move your Code to the Phone
  There are two ways to do this:
   * Option A (Recommended): Push your code from your PC to a private GitHub
     repository, then in Termux type:
      git clone https://github.com/YOUR_USERNAME/xradash.git
   * Option B: Transfer the folder from your PC to your phone's storage. Then in
     Termux, run termux-setup-storage and copy the folder into the Termux home
     directory.

  Step 4: Install Dependencies
  Navigate into your project folders and install the libraries:
   1 # 1. Install Backend
   2 cd ~/xradash/server
   3 npm install
   4
   5 # 2. Install Frontend
   6 cd ~/xradash/client
   7 npm install

  Step 5: Setup your API Keys
  You need to edit the .env file on your phone:
   1 cd ~/xradash/server
   2 nano .env
  Paste your Bybit API keys. Press Ctrl+O, Enter to save, and Ctrl+X to exit.

  ---

  Step 6: The "24/7 Mode" Optimization
  On a mobile phone, running the Vite Dev Server (client) and the Node Server
  (backend) separately can use a lot of battery and RAM. Since you want this to
  run 24/7, we will build the frontend and let the backend serve it.

   1. Build the Frontend:
   1     cd ~/xradash/client
   2     npm run build
   2. Tell the Backend to serve the build:
      (I have already prepared the backend to handle this if we move the dist
  folder, but for now, we can just run them normally if your phone has 4GB+
  RAM).

  ---

  Step 7: Launching the Dashboard
  You need two sessions in Termux (swipe from the left edge of the screen and
  tap "New Session"):

  Session 1 (Backend):
   1 cd ~/xradash/server
   2 node index.js

  Session 2 (Frontend):
   1 cd ~/xradash/client
   2 npm run dev -- --host

  ---

  Step 8: The Fullscreen App Experience
   1. Open Chrome on your Android phone.
   2. Go to http://localhost:5173.
   3. Tap the Three Dots (⋮) -> Add to Home Screen.
   4. Close Chrome and open the XRADASH icon from your home screen.
   5. Rotate your phone to Landscape.
   6. Tap the Maximize icon I added earlier.

  Step 9: Prevent Android from killing the Server
  Android often "sleeps" apps to save battery. To keep XRADASH running 24/7:
   1. Pull down your notification bar.
   2. Find the Termux notification.
   3. Tap the arrow and select "Acquire WakeLock". (This prevents the CPU from
      sleeping).
   4. Go to your phone Settings -> Battery -> Background usage limits and set
      Termux to "Never sleeping" or "Unrestricted".

  Your phone is now a dedicated, standalone trading dashboard! Let me know if
  you hit any errors during the Termux setup.

=== FOR LINUX PC ===

✦ Running XRADASH on Ubuntu 24.04 (Noble Numbat) is very straightforward because
  Node.js is natively well-supported. Since you are using this PC to chat with
  me, the project folder should already be at /home/xralier/xradash.

  Here is the detailed guide to setting it up and running it on your Linux
  machine.

  ---

  Step 1: Install System Prerequisites
  Open your terminal and ensure you have the necessary tools installed:

   1 # Update your package list
   2 sudo apt update
   3
   4 # Install Node.js, npm (Package Manager), and Git
   5 sudo apt install nodejs npm git -y
   6
   7 # Verify installations (Node should be v18+ for this project)
   8 node -v
   9 npm -v

  ---

  Step 2: Navigate and Install Dependencies
  You need to install the libraries for both the "Engine" (Server) and the
  "Cockpit" (Client).

  1. Setup the Backend:
   1 cd /home/xralier/xradash/server
   2 npm install

  2. Setup the Frontend:

   1 cd /home/xralier/xradash/client
   2 npm install

  ---

  Step 3: Configure your Bybit API Keys
  The server cannot fetch your data without your credentials. Use the built-in
  nano editor to add them:

   1 cd /home/xralier/xradash/server
   2 nano .env
  Paste your keys into the file:
   * BYBIT_API_KEY_1=your_key_here
   * BYBIT_API_SECRET_1=your_secret_here
  (Add Key 2 and 3 if you have them, otherwise leave them blank).

  Press Ctrl+O, then Enter to save, and Ctrl+X to exit.

  ---

  Step 4: Launch the Dashboard
  To run the dashboard, you need to keep two processes running. It is best to
  use two separate terminal tabs (or use a tool like screen or tmux).

  Terminal 1 (The Backend):

   1 cd /home/xralier/xradash/server
   2 node index.js
  You should see: Server running on port 3001.

  Terminal 2 (The Frontend):

   1 cd /home/xralier/xradash/client
   2 npm run dev
  You should see: VITE ready... Local: http://localhost:5173/.

  ---

  Step 5: Using the Dashboard on Ubuntu
   1. Open Google Chrome or Firefox.
   2. Navigate to: http://localhost:5173
   3. Pro Tip (The Fullscreen View): Since we built a mobile-first dashboard,
      you can see the perfect layout on PC by doing this:
       * Right-click and select Inspect.
       * Click the Device Toggle icon (looks like a phone/tablet) at the top of
         the inspect panel.
       * Select a large phone (like iPhone 14 Pro Max) and click the Rotate icon
         to put it in Landscape.
       * Click the Maximize (Square) button I added in the top right of the
         dashboard.

  Step 6: Running in the Background (Optional)
  If you want to keep the dashboard running even if you close the terminal, you
  can install pm2:

   1 sudo npm install -g pm2
   2
   3 # Start both parts
   4 cd /home/xralier/xradash/server && pm2 start index.js --name xra-server
   5 cd /home/xralier/xradash/client && pm2 start "npm run dev" --name
     xra-client
   6
   7 # To check status
   8 pm2 status

  Your Ubuntu 24 PC is now fully configured! You can now monitor your Bybit
  accounts directly from your Linux desktop or use this PC as the host for your
  other devices.
