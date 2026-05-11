# Testing Guide — Impact Ventures Dashboard

## Manual Test Checklist

### Core UI
- [ ] Scatter matrix renders with tier colour coding (cyan T1, mint T2, amber T3, slate T4)
- [ ] Clicking a scatter point opens the venture detail modal
- [ ] Modal closes via the X button and via backdrop click
- [ ] Strategic observations sidebar displays all entries

### Search & Filter
- [ ] Search by venture name returns matching results
- [ ] Search by rationale text returns matching results
- [ ] Tier buttons (ALL, T1–T4) filter the grid correctly
- [ ] Category filter works for all 9 categories
- [ ] M-range and G-range sliders filter correctly
- [ ] "Reset all filters" restores full list

### Comparison
- [ ] Select up to 4 ventures — comparison bar appears
- [ ] EXECUTE_COMPARE opens the comparison matrix modal
- [ ] CLEAR_STACK removes all selections
- [ ] Cannot select a 5th venture

### AI Brief Generation
- [ ] GENERATE_BRIEF triggers Gemini API call
- [ ] Loading state shows "SYNTHESIZING_COMPUTE..."
- [ ] Generated brief renders as bullet points
- [ ] REGENERATE_ANALYSIS replaces previous brief

### Admin
- [ ] Navigate to `#/admin` — login modal appears
- [ ] Wrong password shows error, logs `ADMIN_LOGIN_FAIL`
- [ ] Correct password (`admin123`) opens dashboard
- [ ] Audit Log tab shows all events
- [ ] Diagnostics: storage test shows PASS/FAIL
- [ ] Diagnostics: portfolio count matches APP_DATA.length
- [ ] Logout clears session and closes dashboard

### Accessibility
- [ ] Skip-to-content link appears on Tab key press
- [ ] All modals trap focus correctly
- [ ] Tier filter buttons announce `aria-pressed` state
- [ ] Advanced filter panel announces `aria-expanded` state
- [ ] Screen reader announces modal labels correctly

## Admin Diagnostics (in-app)

Access `#/admin` → Diagnostics tab to run:
1. **LocalStorage Access** — verifies browser storage
2. **Portfolio Count** — validates data integrity
3. **Gemini API Key** — checks environment configuration
