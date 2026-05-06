
import React from 'react';
import { DashboardData } from '../types';

interface Props {
  data: DashboardData;
  onChange: (data: DashboardData, field: string) => void;
}

const ControlPanel: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: keyof DashboardData, value: any) => {
    onChange({ ...data, [field]: value }, `Updated ${field} to ${value}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <InputGroup 
        label="Total Scope" 
        id="total-scope"
        type="number"
        value={data.totalAssessments} 
        onChange={(v) => handleChange('totalAssessments', Number(v))} 
        colorClass="focus:ring-emerald-500/50"
      />
      <InputGroup 
        label="Completed Items" 
        id="completed-items"
        type="number"
        value={data.completed} 
        onChange={(v) => handleChange('completed', Number(v))} 
        colorClass="focus:ring-blue-500/50"
      />
      <InputGroup 
        label="Project Start Date" 
        id="start-date"
        type="date"
        value={data.startDate} 
        onChange={(v) => handleChange('startDate', v)} 
        colorClass="focus:ring-amber-500/50"
      />
      <InputGroup 
        label="Daily Target Rate" 
        id="target-rate"
        type="number"
        value={data.targetRate} 
        onChange={(v) => handleChange('targetRate', Number(v))} 
        colorClass="focus:ring-red-500/50"
      />
      <div className="sm:col-span-2 lg:col-span-4 border-t border-[var(--border-color)] pt-4 mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputGroup 
          label="Report Title" 
          id="report-title"
          type="text"
          value={data.title} 
          onChange={(v) => handleChange('title', v)} 
          colorClass="focus:ring-fuchsia-500/50"
        />
        <InputGroup 
          label="Item Label (Plural)" 
          id="item-label"
          type="text"
          value={data.itemLabel} 
          onChange={(v) => handleChange('itemLabel', v)} 
          colorClass="focus:ring-indigo-500/50"
        />
        <InputGroup 
          label="Organization Logo URL" 
          id="logo-url"
          type="text"
          value={data.logoUrl} 
          onChange={(v) => handleChange('logoUrl', v)} 
          colorClass="focus:ring-slate-500/50"
        />
      </div>
    </div>
  );
};

const InputGroup = ({ label, id, value, onChange, colorClass, type }: { label: string, id: string, value: any, onChange: (v: any) => void, colorClass: string, type: string }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">{label}</label>
    <input 
      id={id}
      type={type} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-main)] font-mono focus:outline-none focus:ring-2 ${colorClass} transition-all appearance-none`}
      aria-label={label}
    />
  </div>
);

export default ControlPanel;
