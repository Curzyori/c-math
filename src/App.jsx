import React from 'react';
import { CalculatorEngine } from './components/CalculatorEngine';
import { SessionHistory } from './components/SessionHistory';
import { useCalculator } from './hooks/useCalculator';
import { Trash2 } from 'lucide-react';

function App() {
  const calculatorHook = useCalculator();

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-curzy-accent/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <header className="mb-8 relative z-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-curzy-accent to-emerald-300 tracking-tight">
          C Math
        </h1>
        <p className="text-white/50 text-sm mt-2 font-medium">Advanced Calculations & DCA Tracking</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <CalculatorEngine calculatorHook={calculatorHook} />
        </div>
        
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full gap-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-white/80 font-medium">Activity Log</h2>
            <button 
              onClick={calculatorHook.clearHistory}
              disabled={calculatorHook.history.length === 0}
              className="text-sm text-red-400/60 hover:text-red-400 flex items-center gap-1 transition-colors disabled:opacity-30"
            >
              <Trash2 size={16} /> Clear
            </button>
          </div>
          <div className="flex-1 min-h-[400px]">
            <SessionHistory history={calculatorHook.history} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
