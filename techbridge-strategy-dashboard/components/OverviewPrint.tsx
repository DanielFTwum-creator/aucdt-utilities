import React from 'react';
import { useDashboardData } from '../contexts/DataContext';

const OverviewPrint: React.FC = () => {
  const { data } = useDashboardData();
  const { funnel, metrics } = data;

  // Calculate percentages for the chart
  const signedUp = funnel.find(f => f.stage === 'Signed Up')?.count || 0;
  const applied = funnel.find(f => f.stage === 'Applied')?.count || 0;
  const accepted = funnel.find(f => f.stage === 'Accepted')?.count || 0;
  const registered = funnel.find(f => f.stage === 'Registered')?.count || 0;

  const appliedPct = signedUp > 0 ? Math.round((applied / signedUp) * 100) : 0;
  const acceptedPct = signedUp > 0 ? Math.round((accepted / signedUp) * 100) : 0;
  const registeredPct = signedUp > 0 ? Math.round((registered / signedUp) * 100) : 0;

  // Calculate widths for SVG bars (max width 350)
  const maxCount = signedUp;
  const getWidth = (count: number) => maxCount > 0 ? (count / maxCount) * 350 : 0;

  return (
    <div className="w-[1240px] h-[1754px] bg-white p-[60px] relative shadow-none mx-auto flex flex-col font-serif text-[#1A1A1A]">
      {/* MASTHEAD */}
      <div className="flex justify-between items-end pb-3 mb-8 border-b-2 border-[#C0392B]">
        <div className="text-[9pt] font-bold font-sans text-[#2C3E50] tracking-[0.05em] uppercase">
          TechBridge University College
        </div>
        <div className="text-[9pt] font-normal font-sans text-[#555555] tracking-[0.05em] uppercase">
          Confidential Executive Briefing — February 2026
        </div>
      </div>

      {/* HEADLINE */}
      <div className="mb-8 pb-6 border-b border-[#2C3E50]">
        <h1 className="text-[48pt] font-bold leading-[1.1] mb-4 text-[#1A1A1A] tracking-[-0.02em]">
          {metrics.currentEnrollment} Students. {metrics.capacity} Needed.<br />The Window Is Now.
        </h1>
        <div className="text-[13pt] italic leading-[1.4] text-[#555555] max-w-[85%]">
          A conversion crisis is eroding TechBridge's financial foundation — 
          and a high-ROI intervention path has been identified.
        </div>
      </div>

      {/* 3-COLUMN BODY */}
      <div className="grid grid-cols-[40fr_35fr_25fr] gap-6 mb-10 flex-grow">
        
        {/* LEFT COLUMN (40%) */}
        <div className="flex flex-col">
          <span className="text-[8pt] font-bold font-sans text-[#C0392B] tracking-[0.05em] uppercase mb-3 block">
            The Crisis
          </span>
          
          <p className="text-[10pt] leading-[1.5] mb-4 text-justify text-[#1A1A1A]">
            TechBridge University College currently enrolls {metrics.currentEnrollment} students against 
            a break-even capacity of {metrics.capacity}. A {metrics.conversionDropoutRate} dropout rate at the final 
            conversion stage — qualified, accepted students who do not register — 
            represents the core structural threat to institutional sustainability.
          </p>
          
          <p className="text-[10pt] leading-[1.5] mb-4 text-justify text-[#1A1A1A]">
            Root cause analysis identifies brand perception tied to the former 
            institutional name as the primary conversion barrier. The GTEC-approved 
            rebranding to TechBridge creates an immediate and time-sensitive 
            intervention window.
          </p>

          <div className="mt-8 p-4 border border-[#2C3E50]">
            <span className="text-[9pt] font-bold font-sans text-[#2C3E50] tracking-[0.05em] uppercase mb-2 block">
              Annual Burn Without Intervention
            </span>
            <span className="text-[28pt] font-bold leading-none mb-1 block text-[#C0392B]">
              {metrics.burnRate}
            </span>
            <span className="text-[9pt] italic text-[#555555]">
              Current trajectory — loss position
            </span>
          </div>
        </div>

        {/* CENTER COLUMN (35%) */}
        <div className="flex flex-col">
          <span className="text-[8pt] font-bold font-sans text-[#2C3E50] tracking-[0.05em] uppercase mb-3 block">
            Conversion Funnel
          </span>
          
          <div className="p-5 h-[400px] flex flex-col justify-center border border-[#2C3E50]">
            {/* SVG CHART */}
            <svg width="100%" height="250" viewBox="0 0 350 250" preserveAspectRatio="xMidYMid meet">
                {/* Stage 1: Signed Up */}
                <text x="0" y="20" fontFamily="Helvetica Neue, sans-serif" fontSize="10" fill="#2C3E50" fontWeight="bold">SIGNED UP</text>
                <rect x="0" y="28" width={getWidth(signedUp)} height="24" fill="#2C3E50" />
                <text x="350" y="20" fontFamily="Helvetica Neue, sans-serif" fontSize="10" fill="#2C3E50" textAnchor="end">100%</text>

                {/* Stage 2: Applied */}
                <text x="0" y="80" fontFamily="Helvetica Neue, sans-serif" fontSize="10" fill="#2C3E50" fontWeight="bold">APPLIED</text>
                <rect x="0" y="88" width={getWidth(applied)} height="24" fill="#2C3E50" />
                <text x={getWidth(applied)} y="80" fontFamily="Helvetica Neue, sans-serif" fontSize="10" fill="#2C3E50" textAnchor="end">{appliedPct}%</text>

                {/* Stage 3: Accepted */}
                <text x="0" y="140" fontFamily="Helvetica Neue, sans-serif" fontSize="10" fill="#2C3E50" fontWeight="bold">ACCEPTED</text>
                <rect x="0" y="148" width={getWidth(accepted)} height="24" fill="#2C3E50" />
                <text x={getWidth(accepted)} y="140" fontFamily="Helvetica Neue, sans-serif" fontSize="10" fill="#2C3E50" textAnchor="end">{acceptedPct}%</text>

                {/* Stage 4: Registered (Crisis) */}
                <text x="0" y="200" fontFamily="Helvetica Neue, sans-serif" fontSize="10" fill="#C0392B" fontWeight="bold">REGISTERED</text>
                <rect x="0" y="208" width={getWidth(registered)} height="24" fill="#C0392B" />
                <text x={getWidth(registered)} y="200" fontFamily="Helvetica Neue, sans-serif" fontSize="10" fill="#C0392B" textAnchor="end">{registeredPct}%</text>
            </svg>
            
            <div className="text-[9pt] italic text-[#555555] mt-4 text-center">
                {metrics.conversionDropoutRate} of accepted, qualified students do not complete registration.
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (25%) */}
        <div className="flex flex-col">
          <span className="text-[8pt] font-bold font-sans text-[#C0392B] tracking-[0.05em] uppercase mb-3 block">
            Key Metric
          </span>
          
          <div className="mb-8 pb-6 border-b-2 border-[#C0392B]">
            <span className="text-[96pt] font-bold leading-[0.9] text-center block mb-2 text-[#C0392B]">
              {metrics.conversionDropoutRate}
            </span>
            <span className="text-[11pt] font-bold font-sans text-[#2C3E50] uppercase text-center block">
              Conversion Dropout Rate
            </span>
          </div>

          <div className="mb-8 pb-6">
            <span className="text-[48pt] font-bold leading-none block mb-2 text-[#2C3E50]">
              {metrics.currentEnrollment}
            </span>
            <span className="text-[9pt] font-sans text-[#555555] uppercase">
              Current Enrollment / {metrics.capacity} Capacity
            </span>
          </div>

          <div className="mt-auto">
            <div className="p-3 text-center cursor-pointer block border border-[#2C3E50] font-sans text-[#2C3E50] uppercase tracking-[0.05em] text-[9pt]">
                View Intervention Roadmap &rarr;
            </div>
          </div>
        </div>

      </div>

      {/* PULL QUOTE */}
      <div className="py-8 mb-auto border-t border-b border-[#2C3E50]">
        <div className="text-[18pt] italic leading-[1.4] text-center max-w-[80%] mx-auto mb-4 text-[#1A1A1A]">
            "{metrics.immediateInvestment} invested today returns {metrics.projectedReturn} over five years — a 
            projected ROI of {metrics.roi}. The intervention window is open now."
        </div>
        <span className="text-[9pt] font-bold font-sans text-[#555555] uppercase tracking-[0.05em] text-center block">
            — TechBridge Strategic Financial Model, 2026
        </span>
      </div>

      {/* FOOTER */}
      <div className="pt-3 flex justify-between text-[9pt] font-sans text-[#2C3E50] border-t border-[#2C3E50]">
        <div className="font-bold">TECHBRIDGE UNIVERSITY COLLEGE</div>
        <div>Page 1 of 3</div>
        <div className="text-[#555555]">Generated: February 20, 2026</div>
      </div>

    </div>
  );
};

export default OverviewPrint;
