# Administrator Guide: Ghana News Aggregator
**Project:** Ghana News Aggregator (v3.0.0)
**Core Requirement:** Strict React 19.2.4 Production Build

## 1. Overview
The Ghana News Aggregator is an institutional editorial platform designed for automated news ingestion, AI synthesis, and strategic archiving. It features a persistent sidebar navigation and real-time refresh monitoring.

## 2. Refresh Protocol Monitoring
- **Access**: Click the "Refresh Protocol" tab in the primary sidebar.
- **Tracking**: Monitor the 5-phase sequential refinement of the application core.
- **Compliance**: Every update must strictly adhere to the React 19.2.4 mandate and 100% gap analysis sync.

## 3. Editorial Cockpit Management
- **News Feed**: Review pending articles, modify headlines/summaries, and approve for institutional archiving.
- **Agent Monitor**: Track the real-time state transitions of the Nexus Agent (Idle, Fetching, Processing, Publishing).
- **Manual Fetch**: Use the "Manual Fetch" trigger in the news feed to bypass autonomous cycles for urgent briefings.

## 4. Audit Trail & Compliance
Review the "Institutional Audit Log" in the Settings view to monitor all news fetches, summary generations, and staff authentication events. All logs are persisted via `localStorage` for institutional durability.

## 5. Troubleshooting
If ingestion fails:
1. Verify the Google GenAI (Gemini) API key in settings.
2. Check the Agent Monitor logs for specific "Search Grounding" errors.
3. Ensure connectivity to Ghanaian news domains (Graphic, Joy, etc.).
