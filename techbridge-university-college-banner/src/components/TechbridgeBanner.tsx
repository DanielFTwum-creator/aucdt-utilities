import * as React from "react";
import { useBannerColors } from "../context/ColorContext";

export default function TechbridgeBanner() {
  const { colors, fonts } = useBannerColors();
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty('--b-primary',      colors.primary);
    el.style.setProperty('--b-secondary',    colors.secondary);
    el.style.setProperty('--b-text-primary', colors.textPrimary);
    el.style.setProperty('--b-heading-font', `'${fonts.heading}', sans-serif`);
    el.style.setProperty('--b-body-font',    `'${fonts.body}', sans-serif`);
  }, [colors, fonts]);

  return (
    <div ref={rootRef} className="w-[640px] h-[850px] bg-white relative shadow-2xl border-x border-[#ddd] overflow-hidden font-sans">
      <div className="h-[6px] w-full banner-accent-bar" />

      <div className="py-[24px] text-center w-full banner-header">
        <h1 className="text-[60px] font-black tracking-[16px] leading-tight banner-heading">TECHBRIDGE</h1>
        <div className="text-[24px] font-bold tracking-[8px] mt-1 uppercase leading-tight banner-heading">UNIVERSITY COLLEGE</div>
      </div>

      <div className="text-center text-[19px] font-extrabold mt-[8px] mb-[2px] px-4 leading-tight italic banner-formerly">
        Formerly Asanska University College of Design and Technology
      </div>

      <div className="h-[20px] bg-white w-full" />

      <div className="w-[300px] mx-auto text-center py-2 rounded font-black text-[18px] tracking-[1px] uppercase whitespace-nowrap banner-programmes-bar">
        PROGRAMMES WE OFFER
      </div>

      <div className="px-[40px] pt-[25px]">
        {[
          "BA / Dip. Jewellery Design",
          "BA / Dip. Product Design",
          "B.Tech. Fashion Design",
          "B.Tech. Digital Media & Comm. Design"
        ].map((item, index) => (
          <div key={index} className="flex items-start mb-[15px]">
            <div className="w-[14px] h-[14px] rounded-full mr-[20px] shrink-0 mt-[10px] banner-bullet" />
            <div className="font-extrabold leading-[1.1] text-[32px] banner-programme-name">
              {item}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-[26px] font-black my-[10px] banner-cert-line">
        6-month &amp; 1-year certificates
      </div>

      <div className="w-[580px] mx-auto text-center py-[12px] rounded font-black text-[26px] tracking-[2px] uppercase banner-admissions-bar">
        ADMISSIONS ARE ONGOING
      </div>

      <div className="flex justify-between px-[30px] mt-[15px]">
        <div className="w-[320px] h-[108px] rounded flex flex-col justify-center items-center banner-contact-box">
          <div className="text-[34px] font-black tracking-[1px] leading-tight">054 012 4488</div>
          <div className="text-[34px] font-black tracking-[1px] leading-tight">054 012 4400</div>
          <div className="text-[10px] font-bold tracking-[1.5px] opacity-85 mt-1">MON – FRI · 8:00 AM – 5:00 PM</div>
        </div>
        <div className="w-[240px] h-[108px] rounded bg-white flex flex-col justify-center items-center text-center px-2 banner-apply-box">
          <div className="text-[14px] font-extrabold tracking-[2px] mb-1 banner-apply-label">APPLY ONLINE</div>
          <div className="text-[24px] font-black leading-tight text-center px-4 flex items-center justify-center h-full banner-apply-url">techbridge.edu.gh</div>
        </div>
      </div>

      <div className="text-center text-[11px] font-extrabold tracking-[2px] mt-[20px] banner-location">
        OYIBI · GREATER ACCRA · GHANA
      </div>

      <div className="h-[20px] w-full" />

      <div className="h-[6px] w-full absolute bottom-0 banner-bottom-bar" />
    </div>
  );
}
