import React from 'react';

export default function Guide() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto pb-24">
      <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to StockPulse! 📈</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          StockPulse is an AI-powered financial dashboard designed to give you real-time market insights, track your investments, and help you simulate trading strategies without risking real money. This comprehensive guide will walk you through every feature of the platform.
        </p>
      </div>

      <div className="space-y-16">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. The Dashboard & Top Bar</h2>
          
          <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-gray-900 aspect-video flex items-center justify-center">
             <img 
               src="screenshots/dashboard.png" 
               alt="StockPulse Dashboard and Top Bar" 
               className="w-full h-full object-cover"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiIC8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGVuZGluZyBTY3JlZW5zaG90IChzY3JlZW5zaG90cy9kYXNoYm9hcmQucG5nKTwvdGV4dD48L3N2Zz4=';
               }}
             />
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4">At the very top of your screen, you'll find the <strong>Market Status Bar</strong>, which provides essential global context at a glance:</p>
          <ul className="list-disc pl-6 space-y-3 text-gray-600 dark:text-gray-400">
            <li><strong className="text-gray-800 dark:text-gray-200">Market Status:</strong> Indicates whether the US stock market is currently "Open" or "Closed". It dynamically calculates this based on standard trading hours (9:30 AM to 4:00 PM Eastern Time), excluding weekends. The precise New York time is displayed alongside it.</li>
            <li><strong className="text-gray-800 dark:text-gray-200">Live Indices:</strong> Real-time tracking of major market indicators:
              <ul className="list-circle pl-6 mt-2 space-y-1">
                <li><strong>S&P 500:</strong> Measures the performance of 500 large companies listed on stock exchanges in the US.</li>
                <li><strong>NASDAQ:</strong> A benchmark heavily weighted towards information technology companies.</li>
                <li><strong>DOW:</strong> The Dow Jones Industrial Average, measuring 30 prominent companies.</li>
                <li><strong>VIX:</strong> The Volatility Index, often referred to as the "fear index." Higher values indicate greater expected market volatility.</li>
              </ul>
            </li>
            <li><strong className="text-gray-800 dark:text-gray-200">Theme Toggle:</strong> On the far right, you can toggle between Light and Dark mode using the sun/moon icon to match your system preferences or lighting environment.</li>
            <li><strong className="text-gray-800 dark:text-gray-200">Upgrade Button:</strong> Click the golden "Premium" button to view and manage your subscription plans, unlocking advanced AI features and larger tracking limits.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Main Navigation Menu (Left Sidebar)</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The left sidebar is your primary way to navigate between the specialized tools in StockPulse.</p>

          <div className="space-y-12">
            {/* Watchlist */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>⭐</span> Watchlist
              </h3>
              
              <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-gray-900 aspect-video flex items-center justify-center">
                 <img 
                   src="screenshots/watchlist.png" 
                   alt="StockPulse Watchlist" 
                   className="w-full h-full object-cover"
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiIC8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGVuZGluZyBTY3JlZW5zaG90IChzY3JlZW5zaG90cy93YXRjaGxpc3QucG5nKTwvdGV4dD48L3N2Zz4=';
                   }}
                 />
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">The Watchlist is your command center for monitoring specific stocks.</p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 dark:text-gray-400">
                <li><strong className="text-gray-800 dark:text-gray-200">Adding & Removing Stocks:</strong> Use the search bar at the top ("Search tickers to add...") to find companies by their ticker symbol (e.g., AAPL for Apple) or company name. Click the "+" icon to add it. To remove a stock, click the trash can icon on its row.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Data Columns:</strong> 
                  <ul className="list-circle pl-6 mt-2 space-y-1">
                    <li><strong>Price & Chg%:</strong> Real-time price and daily percentage change.</li>
                    <li><strong>5D Sparkline:</strong> A miniature 5-day trendline. Green indicates an upward trend, red indicates a downward trend.</li>
                    <li><strong>52W Range:</strong> A visual bar showing exactly where the current price sits between its 52-week low and 52-week high.</li>
                  </ul>
                </li>
                <li><strong className="text-gray-800 dark:text-gray-200">Interactive Charting:</strong> Clicking on any row instantly loads that stock's detailed historical chart on the right panel. You can adjust the timeframe using the buttons above the chart (1D, 5D, 1mo, 3mo, 6mo, 1y).</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Comparison Tool:</strong> At the top of the chart panel, you can toggle between "Chart" and "Compare". <em>Note: Currently, the compare tool automatically overlays the performance of the top two stocks in your watchlist list.</em></li>
              </ul>
            </div>

            {/* Portfolio */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>📊</span> Portfolio
              </h3>

              <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-gray-900 aspect-video flex items-center justify-center">
                 <img 
                   src="screenshots/portfolio.png" 
                   alt="StockPulse Portfolio" 
                   className="w-full h-full object-cover"
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiIC8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGVuZGluZyBTY3JlZW5zaG90IChzY3JlZW5zaG90cy9wb3J0Zm9saW8ucG5nKTwvdGV4dD48L3N2Zz4=';
                   }}
                 />
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">Manually track your real-world investments in one place.</p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 dark:text-gray-400">
                <li><strong className="text-gray-800 dark:text-gray-200">Adding Holdings:</strong> Click "Add Holding" to log a position. You must provide the Ticker symbol, the total Quantity of shares you own, and your Average Cost Basis (the average price you paid per share).</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Performance Metrics:</strong> 
                  <ul className="list-circle pl-6 mt-2 space-y-1">
                    <li><strong>Total Value:</strong> The current market value of all your holdings combined.</li>
                    <li><strong>Total Return:</strong> Your overall profit or loss since you bought the stocks, shown in dollars and percentages.</li>
                    <li><strong>Today's Return:</strong> How much your portfolio value fluctuated during the current trading day.</li>
                  </ul>
                </li>
                <li><strong className="text-gray-800 dark:text-gray-200">Editing/Deleting:</strong> Use the action buttons next to each holding to update your share count or average cost if you buy more, or delete the holding if you sell out completely.</li>
              </ul>
            </div>

            {/* Paper Trade */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>💸</span> Paper Trade
              </h3>

              <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-gray-900 aspect-video flex items-center justify-center">
                 <img 
                   src="screenshots/paper-trade.png" 
                   alt="StockPulse Paper Trading" 
                   className="w-full h-full object-cover"
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiIC8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGVuZGluZyBTY3JlZW5zaG90IChzY3JlZW5zaG90cy9wYXBlci10cmFkZS5wbmcpPC90ZXh0Pjwvc3ZnPg==';
                   }}
                 />
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">A risk-free simulator for testing strategies with virtual money.</p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 dark:text-gray-400">
                <li><strong className="text-gray-800 dark:text-gray-200">Virtual Balance:</strong> Every user starts with a virtual cash balance of $100,000.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Executing Trades:</strong> 
                  <ul className="list-circle pl-6 mt-2 space-y-1">
                    <li><strong>Buying:</strong> Enter a ticker symbol and the number of shares. The app fetches the live market price and calculates the total cost. If you have enough virtual cash, the trade executes instantly.</li>
                    <li><strong>Selling:</strong> You can only sell shares you currently own in your Paper Trade portfolio. You can sell partial positions or your entire holding.</li>
                  </ul>
                </li>
                <li><strong className="text-gray-800 dark:text-gray-200">Transaction History:</strong> The "History" tab logs every single virtual buy and sell order you make, so you can review your past decisions.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Reset Account:</strong> If you want to start over, you can reset your paper trading account back to the default $100k balance from the settings panel.</li>
              </ul>
            </div>

            {/* AI Signals */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🤖</span> AI Signals (Premium)
              </h3>

              <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-gray-900 aspect-video flex items-center justify-center">
                 <img 
                   src="screenshots/ai-signals.png" 
                   alt="StockPulse AI Signals" 
                   className="w-full h-full object-cover"
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiIC8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGVuZGluZyBTY3JlZW5zaG90IChzY3JlZW5zaG90cy9haS1zaWduYWxzLnBuZyk8L3RleHQ+PC9zdmc+';
                   }}
                 />
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">Leverage our proprietary AI models to uncover hidden market opportunities.</p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 dark:text-gray-400">
                <li><strong className="text-gray-800 dark:text-gray-200">Sentiment Analysis:</strong> The AI scans thousands of recent news articles and earnings transcripts to gauge the overall market sentiment (Bullish, Bearish, or Neutral) for specific sectors and stocks.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Technical Breakouts:</strong> Receive automated signals when a stock breaks through major resistance levels or forms bullish chart patterns (like MACD crossovers).</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Confidence Scores:</strong> Every AI signal comes with a confidence percentage, indicating the historical reliability of that specific pattern.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Account & Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Manage your profile and subscription from the bottom left corner:</p>
          <ul className="list-disc pl-6 space-y-3 text-gray-600 dark:text-gray-400">
            <li><strong className="text-gray-800 dark:text-gray-200">Profile Block:</strong> Shows your registered name, email, and whether you are on the Free or Premium tier.</li>
            <li><strong className="text-gray-800 dark:text-gray-200">Account Limits:</strong> Free accounts have limits on how many stocks they can track in their Watchlist and Portfolio. Upgrading to Premium lifts these restrictions.</li>
            <li><strong className="text-gray-800 dark:text-gray-200">Admin Panel:</strong> If your account has administrative privileges, an extra "Admin" tab appears here, granting you tools to manage platform users and system-wide configurations.</li>
          </ul>
        </section>
        
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-8 mt-8 text-center">
          <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-3">💡 Ready to get started?</h3>
          <p className="text-indigo-800 dark:text-indigo-300 max-w-2xl mx-auto">
            The quickest way to learn is by diving in. Head over to the <strong>Watchlist</strong>, search for your favorite company, and add it. Then, jump into <strong>Paper Trade</strong> and practice buying 10 shares using your virtual cash!
          </p>
        </div>
      </div>
    </div>
  );
}
