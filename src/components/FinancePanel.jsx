import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/mathHelpers';

export const FinancePanel = ({ calculatorHook }) => {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [entryAmount, setEntryAmount] = useState('');
  const [feePercent, setFeePercent] = useState('');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (calculatorHook && calculatorHook.calculateProfit) {
      const res = calculatorHook.calculateProfit(buyPrice, sellPrice, entryAmount, feePercent);
      if (res.success) {
        setResult(res);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel space-y-4">
        <h3 className="text-xl font-semibold text-curzy-accent flex items-center gap-2">
          <Calculator size={22} /> Profit Calculator
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Buy Price</label>
            <input
              type="number"
              placeholder="0.00"
              className="glass-input"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Sell Price</label>
            <input
              type="number"
              placeholder="0.00"
              className="glass-input"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Entry Amount</label>
            <input
              type="number"
              placeholder="0.00"
              className="glass-input"
              value={entryAmount}
              onChange={(e) => setEntryAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Fee (%)</label>
            <input
              type="number"
              placeholder="0"
              className="glass-input"
              value={feePercent}
              onChange={(e) => setFeePercent(e.target.value)}
            />
          </div>
        </div>

        <button onClick={handleCalculate} className="btn-primary w-full py-3 mt-4 text-lg">
          Calculate Profit
        </button>
      </div>

      {result && (
        <div className="glass-panel bg-curzy-accent/5 border-curzy-accent/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-white/60">Net Profit</p>
              <p className={`text-2xl font-bold ${result.profit >= 0 ? 'text-curzy-accent' : 'text-red-400'}`}>
                {formatCurrency(result.profit)}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60">Profit %</p>
              <p className={`text-2xl font-bold ${result.profitPercentage >= 0 ? 'text-curzy-accent' : 'text-red-400'}`}>
                {formatPercentage(result.profitPercentage)}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60">Total Fee Paid</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(result.totalFee)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
