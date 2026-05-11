import { Link } from 'react-router-dom';
import { Phone, Mail, Calendar, FileText } from 'lucide-react';

export default function BecomeAPatient() {
  return (
    <div className="flex-grow bg-[#F9F9F9]">
      
      {/* Hero */}
      <section className="bg-[#1B2A4A] py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif mb-6 tracking-wide text-[#E8F3FA]">Become A Patient</h1>
        <p className="text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed text-gray-200">
          We are excited to announce that we are now accepting new patients! Our experienced team of professionals is dedicated to providing compassionate and personalized care to individuals seeking advanced prosthetic solutions.
        </p>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Details */}
          <div className="lg:w-1/3 space-y-12">
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-serif text-[#1B2A4A] mb-6 border-b border-gray-100 pb-4">Specialties</h3>
              <ul className="space-y-3 text-[#6a879a] font-medium">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Below knee / Above knee</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Partial Foot / Hand</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Below Elbow / Above Elbow</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Knee Disarticulation</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Wrist Disarticulation</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Elbow Disarticulation</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Syme</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Pediatric</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Myoelectric Upper Extremity Devices</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#2F6FA8]" /> Special Cases</li>
              </ul>
              <p className="text-sm italic text-[#2A5171] mt-6">
                If you find that none of the choices mentioned meet your requirements, kindly reach out to our office for personalized assistance.
              </p>
            </div>

            <div className="bg-[#E8F3FA] p-8 rounded-xl border border-[#D0E2EF]">
              <h3 className="text-2xl font-serif text-[#1B2A4A] mb-4">Accepted Insurance</h3>
              <p className="text-[#4A6478] leading-relaxed">
                We understand that navigating insurance can be complex. Rest assured, we work with a wide range of insurance providers to make your prosthetic care as accessible as possible. To confirm your specific coverage, please don't hesitate to call or email us. It's important to note that insurance coverage can change at any time, so we're always here to help you stay up-to-date.
              </p>
            </div>

          </div>

          {/* Right Column: Steps */}
          <div className="lg:w-2/3">
            <h2 className="text-3xl font-serif text-[#1B2A4A] mb-10">Steps To Become A Patient</h2>
            
            <div className="space-y-8">
              
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-[#1B2A4A] rounded-full flex items-center justify-center text-white shadow-lg">
                  <Phone size={24} />
                </div>
                <div className="pt-2">
                  <h4 className="text-xl font-bold text-[#1B2A4A] mb-3">1. Contact BionicSkins™</h4>
                  <p className="text-[#6a879a] leading-relaxed">
                    Call the office at <a href="tel:6179327698" className="text-[#2F6FA8] font-medium hover:underline">(1) 617-932-7698</a> or email us at <a href="mailto:info@bionicskins.com" className="text-[#2F6FA8] font-medium hover:underline">info@bionicskins.com</a> to begin the process.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-[#2F6FA8] rounded-full flex items-center justify-center text-white shadow-lg">
                  <Calendar size={24} />
                </div>
                <div className="pt-2">
                  <h4 className="text-xl font-bold text-[#1B2A4A] mb-3">2. Schedule an Appointment</h4>
                  <p className="text-[#6a879a] leading-relaxed mb-2">
                    Operating hours are Monday through Friday from 9 AM to 5 PM.
                  </p>
                  <p className="text-[#6a879a] leading-relaxed">
                    Patient visits are by appointment only. Special appointment accommodations may be made on a case-by-case basis. If you need a different appointment time, please let us know and we will do our best to accommodate your needs.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-[#5BA8D6] rounded-full flex items-center justify-center text-white shadow-lg">
                  <FileText size={24} />
                </div>
                <div className="pt-2">
                  <h4 className="text-xl font-bold text-[#1B2A4A] mb-3">3. Provide Necessary Information</h4>
                  <p className="text-[#6a879a] leading-relaxed">
                    Please bring your insurance cards, ID, and prescription to your first appointment. This will help us assist you promptly. Our staff may ask for additional information.
                  </p>
                </div>
              </div>

            </div>

            {/* Link out to resources */}
            <div className="mt-16 pt-10 border-t border-gray-200 text-center bg-white p-8 rounded-lg shadow-sm">
              <h4 className="text-2xl font-serif text-[#1B2A4A] mb-4">Patient Resource Center</h4>
              <p className="text-[#6a879a] max-w-2xl mx-auto mb-6">
                We work to provide different resources for amputees and prosthetic users to help them move better and be more independent. Discover information about prosthetic technology, life post-amputation, and how to care for your prosthetic.
              </p>
              <Link to="/amputee-resources" className="inline-block bg-[#16426C] text-white px-8 py-3 rounded hover:bg-[#2F6FA8] transition-colors font-medium">
                Visit Resource Center
              </Link>
            </div>

          </div>
          
        </div>
      </section>

    </div>
  );
}