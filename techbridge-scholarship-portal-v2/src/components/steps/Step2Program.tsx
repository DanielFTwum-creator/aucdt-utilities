import React, { useState } from 'react';
import { FormData } from '../../types';
import { Input } from '../ui/Input';
import { Section } from '../ui/Section';
import { AlertCircle } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const Step2Program: React.FC<Props> = ({ data, updateData }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: any) => {
    let error = "";
    if (typeof value === 'string' && !value.trim()) {
      error = "This field is required.";
    } else if (field === 'serviceYears' && (isNaN(value) || value < 1)) {
      error = "Bond duration must be at least 1 year.";
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return error === "";
  };

  const handleChange = (field: keyof typeof data.program, value: string | number) => {
    updateData({
      program: { ...data.program, [field]: value },
    });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleBlur = (field: string, value: any) => {
    validateField(field, value);
  };

  return (
    <div className="space-y-12 animate-fade-up">
      <Section title="Scholarship & Programme Details" description="Details regarding the academic programme and funding.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Input
            label="Department"
            placeholder="e.g. Computer Science"
            value={data.program.department}
            onChange={(e) => handleChange('department', e.target.value)}
            onBlur={(e) => handleBlur('department', e.target.value)}
            error={errors.department}
            required
          />
          <Input
            label="Programme Duration"
            placeholder="e.g. 3 Years"
            value={data.program.programDuration}
            onChange={(e) => handleChange('programDuration', e.target.value)}
            onBlur={(e) => handleBlur('programDuration', e.target.value)}
            error={errors.programDuration}
            required
          />
        </div>

        <div className="mb-8">
          <Input
            label="Funding Source"
            placeholder="e.g. TECHBRIDGE Fellowship Grant"
            value={data.program.fundingSource}
            onChange={(e) => handleChange('fundingSource', e.target.value)}
            onBlur={(e) => handleBlur('fundingSource', e.target.value)}
            error={errors.fundingSource}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            label="PhD Subject/Topic"
            placeholder="Completion of PhD in..."
            value={data.program.phdSubject}
            onChange={(e) => handleChange('phdSubject', e.target.value)}
            onBlur={(e) => handleBlur('phdSubject', e.target.value)}
            error={errors.phdSubject}
            required
          />
          <div className="relative">
            <Input
              label="Mandatory Bond Period"
              type="text"
              value="10 Years"
              onChange={() => {}} // Read-only
              onBlur={() => {}}
              error={errors.serviceYears}
              required
              disabled
              className="font-bold text-tuc-gold"
            />
            <div className="absolute top-9 right-3 bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-1 rounded border border-red-500/20 uppercase tracking-wider flex items-center">
              <AlertCircle size={10} className="mr-1" /> Mandatory
            </div>
          </div>
        </div>
      </Section>

      <div className="pl-6 border-l-4 border-tuc-maroon bg-tuc-maroon/5 py-6 pr-6 mt-12 animate-fade-in rounded-r-sm">
        <h4 className="font-label text-tuc-maroon dark:text-tuc-gold tracking-widest uppercase text-sm mb-3 flex items-center font-bold">
          <AlertCircle className="w-5 h-5 mr-2" />
          Strict Policy Enforcement
        </h4>
        <p className="font-body italic text-tuc-ink/80 dark:text-tuc-cream/80 text-xl leading-relaxed">
          This is a <strong className="text-tuc-maroon dark:text-tuc-gold not-italic font-bold">Sponsored Programme</strong>. 
          By proceeding, you explicitly acknowledge that upon completion of your PhD in <strong className="text-tuc-ink dark:text-white not-italic font-bold">{data.program.phdSubject || '[Subject]'}</strong>, 
          you are legally bound to serve TECHBRIDGE for a <strong className="text-tuc-maroon dark:text-tuc-gold not-italic font-bold border-b-2 border-tuc-maroon dark:border-tuc-gold">mandatory period of 10 years post-qualification</strong>.
        </p>
      </div>
    </div>
  );
};
