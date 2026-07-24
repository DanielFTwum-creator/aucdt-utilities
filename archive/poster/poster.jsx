export default function TechbridgeBanner() {
  const programmes = [
    "BA / Dip. Jewellery Design",
    "BA / Dip. Product Design",
    "B.Tech. Fashion Design",
    "B.Tech. Digital Media & Comm. Design",
  ];

  return (
    <div className="w-[640px] h-[850px] bg-white relative shadow-2xl border-x border-[#ddd] overflow-hidden font-heavy">
      <div className="h-[6px] bg-[#D0111B] w-full" />

      <div className="bg-[#D0111B] py-[20px] text-center text-white w-full">
        <h1 className="text-[56px] font-black tracking-[16px] leading-tight font-heavy">TECHBRIDGE</h1>
        <div className="text-[20px] font-bold tracking-[6px] mt-0.5 uppercase leading-tight font-heavy">UNIVERSITY COLLEGE</div>
      </div>

      <div className="text-center text-[13px] font-extrabold text-[#0A0A0A] mt-[6px] mb-[1px] px-3 font-heavy leading-tight">
        Formerly Asanska University College of Design and Technology
      </div>

      <div className="h-[12px] bg-white w-full" />

      <div className="bg-[#1B55A0] text-white w-[300px] mx-auto text-center py-1.5 rounded font-black text-[16px] tracking-[0.5px] uppercase whitespace-nowrap font-heavy">
        PROGRAMMES WE OFFER
      </div>

      <div className="px-[32px] pt-[16px] pb-[8px]">
        {programmes.map((item) => (
          <div key={item} className="flex items-center mb-[10px]">
            <div className="w-[12px] h-[12px] bg-[#D0111B] rounded-full mr-[16px] shrink-0" />
            <div className="font-extrabold text-[#0A0A0A] leading-[1.15] text-[26px] font-heavy">
              {item}
            </div>
          </div>
        ))}
      </div>

      <div className="h-[8px] w-full bg-gradient-to-r from-[#D0111B] via-[#1B55A0] to-[#D0111B] opacity-30" />

      <div className="px-[30px] py-[8px]">
        <div className="text-center text-[#0A0A0A] text-[12px] font-black tracking-[1px] uppercase">
          ✓ Flexible schedules · Industry-focused · Affordable fees
        </div>
      </div>

      <div className="text-center text-[#D0111B] text-[22px] font-black my-[8px] font-heavy">
        6-month &amp; 1-year certificates
      </div>

      <div className="bg-[#D0111B] text-white w-[560px] mx-auto text-center py-[10px] rounded font-black text-[22px] tracking-[1.5px] uppercase font-heavy">
        ADMISSIONS ARE ONGOING
      </div>

      <div className="flex justify-between px-[24px] gap-[12px] mt-[10px]">
        <div className="bg-[#1B55A0] text-white flex-1 rounded flex flex-col justify-center items-center py-[12px]">
          <div className="text-[28px] font-black tracking-[0.5px] leading-tight font-heavy">054 012 4488</div>
          <div className="text-[28px] font-black tracking-[0.5px] leading-tight font-heavy">054 012 4400</div>
          <div className="text-[8px] font-bold tracking-[1px] opacity-[0.8] mt-1">MON – FRI · 8:00 AM – 5:00 PM</div>
        </div>
        <div className="flex-1 border-[2px] border-[#D0111B] rounded bg-white flex flex-col justify-center items-center text-center px-2 py-[12px]">
          <div className="text-[#D0111B] text-[11px] font-extrabold tracking-[1.5px] mb-1 font-heavy">EMAIL</div>
          <div className="text-[#0A0A0A] text-[10px] font-black leading-tight font-heavy">info@techbridge.edu.gh</div>
        </div>
      </div>

      <div className="text-center text-[#1B55A0] text-[10px] font-extrabold tracking-[1.5px] mt-[8px] font-heavy">
        OYIBI · GREATER ACCRA · GHANA
      </div>

      <div className="flex-1" />

      <div className="bg-white px-[24px] py-[8px] text-center text-[11px] text-[#6b7280] font-semibold border-t border-[#e5e7eb]">
        Visit <span className="font-black text-[#D0111B]">techbridge.edu.gh</span> to apply online
      </div>

      <div className="h-[6px] bg-[#1B55A0] w-full absolute bottom-0" />
    </div>
  );
}
