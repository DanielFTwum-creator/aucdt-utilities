# StockPulse SRS Backlog

## Overview
This backlog captures the missing work needed to align the current `stockpulse` implementation with the `StockPulse_SRS.pdf` requirements baseline.

### Current prototype coverage
- Basic watchlist-style UI
- Simulated stock price updates for SOXS and SOXL
- Basic price alerts and browser notifications
- Gemini AI call for buy/sell/hold rationale
- Simple order modal with a daily trade limit
- No user authentication or backend
- No real market data integration
- No portfolio management or paper trading
- No news/sentiment, no accessibility or theme support

## Prioritized backlog

### 1. Critical functional backlog

#### 1.1 User Account & Authentication (SRS IDs: FR-ACC-001..FR-ACC-009)
- Implement user account registration, login, logout, email verification, and profile management. (FR-ACC-001, FR-ACC-003, FR-ACC-007)
- Add secure password management and password reset flow. (FR-ACC-001, FR-ACC-004)
- Add multi-factor authentication support. (FR-ACC-005)
- Enforce session expiry and account data deletion/export workflows. (FR-ACC-006, FR-ACC-009)
- Support subscription management, free/premium differentiation, and plan limits. (FR-ACC-008)

#### 1.2 Market Data & Watchlists (SRS IDs: FR-MKT-001..FR-MKT-008)
- Integrate a real market data provider for delayed and real-time stock data. (FR-MKT-001)
- Build watchlist management: create, edit, delete, save watchlists, and enforce tier limits. (FR-MKT-004)
- Create a sortable/filterable watchlist table with ticker, company, last price, change, volume, market cap. (FR-MKT-005)
- Add interactive OHLCV charts with configurable timeframes and required indicators. (FR-MKT-002, FR-MKT-003)
- Add a stock screener with filters for price range, market cap, sector, P/E, EPS growth, RSI, 52-week range, average volume, dividend yield, plus saved screens/presets. (FR-MKT-006, FR-MKT-007)
- Add a market overview dashboard for major indices with sparkline charts. (FR-MKT-008)

#### 1.3 Portfolio Management (SRS IDs: FR-PORT-001..FR-PORT-008)
- Allow manual entry of positions: ticker, shares, purchase price, purchase date. (FR-PORT-001)
- Calculate and display current value, cost basis, unrealized P&L, day gain, and day gain percentage. (FR-PORT-002)
- Build a portfolio dashboard showing total portfolio value, invested capital, unrealized P&L, day change, and asset allocation. (FR-PORT-003)
- Add historical portfolio performance chart against benchmarks. (FR-PORT-004)
- Support dividend/cash transaction recording and accurate cost basis. (FR-PORT-005)
- Compute portfolio metrics: Sharpe ratio, Beta, Alpha, max drawdown, annualized return, 30-day volatility. (FR-PORT-006)
- Add portfolio data export as CSV/PDF. (FR-PORT-008)
- Design broker read-only OAuth sync for premium users. (FR-PORT-007)

#### 1.4 AI Stock Analysis Engine (SRS IDs: FR-AI-001..FR-AI-007)
- Implement a composite AI Score (0–100) for each analyzed security. (FR-AI-001)
- Produce Buy/Sell/Hold signals with confidence levels and human-readable rationale. (FR-AI-002)
- Ensure the AI pipeline analyzes technical indicators, fundamentals, and trailing sentiment. (FR-AI-003)
- Capture AI signal history and outcome tracking after 5/10/30 trading days. (FR-AI-004)
- Refresh premium watchlist signals every 60 minutes during market hours. (FR-AI-005)
- Display feature importance for AI score drivers. (FR-AI-006)
- Include an AI disclaimer on all generated content. (FR-AI-007)

#### 1.5 Alerts & Notifications (SRS IDs: FR-ALRT-001..FR-ALRT-007)
- Support price alerts and percentage change alerts. (FR-ALRT-001, FR-ALRT-002)
- Extend alert creation to technical indicators (RSI, MACD, Bollinger Bands). (FR-ALRT-003)
- Add earnings alerts 24h and 1h before events for held/watchlisted securities. (FR-ALRT-004)
- Support multi-channel alert delivery: push mobile, in-app, and email. (FR-ALRT-005)
- Add per-alert channel preferences. (FR-ALRT-005)
- Limit active alerts by tier: free 5, premium 100. (FR-ALRT-006)
- Add alert history with timestamp, trigger condition, and price at trigger. (FR-ALRT-007)

#### 1.6 Paper Trading (SRS IDs: FR-PAPER-001..FR-PAPER-005)
- Provide a paper trading account seeded with $100,000 virtual capital and monthly reset. (FR-PAPER-001)
- Support market, limit, and stop-loss orders in paper trading. (FR-PAPER-002)
- Simulate realistic fills with bid/ask spreads and slippage. (FR-PAPER-003)
- Build a paper trading dashboard showing virtual portfolio value, positions, order history, realized/unrealized P&L, and win rate. (FR-PAPER-004)
- Compare paper portfolio performance against the S&P 500 benchmark. (FR-PAPER-005)

### 2. High-priority non-functional backlog

#### 2.1 Security (SRS IDs: NFR-SEC-001..NFR-SEC-007)
- Move Gemini API and other keys to a secure backend/proxy, never into browser code. (NFR-SEC-001, NFR-SEC-003)
- Require HTTPS/TLS and reject insecure protocols. (NFR-SEC-001)
- Enforce authentication, JWT access tokens, and refresh token rotation. (NFR-SEC-003)
- Implement rate limiting for authenticated and unauthenticated requests. (NFR-SEC-004)
- Log authentication/security events with 90-day retention. (NFR-SEC-005)
- Prepare for third-party penetration testing before production release. (NFR-SEC-007)

#### 2.2 Performance & Reliability (SRS IDs: NFR-PERF-001..NFR-PERF-006, NFR-REL-001..NFR-REL-005)
- Define dashboard load and endpoint response SLAs. (NFR-PERF-001, NFR-PERF-005)
- Ensure real-time price and chart refresh performance. (NFR-PERF-002, NFR-PERF-003)
- Ensure AI signal generation completes within 10 seconds. (NFR-PERF-006)
- Plan for at least 50,000 concurrent authenticated users. (NFR-PERF-004)
- Build failover for market data feeds and backup/recovery procedures. (NFR-REL-003, NFR-REL-004)
- Add graceful degradation and outage messaging. (NFR-REL-005)
- Define maintenance windows and uptime SLA. (NFR-REL-001, NFR-REL-002)

#### 2.3 Usability & Accessibility (SRS IDs: NFR-USE-001..NFR-USE-005)
- Ensure WCAG 2.1 AA compliance. (NFR-USE-001)
- Add keyboard and screen reader support. (NFR-USE-002)
- Add light/dark theme switching with system default. (NFR-USE-004)
- Improve onboarding so new users can complete setup within 5 minutes. (NFR-USE-003)
- Use human-readable, specific error messages. (NFR-USE-005)

#### 2.4 News, Sentiment & Compliance (SRS IDs: FR-NEWS-001..FR-NEWS-005, FR-AI-007)
- Add financial news aggregation and sentiment scoring. (FR-NEWS-001, FR-NEWS-002)
- Prioritize news for held positions and relevant tickers. (FR-NEWS-003)
- Add an earnings calendar and SEC filing links. (FR-NEWS-004, FR-NEWS-005)
- Include compliance disclaimers and terms/privacy links. (FR-AI-007)
- Align data retention with privacy regulations. (Regulatory and retention clauses in Section 5)

### 3. Medium/long-term backlog
- Build mobile-specific UX and biometric authentication for mobile clients. (External interface requirements)
- Add internationalization support and locale-aware formatting. (Section 5.3)
- Add append-only audit trails and observability. (NFR-MAINT-001..NFR-MAINT-003)
- Expand analytics coverage with additional financial KPIs. (Portfolio and AI sections)
- Create admin/ops dashboards for system health and usage metrics. (NFR-MAINT-003)

## Notes
This backlog is intentionally structured by SRS category and priority. The next implementation phase should start with the critical functional pieces that are missing entirely from the prototype:
1. secure backend/auth
2. real market data and watchlists
3. portfolio management
4. AI signal quality and history
5. alert delivery and paper trading

Once these are in place, the non-functional backlog becomes a delivery and hardening phase.
