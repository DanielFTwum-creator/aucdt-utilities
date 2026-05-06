import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const values = [
  { title: 'Innovation', content: 'We push the boundaries of computational design and technology to magnify the skills and abilities of our practitioners and empower our patients to live healthier, happier lives.' },
  { title: 'Integrity', content: 'We practice with honesty and transparency, maintaining the highest ethical standards to cultivate trust with our patients and partners.' },
  { title: 'Partnership', content: 'We believe in building lasting relationships with our patients, physicians, and partners — working collaboratively to achieve the best outcomes for every individual we serve.' },
  { title: 'Personalized Care', content: 'Every patient is unique. We use cutting-edge technology and deep clinical expertise to deliver prosthetic solutions tailored precisely to each individual\'s anatomy and lifestyle.' },
  { title: 'Respect', content: 'We treat every patient, colleague, and partner with dignity and compassion, honoring the trust placed in us at every stage of the care journey.' },
];

export default function ValuesAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-frost px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">

        {/* Left: small image + description text below */}
        <div>
          <img
            src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/6cd0ccf7-0d7d-4f31-a9cd-c32d115a72ce/Lauren+%26+Eric.png"
            alt="Our Values"
            className="rounded-[16px] shadow-lg w-full h-[320px] object-cover mb-8 border-4 border-white"
            referrerPolicy="no-referrer"
          />
          <p className="text-[#5F7182] font-sans text-sm leading-relaxed">
            At BionicSkins™, we uphold a set of core values that guide our daily actions and shape our interactions
            with our patients and partners. Innovation, integrity, partnership, personalized care, and respect are the
            pillars of our organization.
          </p>
        </div>

        {/* Right: heading + accordion */}
        <div>
          <h2 className="text-4xl font-bold font-serif text-navy mb-8 tracking-tight focus:outline-none">Our Values</h2>
          {values.map((v, i) => (
            <div key={i} className="border-b border-navy/20">
              <button
                className="w-full py-5 flex justify-between items-center font-sans text-lg font-bold text-navy text-left hover:text-accent transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {v.title}
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} className="shrink-0 ml-4">
                  <ChevronDown size={22} className="text-navy" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pb-6 font-sans text-base text-[#5F7182] leading-relaxed overflow-hidden"
                  >
                    {v.content}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
