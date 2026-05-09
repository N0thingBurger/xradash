import React, { useState, useEffect } from 'react';
import HeaderStats from './components/HeaderStats';
import PositionList from './components/PositionList';
import { useDashboardData } from './hooks/useDashboardData';
import { Sun, Moon, Wifi, WifiOff, Maximize, Minimize } from 'lucide-react';
import { clsx } from 'clsx';

function App() {
  const { data, isConnected } = useDashboardData();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="h-screen w-screen flex flex-col p-2 overflow-hidden bg-bg-main text-text-main transition-colors duration-200">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-2 px-1 shrink-0">
        <div className="flex items-center space-x-2 overflow-hidden">
          <h1 className="text-sm font-black tracking-tighter uppercase italic flex items-center shrink-0">
            <span className="text-trading-up">XRA</span>
            <span className="text-text-main">DASH</span>
          </h1>
          <div className={clsx(
            "flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
            isConnected ? "bg-trading-up/10 text-trading-up" : "bg-trading-down/10 text-trading-down"
          )}>
            {isConnected ? <Wifi size={10} /> : <WifiOff size={10} />}
            <span>{isConnected ? 'LIVE' : 'OFFLINE'}</span>
          </div>
          {data.btcPrice > 0 && (
            <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded-sm bg-bg-card border border-border-main text-[10px] font-black shrink-0">
              <span className="text-trading-up">BTC</span>
              <span className="text-text-main">{data.btcPrice.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md border border-border-main bg-bg-card hover:bg-bg-main text-text-main transition-colors"
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded-md border border-border-main bg-bg-card hover:bg-bg-main text-text-main transition-colors"
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      <HeaderStats data={data} />
      <PositionList positions={data.positions} />
      
      <div className="mt-1 px-1 flex justify-between items-center text-[9px] text-text-muted font-medium uppercase tracking-widest shrink-0">
        <span>{data.accountCount || 0} {data.accountCount === 1 ? 'Account' : 'Accounts'} Connected</span>
        <span>{data.positions.length} Positions Active</span>
      </div>
    </div>
  );
}

export default App;
