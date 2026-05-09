import React from 'react';
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

const StatCard = ({ title, value, subValue, type }) => {
  const isPositive = typeof value === 'number' ? value >= 0 : true;
  const colorClass = type === 'pnl' 
    ? (isPositive ? 'text-trading-up' : 'text-trading-down')
    : 'text-text-main';

  return (
    <div className="bg-bg-card border border-border-main p-2 rounded-md flex flex-col justify-center transition-colors">
      <span className="text-[10px] uppercase text-text-muted font-bold leading-tight">{title}</span>
      <div className="flex items-baseline space-x-1">
        <span className={clsx("text-lg font-bold leading-none", colorClass)}>
          {typeof value === 'number' ? (value >= 0 ? '+' : '') + value.toFixed(4) : value}
        </span>
        {subValue && (
          <span className={clsx("text-xs font-semibold", colorClass)}>
            ({subValue})
          </span>
        )}
      </div>
    </div>
  );
};

const HeaderStats = ({ data }) => {
  const { totalUnrealizedPnL, dailyRealizedPnL, worstPosition } = data;

  return (
    <div className="grid grid-cols-2 portrait:grid-cols-2 landscape:grid-cols-3 gap-2 mb-2 shrink-0">
      <StatCard 
        title="Total Unrealized PnL" 
        value={totalUnrealizedPnL} 
        type="pnl"
      />
      <StatCard 
        title="Daily Realized PnL" 
        value={dailyRealizedPnL} 
        type="pnl"
      />
      <div className="portrait:col-span-2 landscape:col-span-1">
        {worstPosition ? (
          <div className="bg-bg-card border border-trading-down/30 p-2 rounded-md flex flex-col justify-center transition-colors h-full">
            <span className="text-[10px] uppercase text-trading-down font-bold leading-tight flex items-center">
              <AlertCircle size={10} className="mr-1" /> Worst Performer
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-trading-down leading-none truncate">{worstPosition.symbol}</span>
              <div className="flex items-center space-x-1 whitespace-nowrap text-trading-down mt-0.5">
                <span className="text-xs font-bold">
                  {typeof worstPosition.upnl === 'number' ? worstPosition.upnl.toFixed(2) : '0.00'}
                </span>
                <span className="text-xs font-bold">|</span>
                <span className="text-xs font-bold">
                  {typeof worstPosition.movePct === 'number' ? worstPosition.movePct.toFixed(2) : '0.00'}% m
                </span>
                <span className="text-[10px] font-semibold opacity-70">
                  [{typeof worstPosition.upnlPct === 'number' ? worstPosition.upnlPct.toFixed(2) : '0.00'}% l]
                </span>
              </div>
            </div>
          </div>
        ) : (
          <StatCard title="Worst Performer" value="None" type="neutral" />
        )}
      </div>
    </div>
  );
};

export default HeaderStats;
