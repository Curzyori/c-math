import React from 'react';
import { Copy, Terminal } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/mathHelpers';
import { motion, AnimatePresence } from 'framer-motion';

export const SessionHistory = ({ history }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderHistoryItem = (item) => {
    let content = '';
    
    if (item.type === 'Basic') {
      content = `${item.expression} = ${item.result}`;
    } else if (item.type === 'Finance/DCA') {
      content = `[DCA & Finance]\nAvg Buy: ${formatCurrency(item.avgBuyPrice)}\nTotal Qty: ${item.totalQty}\nSell Price: ${formatCurrency(item.sellPrice)}\nNet Profit: ${formatCurrency(item.netProfit)}\nROI: ${formatPercentage(item.roi)}`;
    } else if (item.type === 'Profit') {
      content = `[Profit Calculator]\nEntry Amount: ${formatCurrency(item.entryAmount)}\nNet Profit: ${formatCurrency(item.netProfit)}\nROI: ${formatPercentage(item.roi)}`;
    } else {
      const { id, timestamp, type, ...cleanItem } = item;
      content = JSON.stringify(cleanItem, null, 2);
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-3 p-3 bg-black/40 rounded border border-white/5 font-mono text-sm relative group"
      >
        <button 
          onClick={() => handleCopy(content)}
          className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded opacity-0 group-hover:opacity-100 transition-all text-white/70 hover:text-white"
          title="Copy"
        >
          <Copy size={14} />
        </button>
        <div className="text-curzy-accent/70 text-xs mb-1">
          [{new Date(item.timestamp).toLocaleTimeString()}] {item.type}
        </div>
        <pre className="whitespace-pre-wrap text-white/90 font-mono text-[13px]">{content}</pre>
      </motion.div>
    );
  };

  return (
    <div className="glass-panel h-full flex flex-col max-h-[600px] lg:max-h-none overflow-hidden">
      <div className="flex items-center gap-2 mb-4 text-white/80 border-b border-white/10 pb-3 shrink-0">
        <Terminal size={18} className="text-curzy-accent" />
        <h3 className="font-semibold">Session Terminal</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="text-white/40 text-sm text-center mt-10 font-mono">
            &gt; Awaiting input...
          </div>
        ) : (
          <AnimatePresence>
            {history.map(item => (
              <React.Fragment key={item.id}>
                {renderHistoryItem(item)}
              </React.Fragment>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
