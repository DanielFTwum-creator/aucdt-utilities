# Integration & Testing Guide
## Rophe RPMS - Features A, E, & B

**Version:** 1.0
**Date:** January 12, 2025
**Features Covered:** PHI Anonymization (A), Enhanced Gemini (E), Drug Interactions (B)

---

## Table of Contents

1. [Integration Steps](#integration-steps)
2. [Testing Scenarios](#testing-scenarios)
3. [Expected Behaviors](#expected-behaviors)
4. [Troubleshooting](#troubleshooting)
5. [Security Checklist](#security-checklist)

---

## Integration Steps

### Step 1: Update App.tsx

The main App component needs updates to support prescriptions and integrate all features.

#### 1.1 Add Prescription State

**Location:** `App.tsx` (after line 24)

```typescript
// Add prescription state
const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
```

#### 1.2 Update Patient Mock Data (Optional)

If using mock patients, add currentMedications:

```typescript
// In mockData.ts or App.tsx
const updatedPatient = {
  ...selectedPatient,
  currentMedications: ['MED-001', 'MED-005'], // Example: Coartem + Lisinopril
  prescriptions: []
};
```

#### 1.3 Add Prescription Handler

```typescript
const handleAddPrescription = (prescription: Prescription) => {
  setPrescriptions(prev => [...prev, prescription]);

  // Update patient's current medications
  setPatients(prev => prev.map(p => {
    if (p.id === prescription.patientId) {
      return {
        ...p,
        currentMedications: [...(p.currentMedications || []), prescription.medicationId],
        prescriptions: [...(p.prescriptions || []), prescription]
      };
    }
    return p;
  }));

  addAuditLog('PRESCRIPTION_CREATED',
    `Prescribed ${prescription.medicationName} to ${selectedPatient?.firstName} ${selectedPatient?.lastName}`
  );
};
```

#### 1.4 Update ClinicalAssistance Props

**Find:** (around line 300-350 in App.tsx)
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

---

### Step 2: Integrate PrescriptionModal into PatientRegistry

#### 2.1 Add to PatientRegistry Component

**File:** `components/PatientRegistry.tsx`

**Import the modal:**
```typescript
import PrescriptionModal from './PrescriptionModal';
import { Prescription } from '../types';
```

**Add state:**
```typescript
const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
```

**Add props:**
```typescript
interface PatientRegistryProps {
  // ... existing props
  onAddPrescription: (prescription: Prescription) => void;
  currentUser: string;
  addAuditLog?: (action: string, details: string) => void;
}
```

**Add "Prescribe" button in patient details section:**
```tsx
<button
  onClick={() => setShowPrescriptionModal(true)}
  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center space-x-2"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
  <span>Prescribe Medication</span>
</button>
```

**Add modal at the end of component:**
```tsx
{selectedPatient && (
  <PrescriptionModal
    isOpen={showPrescriptionModal}
    onClose={() => setShowPrescriptionModal(false)}
    patient={selectedPatient}
    currentUser={currentUser}
    onPrescribe={(prescription) => {
      onAddPrescription(prescription);
      setShowPrescriptionModal(false);
    }}
    addAuditLog={addAuditLog}
  />
)}
```

#### 2.2 Display Current Medications

Add a section showing active prescriptions:

```tsx
{selectedPatient?.prescriptions && selectedPatient.prescriptions.length > 0 && (
  <div className="mt-6">
    <h3 className="font-bold text-gray-900 dark:text-white mb-3">Current Medications</h3>
    <div className="space-y-2">
      {selectedPatient.prescriptions
        .filter(rx => rx.status === 'Active')
        .map(prescription => (
          <div key={prescription.id}
            className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{prescription.medicationName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {prescription.dosage} - {prescription.frequency}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Duration: {prescription.duration} | Prescribed: {new Date(prescription.prescribedDate).toLocaleDateString()}
                </p>
              </div>
              <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-full">
                Active
              </span>
            </div>
            {prescription.instructions && (
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic">
                Instructions: {prescription.instructions}
              </p>
            )}
          </div>
        ))}
    </div>
  </div>
)}
```

---

### Step 3: Copy Necessary Files

If you're working in a fresh directory:

```bash
cd "c:\Users\DELL\Downloads\rophe-specialist-care-rpms"

# Copy from restored backup if needed
cp ../rophe-specialist-care-rpms-restored/services/mockData.ts services/
cp ../rophe-specialist-care-rpms-restored/App.tsx ./
cp ../rophe-specialist-care-rpms-restored/components/PatientRegistry.tsx components/
# ... copy other needed components
```

---

### Step 4: Install & Run

```bash
npm install
npm run dev
```

---

## Testing Scenarios

### Test Suite 1: PHI Anonymization (Feature A)

#### Test Case 1.1: Name Anonymization
**Input:**
```
Patient: Sarah Johnson
Complaint: "Sarah Johnson has fever and headache since yesterday."
```

**Expected Result:**
- ✅ Anonymization banner shows "2 sensitive elements removed"
- ✅ Details show: `2x NAME`
- ✅ AI receives: "[PATIENT_FIRST_NAME] [PATIENT_LAST_NAME] has fever..."

**How to Test:**
1. Login as Doctor
2. Go to Patient Registry
3. Select patient Sarah Johnson (PT-00001)
4. Enter complaint with patient's name
5. Click "Analyze Symptoms"
6. Verify blue PHI banner appears
7. Click "Show Details" to see NAME replacements

#### Test Case 1.2: Multi-PHI Anonymization
**Input:**
```
Complaint: "John Doe (john.doe@email.com, +233 24 555 1234) reports chest pain.
Lives at 123 Main Street, Accra. Symptoms started on 2025-01-10."
```

**Expected Result:**
- ✅ Shows "7 sensitive elements removed"
- ✅ Breakdown: 2x NAME, 1x EMAIL, 1x PHONE, 1x DATE, 2x ADDRESS

**How to Test:**
1. Create test patient with these exact details
2. Enter complaint with all PHI types
3. Verify each type is caught and replaced
4. Check audit log for anonymization entry

---

### Test Suite 2: Enhanced Gemini AI (Feature E)

#### Test Case 2.1: Malaria Diagnosis (Ghana Context)
**Input:**
```
Patient: 34-year-old male
Complaint: "Fever for 3 days, chills, sweating, headache, body aches"
```

**Expected Result:**
```json
{
  "possibleDiagnoses": [
    {
      "name": "Malaria",
      "icd10": "B50.9",
      "probability": "High",
      "confidence": 85-95,
      "reasoning": "Classic presentation in endemic region"
    },
    {
      "name": "Typhoid Fever",
      "icd10": "A01.0",
      "probability": "Moderate",
      "confidence": 60-70
    }
  ],
  "urgentFlags": [],
  "treatmentSuggestions": [
    "Order malaria RDT or blood smear",
    "Consider ACT if confirmed"
  ]
}
```

**How to Test:**
1. Select patient
2. Enter malaria symptoms
3. Click "Analyze Symptoms"
4. Verify Malaria appears as top diagnosis
5. Check ICD-10 code is B50.9
6. Verify confidence score shown
7. Check clinical reasoning is present

#### Test Case 2.2: Cardiac Emergency Detection
**Input:**
```
Complaint: "Severe crushing chest pain radiating to left arm, shortness of breath,
nausea, cold sweats. Started 15 minutes ago."
```

**Expected Result:**
- ✅ Red "Urgent Red Flags" banner appears
- ✅ Flags include: "CARDIAC EMERGENCY - Immediate EKG required"
- ✅ Top diagnosis: STEMI (I21.3) with High probability
- ✅ Confidence: 90%+

**How to Test:**
1. Enter cardiac symptoms
2. Verify urgent flag section appears (RED background)
3. Check for immediate action recommendations
4. Verify treatment suggestions include aspirin, EKG

#### Test Case 2.3: API Retry Logic
**Scenario:** Simulate API failure

**How to Test:**
1. Temporarily set invalid API key in `.env.local`
2. Try to analyze symptoms
3. Check browser console for retry attempts (1s, 2s, 4s delays)
4. Verify graceful error message shown to user
5. Check audit log shows "AI_SERVICE_ERROR"

---

### Test Suite 3: Drug Interaction Checking (Feature B)

#### Test Case 3.1: Severe Interaction Detection
**Setup:**
```typescript
Patient currentMedications: ['MED-011'] // Warfarin
New prescription: Ibuprofen (MED-008)
```

**Expected Result:**
- ✅ Severe interaction warning (RED)
- ✅ Effect: "Significantly increased bleeding risk"
- ✅ Recommendation: "Avoid combination. Use paracetamol instead."
- ✅ Checkbox required: "I acknowledge severe interactions..."
- ✅ Override reason textbox appears when checked

**How to Test:**
1. Add Warfarin to patient's current medications
2. Click "Prescribe Medication"
3. Search for "Ibuprofen"
4. Select medication
5. Verify RED severe warning appears
6. Try to prescribe without checking acknowledgment → Should fail
7. Check acknowledgment box
8. Enter override reason
9. Complete prescription
10. Verify audit log shows "SEVERE_INTERACTION_OVERRIDE"

#### Test Case 3.2: Moderate Interaction
**Setup:**
```typescript
Patient currentMedications: ['MED-003'] // Amoxicillin
New prescription: Warfarin (MED-011)
```

**Expected Result:**
- ✅ Moderate interaction warning (AMBER)
- ✅ Effect: "Increased anticoagulant effect"
- ✅ Recommendation: "Monitor INR closely"
- ✅ No acknowledgment required (can prescribe directly)

#### Test Case 3.3: Allergy Conflict - Direct Match
**Setup:**
```typescript
Patient allergies: ['Penicillin']
New prescription: Amoxicillin (MED-003)
```

**Expected Result:**
- ✅ ALLERGY CONFLICT banner (RED, bordered)
- ✅ Type: "Direct Match"
- ✅ Recommendation: "CONTRAINDICATED: Do not prescribe..."
- ✅ Confirmation dialog before allowing prescription

**How to Test:**
1. Add "Penicillin" to patient allergies
2. Try to prescribe Amoxicillin
3. Verify red allergy warning appears
4. Attempt to prescribe → confirmation dialog appears
5. Cancel and select alternative medication

#### Test Case 3.4: Cross-Reactivity Detection
**Setup:**
```typescript
Patient allergies: ['Penicillin']
New prescription: Cephalosporin (if added to database)
```

**Expected Result:**
- ✅ Cross-Reactivity warning
- ✅ Message: "5-10% cross-reactivity risk between penicillins and cephalosporins"
- ✅ Recommendation: "Consider alternative if severe penicillin allergy history"

#### Test Case 3.5: Pregnancy Warning
**Setup:**
```typescript
Patient: Female
New prescription: Warfarin (MED-011, Category X)
```

**Expected Result:**
- ✅ Purple pregnancy warning banner
- ✅ Message: "CONTRAINDICATED IN PREGNANCY: Category X. Proven fetal risk."

**How to Test:**
1. Select female patient
2. Prescribe Warfarin
3. Verify pregnancy warning appears
4. Check for Category X mention

#### Test Case 3.6: Multiple Simultaneous Issues
**Setup:**
```typescript
Patient:
  - Gender: Female
  - Allergies: ['Aspirin']
  - Current Medications: ['MED-011'] // Warfarin
New prescription: Ibuprofen (MED-008)
```

**Expected Result:**
- ✅ Allergy conflict (Aspirin/NSAID cross-reactivity)
- ✅ Severe drug interaction (Ibuprofen + Warfarin)
- ✅ Both warnings displayed simultaneously
- ✅ All sections expandable

---

### Test Suite 4: End-to-End Workflows

#### Workflow 4.1: Complete Prescription Cycle
1. ✅ Login as Doctor
2. ✅ Select patient with known allergies
3. ✅ Enter symptoms in Clinical Assistance
4. ✅ Verify PHI anonymization works
5. ✅ Get AI diagnosis with ICD-10 codes
6. ✅ Click "Prescribe Medication"
7. ✅ Search for medication
8. ✅ Review interaction warnings
9. ✅ Fill prescription details
10. ✅ Complete prescription
11. ✅ Verify appears in "Current Medications"
12. ✅ Check audit log for all events

#### Workflow 4.2: Override Severe Interaction
1. ✅ Patient has Warfarin prescribed
2. ✅ Doctor attempts to prescribe Ibuprofen
3. ✅ Severe warning appears
4. ✅ Doctor reviews clinical justification
5. ✅ Checks acknowledgment
6. ✅ Documents override reason: "Patient has severe pain, benefits outweigh risks, will monitor INR daily"
7. ✅ Prescription created
8. ✅ Audit log captures override with reason

---

## Expected Behaviors

### PHI Anonymization Patterns

| Input | Detected As | Replaced With |
|-------|-------------|---------------|
| Sarah Johnson | NAME | [PATIENT_FIRST_NAME] [PATIENT_LAST_NAME] |
| +233 24 555 1234 | PHONE | [PHONE_NUMBER] |
| sarah.j@email.com | EMAIL | [EMAIL_ADDRESS] |
| 2025-01-10 | DATE | [DATE] |
| 123 Main St | ADDRESS | [ADDRESS] |
| PT-00001 | MRN | [PATIENT_ID] |

### Interaction Severity Colors

| Severity | Background | Border | Text | Use When |
|----------|------------|--------|------|----------|
| Severe | bg-rose-50 | border-rose-200 | text-rose-700 | Life-threatening, contraindicated |
| Moderate | bg-amber-50 | border-amber-200 | text-amber-700 | Requires monitoring, dose adjustment |
| Minor | bg-blue-50 | border-blue-200 | text-blue-700 | Informational, minimal risk |

### Audit Log Events

| Event | When Triggered | Details Format |
|-------|----------------|----------------|
| PHI_ANONYMIZATION | Every AI query | "Anonymized N PHI elements: 2x NAME, 1x PHONE..." |
| AI_CLINICAL_QUERY | AI analysis start | "Analyzing symptoms for patient age 34" |
| AI_ANALYSIS_COMPLETE | AI response received | "Generated 3 differential diagnoses" |
| PRESCRIPTION_CREATED | Prescription saved | "Prescribed Amoxicillin - No interactions" |
| SEVERE_INTERACTION_OVERRIDE | Override acknowledged | "Ibuprofen prescribed despite severe interactions. Reason: ..." |

---

## Troubleshooting

### Issue 1: "API Key missing" error

**Symptoms:**
- Clinical Assistance shows "Configuration Error"
- Console logs: "API Key missing. AI features disabled."

**Solutions:**
1. Check `.env.local` exists: `ls .env.local`
2. Verify content: `cat .env.local` should show `GEMINI_API_KEY=...`
3. Restart dev server: `npm run dev`
4. Clear browser cache and reload

### Issue 2: No PHI anonymization banner

**Symptoms:**
- AI analysis works but no blue banner appears

**Causes:**
- No PHI detected in complaint text
- Patient object not passed correctly

**Solutions:**
1. Test with known PHI: "John Doe (john@email.com) has fever"
2. Verify `ClinicalAssistance` receives `patient` prop (not just `history`)
3. Check browser console for TypeScript errors

### Issue 3: Interaction warnings not showing

**Symptoms:**
- Prescription modal opens but no warnings appear

**Causes:**
- `currentMedications` array empty or undefined
- Medication IDs don't match database

**Solutions:**
1. Check patient object: `console.log(patient.currentMedications)`
2. Verify medication IDs match database: 'MED-001', 'MED-002', etc.
3. Check browser console for errors in `checkDrugInteractions()`

### Issue 4: Modal doesn't open

**Symptoms:**
- "Prescribe Medication" button clicks but nothing happens

**Solutions:**
1. Check PatientRegistry has `showPrescriptionModal` state
2. Verify PrescriptionModal is imported correctly
3. Check `isOpen` prop is bound to state
4. Look for TypeScript errors in console

### Issue 5: TypeScript errors after integration

**Common Errors:**
```
Property 'patient' does not exist on type 'ClinicalAssistanceProps'
```

**Solution:**
Update ClinicalAssistance props interface to include `patient: Patient`

```
Property 'currentMedications' does not exist on type 'Patient'
```

**Solution:**
Verify types.ts has updated Patient interface with `currentMedications?: string[]`

---

## Security Checklist

Before deploying to production, verify:

### PHI Protection
- [ ] All AI queries go through anonymization
- [ ] Audit log captures anonymization events
- [ ] No PHI in browser console logs
- [ ] No PHI in error messages
- [ ] Anonymized text doesn't contain patient names

### Drug Safety
- [ ] Severe interactions block prescription until acknowledged
- [ ] Allergy conflicts show clear warnings
- [ ] Cross-reactivity patterns detected
- [ ] Pregnancy warnings for Category D/X
- [ ] Override reasons captured in audit

### Authentication & Authorization
- [ ] Only doctors can prescribe
- [ ] Prescription audit includes prescriber name
- [ ] Sensitive interactions logged
- [ ] Session timeout active

### Data Integrity
- [ ] Prescriptions saved to patient record
- [ ] Current medications updated correctly
- [ ] Audit trail immutable
- [ ] No prescription duplication

---

## Performance Benchmarks

Expected timing metrics:

| Operation | Target | Acceptable |
|-----------|--------|------------|
| PHI Anonymization | < 10ms | < 50ms |
| Interaction Check | < 5ms | < 20ms |
| Gemini API Call | 2-3s | < 5s |
| Modal Open | Instant | < 100ms |
| Prescription Save | < 50ms | < 200ms |

---

## Next Steps After Integration

1. **User Acceptance Testing (UAT)**
   - Test with real clinical scenarios
   - Get doctor feedback on interaction warnings
   - Verify audit logs meet compliance needs

2. **Backend Integration Planning**
   - Design prescription database schema
   - Create API endpoints for medications
   - Plan for e-prescribing integration

3. **Enhanced Features (C & D)**
   - Add diagnosis visualization charts
   - Implement clinical decision support alerts
   - Build preventive care reminders

---

**Integration Complete! 🎉**

All features A, E, and B are ready for testing.
