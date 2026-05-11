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

      <div className="bg-[#D0111B] py-[24px] text-center text-white w-full">
        <h1 className="text-[60px] font-black tracking-[16px] leading-tight font-heavy">TECHBRIDGE</h1>
        <div className="text-[24px] font-bold tracking-[8px] mt-1 uppercase leading-tight font-heavy">UNIVERSITY COLLEGE</div>
      </div>

      <div className="text-center text-[16px] font-extrabold text-[#0A0A0A] mt-[8px] mb-[2px] px-4 font-heavy leading-tight">
        Formerly Asanska University College of Design and Technology
      </div>

      <div className="h-[20px] bg-white w-full" />

      <div className="bg-[#1B55A0] text-white w-[300px] mx-auto text-center py-2 rounded font-black text-[18px] tracking-[1px] uppercase whitespace-nowrap font-heavy">
        PROGRAMMES WE OFFER
      </div>

      <div className="px-[40px] pt-[25px]">
        {programmes.map((item) => (
          <div key={item} className="flex items-center mb-[15px]">
            <div className="w-[14px] h-[14px] bg-[#D0111B] rounded-full mr-[20px] shrink-0" />
            <div className="font-extrabold text-[#0A0A0A] leading-[1.1] text-[32px] font-heavy">
              {item}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-[#D0111B] text-[26px] font-black my-[10px] font-heavy">
        6-month &amp; 1-year certificates
      </div>

      <div className="bg-[#D0111B] text-white w-[580px] mx-auto text-center py-[12px] rounded font-black text-[26px] tracking-[2px] uppercase font-heavy">
        ADMISSIONS ARE ONGOING
      </div>

      <div className="flex justify-between px-[30px] mt-[15px]">
        <div className="bg-[#1B55A0] text-white w-[320px] h-[108px] rounded flex flex-col justify-center items-center">
          <div className="text-[34px] font-black tracking-[1px] leading-tight font-heavy">054 012 4488</div>
          <div className="text-[34px] font-black tracking-[1px] leading-tight font-heavy">054 012 4400</div>
          <div className="text-[10px] font-bold tracking-[1.5px] opacity-[0.85] mt-1">MON – FRI · 8:00 AM – 5:00 PM</div>
        </div>
        <div className="w-[240px] h-[108px] border-[3px] border-[#D0111B] rounded bg-white flex flex-col justify-center items-center text-center px-2">
          <div className="text-[#D0111B] text-[14px] font-extrabold tracking-[2px] mb-1 font-heavy">APPLY ONLINE</div>
          <div className="text-[#0A0A0A] text-[22px] font-black leading-tight font-heavy">techbridge.edu.gh</div>
        </div>
      </div>

      <div className="text-center text-[#1B55A0] text-[11px] font-extrabold tracking-[2px] mt-[20px] font-heavy">
        OYIBI · GREATER ACCRA · GHANA
      </div>

      <div className="h-[20px] w-full" />

      <div className="h-[6px] bg-[#1B55A0] w-full absolute bottom-0" />
    </div>
  );
}
