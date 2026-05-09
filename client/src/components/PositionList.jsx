import React from 'react';
import { clsx } from 'clsx';

const PositionList = ({ positions }) => {
  return (
    <div className="flex-1 overflow-y-auto border border-border-main rounded-md bg-bg-card transition-colors">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-bg-main text-[10px] uppercase text-text-muted font-bold z-10 transition-colors">
          <tr>
            <th className="p-2 border-b border-border-main">Symbol</th>
            <th className="p-2 border-b border-border-main">Value (USDT)</th>
            <th className="p-2 border-b border-border-main text-right">Unrealized PNL</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {positions.map((pos, idx) => {
            const isLong = pos.side === 'Buy';
            const colorClass = isLong ? 'text-trading-up' : 'text-trading-down';
            
            return (
              <tr 
                key={`${pos.symbol}_${idx}`} 
                className="border-b border-border-main hover:bg-bg-main/50 transition-colors"
              >
                <td className={clsx("p-2 portrait:p-1.5 font-bold", colorClass)}>
                  <div className="flex flex-col">
                    <span className="portrait:text-xs">{pos.symbol}</span>
                    <span className="text-[10px] opacity-70">
                      {isLong ? 'LONG' : 'SHORT'}
                    </span>
                  </div>
                </td>
                <td className={clsx("p-2 portrait:p-1.5 font-medium portrait:text-xs", colorClass)}>
                  {pos.value.toFixed(2)}
                </td>
                <td className="p-2 portrait:p-1.5 text-right font-bold">
                  <div className={clsx(pos.upnl >= 0 ? 'text-trading-up' : 'text-trading-down')}>
                    <span className="portrait:text-xs">{pos.upnl >= 0 ? '+' : ''}{pos.upnl.toFixed(4)}</span>
                    <div className="text-[10px] portrait:text-[9px] font-bold">
                      {pos.movePct >= 0 ? '+' : ''}{pos.movePct.toFixed(2)}% m
                      <span className="ml-1 opacity-70 font-semibold">
                        ({pos.upnlPct >= 0 ? '+' : ''}{pos.upnlPct.toFixed(2)}% l)
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
          {positions.length === 0 && (
            <tr>
              <td colSpan="3" className="p-10 text-center text-text-muted italic">
                No active positions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PositionList;
