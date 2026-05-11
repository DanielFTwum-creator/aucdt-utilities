import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const accordionItems = [
  { title: 'Levels Of Prosthetic Intervention Provided', content: 'Details regarding the levels of prosthetic intervention provided.' },
  { title: 'Referring a Patient to BionicSkins™', content: 'Steps and requirements for referring a patient.' },
  { title: 'Additional Information', content: 'Any additional details relevant to the referral process.' },
  { title: 'Benefits of Referring Your Patients to BionicSkins™', content: 'The advantages of partnering with BionicSkins for prosthetic care.' },
];

export default function ReferAPatient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex-grow flex flex-col bg-[#F9F9F9]">
      {/* Hero section */}
      <section className="w-full h-[50vh] md:h-[55vh] relative overflow-hidden">
        <img 
          src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/6cd0ccf7-0d7d-4f31-a9cd-c32d115a72ce/Lauren+%26+Eric.png" 
          alt="Clinic Environment" 
          className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-[#1B2A4A]/10"></div>
      </section>

      {/* Blue Band Section */}
      <section className="w-full bg-[#6a879a] relative min-h-[160px] md:min-h-[220px] flex items-center">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `linear-gradient(135deg, #000 25%, transparent 25%), linear-gradient(225deg, #000 25%, transparent 25%), linear-gradient(315deg, #000 25%, transparent 25%), linear-gradient(45deg, #000 25%, transparent 25%)`,
          backgroundPosition: `12px 0, 12px 0, 0 0, 0 0`,
          backgroundSize: `24px 24px`,
          backgroundRepeat: `repeat`
        }}></div>

        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-[45%] lg:w-[40%]"></div>
          <div className="md:w-[55%] lg:w-[60%] flex items-center pt-8 md:pt-0 pb-8 md:pb-0">
             <h2 className="text-3xl md:text-4xl text-white font-sans font-light tracking-wide md:pl-8">
               Your Patients-Our Privilege
             </h2>
          </div>
        </div>
      </section>

      {/* White Content Section */}
      <section className="w-full bg-white relative pb-20">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col md:flex-row">
          <div className="md:w-[45%] lg:w-[40%] relative">
             <div className="relative md:absolute w-[90%] md:w-full max-w-[500px] mx-auto md:mx-0 md:-top-[280px] mt-[-60px] md:mt-0 left-0 lg:left-8 z-20">
                <div className="w-full aspect-[4/5] rounded-[2rem] md:rounded-[3rem] rounded-t-[8rem] md:rounded-t-[14rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative transform hover:-translate-y-2 transition-transform duration-500">
                   <img 
                     src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/76e86cc7-d8b5-40c1-99a6-44457d5e8e79/Advanced+Prosthetic+Alignment+Technology.png?format=2500w"
                     alt="Tablet Application Display"
                     className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
                   />
                </div>
             </div>
             <div className="hidden md:block w-full max-w-[500px] aspect-[4/5] invisible"></div>
          </div>

          <div className="md:w-[55%] lg:w-[60%] pt-16 md:pt-16 pb-12 md:pl-8">
            <div className="max-w-[700px]">
              <p className="text-[#1B2A4A] text-[1.1rem] leading-[2] mb-8 font-sans">
                <span className="italic">BionicSkins™</span> is thrilled to be your <span className="text-[#2F6FA8] font-medium">trusted partner</span> in providing exceptional prosthetic care to your patients. We understand the importance of seamless collaboration between physicians and the prosthetic clinic to ensure the best possible outcomes for patients.
              </p>
              <p className="text-[#1B2A4A] text-[1.1rem] leading-[2] font-sans">
                At <span className="italic">BionicSkins™</span>, we strive to make the referral process as smooth and efficient as possible. Our dedicated team is here to assist you every step of the way, from the initial referral to the fabrication and fitting of the prosthesis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Process Section (Accordion + Form) */}
      <section className="w-full bg-white pb-32">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-[2.5rem] font-sans font-light text-[#2F6FA8] mb-12">Referral Process</h2>
          
          {/* Accordion */}
          <div className="mb-16 border-t border-black">
            {accordionItems.map((item, i) => (
              <div key={i} className="border-b border-black">
                <button 
                  className="w-full py-4 flex justify-between items-center text-left text-[1.1rem] font-sans text-[#2F6FA8] hover:text-[#1B2A4A] transition-colors"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  {item.title}
                  <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }}>
                    <ChevronDown className="text-black" strokeWidth={1} size={24} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pt-2 font-sans text-[#1B2A4A] leading-relaxed">
                        {item.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-[#F0F3F5] rounded-xl p-8 md:p-12 shadow-sm font-sans">
            <form className="space-y-6">
              
              <div className="space-y-2">
                <p className="text-[#4A6478] text-sm font-medium mb-4">Name Of Person To Contact</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#8c9ca8] mb-1">First Name <span className="text-[#a4b1bb]">(required)</span></label>
                    <input type="text" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
                  </div>
                  <div>
                    <label className="block text-xs text-[#8c9ca8] mb-1">Last Name <span className="text-[#a4b1bb]">(required)</span></label>
                    <input type="text" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#4A6478] font-medium mb-1">Email <span className="text-xs text-[#a4b1bb] ml-1">(required)</span></label>
                <input type="email" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
                <div className="flex items-center mt-3 gap-2">
                  <input type="checkbox" id="news" className="w-4 h-4 rounded-sm border-gray-400 cursor-pointer text-[#16426C] focus:ring-[#16426C]" />
                  <label htmlFor="news" className="text-sm text-[#4A6478] cursor-pointer">Sign up for news and updates</label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#4A6478] font-medium mb-1">Phone Contact For Clinician <span className="text-xs text-[#a4b1bb] ml-1">(required)</span></label>
                <input type="tel" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
              </div>

              <div>
                <label className="block text-sm text-[#4A6478] font-medium mb-1">Subject <span className="text-xs text-[#a4b1bb] ml-1">(required)</span></label>
                <input type="text" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
              </div>

              <div>
                <label className="block text-sm text-[#4A6478] font-medium mb-1">Message <span className="text-xs text-[#a4b1bb] ml-1">(required)</span></label>
                <textarea rows={4} className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8] resize-y" required></textarea>
              </div>

              <div>
                <label className="block text-sm text-[#4A6478] font-medium mb-1">Best Time & Day To Contact You <span className="text-xs text-[#a4b1bb] ml-1">(required)</span></label>
                <input type="text" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
              </div>

              <div className="pt-2">
                <button type="submit" className="bg-[#16426C] text-white px-8 py-3 rounded-md font-sans font-medium hover:bg-[#2F6FA8] transition-colors shadow-sm">
                  Refer A Patient
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
