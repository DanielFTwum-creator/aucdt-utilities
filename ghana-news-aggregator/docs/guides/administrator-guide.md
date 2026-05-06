# 📘 Administrator Operational Guide
## Ghana News Aggregator & Auto-Poster System

**Version:** 2.1 (Production)  
**Classification:** Internal - Administrative Use Only

---

## 1. System Overview
The Ghana News Aggregator is an AI-driven platform designed to automate the discovery, summarization, and publication of local news. As an Administrator, you oversee the system's "Nexus Agent," manage ingestion sources, and ensure content quality through the editorial moderation suite.

---

## 2. Secure Access
### 2.1 Authentication
- **Access URL**: Ensure you are accessing the system over a secure (HTTPS) connection.
- **Login Credentials**: Default username is `admin`. Use the password configured during deployment.
- **Session Management**: Sessions expire after 24 hours of inactivity.

### 2.2 Security Best Practices
- **Password Rotation**: Change the administrative password every 90 days via **Settings > Security Settings**.
- **Audit Monitoring**: Periodically review the **Audit Logs** in Settings to detect unauthorized configuration changes.

---

## 3. Managing Ingestion Sources
The system supports multiple ingestion methodologies to ensure comprehensive coverage.

### 3.1 Adding a Source
1. Navigate to **Settings > Ingestion Sources**.
2. Click **Add Source**.
3. **Identity**: Enter a descriptive name (e.g., "Daily Graphic").
4. **Endpoint**: Provide the valid RSS or API URL.
5. **Validation**: Use the AI-powered "Validate Source" button. This uses Gemini to verify if the endpoint provides relevant Ghanaian news data.
6. **Toggle**: Ensure "Automated Polling" is enabled for the Agent to pick up the source.

---

## 4. Nexus Agent Governance
The Agent operates on a high-frequency autonomous loop (default 15s check).

### 4.1 Agent States
- **Idle**: Standard dormant state between cycles.
- **Ingesting**: Active search grounding or RSS polling.
- **AI Cogitation**: Synthesis of headlines, summaries, and images.
- **Dispatch**: Social media API communication.

### 4.2 Manual Halt
In the event of a breaking news "flood" or detected hallucination, use the **Manual Halt** button on the **Agent Monitor** tab. This pauses all autonomous processing while allowing manual feed moderation.

---

## 5. Editorial Workflow
All discovered articles enter the **PENDING** state by default.

### 5.1 Moderation Steps
1. **News Feed**: Review incoming stories.
2. **Expansion**: Click an article title to view full AI-generated metadata (sentiment, engagement score, tags).
3. **Inline Correction**: Click the pencil icon next to a headline or summary to make immediate edits. This moves the article to **PENDING_EDIT**.
4. **Approval**: Click "Quick Approve" or "Commit & Approve" to move the item to the publication queue.
5. **Rejection**: Use the "Reject" button to archive stories that are redundant or irrelevant.

---

## 6. Social Media Integration
The system currently supports **Facebook Graph API**.

### 6.1 Token Management
- Ensure the **Page Access Token** in Settings is "Long-Lived" (valid for 60 days or permanent).
- If auto-posting fails, check the **Agent Monitor Logs** for "OAuth Exception" errors. This usually indicates a token has been revoked or expired.

---

## 7. Compliance & Reporting
- **Audit Trail**: Every administrative action is logged. 
- **Exporting**: Use the **Export JSON** button in Settings to generate compliance reports for stakeholders.
- **Diagnostic Suite**: Run a **Self-Test** (Dashboard > Self-Test) before every major reporting period to verify system integrity.

---
*© 2025 Ghana News Hub. Documentation Managed by ICT Division.*