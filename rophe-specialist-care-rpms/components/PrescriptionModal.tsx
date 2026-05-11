import React, { useState, useEffect } from 'react';
import { Patient, Prescription } from '../types';
import {
  searchMedications,
  getMedicationById,
  Medication,
  MedicationCategory
} from '../services/medicationDatabase';
import {
  checkDrugInteractions,
  generateInteractionAuditMessage,
  sortInteractionsBySeverity,
  InteractionCheck
} from '../services/drugInteractionService';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  currentUser: string;
  onPrescribe: (prescription: Prescription) => void;
  addAuditLog?: (action: string, details: string) => void;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentUser,
  onPrescribe,
  addAuditLog
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Medication[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Prescription details
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [quantity, setQuantity] = useState('');
  const [refills, setRefills] = useState(0);
  const [instructions, setInstructions] = useState('');

  // Interaction checking
  const [interactionCheck, setInteractionCheck] = useState<InteractionCheck | null>(null);
  const [showInteractionDetails, setShowInteractionDetails] = useState(true);
  const [acknowledgedSevere, setAcknowledgedSevere] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  // Handle medication search
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const results = searchMedications(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  // Check interactions when medication selected
  useEffect(() => {
    if (selectedMedication) {
      const check = checkDrugInteractions(
        selectedMedication,
        patient.currentMedications || [],
        patient.allergies || [],
        patient.gender === 'Female' // Simplified pregnancy check
      );
      setInteractionCheck(check);

      // Pre-populate dosage with common options
      if (selectedMedication.commonDosages.length > 0) {
        setDosage(selectedMedication.commonDosages[0]);
      }
    } else {
      setInteractionCheck(null);
    }
  }, [selectedMedication, patient]);

  const handleSelectMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setSearchQuery(medication.name);
    setShowResults(false);
    setAcknowledgedSevere(false);
    setOverrideReason('');
  };

  const handlePrescribe = () => {
    if (!selectedMedication || !dosage || !frequency || !duration) {
      alert('Please fill in all required fields');
      return;
    }

    // Check for severe interactions without acknowledgment
    const hasSevereInteractions = interactionCheck?.interactions.some(
      i => i.severity === 'Severe'
    );

    if (hasSevereInteractions && !acknowledgedSevere) {
      alert('Please acknowledge severe interactions before prescribing');
      return;
    }

    if (interactionCheck?.hasAllergyConflict) {
      if (!confirm('ALLERGY CONFLICT DETECTED. Are you sure you want to prescribe this medication?')) {
        return;
      }
    }

    const prescription: Prescription = {
      id: `RX-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      patientId: patient.id,
      medicationId: selectedMedication.id,
      medicationName: selectedMedication.name,
      dosage,
      frequency,
      duration,
      quantity,
      refills,
      instructions,
      prescribedBy: currentUser,
      prescribedDate: new Date().toISOString(),
      status: 'Active'
    };

    // Audit logging
    if (addAuditLog && interactionCheck) {
      const auditMessage = generateInteractionAuditMessage(
        selectedMedication.name,
        interactionCheck
      );
      addAuditLog('PRESCRIPTION_CREATED', auditMessage);

      if (acknowledgedSevere && overrideReason) {
        addAuditLog('SEVERE_INTERACTION_OVERRIDE',
          `${selectedMedication.name} prescribed despite severe interactions. Reason: ${overrideReason}`
        );
      }
    }

    onPrescribe(prescription);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedMedication(null);
    setDosage('');
    setFrequency('');
    setDuration('');
    setQuantity('');
    setRefills(0);
    setInstructions('');
    setInteractionCheck(null);
    setAcknowledgedSevere(false);
    setOverrideReason('');
    onClose();
  };

  if (!isOpen) return null;

  const sortedInteractions = interactionCheck?.interactions
    ? sortInteractionsBySeverity(interactionCheck.interactions)
    : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Prescription</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Patient: {patient.firstName} {patient.lastName} | DOB: {patient.dob}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Medication Search */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
              Search Medication *
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type medication name..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
              />

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                  {searchResults.map((med) => (
                    <button
                      key={med.id}
                      onClick={() => handleSelectMedication(med)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-600 last:border-b-0"
                    >
                      <p className="font-bold text-gray-900 dark:text-white">{med.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{med.genericName}</p>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                        {med.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Medication Info */}
          {selectedMedication && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-lg">
                    {selectedMedication.name}
                  </h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    {selectedMedication.genericName}
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-full text-xs font-bold">
                  {selectedMedication.category}
                </span>
              </div>

              {selectedMedication.pregnancyCategory && (
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Pregnancy Category: <strong>{selectedMedication.pregnancyCategory}</strong>
                </p>
              )}
            </div>
          )}

          {/* Interaction Warnings */}
          {interactionCheck && (interactionCheck.hasInteractions || interactionCheck.hasAllergyConflict || interactionCheck.pregnancyWarning) && (
            <div className="space-y-3">
              {/* Allergy Conflicts */}
              {interactionCheck.hasAllergyConflict && (
                <div className="bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-300 dark:border-rose-900 rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-rose-500 rounded-xl text-white">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="font-black text-rose-900 dark:text-rose-300 uppercase tracking-wide">
                      Allergy Conflict Detected
                    </h4>
                  </div>
                  {interactionCheck.allergyWarnings.map((warning, idx) => (
                    <div key={idx} className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-3 mb-2">
                      <p className="font-bold text-rose-800 dark:text-rose-400 mb-1">
                        {warning.type}: {warning.allergen}
                      </p>
                      <p className="text-sm text-rose-700 dark:text-rose-300">{warning.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Drug Interactions */}
              {interactionCheck.hasInteractions && (
                <div className="border-2 border-amber-300 dark:border-amber-900 rounded-2xl overflow-hidden">
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-amber-700 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <h4 className="font-black text-amber-900 dark:text-amber-300 uppercase tracking-wide">
                        Drug Interactions ({sortedInteractions.length})
                      </h4>
                    </div>
                    <button
                      onClick={() => setShowInteractionDetails(!showInteractionDetails)}
                      className="text-xs font-bold text-amber-700 dark:text-amber-400 underline"
                    >
                      {showInteractionDetails ? 'Hide' : 'Show'} Details
                    </button>
                  </div>

                  {showInteractionDetails && (
                    <div className="p-4 space-y-3">
                      {sortedInteractions.map((interaction, idx) => (
                        <div
                          key={idx}
                          className={`rounded-xl p-4 border-2 ${interaction.color}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-bold text-sm">
                                Interaction with: {interaction.interactingDrug}
                              </p>
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                                interaction.severity === 'Severe' ? 'bg-rose-500 text-white' :
                                interaction.severity === 'Moderate' ? 'bg-amber-500 text-white' :
                                'bg-blue-500 text-white'
                              }`}>
                                {interaction.severity}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm mb-2"><strong>Effect:</strong> {interaction.effect}</p>
                          <p className="text-xs mb-2"><strong>Mechanism:</strong> {interaction.mechanism}</p>
                          <p className="text-xs font-bold"><strong>Recommendation:</strong> {interaction.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pregnancy Warning */}
              {interactionCheck.pregnancyWarning && (
                <div className="bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-300 dark:border-purple-900 rounded-2xl p-4">
                  <p className="text-sm font-bold text-purple-900 dark:text-purple-300">
                    ⚠️ {interactionCheck.pregnancyWarning}
                  </p>
                </div>
              )}

              {/* Severe Interaction Acknowledgment */}
              {sortedInteractions.some(i => i.severity === 'Severe') && (
                <div className="bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl p-4">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={acknowledgedSevere}
                      onChange={(e) => setAcknowledgedSevere(e.target.checked)}
                      className="mt-1 w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
                    />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      I acknowledge the severe drug interactions listed above and have clinically justified this prescription.
                    </span>
                  </label>

                  {acknowledgedSevere && (
                    <textarea
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="Required: Document clinical justification for override..."
                      className="mt-3 w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-xl text-sm dark:bg-slate-700 dark:text-white"
                      rows={3}
                      required
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Prescription Details Form */}
          {selectedMedication && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Dosage *
                </label>
                <select
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Select dosage...</option>
                  {selectedMedication.commonDosages.map((d, idx) => (
                    <option key={idx} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Frequency *
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Select frequency...</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily (BID)">Twice daily (BID)</option>
                  <option value="Three times daily (TID)">Three times daily (TID)</option>
                  <option value="Four times daily (QID)">Four times daily (QID)</option>
                  <option value="Every 4 hours">Every 4 hours</option>
                  <option value="Every 6 hours">Every 6 hours</option>
                  <option value="Every 8 hours">Every 8 hours</option>
                  <option value="As needed (PRN)">As needed (PRN)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Duration *
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Select duration...</option>
                  <option value="3 days">3 days</option>
                  <option value="5 days">5 days</option>
                  <option value="7 days">7 days</option>
                  <option value="10 days">10 days</option>
                  <option value="14 days">14 days</option>
                  <option value="30 days">30 days</option>
                  <option value="60 days">60 days</option>
                  <option value="90 days">90 days</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g., 30 tablets"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Refills
                </label>
                <input
                  type="number"
                  value={refills}
                  onChange={(e) => setRefills(parseInt(e.target.value) || 0)}
                  min="0"
                  max="12"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="E.g., Take with food, Avoid alcohol, etc."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-6 flex items-center justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePrescribe}
            disabled={!selectedMedication || !dosage || !frequency || !duration}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Prescribe Medication
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
