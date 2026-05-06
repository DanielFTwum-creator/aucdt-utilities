import React, { useState } from 'react';
import { FormData } from '../../types';
import { Input } from '../ui/Input';
import { Section } from '../ui/Section';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const Step1Scholar: React.FC<Props> = ({ data, updateData }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    let error = "";
    if (!value.trim()) {
      error = "This field is required.";
    } else if (field === 'email') {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!re.test(value)) {
        error = "Please enter a valid professional email address.";
      }
    } else if (field === 'phone') {
      // Basic check if it has enough digits after masking
      const digits = value.replace(/\D/g, "");
      if (digits.length < 8) {
        error = "Please enter a valid phone number.";
      }
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return error === "";
  };

  const handleChange = (field: keyof typeof data.scholar, value: string) => {
    updateData({
      scholar: { ...data.scholar, [field]: value },
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field: string, value: string) => {
    validateField(field, value);
  };

  const handleMetaChange = (field: keyof typeof data.meta, value: string) => {
    updateData({
      meta: { ...data.meta, [field]: value },
    });
  };

  return (
    <div className="space-y-12 animate-fade-up">
      <Section title="Agreement Metadata" description="Date and location of the agreement execution.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            label="Date of Agreement"
            type="date"
            value={data.meta.date}
            onChange={(e) => handleMetaChange('date', e.target.value)}
          />
          <Input
            label="Location (City)"
            placeholder="e.g. Accra"
            value={data.meta.madeAt}
            onChange={(e) => handleMetaChange('madeAt', e.target.value)}
          />
        </div>
      </Section>

      <Section title="Scholar Personal Details" description="Primary identification for the scholarship bond.">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          <div className="md:col-span-3">
             <div className="relative mb-8">
               <select
                 className="w-full px-0 py-4 bg-transparent border-b-2 border-tuc-ink/20 dark:border-tuc-gold/30 transition-all outline-none font-body text-xl text-tuc-ink dark:text-white appearance-none focus:border-tuc-gold rounded-none"
                 value={data.scholar.title}
                 onChange={(e) => handleChange('title', e.target.value)}
               >
                 <option value="Mr" className="bg-tuc-cream dark:bg-tuc-ink text-tuc-ink dark:text-white">Mr</option>
                 <option value="Mrs" className="bg-tuc-cream dark:bg-tuc-ink text-tuc-ink dark:text-white">Mrs</option>
                 <option value="Miss" className="bg-tuc-cream dark:bg-tuc-ink text-tuc-ink dark:text-white">Miss</option>
                 <option value="Dr" className="bg-tuc-cream dark:bg-tuc-ink text-tuc-ink dark:text-white">Dr</option>
               </select>
               <label className="absolute -top-3 left-0 font-label tracking-widest uppercase text-xs text-tuc-gold pointer-events-none">
                 Title
               </label>
             </div>
          </div>
          <div className="md:col-span-9">
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              value={data.scholar.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              onBlur={(e) => handleBlur('fullName', e.target.value)}
              error={errors.fullName}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           <Input
            label="ID Number / Passport No."
            placeholder="GHA-000000000-0"
            mask="aaa-000000000-0"
            value={data.scholar.idNumber}
            onChange={(e) => handleChange('idNumber', e.target.value)}
            onBlur={(e) => handleBlur('idNumber', e.target.value)}
            error={errors.idNumber}
            required
          />
          <Input
            label="Son/Daughter of (Parent's Name)"
            placeholder="Parent/Guardian Name"
            value={data.scholar.parentName}
            onChange={(e) => handleChange('parentName', e.target.value)}
            onBlur={(e) => handleBlur('parentName', e.target.value)}
            error={errors.parentName}
            required
          />
        </div>

        <div className="mb-8">
          <Input
            label="Permanent Residential Address"
            placeholder="Full residential address"
            value={data.scholar.address}
            onChange={(e) => handleChange('address', e.target.value)}
            onBlur={(e) => handleBlur('address', e.target.value)}
            error={errors.address}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Input
            label="Email Address"
            type="email"
            placeholder="scholar@example.com"
            value={data.scholar.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={(e) => handleBlur('email', e.target.value)}
            error={errors.email}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+233 00 000 0000"
            mask="+000 00 000 0000"
            value={data.scholar.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={(e) => handleBlur('phone', e.target.value)}
            error={errors.phone}
            required
          />
        </div>
      </Section>
    </div>
  );
};
