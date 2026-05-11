import React, { useState, useEffect } from 'react';
import { FormData } from '../../types';
import { Input } from '../ui/Input';
import { Section } from '../ui/Section';
import { Info } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const Step3GuarantorWitness: React.FC<Props> = ({ data, updateData }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isGuarantorPopulated = () => {
    return !!(data.guarantor.name?.trim() || data.guarantor.idNumber?.trim() || data.guarantor.phone?.trim());
  };

  const validateField = (field: string, value: string) => {
    let error = "";
    
    if (field === 'guarantor_address') {
      // Address is only mandatory if other guarantor info is provided
      if (isGuarantorPopulated() && !value.trim()) {
        error = "Guarantor address is required when other details are provided.";
      }
    } else if (field.startsWith('techbridgeWitness_') || field.startsWith('scholarWitness_') || field.startsWith('guarantor_')) {
       // All other fields in this step are mandatory for a valid bond
       if (!value.trim()) {
         error = "This field is required.";
       } else if (field === 'guarantor_phone') {
         const re = /^\+?[0-9\s-]{8,20}$/;
         if (!re.test(value)) error = "Please enter a valid phone number.";
       }
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error === "";
  };

  // Synchronize validation state when dependency fields change
  useEffect(() => {
    if (!isGuarantorPopulated()) {
      // If nothing is populated, address error should clear
      setErrors(prev => ({ ...prev, guarantor_address: "" }));
    } else if (data.guarantor.address?.trim()) {
      // If address is filled, error should clear
      setErrors(prev => ({ ...prev, guarantor_address: "" }));
    }
  }, [data.guarantor.name, data.guarantor.idNumber, data.guarantor.phone, data.guarantor.address]);

  const handleGuarantorChange = (field: keyof typeof data.guarantor, value: string) => {
    updateData({ guarantor: { ...data.guarantor, [field]: value } });
  };

  const handleWitnessChange = (
    witnessType: 'techbridgeWitness' | 'scholarWitness',
    field: keyof typeof data.witnesses.techbridgeWitness,
    value: string
  ) => {
    updateData({
      witnesses: {
        ...data.witnesses,
        [witnessType]: { ...data.witnesses[witnessType], [field]: value }
      }
    });
  };

  const guarantorIncomplete = isGuarantorPopulated();

  return (
    <div className="space-y-12 animate-fade-up">
      <Section 
        title="Guarantor Details" 
        description="The individual or entity legally responsible for the scholarship bond obligations."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Input
            label="Guarantor Name"
            placeholder="Full legal name"
            value={data.guarantor.name}
            onChange={(e) => handleGuarantorChange('name', e.target.value)}
            onBlur={(e) => validateField('guarantor_name', e.target.value)}
            error={errors.guarantor_name}
            required
          />
          <Input
            label="Guarantor ID Number"
            placeholder="GHA-000000000-0"
            mask="aaa-000000000-0"
            value={data.guarantor.idNumber}
            onChange={(e) => handleGuarantorChange('idNumber', e.target.value)}
            onBlur={(e) => validateField('guarantor_idNumber', e.target.value)}
            error={errors.guarantor_idNumber}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Input
            label="Guarantor Address"
            placeholder="Full residential address"
            value={data.guarantor.address || ''}
            onChange={(e) => handleGuarantorChange('address', e.target.value)}
            onBlur={(e) => validateField('guarantor_address', e.target.value)}
            error={errors.guarantor_address}
            required={guarantorIncomplete}
          />
          <Input
            label="Guarantor Phone"
            type="tel"
            placeholder="+233 00 000 0000"
            mask="+000 00 000 0000"
            value={data.guarantor.phone || ''}
            onChange={(e) => handleGuarantorChange('phone', e.target.value)}
            onBlur={(e) => validateField('guarantor_phone', e.target.value)}
            error={errors.guarantor_phone}
            required
          />
        </div>
        
        {!guarantorIncomplete && (
          <div className="flex items-center gap-4 p-4 border border-tuc-gold/20 bg-tuc-gold/5 mt-6 animate-fade-in">
            <Info size={16} className="text-tuc-gold shrink-0" />
            <p className="font-body italic text-[#444444] dark:text-tuc-cream/60 text-sm font-medium">
              Address is currently optional but will become mandatory if you provide other guarantor details.
            </p>
          </div>
        )}
      </Section>

      <Section title="Witness Attestation" description="Official representatives verifying the execution of this bond.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
            
            {/* Techbridge Witness */}
            <div className="space-y-8">
                <h3 className="font-display font-bold text-xl text-tuc-ink dark:text-white uppercase border-b border-tuc-gold/30 pb-4 mb-6">
                    For Techbridge University
                </h3>
                <div className="space-y-8">
                    <Input
                        label="Full Name"
                        placeholder="Witness Name"
                        value={data.witnesses.techbridgeWitness.name}
                        onChange={(e) => handleWitnessChange('techbridgeWitness', 'name', e.target.value)}
                        onBlur={(e) => validateField('techbridgeWitness_name', e.target.value)}
                        error={errors.techbridgeWitness_name}
                        required
                    />
                    <Input
                        label="Designation / Staff ID"
                        placeholder="e.g. Registrar / TUC-001"
                        value={data.witnesses.techbridgeWitness.idNumber}
                        onChange={(e) => handleWitnessChange('techbridgeWitness', 'idNumber', e.target.value)}
                        onBlur={(e) => validateField('techbridgeWitness_idNumber', e.target.value)}
                        error={errors.techbridgeWitness_idNumber}
                        required
                    />
                </div>
            </div>

            {/* Vertical Divider (Desktop) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-tuc-gold/20 -ml-px"></div>

            {/* Scholar Witness */}
            <div className="space-y-8">
                <h3 className="font-display font-bold text-xl text-tuc-ink dark:text-white uppercase border-b border-tuc-gold/30 pb-4 mb-6">
                    For Scholar
                </h3>
                <div className="space-y-8">
                    <Input
                        label="Full Name"
                        placeholder="Witness Name"
                        value={data.witnesses.scholarWitness.name}
                        onChange={(e) => handleWitnessChange('scholarWitness', 'name', e.target.value)}
                        onBlur={(e) => validateField('scholarWitness_name', e.target.value)}
                        error={errors.scholarWitness_name}
                        required
                    />
                    <Input
                        label="ID Number"
                        placeholder="Witness ID"
                        value={data.witnesses.scholarWitness.idNumber}
                        onChange={(e) => handleWitnessChange('scholarWitness', 'idNumber', e.target.value)}
                        onBlur={(e) => validateField('scholarWitness_idNumber', e.target.value)}
                        error={errors.scholarWitness_idNumber}
                        required
                    />
                </div>
            </div>

        </div>
      </Section>
    </div>
  );
};
