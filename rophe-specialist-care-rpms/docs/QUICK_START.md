# Quick Start: PHI Anonymization + Enhanced AI

## ⚡ 5-Minute Integration

### Step 1: Copy Files (If Needed)

If working from the restored folder:
```bash
cd "c:\Users\DELL\Downloads"
cp -r rophe-specialist-care-rpms-restored/* rophe-specialist-care-rpms/
```

### Step 2: Install Dependencies

```bash
cd rophe-specialist-care-rpms
npm install
```

### Step 3: Configure API Key

Edit `.env.local`:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your key from: https://ai.google.dev/

### Step 4: Update App.tsx

Find the `ClinicalAssistance` component usage and update the props:

**Find this line** (around line 300-350 in App.tsx):
```typescript
<ClinicalAssistance
  complaint={clinicalComplaint}
  history={selectedPatient?.medicalHistory || []}
/>
```

**Replace with:**
```typescript
<ClinicalAssistance
  complaint={clinicalComplaint}
  patient={selectedPatient!}
  addAuditLog={addAuditLog}
/>
```

### Step 5: Run the App

```bash
npm run dev
```

Visit: http://localhost:5173 (or the port Vite shows)

---

## ✅ Testing the Features

### Test PHI Anonymization

1. **Login** as Doctor (username: `dr.smith`, password: `doctor123`)
2. **Go to Patient Registry** tab
3. **Select a patient** (e.g., Sarah Johnson - PT-00001)
4. **Scroll to "Clinical Assistance" section**
5. **Enter complaint with PHI:**
   ```
   Patient Sarah Johnson (sarah.j@email.com, +233 24 123 4567)
   has fever since 2025-01-10. Lives at 456 Oak St, Accra.
   Complains of headache and body aches.
   ```
6. **Click "Analyze Symptoms"**
7. **Verify:**
   - ✅ Blue "PHI Anonymization Active" banner appears
   - ✅ Shows count of removed elements
   - ✅ Click "Show Details" to see breakdown
   - ✅ AI suggestions appear with ICD-10 codes

### Test Enhanced AI Features

1. **Try different symptoms:**
   ```
   Chest pain, shortness of breath, sweating for 30 minutes
   ```

2. **Check the response includes:**
   - ✅ Multiple diagnoses ranked by probability
   - ✅ ICD-10 codes for each diagnosis
   - ✅ Confidence scores (0-100%)
   - ✅ Clinical reasoning for each diagnosis
   - ✅ Urgent red flags (if applicable)
   - ✅ Treatment suggestions

3. **Test Patient Summary:**
   - Click "Patient Summary" button
   - Get simplified explanation suitable for patients

### Test Audit Logging

1. **Go to System Admin tab**
2. **Enter admin password:** `rophe2024`
3. **Click "Audit Logs" tab**
4. **Look for entries:**
   - `PHI_ANONYMIZATION`: Shows what was anonymized
   - `AI_CLINICAL_QUERY`: Records AI analysis request
   - `AI_ANALYSIS_COMPLETE`: Shows number of diagnoses generated

---

## 🎨 Visual Features

### PHI Protection Banner
- **Color:** Blue (#3B82F6)
- **Icon:** Lock symbol
- **Location:** Above AI results
- **Expandable:** Click "Show Details"

### Anonymization Details
- **Grid Layout:** 2-4 columns
- **Shows:** PHI type + count (e.g., "NAME: 2x replaced")
- **Timestamp:** When anonymization occurred

### Enhanced Diagnoses
- **Numbered Cards:** 1, 2, 3...
- **Color-Coded:** Green (High), Blue (Moderate), Gray (Low)
- **Confidence %:** Below probability badge
- **Reasoning:** Expandable text section

---

## 🐛 Troubleshooting

### Problem: "API Key missing"

**Solution:**
```bash
# Check .env.local exists
ls -la .env.local

# Verify content
cat .env.local
# Should show: GEMINI_API_KEY=...

# Restart dev server
npm run dev
```

### Problem: "TypeError: patient is undefined"

**Solution:** Ensure you updated `App.tsx` to pass `patient` object instead of `history` array.

### Problem: No anonymization banner

**Cause:** No PHI detected in complaint text.

**Test with:** `John Doe (john@email.com) has fever`

### Problem: TypeScript errors

**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules
npm install
npm run dev
```

---

## 📊 Expected Behavior

### Scenario: Malaria Symptoms

**Input:**
```
Patient age 34, fever for 3 days, chills, sweating, headache, fatigue
```

**Expected Output:**
```json
{
  "possibleDiagnoses": [
    {
      "name": "Malaria",
      "icd10": "B50.9",
      "probability": "High",
      "confidence": 90,
      "reasoning": "Classic malaria presentation in endemic region with fever, chills, sweats"
    },
    {
      "name": "Typhoid Fever",
      "icd10": "A01.0",
      "probability": "Moderate",
      "confidence": 65,
      "reasoning": "Similar presentation but less likely given symptom pattern"
    }
  ],
  "urgentFlags": [],
  "treatmentSuggestions": [
    "Order malaria rapid diagnostic test (RDT) or blood smear",
    "Consider artemisinin-based combination therapy if confirmed",
    "Monitor for complications (cerebral malaria, severe anemia)"
  ]
}
```

### Scenario: Cardiac Emergency

**Input:**
```
Severe crushing chest pain radiating to left arm, shortness of breath,
nausea, cold sweats. Started 20 minutes ago.
```

**Expected Output:**
```json
{
  "urgentFlags": [
    "CARDIAC EMERGENCY - Immediate EKG and cardiac enzymes required",
    "Activate emergency response protocol",
    "Consider aspirin administration if no contraindications"
  ],
  "possibleDiagnoses": [
    {
      "name": "ST-Elevation Myocardial Infarction (STEMI)",
      "icd10": "I21.3",
      "probability": "High",
      "confidence": 95
    }
  ]
}
```

---

## 🚀 Next Features to Implement

Based on the roadmap in `IMPLEMENTATION_SUMMARY.md`:

### Option B: Drug Interaction Checking
```bash
# Future implementation
services/drugInteractionService.ts
components/PrescriptionModal.tsx
```

### Option C: Differential Diagnosis Ranking
```bash
# Enhanced visualization
components/DiagnosisChart.tsx  # Uses recharts
```

### Option D: Clinical Decision Support Alerts
```bash
# Proactive reminders
services/clinicalGuidelinesService.ts
components/ClinicalAlertsPanel.tsx
```

---

## 📝 Notes

1. **PHI Anonymization is Automatic:** No configuration needed, runs on every AI query
2. **Audit Logs Stored in Memory:** Currently localStorage, will need backend for production
3. **Gemini 3 Model:** Uses `gemini-3-pro-preview` with 15k thinking budget
4. **Retry Logic:** 3 attempts with exponential backoff (1s, 2s, 4s)
5. **Ghana Context:** AI knows about malaria, typhoid, tropical diseases

---

## 📞 Support

**File Issues:**
- Missing features: Check `IMPLEMENTATION_SUMMARY.md`
- Integration help: See `CLAUDE.md` Architecture section
- HIPAA questions: Review `docs/HIPAA_Compliance_Matrix.md`

**Environment:**
- Node.js 18+
- React 19.2.3
- TypeScript 5.9.3
- Vite 7.3.1

---

**You're all set! 🎉**

The enhanced AI with PHI protection is ready to use.
