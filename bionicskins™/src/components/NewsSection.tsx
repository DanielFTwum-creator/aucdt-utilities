import { Facebook, Instagram, Linkedin, Link as LinkIcon } from 'lucide-react';

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  );
}

const SOCIAL_LINKS = [
  { icon: Facebook,   href: 'https://www.facebook.com/BionicSkins',                                                  label: 'Facebook' },
  { icon: Instagram,  href: 'https://www.instagram.com/bionicskins/',                                                label: 'Instagram' },
  { icon: Linkedin,   href: 'https://www.linkedin.com/company/bionicskins/',                                         label: 'LinkedIn' },
  { icon: TikTokIcon, href: 'https://www.tiktok.com/@bionicskins',                                                   label: 'TikTok' },
  { icon: LinkIcon,   href: 'https://livingwithamplitude.com/article/hugh-herr-bionic-skins-prosthetic-socket-amputees/', label: 'Interview' },
];

const INTERVIEW_URL = 'https://livingwithamplitude.com/article/hugh-herr-bionic-skins-prosthetic-socket-amputees/';

export default function NewsSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 items-start">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-8">

            {/* Heading + social + text */}
            <div>
              <h2 className="text-5xl font-serif text-navy mb-4 tracking-tight">In The News</h2>
              <p className="text-[#2F6FA8] font-sans font-bold text-lg mb-3">Stay in-the-know</p>
              <div className="flex items-center gap-4 mb-5">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="text-[#2A5171] hover:text-prof-blue transition-colors">
                  <Icon size={20} />
                </a>
              ))}
              </div>
              <p className="text-[#6a879a] text-sm leading-relaxed">
                BionicSkins™ is ready to share the news. Our commitment to revolutionizing prosthetics and
                providing unparalleled comfort to our patients is our number one priority. Stay in the know by
                following our social media channels, where we'll keep you updated on our latest advancements,
                patient stories, and industry insights. Join us on this remarkable journey as we redefine the
                future of prosthetics, one step at a time.
              </p>
            </div>

            {/* Wave banner card */}
            <div className="relative">
              {/* Waves extend beyond card on both sides */}
              <svg
                className="absolute top-1/2 -translate-y-1/2 left-[-40px] right-[-40px] w-[calc(100%+80px)] pointer-events-none"
                style={{ height: '160px' }}
                viewBox="0 0 700 160"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {[0,12,24,36,48,60,72,84,96,108,120,132,144].map((offset, i) => (
                  <path
                    key={i}
                    d={`M0,${80 + Math.sin(i) * 15} C175,${30 + offset} 350,${130 - offset} 525,${80 + Math.sin(i) * 15} S700,${30 + offset} 700,${80 + Math.sin(i) * 15}`}
                    fill="none"
                    stroke="#5BA8D6"
                    strokeWidth="0.8"
                    opacity={0.6 - i * 0.04}
                  />
                ))}
              </svg>

              {/* Card */}
              <div className="relative z-10 bg-white/85 backdrop-blur-sm border border-gray-200 rounded-[12px] shadow-sm px-8 py-8 text-center mx-4">
                <h3 className="text-xl font-serif text-navy leading-snug mb-6">
                  Hugh Herr Interviews With Amplitude Magazine To Introduce BionicSkins™
                </h3>
                <a
                  href={INTERVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#16426C] text-white px-7 py-2.5 rounded-[4px] font-sans font-medium text-sm hover:bg-[#2A5171] transition-all duration-300"
                >
                  Read Full Interview Here
                </a>
              </div>
            </div>
          </div>

          {/* ── Right column: article card ── */}
          <div className="rounded-[12px] overflow-hidden border border-gray-200 shadow-md">
            {/* Blue header */}
            <div className="bg-[#2A5171] px-5 py-3 flex items-start justify-between gap-4">
              <p className="text-white text-sm font-sans font-bold uppercase tracking-wide leading-tight">
                Bionic Skins' Scientific Socket Solution
              </p>
              <span className="text-white/60 text-[10px] font-sans shrink-0 pt-0.5">January 30, 2024</span>
            </div>

            {/* Article body */}
            <div className="bg-white p-5 grid grid-cols-[1fr_auto] gap-4">
              {/* Left: text + main image */}
              <div>
                <p className="text-navy font-sans font-semibold text-sm mb-3 leading-snug">
                  Can prosthetic innovator Hugh Herr build a better socket-and-liner system?
                </p>
                <p className="text-[#6a879a] text-xs leading-relaxed mb-4">
                  <strong className="text-navy">This year marks</strong> the 20th anniversary of the patent for
                  the iWalk Knee, one of the first smart prosthetic joints ever invented. At a time when Mark
                  Zuckerberg barely knew his algorithms from his Adam's apple, the iWalk boasted an artificial
                  brain powerful enough to crunch a torrent of data about its wearer's biomechanics, then
                  adjust in real time to integrate seamlessly with each stride.
                </p>
                <img
                  src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/fbcfdfbd-1d76-47b0-8028-b76d0dbea356/hughherr_1920x1080.jpg?format=2500w"
                  alt="Hugh Herr"
                  className="w-full h-36 object-cover object-top rounded"
                  referrerPolicy="no-referrer"
                />
                <p className="text-[#6a879a] text-xs mt-3 leading-relaxed">
                  The device heralded a new era of responsive, interactive artificial limbs. It also helped make
                  the patent-holder…
                </p>
                <a href={INTERVIEW_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-3 text-[#2F6FA8] text-xs font-sans font-medium hover:underline">
                  Read full article →
                </a>
              </div>

              {/* Right: two stacked thumbnails */}
              <div className="flex flex-col gap-2 w-28 shrink-0">
                <div className="rounded overflow-hidden border border-gray-100">
                  <div className="bg-[#1a1a2e] p-1.5 text-center">
                    <p className="text-white text-[8px] font-sans leading-tight">Learn about<br />Running Foot Grants</p>
                  </div>
                  <img
                    src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/76ec0ecd-d141-4f57-9967-7c8f6ad6d718/Bionic+Skin+Prosthetic+Studio.png?format=2500w"
                    alt="Running Foot Grants"
                    className="w-full h-16 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="rounded overflow-hidden border border-gray-100">
                  <div className="bg-white p-1 text-center border-b border-gray-100">
                    <p className="text-[#c0392b] text-[9px] font-sans font-bold tracking-widest">AMPLITUDE</p>
                  </div>
                  <img
                    src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/a2f5acae-97fb-4c82-a62a-35f3ffc5991e/Compassionate+Patient+Care+-+Powered+by+Science+%28Instagram+Post%29.png"
                    alt="Amplitude Magazine"
                    className="w-full h-20 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
