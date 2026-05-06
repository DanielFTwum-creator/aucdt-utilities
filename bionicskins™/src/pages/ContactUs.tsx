import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MapPin, Phone, Mail, Clock, FileText } from 'lucide-react';

const contactAccordion = [
  { 
    title: 'Hours', 
    content: 'Our patient appointment hours are Monday - Friday from 9am-5pm. To schedule an appointment, please call 617-932-7698.' 
  },
  { 
    title: 'Parking', 
    content: '- Please refrain from parking under the building in any of the numbered spots, as they are reserved for tenants (unless you require the handicap-designated spaces by the front door).\n- Open and uncovered spots outside the building are available for patient parking.\n- Enter through the front door (directly across from Polatis), located below the 209 Burlington Road Marquee.' 
  },
  { 
    title: 'Suite Access', 
    content: 'Using the Main Staircase:\n- Enter the front door on the ground floor.\n- Proceed straight ahead to the main staircase.\n- Turn right at the top of the stairs.\n- Suite 217 is the first suite on your right.\n\nUsing the Elevator:\n- Enter the elevator in the lobby, located to the left of the main staircase.\n- Press the button for Level 2.\n- Exit the elevator and turn right.\n- Suite 217 is the first suite on your right, past the staircase.' 
  }
];

export default function ContactUs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex-grow bg-[#F9F9F9]">
      
      {/* Header */}
      <section className="bg-[#1B2A4A] py-16 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Contact Us</h1>
      </section>

      <section className="py-16 px-6 max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Info & Accordion */}
          <div className="lg:w-1/2 space-y-10">
            <div>
              <h2 className="text-3xl font-serif text-[#1B2A4A] mb-4">Welcome To BionicSkins™</h2>
              <p className="text-lg text-[#6a879a] leading-relaxed">
                BionicSkins™ is dedicated to providing compassionate patient care and support. We strive to offer a seamless experience for our patients and visitors. If you have any questions, concerns, or need to schedule an appointment, please don't hesitate to contact us. Our friendly and knowledgeable staff is here to assist you in any way we can.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#2F6FA8] mt-1" />
                <div>
                  <h4 className="font-semibold text-[#1B2A4A]">Our Clinic</h4>
                  <p className="text-sm text-[#6a879a]">209 Burlington Rd, Suite 217<br/>Bedford, MA 01730</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-[#2F6FA8] mt-1" />
                <div>
                  <h4 className="font-semibold text-[#1B2A4A]">Phone</h4>
                  <p className="text-sm text-[#6a879a]">(1) 617-932-7698</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-[#2F6FA8] mt-1" />
                <div>
                  <h4 className="font-semibold text-[#1B2A4A]">Email</h4>
                  <p className="text-sm text-[#6a879a]">info@bionicskins.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FileText className="text-[#2F6FA8] mt-1" />
                <div>
                  <h4 className="font-semibold text-[#1B2A4A]">Fax (Prescriptions)</h4>
                  <p className="text-sm text-[#6a879a]">(1) 617-518-5455</p>
                </div>
              </div>
            </div>

            {/* Logistics Accordion */}
            <div className="border-t border-black pt-4 mt-8">
              <h3 className="text-xl font-serif text-[#1B2A4A] mb-4">Visit Logistics</h3>
              {contactAccordion.map((item, i) => (
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
                        <p className="pb-6 pt-2 font-sans text-[#1B2A4A] leading-relaxed whitespace-pre-wrap">
                          {item.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: General Inquiries Form */}
          <div className="lg:w-1/2">
            <div className="bg-[#EEF1F3] rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-serif text-[#1B2A4A] mb-6 border-b border-gray-300 pb-4">General Inquiries</h3>
              <form className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#4A6478] mb-1">First Name <span className="text-[#a4b1bb]">(required)</span></label>
                    <input type="text" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
                  </div>
                  <div>
                    <label className="block text-sm text-[#4A6478] mb-1">Last Name <span className="text-[#a4b1bb]">(required)</span></label>
                    <input type="text" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#4A6478] mb-1">Email <span className="text-xs text-[#a4b1bb] ml-1">(required)</span></label>
                  <input type="email" className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8]" required />
                </div>

                <div>
                  <label className="block text-sm text-[#4A6478] mb-1">Message <span className="text-xs text-[#a4b1bb] ml-1">(required)</span></label>
                  <textarea rows={5} className="w-full border border-gray-400 rounded-sm bg-white px-3 py-2 outline-none focus:border-[#2F6FA8] resize-y" required></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" className="bg-[#16426C] text-white px-8 py-3 rounded-md font-sans font-medium hover:bg-[#2F6FA8] transition-colors w-full">
                    Submit Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </section>

      {/* Google Maps Embed */}
      <section className="w-full h-[450px] border-t border-gray-200">
        <iframe
          title="BionicSkins™ Location"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2944.2!2d-71.2740!3d42.4930!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e39f6f4e5f5b5f%3A0x0!2s209+Burlington+Rd%2C+Bedford%2C+MA+01730!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
        />
      </section>

    </div>
  );
}