/**
 * Drug Interaction Checking Service
 *
 * Checks for drug-drug and drug-allergy interactions
 * Provides severity-coded warnings and clinical recommendations
 */

import { Medication, DrugInteraction, getMedicationById } from './medicationDatabase';

export interface InteractionCheck {
  hasInteractions: boolean;
  hasAllergyConflict: boolean;
  interactions: InteractionWarning[];
  allergyWarnings: AllergyWarning[];
  contraindications: string[];
  pregnancyWarning?: string;
}

export interface InteractionWarning {
  severity: 'Severe' | 'Moderate' | 'Minor';
  interactingDrug: string;
  effect: string;
  mechanism: string;
  recommendation: string;
  color: string; // For UI
}

export interface AllergyWarning {
  allergen: string;
  medication: string;
  type: 'Direct Match' | 'Cross-Reactivity';
  recommendation: string;
}

/**
 * Check for drug interactions and contraindications
 */
export const checkDrugInteractions = (
  newMedication: Medication,
  currentMedications: string[], // Array of medication IDs
  patientAllergies: string[],
  isPregnant?: boolean
): InteractionCheck => {
  const result: InteractionCheck = {
    hasInteractions: false,
    hasAllergyConflict: false,
    interactions: [],
    allergyWarnings: [],
    contraindications: []
  };

  // 1. Check drug-drug interactions
  for (const medId of currentMedications) {
    const currentMed = getMedicationById(medId);
    if (!currentMed) continue;

    // Check interactions from new med → current meds
    const interaction = newMedication.interactions.find(
      int => int.drugId === currentMed.id
    );

    if (interaction) {
      result.hasInteractions = true;
      result.interactions.push({
        severity: interaction.severity,
        interactingDrug: currentMed.name,
        effect: interaction.effect,
        mechanism: interaction.mechanism,
        recommendation: interaction.recommendation,
        color: getSeverityColor(interaction.severity)
      });
    }

    // Check reverse interactions (current med → new med)
    const reverseInteraction = currentMed.interactions.find(
      int => int.drugId === newMedication.id
    );

    if (reverseInteraction && !interaction) { // Avoid duplicates
      result.hasInteractions = true;
      result.interactions.push({
        severity: reverseInteraction.severity,
        interactingDrug: currentMed.name,
        effect: reverseInteraction.effect,
        mechanism: reverseInteraction.mechanism,
        recommendation: reverseInteraction.recommendation,
        color: getSeverityColor(reverseInteraction.severity)
      });
    }
  }

  // 2. Check allergy conflicts
  for (const allergy of patientAllergies) {
    const allergyLower = allergy.toLowerCase();

    // Direct match (e.g., patient allergic to "Penicillin", prescribing "Amoxicillin")
    if (
      newMedication.name.toLowerCase().includes(allergyLower) ||
      newMedication.genericName.toLowerCase().includes(allergyLower)
    ) {
      result.hasAllergyConflict = true;
      result.allergyWarnings.push({
        allergen: allergy,
        medication: newMedication.name,
        type: 'Direct Match',
        recommendation: 'CONTRAINDICATED: Do not prescribe. Select alternative medication.'
      });
    }

    // Cross-reactivity (e.g., penicillin allergy with cephalosporins)
    const crossReaction = checkCrossReactivity(allergyLower, newMedication);
    if (crossReaction) {
      result.hasAllergyConflict = true;
      result.allergyWarnings.push(crossReaction);
    }
  }

  // 3. Add contraindications
  result.contraindications = newMedication.contraindications;

  // 4. Pregnancy warning
  if (isPregnant && newMedication.pregnancyCategory) {
    const category = newMedication.pregnancyCategory;
    if (category === 'D' || category === 'X') {
      result.pregnancyWarning = getPregnancyWarning(category, newMedication.name);
    }
  }

  return result;
};

/**
 * Get severity color for UI
 */
const getSeverityColor = (severity: 'Severe' | 'Moderate' | 'Minor'): string => {
  switch (severity) {
    case 'Severe':
      return 'text-rose-700 bg-rose-50 border-rose-200';
    case 'Moderate':
      return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'Minor':
      return 'text-blue-700 bg-blue-50 border-blue-200';
  }
};

/**
 * Check for cross-reactivity patterns
 */
const checkCrossReactivity = (
  allergyLower: string,
  medication: Medication
): AllergyWarning | null => {
  const medNameLower = medication.name.toLowerCase();
  const genericLower = medication.genericName.toLowerCase();

  // Penicillin cross-reactivity with cephalosporins
  if (allergyLower.includes('penicillin') || allergyLower.includes('amoxicillin')) {
    if (
      medNameLower.includes('cef') ||
      genericLower.includes('cef') ||
      medNameLower.includes('cephalosporin')
    ) {
      return {
        allergen: 'Penicillin',
        medication: medication.name,
        type: 'Cross-Reactivity',
        recommendation: 'CAUTION: 5-10% cross-reactivity risk between penicillins and cephalosporins. Consider alternative if severe penicillin allergy history.'
      };
    }
  }

  // Sulfa drug cross-reactivity
  if (allergyLower.includes('sulfa') || allergyLower.includes('sulfon')) {
    if (medNameLower.includes('sulfa') || genericLower.includes('sulfa')) {
      return {
        allergen: 'Sulfonamides',
        medication: medication.name,
        type: 'Cross-Reactivity',
        recommendation: 'CONTRAINDICATED: Sulfonamide allergy. Select alternative antibiotic.'
      };
    }
  }

  // Aspirin/NSAID cross-reactivity
  if (allergyLower.includes('aspirin') || allergyLower.includes('nsaid')) {
    if (
      medNameLower.includes('ibuprofen') ||
      medNameLower.includes('naproxen') ||
      medNameLower.includes('diclofenac')
    ) {
      return {
        allergen: 'Aspirin/NSAIDs',
        medication: medication.name,
        type: 'Cross-Reactivity',
        recommendation: 'CAUTION: High cross-reactivity among NSAIDs. Consider paracetamol instead.'
      };
    }
  }

  return null;
};

/**
 * Get pregnancy category warning
 */
const getPregnancyWarning = (category: 'D' | 'X', medName: string): string => {
  if (category === 'X') {
    return `CONTRAINDICATED IN PREGNANCY: ${medName} is Category X. Proven fetal risk. Do not prescribe to pregnant patients.`;
  } else {
    return `PREGNANCY CAUTION: ${medName} is Category D. Evidence of fetal risk. Use only if potential benefit justifies risk. Document rationale.`;
  }
};

/**
 * Generate interaction summary for audit log
 */
export const generateInteractionAuditMessage = (
  medicationName: string,
  check: InteractionCheck
): string => {
  const parts: string[] = [];

  if (check.hasAllergyConflict) {
    parts.push(`ALLERGY ALERT (${check.allergyWarnings.length})`);
  }

  if (check.hasInteractions) {
    const severeCount = check.interactions.filter(i => i.severity === 'Severe').length;
    const moderateCount = check.interactions.filter(i => i.severity === 'Moderate').length;
    const minorCount = check.interactions.filter(i => i.severity === 'Minor').length;

    const interactionSummary = [];
    if (severeCount > 0) interactionSummary.push(`${severeCount} severe`);
    if (moderateCount > 0) interactionSummary.push(`${moderateCount} moderate`);
    if (minorCount > 0) interactionSummary.push(`${minorCount} minor`);

    parts.push(`Interactions: ${interactionSummary.join(', ')}`);
  }

  if (check.pregnancyWarning) {
    parts.push('Pregnancy warning');
  }

  if (parts.length === 0) {
    return `Prescribed ${medicationName} - No interactions detected`;
  }

  return `Prescribed ${medicationName} - ${parts.join(' | ')}`;
};

/**
 * Sort interactions by severity (Severe first)
 */
export const sortInteractionsBySeverity = (
  interactions: InteractionWarning[]
): InteractionWarning[] => {
  const severityOrder = { 'Severe': 0, 'Moderate': 1, 'Minor': 2 };
  return [...interactions].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
};
