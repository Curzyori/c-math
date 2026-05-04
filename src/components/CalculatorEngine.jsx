import React, { useState } from 'react';
import { FinancePanel } from './FinancePanel';
import { Calculator } from 'lucide-react';
import clsx from 'clsx';

const Keypad = ({ onKeyPress }) => {
  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    'C', '0', '.', '+',
    'Del', '='
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mt-6 mx-auto max-w-[280px] w-full">
      {buttons.map((btn) => (
        <button
          key={btn}
          type="button"
          onClick={() => onKeyPress(btn)}
          className={clsx(
            "p-3 rounded-xl text-lg font-medium transition-all duration-200 border border-white/5",
            "bg-white/5 hover:bg-curzy-accent/20 hover:border-curzy-accent/30 text-white",
            btn === '=' ? "col-span-2 bg-curzy-accent/20 text-curzy-accent hover:bg-curzy-accent/30" : "",
            btn === 'Del' ? "col-span-2 text-red-400 hover:bg-red-400/20 hover:border-red-400/30" : "",
            btn === 'C' ? "text-red-400 hover:bg-red-400/20 hover:border-red-400/30" : ""
          )}
        >
          {btn}
        </button>
      ))}
    </div>
  );
};

export const CalculatorEngine = ({ calculatorHook }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [expression, setExpression] = useState('');
  
  const handleBasicSubmit = (e) => {
    if (e) e.preventDefault();
    if (expression.trim()) {
      calculatorHook.calculateBasic(expression);
      setExpression('');
    }
  };

  const handleKeyPress = (key) => {
    if (key === '=') {
      handleBasicSubmit();
    } else if (key === 'C') {
      setExpression('');
    } else if (key === 'Del') {
      setExpression(prev => prev.slice(0, -1));
    } else {
      setExpression(prev => prev + key);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10 w-fit backdrop-blur-md">
        <button
          onClick={() => setActiveTab('basic')}
          className={clsx(
            "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
            activeTab === 'basic' ? "bg-curzy-accent text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "text-white/60 hover:text-white"
          )}
        >
          Basic Math
        </button>
        <button
          onClick={() => setActiveTab('finance')}
          className={clsx(
            "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
            activeTab === 'finance' ? "bg-curzy-accent text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "text-white/60 hover:text-white"
          )}
        >
          Finance
        </button>
      </div>

      <div className="flex-1 transition-all duration-300 ease-in-out">
        {activeTab === 'basic' ? (
          <div className="glass-panel space-y-6">
            <h3 className="text-xl font-semibold text-curzy-accent flex items-center gap-2">
              <Calculator size={22} /> Expression Evaluator
            </h3>
            <form onSubmit={handleBasicSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Mathematical Expression</label>
                <input
                  type="text"
                  placeholder="e.g. 2 + 2 * (3 / 4) or sin(45 deg)"
                  className="glass-input text-lg font-mono py-4"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  autoFocus
                />
              </div>
              <Keypad onKeyPress={handleKeyPress} />
            </form>
          </div>
        ) : (
          <FinancePanel 
            calculatorHook={calculatorHook}
          />
        )}
      </div>
    </div>
  );
};
