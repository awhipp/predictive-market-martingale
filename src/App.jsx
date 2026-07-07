import { useState } from 'react'

function App() {
  const [targetProfit, setTargetProfit] = useState(10.00)
  const [contractPrice, setContractPrice] = useState(0.50)
  const [trades, setTrades] = useState([])

  const getCumulativeLosses = () => {
    let lossSum = 0;
    // Iterate backwards through trades to find the current losing streak
    for (let i = trades.length - 1; i >= 0; i--) {
      const trade = trades[i];
      if (trade.status === 'win') {
        break; // Streak is broken
      }
      if (trade.status === 'loss') {
        lossSum += trade.stake;
      }
    }
    return lossSum;
  }

  const getSessionProfit = () => {
    return trades.reduce((sum, trade) => {
      if (trade.status === 'win') {
        return sum + (trade.grossPayout - trade.stake);
      } else if (trade.status === 'loss') {
        return sum - trade.stake;
      }
      return sum;
    }, 0);
  }

  const cumulativeLosses = getCumulativeLosses();
  const sessionProfit = getSessionProfit();

  const netPayoutOdds = (1.00 / contractPrice) - 1.00
  const nextStake = contractPrice >= 0.99 ? 0 : (targetProfit + cumulativeLosses) / netPayoutOdds
  const totalReturn = contractPrice >= 0.99 ? 0 : nextStake * (1.00 / contractPrice)

  // Determine risk panel styling
  let riskClasses = "p-6 rounded-lg border transition-colors duration-200 space-y-4 relative overflow-hidden "
  let riskText = ""

  if (contractPrice <= 0.40) {
    riskClasses += "bg-green-50 border-green-200 text-green-800"
    riskText = "High multiplier. Low capital requirement to break even."
  } else if (contractPrice <= 0.70) {
    riskClasses += "bg-amber-50 border-amber-200 text-amber-800"
    riskText = "Standard scaling active."
  } else {
    riskClasses += "bg-red-50 border-red-200 text-red-800"
    riskText = "CRITICAL RISK: Chasing a favorite requires dangerous capital allocation."
  }

  const logTrade = () => {
    if (nextStake <= 0) return;
    const newTrade = {
      id: Date.now(),
      stake: nextStake,
      price: contractPrice,
      grossPayout: totalReturn,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setTrades([...trades, newTrade]);
  };

  const resolveTrade = (id, status) => {
    setTrades(trades.map(t => t.id === id ? { ...t, status } : t));
  };

  const resetSession = () => {
    if (window.confirm('Are you sure you want to clear all trade history and reset the session?')) {
      setTrades([]);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-lg">
        <div className="bg-white shadow-xl rounded-xl w-full p-6 space-y-6">

          {/* Header & Session Stats */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Variable-Odds Martingale</h1>
              <p className="text-sm text-gray-500">Prediction market position scaling.</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Session Profit</p>
              <p className={`text-xl font-bold ${sessionProfit > 0 ? 'text-green-600' : sessionProfit < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                {sessionProfit > 0 ? '+' : ''}${sessionProfit.toFixed(2)}
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Configuration Inputs */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Configuration</h2>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Active Losses: ${cumulativeLosses.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="targetProfit" className="block text-sm font-medium text-gray-700 mb-1">Target Profit ($)</label>
                <input
                  type="number"
                  id="targetProfit"
                  step="0.01"
                  value={targetProfit === 0 ? '' : targetProfit}
                  onChange={e => setTargetProfit(parseFloat(e.target.value) || 0)}
                  onBlur={e => setTargetProfit(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="contractPrice" className="text-sm font-medium text-gray-700">Contract Price ($)</label>
                  <span className="text-sm font-semibold text-blue-600">{contractPrice.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  id="contractPrice"
                  min="0.01"
                  max="0.99"
                  step="0.01"
                  value={contractPrice}
                  onChange={e => setContractPrice(parseFloat(e.target.value) || 0.5)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                />
              </div>
            </div>
          </div>

          {/* Risk Panel & Call to Action */}
          <div className={riskClasses}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Required Stake</p>
                <p className="text-3xl font-extrabold mt-1">${nextStake.toFixed(2)}</p>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Gross Payout</p>
                <p className="text-xl font-bold mt-1">${totalReturn.toFixed(2)}</p>
              </div>
            </div>

            <p className="text-xs font-medium pt-2 border-t border-current border-opacity-20 mb-4">
              {riskText}
            </p>

            <button
              onClick={logTrade}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition transform active:scale-95"
            >
              Log Trade @ {contractPrice.toFixed(2)}
            </button>
          </div>

          <hr className="border-gray-200" />

          {/* Trade History */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Trade History</h2>
              {trades.length > 0 && (
                <button onClick={resetSession} className="text-xs text-red-500 hover:text-red-700 underline">Reset Session</button>
              )}
            </div>

            {trades.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                <p className="text-sm text-gray-500">No trades logged yet. Place your first order.</p>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {[...trades].reverse().map((trade) => (
                  <div key={trade.id} className={`p-3 rounded-lg border ${trade.status === 'pending' ? 'bg-white border-blue-200 shadow-sm' : trade.status === 'win' ? 'bg-green-50 border-green-200 opacity-75' : 'bg-red-50 border-red-200 opacity-75'} flex justify-between items-center transition-all`}>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-800">${trade.stake.toFixed(2)}</span>
                        <span className="text-xs text-gray-500">@ {trade.price.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{trade.timestamp}</p>
                    </div>

                    <div>
                      {trade.status === 'pending' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => resolveTrade(trade.id, 'win')}
                            className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold rounded"
                          >
                            Win
                          </button>
                          <button
                            onClick={() => resolveTrade(trade.id, 'loss')}
                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded"
                          >
                            Loss
                          </button>
                        </div>
                      ) : (
                        <span className={`text-xs font-bold uppercase tracking-wider ${trade.status === 'win' ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center pb-4">
          <a
            href="https://github.com/awhipp/predictive-market-martingale"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}

export default App
