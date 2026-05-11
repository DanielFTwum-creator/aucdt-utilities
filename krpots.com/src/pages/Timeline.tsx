import { motion } from "motion/react";

export default function Timeline() {
  const events = [
    { year: 1982, title: "The First Kiln", desc: "Establishment of the original studio in the valley. Focus on functional stoneware and local clay bodies." },
    { year: 1995, title: "Raku Exploration", desc: "A shift towards experimental firing techniques, embracing unpredictability and dramatic metallic glazes." },
    { year: 2008, title: "Monumental Forms", desc: "Transitioning from functional vessels to large-scale sculptural works, challenging the structural limits of terracotta." },
    { year: 2024, title: "Retrospective", desc: "Culmination of four decades of practice, synthesizing early functional forms with modern sculptural aesthetics." }
  ];

  const timelineImages = [
    "/media/pots-by-kr/IMG_5017.webp",
    "/media/pots-by-kr/IMG_5018.webp",
    "/media/pots-by-kr/IMG_5041.webp",
    "/media/pots-by-kr/IMG_5042.webp",
  ];

  return (
    <div className="w-full max-w-[1000px] mx-auto px-10 py-20" role="main" aria-labelledby="timeline-heading">
      <div className="text-center mb-20">
        <h2 id="timeline-heading" className="font-playfair font-black text-5xl uppercase text-theme-text mb-4">Heritage</h2>
        <p className="font-cormorant italic text-gold-pale text-2xl">A Chronology of Earth</p>
      </div>

      <div className="relative" role="list" aria-label="Timeline of events">
        {/* Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent -translate-x-1/2" aria-hidden="true" />

        {events.map((event, i) => (
          <motion.div 
            key={event.year}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`flex items-center justify-between mb-24 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
            role="listitem"
            aria-labelledby={`event-title-${event.year}`}
          >
            <div className={`w-5/12 ${i % 2 === 0 ? "text-right pr-12" : "text-left pl-12"}`}>
              <h3 id={`event-title-${event.year}`} className="font-playfair font-bold text-3xl text-theme-text mb-3">{event.title}</h3>
              <p className="font-cormorant font-light text-xl text-gold-pale leading-relaxed">{event.desc}</p>
            </div>
            
            <div className="w-2/12 flex justify-center relative z-10" aria-hidden="true">
              <div className="w-24 h-24 rounded-full bg-theme-bg border border-gold flex items-center justify-center shadow-[0_0_30px_rgba(200,168,75,0.15)]">
                <span className="font-bebas text-gold text-3xl tracking-widest">{event.year}</span>
              </div>
            </div>
            
            <div className={`w-5/12 ${i % 2 === 0 ? "pl-12" : "pr-12"}`}>
              <div className="aspect-video border border-theme-border overflow-hidden relative">
                <img 
                  src={timelineImages[i]} 
                  alt={`Photograph representing ${event.title} from ${event.year}`}
                  className="w-full h-full object-cover grayscale-[40%] hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
