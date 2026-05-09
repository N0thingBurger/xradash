const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const BybitManager = require('./bybitManager');
require('dotenv').config();

const app = express();
app.use(cors());

// Serve static files from the React app build
const distPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(distPath)) {
  console.log('Serving production build from:', distPath);
  app.use(express.static(distPath));
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  transports: ['websocket'], // Force websocket ONLY
  allowEIO3: true
});

const bybit = new BybitManager();

bybit.onUpdate = (data) => {
  io.emit('dashboard_update', data);
};

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id} | Transport: ${socket.conn.transport.name}`);
  
  // Send current state immediately upon connection
  if (bybit.state) {
    bybit.broadcast(true);
  }
  
  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id} | Reason: ${reason}`);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await bybit.initialize();
});
