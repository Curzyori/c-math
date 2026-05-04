import { evaluate, bignumber, multiply, divide, add, subtract } from 'mathjs';
import { useState, useCallback } from 'react';

export const useCalculator = () => {
  const [history, setHistory] = useState([]);

  const addHistory = useCallback((entry) => {
    setHistory((prev) => [
      { id: Date.now(), timestamp: new Date().toISOString(), ...entry },
      ...prev,
    ]);
  }, []);

  const calculateBasic = useCallback((expression) => {
    try {
      const result = evaluate(expression);
      // Format to avoid long decimals
      const formattedResult = Number.isInteger(result) ? result : Number(result.toFixed(6));
      addHistory({ type: 'Basic', expression, result: formattedResult });
      return { success: true, result: formattedResult };
    } catch (error) {
      return { success: false, error: 'Invalid expression' };
    }
  }, [addHistory]);

  const calculateDCA = useCallback((buys) => {
    if (!buys || buys.length === 0) return { success: false, error: 'No data provided' };
    
    let totalValue = 0;
    let totalQty = 0;
    
    buys.forEach(({ price, qty }) => {
      const p = parseFloat(price);
      const q = parseFloat(qty);
      if (!isNaN(p) && !isNaN(q) && p >= 0 && q >= 0) {
        totalValue += p * q;
        totalQty += q;
      }
    });

    if (totalQty === 0) return { success: false, error: 'Total quantity is zero' };
    
    const avgPrice = totalValue / totalQty;
    addHistory({ type: 'DCA', details: buys, avgPrice, totalQty, totalValue });
    
    return { success: true, avgPrice, totalQty, totalValue };
  }, [addHistory]);

  const calculateFinance = useCallback((avgBuyPrice, sellPrice, quantity, feePercent = 0) => {
    const buy = parseFloat(avgBuyPrice);
    const sell = parseFloat(sellPrice);
    const qty = parseFloat(quantity);
    const feeP = parseFloat(feePercent) || 0;

    if (isNaN(buy) || isNaN(sell) || isNaN(qty) || buy < 0 || sell < 0 || qty <= 0) {
      return { success: false, error: 'Invalid inputs' };
    }

    const grossProfit = (sell - buy) * qty;
    // Assuming fees are applied to the total sell value (like most exchanges)
    // Could also be applied to buy, but let's keep it simple
    const totalSellValue = sell * qty;
    const fees = totalSellValue * (feeP / 100);
    const netProfit = grossProfit - fees;
    const roi = buy > 0 ? (netProfit / (buy * qty)) * 100 : 0;

    addHistory({ type: 'Finance', avgBuyPrice: buy, sellPrice: sell, quantity: qty, feePercent: feeP, netProfit, roi });

    return { success: true, netProfit, grossProfit, fees, roi };
  }, [addHistory]);

  const calculateProfit = useCallback((buyPrice, sellPrice, entryAmount, feePercentage = 0) => {
    const buy = parseFloat(buyPrice) || 0;
    const sell = parseFloat(sellPrice) || 0;
    const amount = parseFloat(entryAmount) || 0;
    const feeP = parseFloat(feePercentage) || 0;

    if (buy === 0) {
      return { success: false, error: 'Buy price cannot be 0' };
    }

    if (isNaN(buy) || isNaN(sell) || isNaN(amount) || buy < 0 || sell < 0 || amount < 0) {
      return { success: false, error: 'Invalid inputs' };
    }

    try {
      const units = divide(bignumber(amount), bignumber(buy));
      const grossSell = multiply(units, bignumber(sell));
      
      const feeRate = divide(bignumber(feeP), bignumber(100));
      const buyFee = multiply(bignumber(amount), feeRate);
      const sellFee = multiply(grossSell, feeRate);
      const totalFeeBn = add(buyFee, sellFee);
      
      const netProfitBn = subtract(subtract(grossSell, bignumber(amount)), totalFeeBn);
      const roiBn = amount > 0 ? multiply(divide(netProfitBn, bignumber(amount)), bignumber(100)) : bignumber(0);

      const profit = Number(netProfitBn.toString());
      const profitPercentage = Number(roiBn.toString());
      const totalFee = Number(totalFeeBn.toString());

      addHistory({ 
        type: 'Profit', 
        entryAmount: amount, 
        netProfit: profit, 
        roi: profitPercentage 
      });

      return { success: true, profit, profitPercentage, totalFee };
    } catch (err) {
      return { success: false, error: 'Calculation error' };
    }
  }, [addHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    calculateBasic,
    calculateDCA,
    calculateFinance,
    calculateProfit,
    clearHistory,
    addLog: addHistory
  };
};
