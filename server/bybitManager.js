const { RestClientV5, WebsocketClient } = require('bybit-api');
require('dotenv').config();

class BybitManager {
  constructor() {
    this.accounts = [
      { id: 'Main', key: process.env.BYBIT_API_KEY_1, secret: process.env.BYBIT_API_SECRET_1 },
      { id: 'Sub1', key: process.env.BYBIT_API_KEY_2, secret: process.env.BYBIT_API_SECRET_2 },
      { id: 'Sub2', key: process.env.BYBIT_API_KEY_3, secret: process.env.BYBIT_API_SECRET_3 }
    ].filter(acc => acc.key && acc.secret);

    this.restClients = this.accounts.map(acc => new RestClientV5({
      key: acc.key,
      secret: acc.secret,
      testnet: false,
    }));

    this.wsClients = this.accounts.map(acc => new WebsocketClient({
      key: acc.key,
      secret: acc.secret,
      market: 'v5',
      testnet: false,
    }));

    this.state = {
      positions: {}, // symbol -> position details
      prices: {},    // symbol -> last price
      dailyRealizedPnL: 0,
    };

    this.onUpdate = null; // Callback for data updates
    this.lastBroadcastTime = 0;
    this.broadcastThrottleMs = 1000; // 1 update per second is plenty for mobile
  }

  async initialize() {
    await this.fetchInitialData();
    this.setupWebSockets();
    
    // Refresh position/PNL data periodically (e.g., every 30s) as a fallback
    setInterval(() => this.fetchInitialData(), 30000);
  }

  async fetchInitialData() {
    try {
      let totalDailyPnL = 0;
      const allPositions = [];

      // Start of day UTC
      const startTime = new Date().setUTCHours(0, 0, 0, 0);

      for (const client of this.restClients) {
        // Fetch Positions
        const posRes = await client.getPositionInfo({ category: 'linear', settleCoin: 'USDT' });
        if (posRes.retCode === 0) {
          allPositions.push(...posRes.result.list);
        }

        // Fetch Closed PnL for today
        const pnlRes = await client.getClosedPnL({ category: 'linear', startTime });
        if (pnlRes.retCode === 0) {
          totalDailyPnL += pnlRes.result.list.reduce((acc, curr) => acc + parseFloat(curr.closedPnl), 0);
        }
      }

      this.state.dailyRealizedPnL = totalDailyPnL;
      
      const newPositions = {};
      const activeSymbols = new Set();
      
      allPositions.filter(p => parseFloat(p.size) !== 0).forEach((p, idx) => {
        const key = `${p.symbol}_${idx}`;
        activeSymbols.add(p.symbol);
        newPositions[key] = {
          symbol: p.symbol,
          side: p.side,
          size: parseFloat(p.size),
          avgPrice: parseFloat(p.avgPrice),
          unrealisedPnl: parseFloat(p.unrealisedPnl),
          curRealisedPnl: parseFloat(p.curRealisedPnl),
          value: parseFloat(p.positionValue),
          leverage: parseFloat(p.leverage)
        };
      });

      this.state.positions = newPositions;
      
      // If we have a public WS, check if we need to subscribe to new symbols immediately
      if (this.publicWs) {
        this.subscribeToTickers(this.publicWs);
      }

      this.broadcast(true); 
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  }

  setupWebSockets() {
    this.wsClients.forEach((ws, idx) => {
      // Private topics
      ws.subscribeV5(['position', 'execution'], 'linear', true);

      ws.on('update', (data) => {
        if (data.topic === 'position') {
          console.log(`[Private WS] Position update received`);
          this.handlePositionUpdate(data.data);
        } else if (data.topic === 'execution') {
          console.log(`[Private WS] Execution update received`);
          this.handleExecutionUpdate(data.data);
        }
      });
      
      ws.on('open', () => console.log(`[Private WS] Connection opened for account ${idx + 1}`));
      ws.on('error', (err) => console.error(`[Private WS] Error:`, err));
    });

    // Public tickers for price updates
    this.publicWs = new WebsocketClient({ market: 'v5' });
    this.subscribedSymbols = new Set();
    
    this.publicWs.on('update', (data) => {
      if (data.topic.startsWith('tickers.')) {
        const ticker = data.data;
        if (ticker.lastPrice) {
          this.state.prices[ticker.symbol] = parseFloat(ticker.lastPrice);
          this.broadcast();
        }
      }
    });

    this.publicWs.on('open', () => {
      console.log(`[Public WS] Connection opened`);
      this.subscribeToTickers(this.publicWs);
    });

    // Periodically check if we need to subscribe to new symbols (safety net)
    setInterval(() => this.subscribeToTickers(this.publicWs), 15000);
  }

  subscribeToTickers(ws) {
    const currentSymbols = [...new Set(Object.values(this.state.positions).map(p => p.symbol))];
    const newSymbols = currentSymbols.filter(s => !this.subscribedSymbols.has(s));
    
    if (newSymbols.length > 0) {
      console.log(`[Public WS] Subscribing to new symbols: ${newSymbols.join(', ')}`);
      ws.subscribeV5(newSymbols.map(s => `tickers.${s}`), 'linear');
      newSymbols.forEach(s => this.subscribedSymbols.add(s));
    }
  }

  handlePositionUpdate(data) {
    this.fetchInitialData(); 
  }

  handleExecutionUpdate(data) {
    this.fetchInitialData();
  }

  broadcast(force = false) {
    const now = Date.now();
    if (!force && now - this.lastBroadcastTime < this.broadcastThrottleMs) {
      return;
    }
    this.lastBroadcastTime = now;

    if (this.onUpdate) {
      const positionsArray = Object.values(this.state.positions).map(p => {
        const currentPrice = this.state.prices[p.symbol] || p.avgPrice;
        
        // Use Bybit's formula for Linear Perpetual PnL
        const upnl = p.side === 'Buy'
          ? (currentPrice - p.avgPrice) * Math.abs(p.size)
          : (p.avgPrice - currentPrice) * Math.abs(p.size);
          
        const upnlPct = p.side === 'Buy' 
          ? ((currentPrice - p.avgPrice) / p.avgPrice) * p.leverage * 100
          : ((p.avgPrice - currentPrice) / p.avgPrice) * p.leverage * 100;

        const movePct = p.side === 'Buy'
          ? ((currentPrice - p.avgPrice) / p.avgPrice) * 100
          : ((p.avgPrice - currentPrice) / p.avgPrice) * 100;

        return {
          ...p,
          currentPrice,
          upnl: parseFloat(upnl.toFixed(4)),
          upnlPct: parseFloat(upnlPct.toFixed(2)),
          movePct: parseFloat(movePct.toFixed(2))
        };
      }).sort((a, b) => b.upnl - a.upnl); // Sort by PnL Value (USDT) Descending

      const totalUnrealizedPnL = positionsArray.reduce((acc, curr) => acc + curr.upnl, 0);
      const worstPosition = [...positionsArray].sort((a, b) => a.upnl - b.upnl)[0] || null;

      this.onUpdate({
        accountCount: this.accounts.length,
        positionCount: positionsArray.length,
        totalUnrealizedPnL: parseFloat(totalUnrealizedPnL.toFixed(4)),
        dailyRealizedPnL: parseFloat(this.state.dailyRealizedPnL.toFixed(4)),
        worstPosition: worstPosition ? {
          symbol: worstPosition.symbol,
          upnl: worstPosition.upnl,
          upnlPct: worstPosition.upnlPct,
          movePct: worstPosition.movePct,
          side: worstPosition.side
        } : null,
        positions: positionsArray
      });
    }
  }
}

module.exports = BybitManager;
