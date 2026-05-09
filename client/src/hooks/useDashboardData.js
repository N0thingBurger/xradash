import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : `http://${window.location.hostname}:3001`;

// Initialize socket outside the hook so it persists across re-renders
const socket = io(SOCKET_URL, {
  transports: ['websocket'], // Force websocket ONLY
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

export const useDashboardData = () => {
  const [data, setData] = useState({
    positionCount: 0,
    totalUnrealizedPnL: 0,
    dailyRealizedPnL: 0,
    worstPosition: null,
    positions: []
  });
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onUpdate(newData) {
      // Use functional update to avoid dependency on 'data'
      setData(newData);
    }

    function onConnect() {
      console.log("XRADASH: Socket Connected");
      setIsConnected(true);
    }

    function onDisconnect(reason) {
      console.log("XRADASH: Socket Disconnected:", reason);
      setIsConnected(false);
    }

    socket.on('dashboard_update', onUpdate);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('dashboard_update', onUpdate);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return { data, isConnected };
};
