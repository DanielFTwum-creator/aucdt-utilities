/**
 * PHI Anonymization Service
 *
 * This service removes Protected Health Information (PHI) from text
 * before sending to external AI services (Gemini 3) to ensure HIPAA compliance.
 *
 * PHI Elements Anonymized:
 * - Patient names (first, last)
 * - Phone numbers
 * - Email addresses
 * - Dates (birth dates, appointment dates)
 * - Addresses
 * - Medical Record Numbers (MRNs)
 * - Insurance IDs
 *
 * @see HIPAA Safe Harbor Method (45 CFR § 164.514(b)(2))
 */

import { Patient } from '../types';

export interface AnonymizationResult {
  anonymizedText: string;
  originalText: string;
  phiElementsRemoved: number;
  replacements: AnonymizationReplacement[];
  timestamp: string;
}

export interface AnonymizationReplacement {
  type: 'NAME' | 'PHONE' | 'EMAIL' | 'DATE' | 'ADDRESS' | 'MRN' | 'INSURANCE_ID';
  original: string;
  replacement: string;
  count: number;
}

/**
 * Anonymize text by removing PHI elements
 */
export const anonymizePHI = (
  text: string,
  patient: Patient
): AnonymizationResult => {
  if (!text || text.trim().length === 0) {
    return {
      anonymizedText: text,
      originalText: text,
      phiElementsRemoved: 0,
      replacements: [],
      timestamp: new Date().toISOString()
    };
  }

  let anonymized = text;
  const replacements: AnonymizationReplacement[] = [];

  // 1. Remove Patient Names (case-insensitive)
  const firstNameRegex = new RegExp(escapeRegex(patient.firstName), 'gi');
  const firstNameMatches = (anonymized.match(firstNameRegex) || []).length;
  if (firstNameMatches > 0) {
    anonymized = anonymized.replace(firstNameRegex, '[PATIENT_FIRST_NAME]');
    replacements.push({
      type: 'NAME',
      original: patient.firstName,
      replacement: '[PATIENT_FIRST_NAME]',
      count: firstNameMatches
    });
  }

  const lastNameRegex = new RegExp(escapeRegex(patient.lastName), 'gi');
  const lastNameMatches = (anonymized.match(lastNameRegex) || []).length;
  if (lastNameMatches > 0) {
    anonymized = anonymized.replace(lastNameRegex, '[PATIENT_LAST_NAME]');
    replacements.push({
      type: 'NAME',
      original: patient.lastName,
      replacement: '[PATIENT_LAST_NAME]',
      count: lastNameMatches
    });
  }

  // 2. Remove Phone Numbers (various formats)
  // Ghana format: +233 XX XXX XXXX or 0XX XXX XXXX
  const phoneRegex = /(\+233\s?\d{2}\s?\d{3}\s?\d{4}|0\d{2}\s?\d{3}\s?\d{4}|\d{10})/g;
  const phoneMatches = (anonymized.match(phoneRegex) || []).length;
  if (phoneMatches > 0) {
    anonymized = anonymized.replace(phoneRegex, '[PHONE_NUMBER]');
    replacements.push({
      type: 'PHONE',
      original: patient.phone,
      replacement: '[PHONE_NUMBER]',
      count: phoneMatches
    });
  }

  // Also remove the exact patient phone if it didn't match the pattern
  if (patient.phone && anonymized.includes(patient.phone)) {
    const exactPhoneRegex = new RegExp(escapeRegex(patient.phone), 'g');
    const exactPhoneMatches = (anonymized.match(exactPhoneRegex) || []).length;
    anonymized = anonymized.replace(exactPhoneRegex, '[PHONE_NUMBER]');
    if (phoneMatches === 0) {
      replacements.push({
        type: 'PHONE',
        original: patient.phone,
        replacement: '[PHONE_NUMBER]',
        count: exactPhoneMatches
      });
    }
  }

  // 3. Remove Email Addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatches = (anonymized.match(emailRegex) || []).length;
  if (emailMatches > 0) {
    anonymized = anonymized.replace(emailRegex, '[EMAIL_ADDRESS]');
    replacements.push({
      type: 'EMAIL',
      original: patient.email,
      replacement: '[EMAIL_ADDRESS]',
      count: emailMatches
    });
  }

  // 4. Remove Dates (multiple formats)
  // YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, Month DD, YYYY
  const dateRegex = /\b\d{4}-\d{2}-\d{2}\b|\b\d{2}\/\d{2}\/\d{4}\b|\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi;
  const dateMatches = (anonymized.match(dateRegex) || []).length;
  if (dateMatches > 0) {
    anonymized = anonymized.replace(dateRegex, '[DATE]');
    replacements.push({
      type: 'DATE',
      original: 'various dates',
      replacement: '[DATE]',
      count: dateMatches
    });
  }

  // 5. Remove Addresses (if present in text)
  if (patient.address && patient.address.trim().length > 0) {
    const addressParts = patient.address.split(',').map(part => part.trim());
    addressParts.forEach(part => {
      if (part.length > 3) {
        const addressRegex = new RegExp(escapeRegex(part), 'gi');
        const addressMatches = (anonymized.match(addressRegex) || []).length;
        if (addressMatches > 0) {
          anonymized = anonymized.replace(addressRegex, '[ADDRESS]');
          replacements.push({
            type: 'ADDRESS',
            original: part,
            replacement: '[ADDRESS]',
            count: addressMatches
          });
        }
      }
    });
  }

  // 6. Remove Patient ID/MRN
  if (patient.id) {
    const idRegex = new RegExp(escapeRegex(patient.id), 'gi');
    const idMatches = (anonymized.match(idRegex) || []).length;
    if (idMatches > 0) {
      anonymized = anonymized.replace(idRegex, '[PATIENT_ID]');
      replacements.push({
        type: 'MRN',
        original: patient.id,
        replacement: '[PATIENT_ID]',
        count: idMatches
      });
    }
  }

  // 7. Remove Insurance IDs
  if (patient.insuranceId) {
    const insuranceRegex = new RegExp(escapeRegex(patient.insuranceId), 'gi');
    const insuranceMatches = (anonymized.match(insuranceRegex) || []).length;
    if (insuranceMatches > 0) {
      anonymized = anonymized.replace(insuranceRegex, '[INSURANCE_ID]');
      replacements.push({
        type: 'INSURANCE_ID',
        original: patient.insuranceId,
        replacement: '[INSURANCE_ID]',
        count: insuranceMatches
      });
    }
  }

  const totalRemoved = replacements.reduce((sum, r) => sum + r.count, 0);

  return {
    anonymizedText: anonymized,
    originalText: text,
    phiElementsRemoved: totalRemoved,
    replacements,
    timestamp: new Date().toISOString()
  };
};

const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const generateAnonymizationAuditMessage = (result: AnonymizationResult): string => {
  const { phiElementsRemoved, replacements } = result;
  if (phiElementsRemoved === 0) return 'No PHI detected in text';
  const typesSummary = replacements.map(r => `${r.count} ${r.type}`).join(', ');
  return `Anonymized ${phiElementsRemoved} PHI elements: ${typesSummary}`;
};

export const createSanitizedContext = (patient: Patient): string => {
  const context: string[] = [];
  const age = calculateAge(patient.dob);
  context.push(`Patient age: ${age} years`);
  context.push(`Gender: ${patient.gender}`);
  if (patient.bloodGroup) context.push(`Blood type: ${patient.bloodGroup}`);
  if (patient.allergies?.length) context.push(`Allergies: ${patient.allergies.join(', ')}`);
  if (patient.medicalHistory?.length) context.push(`History: ${patient.medicalHistory.join(', ')}`);
  return context.join('\n');
};

const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};
