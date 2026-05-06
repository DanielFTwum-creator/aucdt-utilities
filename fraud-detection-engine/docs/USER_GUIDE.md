# User Guide — Fraud Detection Engine

**Version:** 3.0.0  
**Last Updated:** 2026-04-27  
**Institution:** Techbridge University College (TUC)

---

## Quick Start

### 1. Access the Application
- **URL:** `http://localhost:3000` (development) or your deployed instance
- **Browser Support:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Recommended Device:** Desktop (primary), Tablet (responsive), Mobile (responsive)

### 2. First-Time Login (Admin Only)
If you're accessing the admin features:
1. Click the **TUC logo** in the header or navigate to `/#/login`
2. Enter credentials: **Username:** `admin` | **Password:** `admin`
3. Click **Sign In**
4. You'll be redirected to the Dashboard

### 3. Main Navigation
The app uses a **sidebar navigation** on the left. Current page is highlighted in gold.

**Available Pages:**
- 📊 **Dashboard** — Overview of entity health and trends
- 📋 **Entities** — List of all monitored financial entities
- 💚 **Health** — Detailed health distribution and status grid
- 🚨 **Alerts** — Active fraud/risk alerts with acknowledgement
- 🔧 **Admin** (protected) — Diagnostics, monitoring, testing

---

## Dashboard

The Dashboard provides a real-time snapshot of your fraud detection monitoring.

### What You'll See

#### 1. **Key Metrics Cards** (Top Row)
Four stat cards showing:
- **Total Entities** — Number of monitored entities (e.g., 10)
- **Healthy** — Entities with health score ≥ 80 (✅ green)
- **Warnings** — Entities with health 50–79 (⚠️ yellow)
- **Critical** — Entities with health < 50 (🚨 red)

**What it means:**
- Green = No action needed
- Yellow = Monitor closely, may escalate
- Red = Immediate attention required

#### 2. **Average Health Score Banner**
Shows the overall system health as a percentage (0–100).

**Interpretation:**
- **90–100%** — Excellent, all systems normal
- **70–89%** — Good, minor warnings present
- **50–69%** — Fair, several entities need attention
- **0–49%** — Critical, immediate action required

#### 3. **Health Score Trend Chart**
An interactive area chart showing health scores over time (last 10 minutes).

**How to use it:**
- Hover over points to see exact timestamps and values
- Watch for sudden drops → indicator of emerging issues
- Look for sustained low trends → ongoing problems

**Legend:**
- **Y-axis:** Health score (0–100)
- **X-axis:** Time (auto-updating every 5 seconds)
- **Trend:** Blue area = current trend

### Real-Time Updates
The Dashboard automatically refreshes entity data **every 5 seconds**. No manual refresh needed.

### Keyboard & Accessibility
- **Tab** to navigate between cards
- **Enter/Space** to interact with any card
- **Screen reader support** — All metrics announced via ARIA labels

---

## Entities Page

View all monitored financial entities and their current health status.

### Entity List View

**Columns:**
| Column | Shows | Color Code |
|--------|-------|-----------|
| **Name** | Entity identifier | — |
| **Health Score** | Current score 0–100 | 🟢 ≥80 / 🟡 50–79 / 🔴 <50 |
| **Status** | Human-readable label | "Healthy", "Warning", "Critical" |
| **Trend** | ↑ Improving, ↓ Declining, → Stable | Direction arrow |
| **Last Updated** | Timestamp | ISO format |

### Filtering & Search
Currently, all entities are displayed. To find a specific entity, use your **browser's find feature** (`Ctrl+F` / `Cmd+F`).

### Entity Details (REST API)
For developers: Click on an entity name → opens entity detail view (if implemented) showing:
- Health score history (last 24 hours)
- Transaction count
- Associated metrics
- Risk indicators

**API Endpoint:** `GET /api/v1/entities/:id`

### Taking Action
If an entity is in **Warning** or **Critical** status:
1. **Alert** — See the Alerts page (linked from Dashboard)
2. **Monitor** — Review Health page to understand why health is low
3. **Escalate** — Contact your fraud team or incident response

---

## Health Monitoring Page

Detailed breakdown of entity health status across your monitored system.

### Health Distribution Summary (Top)

**Three cards showing counts:**
- **Healthy (≥80)** — ✅ green
- **Warning (50–79)** — ⚠️ yellow
- **Critical (<50)** — 🚨 red

**Use this to:** Quickly assess how many entities need attention at each level.

### Health Distribution Chart
A horizontal bar chart showing **entity count** at each health score range.

**Interpretation:**
- Tall red bar on left = Many critical entities
- Tall green bar on right = Mostly healthy entities
- Balanced distribution = System operating normally

### Entity Status Grid
A detailed grid showing every entity with:
- **Name**
- **Health Score** (numerical value)
- **Visual Status** (colored cell)
- **Trend** (up/down/stable arrow)
- **Last Update** (timestamp)

**Grid Features:**
- Sortable by clicking column headers
- Scrollable horizontally (on mobile)
- Real-time updates every 5 seconds

### When to Act
- **Green (≥80):** No immediate action; continue monitoring
- **Yellow (50–79):** Investigate root cause; prepare for escalation
- **Red (<50):** Escalate to fraud team immediately; check Alerts page

---

## Alerts Page

The central hub for fraud/risk alerts and incident response.

### Understanding Alerts

Alerts are generated automatically when entity health scores fall below thresholds:

| Alert Type | Condition | Color | Action |
|------------|-----------|-------|--------|
| **Critical** | Health < 50 | 🔴 Red | Respond immediately |
| **Warning** | Health 50–79 | 🟡 Yellow | Investigate within 1 hour |

### Alert List

Each alert shows:
- **Entity Name** — Which entity triggered the alert
- **Alert Type** — Critical or Warning
- **Health Score** — Current health score
- **Timestamp** — When alert was generated
- **Status** — "Active" or "Acknowledged"

### Alert Workflow

#### Step 1: Review Active Alerts
The page automatically shows all **unacknowledged** alerts at the top.

#### Step 2: Investigate
- Click the entity name to view its details
- Check the Health page for trend analysis
- Review recent transaction logs (if available)

#### Step 3: Acknowledge
Once you've reviewed and taken action:
1. Click the **Acknowledge** button next to the alert
2. Alert status changes from "Active" to "Acknowledged"
3. Acknowledged alerts move below active ones

#### Step 4: Monitor
Even after acknowledgement:
- Continue monitoring the entity's health score
- If health improves (≥80), the alert is considered resolved
- If health worsens (drops further), escalate to incident response

### "All Clear" State
If there are **no active alerts**, you'll see a green message:
```
✅ All Clear
No critical or warning alerts at this time.
```

This doesn't mean monitoring can stop — continue watching the Health page.

### Common Alert Scenarios

**Scenario 1: New Critical Alert**
```
Entity: "Global Bank Corp" → Health: 42 (Critical)
Action: Investigate immediately
- Review transaction patterns
- Check for fraudulent activity
- Escalate to fraud team
- Acknowledge when investigating
```

**Scenario 2: Persistent Warning**
```
Entity: "Regional Credit Union" → Health: 65 (Warning)
Action: Monitor closely
- Track if health is declining
- Check for systematic issues
- Escalate if health drops below 50
- Acknowledge while investigating
```

**Scenario 3: Recovered Entity**
```
Entity: "Tech Finance" → Health: 45 (was Critical) → 85 (now Healthy)
Action: Close investigation
- Confirm root cause was resolved
- Acknowledge the original alert
- Update incident log
```

---

## Theme & Accessibility

### Theme Toggle

Located in the **top-right header**, next to the TUC logo.

#### Available Themes:

1. **Light Theme** ☀️
   - Cream background (#F2EBD9)
   - Dark text for readability
   - Best for bright environments

2. **Dark Theme** 🌙
   - Dark background (#0F0C07)
   - Light text to reduce eye strain
   - Best for low-light environments

3. **High-Contrast Theme** ⚫⚪
   - Maximum contrast for readability
   - Compliant with WCAG AAA standards
   - Best for users with visual impairments

### Theme Persistence
Your theme choice is **automatically saved** to your browser's local storage. Next time you visit, your preferred theme will load.

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| **Toggle Theme** | `T` (when sidebar is not focused) |
| **Navigate Sidebar** | **Tab** to move, **Enter** to select |
| **Focus Main Content** | **Tab** continuously until main area is focused |
| **Open Sidebar Menu** | **Alt + M** (on desktop) |

### Screen Reader Support
The application is **100% accessible** via screen readers (NVDA, JAWS, VoiceOver):
- All buttons have ARIA labels
- Form inputs are properly labeled
- Navigation is announced
- Interactive elements are keyboard navigable

**Test with:** NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS)

---

## Admin Features (Protected)

Only users logged in as **admin** can access these pages. Navigate to `/#/admin` after logging in.

### Admin Login

1. Click the **TUC Logo** or type `/#/login` directly
2. Enter: **admin** / **admin**
3. Click **Sign In**
4. You'll be redirected to Dashboard
5. Now `/#/admin` routes are accessible

### Admin Navigation

Sidebar shows a new **"Admin"** section with sub-pages:
- 🔧 **Diagnostics** — System health
- 💾 **DB Monitor** — Database stats
- 📋 **Logs** — Audit trail
- ⚡ **Performance** — API latency
- 🧪 **Testing** — Automated tests
- 🤖 **Sentinel** — AI orchestrator console

### 1. Diagnostics

**What it shows:**
- **Server Uptime** — How long the app has been running
- **Memory Usage** — Heap allocated, free memory
- **Process Info** — Node.js version, process ID, CPU cores

**When to check:**
- During performance issues
- Before deploying to production
- When monitoring memory leaks

**Interpretation:**
- **Memory increasing over time** → Possible memory leak
- **Uptime < 1 hour** → Server was recently restarted
- **Heap > 80% of max** → Approaching memory limits

### 2. Database Monitor

**What it shows:**
- **Table row counts** — entities, metrics, health_scores, audit_logs
- **Database file size** — Physical size of `fde.db`
- **Recent queries** — Last updated entities and metrics

**When to check:**
- Verify data is being collected
- Monitor database growth
- Investigate slow queries

**Actions:**
- Monitor row counts; alert if growing unexpectedly
- Check if metrics table exceeds 10,000 rows (auto-cleanup runs every 60 seconds)

### 3. Logs (Audit Trail)

**What it shows:**
- **Timestamp** — When action occurred
- **User** — Who performed action (currently "admin")
- **Action** — What was done (login, diagnostics run, alert acknowledged, etc.)
- **Category** — Login, Diagnostic, Alert, Sentinel, Admin
- **Severity** — info, warning, error
- **Message** — Detailed description

**When to check:**
- Compliance audits
- Incident investigations
- Security reviews

**Important:** Don't manually modify or delete audit logs — they're compliance-critical.

### 4. Performance Analytics

**What it shows:**
- **API Endpoint latency** — Response times for all internal API calls
- **Avg/Min/Max** — Average, minimum, and maximum response times in milliseconds
- **Trend chart** — Last 20 API request durations visualized

**Color coding:**
- 🟢 **Green:** < 50ms (optimal)
- 🟡 **Yellow:** 50–100ms (acceptable)
- 🔴 **Red:** > 100ms (investigate)

**When to check:**
- Performance degradation reported
- Before/after optimization changes
- Capacity planning

**Interpretation:**
- Consistent low latency = healthy system
- Spikes or sustained high latency = bottleneck present

### 5. Automated Testing

**What it shows:**
- **Backend tests** — System connectivity checks
- **E2E UI tests** — Full application workflow tests
- **Test results** — Pass/fail status

**When to run:**
- Before deployment
- After configuration changes
- Periodic health checks

**Actions:**
1. Click **Run Tests**
2. Wait for results (typically 1–2 minutes)
3. Review any failures
4. Fix issues and re-run if needed

### 6. Sentinel Console

**What it shows:**
- **Health Report** — Current system health metrics
- **Remediation Controls** — Trigger autonomous remediation

**When to use:**
- Testing Sentinel integration
- Simulating failure scenarios
- Validating orchestration responses

**Actions:**
1. Click **Send Health Report** → Sends current health to Sentinel
2. Click **Trigger Remediation** → Simulates autonomous healing

**Note:** These are **simulation** controls. In production, Sentinel would trigger remediation automatically based on system state.

---

## Common Tasks & Workflows

### Task 1: Respond to a Critical Alert

**Scenario:** You see a Critical alert (Health < 50).

**Steps:**
1. Go to **Alerts page**
2. Click the critical alert entry
3. Note the entity name and health score
4. Go to **Health page** → Find the entity → Check trend
5. Go to **Entities page** → Click entity → View details
6. Contact your fraud team with:
   - Entity name
   - Health score
   - Recent trend
   - Timestamp
7. Return to **Alerts page** → Click **Acknowledge**
8. Continue monitoring; health should improve as issues are resolved

### Task 2: Monitor System Health Over Time

**Scenario:** You want to ensure the system is stable.

**Daily Routine:**
1. **Morning check:** Go to **Dashboard**
   - Review stats cards (should be mostly green)
   - Check trend chart for overnight issues
2. **Mid-day:** Go to **Health page**
   - Scan for any new warnings
   - Investigate any entity with declining trend
3. **End of day:** Go to **Alerts page**
   - Acknowledge any alerts
   - Confirm all critical issues are being handled

### Task 3: Investigate a Warning Alert

**Scenario:** An entity is in Warning state (health 50–79).

**Steps:**
1. Go to **Health page** → Find the entity
2. Check the trend:
   - **↓ Declining?** → Escalate to warning soon
   - **↑ Improving?** → Monitor but no immediate action
   - **→ Stable?** → Investigate root cause
3. Go to **Entities page** → Click entity details
4. Review:
   - Historical metrics
   - Transaction patterns
   - Risk factors
5. Contact relevant team (fraud, operations) with findings
6. Return to **Alerts page** → Acknowledge the alert once investigating

### Task 4: Deploy a New Version

**Scenario:** You've deployed an updated version to production.

**Verification Steps:**
1. **Smoke test:** Open app in browser → Dashboard loads ✅
2. **Check metrics:** All four stat cards show values ✅
3. **Verify alerts:** At least one entity in portfolio ✅
4. **Test admin:** Log in with `admin/admin` → Admin pages load ✅
5. **Check logs:** Go to **Admin > Logs** → Verify login is recorded ✅
6. **Performance:** Go to **Admin > Performance** → Check latency is < 100ms ✅
7. **Declare success:** Version is stable in production ✅

---

## Troubleshooting

### "Page Won't Load"

**Symptom:** Dashboard or page shows loading spinner forever.

**Solutions:**
1. Check browser console for errors (F12 → Console tab)
2. Verify dev server is running: `pnpm run dev`
3. Check if port 3000 is accessible: Open `http://localhost:3000` directly
4. Reload page: `Ctrl+Shift+R` (hard refresh, clear cache)
5. Check network: Ensure internet connection is active

### "Can't Login as Admin"

**Symptom:** Login form rejects username/password.

**Solutions:**
1. Verify default credentials: **admin** / **admin** (case-sensitive)
2. Check browser's developer console (F12) for error messages
3. Ensure cookies are enabled in browser
4. Try a different browser to rule out cache issues

### "Alerts Not Updating"

**Symptom:** Alerts page shows old alerts; new alerts don't appear.

**Solutions:**
1. Refresh page: `F5` or `Ctrl+R`
2. Check if entity health scores are updating:
   - Go to **Health page**
   - Scores should change every 5 seconds
3. If Health page not updating, server may be down:
   - Restart dev server: `pnpm run dev`
4. Check browser console for API errors

### "Theme Not Saving"

**Symptom:** Theme reverts to default on reload.

**Solutions:**
1. Ensure browser allows localStorage:
   - F12 → Application → Local Storage → Check if entry exists
2. Try incognito/private window (some browsers disable localStorage)
3. Clear site data and reload:
   - F12 → Application → Clear site data → Reload

### "Can't Access Admin Pages"

**Symptom:** Clicking Admin links does nothing or redirects to Dashboard.

**Solutions:**
1. Verify you're logged in:
   - Check if **TUC Logo** in header shows user indicator
   - If not logged in, click logo → log in with admin/admin
2. Try direct URL: Navigate to `/#/admin/diagnostics`
3. Check browser console (F12) for authentication errors

---

## Keyboard Shortcuts & Accessibility

### Desktop Navigation

| Key | Action |
|-----|--------|
| **Tab** | Move between interactive elements |
| **Shift + Tab** | Move backwards |
| **Enter / Space** | Activate button or link |
| **Escape** | Close modals (if any) |
| **Ctrl + F** | Find on page (browser native) |
| **Ctrl + Shift + R** | Hard refresh (clear cache) |

### Screen Reader Keys

| Action | Command |
|--------|---------|
| **Announce page title** | **Alt + T** (some readers) |
| **List all headings** | **H** (NVDA), **⌘ + Option + U** (VoiceOver) |
| **Skip to content** | **Skip Links** available at top of page |

### Accessibility Features

✅ **100% keyboard navigable** — Use only Tab/Shift+Tab to access all functions  
✅ **ARIA labels** — All buttons, icons, and interactive elements named  
✅ **Focus indicators** — Clear outline shows which element is focused  
✅ **High-Contrast theme** — WCAG AAA compliant colors  
✅ **Screen reader tested** — Compatible with NVDA, JAWS, VoiceOver  

---

## Getting Help

### Documentation
- **Deployment:** See `DEPLOYMENT_GUIDE.md`
- **Architecture:** See `ARCHITECTURE.md`
- **Admin Guide:** See `ADMIN_GUIDE.md`
- **Testing:** See `CI-CD_TESTING_SETUP.md`

### Support Contact
- **Email:** daniel.twum@techbridge.edu.gh
- **Institution:** Techbridge University College (TUC), Oyibi, Greater Accra, Ghana
- **Role:** Head of ICT & Special Advisor to the Founder

### Reporting Issues
If you encounter a bug or have a feature request:
1. Note the exact steps to reproduce
2. Take a screenshot or describe the issue
3. Check browser console (F12) for error messages
4. Email details to support contact above

---

## FAQ

**Q: How often does the Dashboard update?**  
A: Every 5 seconds. Metrics are simulated in development; in production, they come from real transaction streams.

**Q: Can I acknowledge an alert that hasn't happened yet?**  
A: No. You can only acknowledge active alerts. Once an alert is generated, it stays in the list until you acknowledge it.

**Q: What happens if I'm not logged in and try to access admin pages?**  
A: You'll be redirected to the login page. Once authenticated, you'll have access.

**Q: Is my data backed up?**  
A: The SQLite database file (`fde.db`) persists on disk. For production deployments, implement regular database backups.

**Q: Can I change the admin password?**  
A: Currently, the password is hardcoded in the app. For production, implement a secure credential management system (roadmap item).

**Q: What's the maximum number of entities the system can monitor?**  
A: No hard limit, but performance may degrade with > 1000 entities. Monitor the **Performance** admin page for latency.

---

*Last Updated: 2026-04-27*  
*Techbridge University College — Fraud Detection Engine v3.0.0*  
*Managed by The Sentinel AI Orchestrator*
