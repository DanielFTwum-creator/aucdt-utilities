import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Top Section: Links, Info & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 font-sans">
          
          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-navy mb-6">Contact Us</h3>
            <p className="text-[#6a879a] leading-relaxed">
              209 Burlington Rd, Suite 217,<br />
              Bedford, Massachusetts, 01730
            </p>
            <p className="text-[#6a879a]">
              Email: <a href="mailto:info@bionicskins.com" className="text-navy hover:underline">info@bionicskins.com</a>
            </p>
            <p className="text-[#6a879a]">
              Office Number: <a href="tel:6179327698" className="text-navy hover:underline">(1) 617-932-7698</a>
            </p>
            <p className="text-[#6a879a]">
              Fax Number: (1) 617-518-5455
            </p>
          </div>

          {/* Hours Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-navy mb-6">Hours</h3>
            <p className="text-[#6a879a]">Monday – Friday:</p>
            <p className="text-[#6a879a]">9:00 am - 5:00 pm</p>
            <p className="text-[#6a879a] italic pt-2">By Appointment Only</p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-navy mb-6">Quick Links</h3>
            <div className="flex flex-col space-y-3">
              <Link to="/about" className="text-navy hover:text-accent transition-colors w-fit">About Bionic Skins™</Link>
              <Link to="/technology" className="text-navy hover:text-accent transition-colors w-fit">Our Technology</Link>
              <Link to="/become-a-patient" className="text-navy hover:text-accent transition-colors w-fit">Become A Patient</Link>
              <Link to="/policies" className="text-navy hover:text-accent transition-colors w-fit">Policies</Link>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-navy mb-6">Newsletter</h3>
            <p className="text-[#6a879a] text-sm mb-4">Subscribe to receive news and updates.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="px-4 py-2 border border-gray-200 rounded-[4px] focus:outline-none focus:border-navy"
              />
              <button 
                type="submit" 
                className="bg-accent text-white px-6 py-2 rounded-[4px] font-bold hover:opacity-90 transition-opacity"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full h-[400px] mb-16 rounded-[12px] overflow-hidden shadow-sm grayscale hover:grayscale-0 transition-all duration-700">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1471.954605940502!2d-71.26444589999999!3d42.4852945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e3bb07963db88f%3A0xc3f587fc9f6920e5!2s209%20Burlington%20Rd%2C%20Bedford%2C%20MA%2001730!5e0!3m2!1sen!2sus!4v1712160000000!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Accreditations Section */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 py-12 border-t border-b border-gray-100">
          <img src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/1709222327231-X9V7M8BN3CX60BF3F6G5/American+Board+For+Certification+Prosthetics.png" alt="ABC Prosthetics" className="h-[4.5rem] w-auto opacity-80 hover:opacity-100 transition-opacity" />
          <img src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/1709222327282-VZCGFKFOH1KDXZHRVN1K/American+Orthotic+Prosthetic+Association+AOPA.png" alt="AOPA" className="h-[4.5rem] w-auto opacity-80 hover:opacity-100 transition-opacity" />
          <img src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/1709222327998-4AX7PRY09G0V3K6BC6JD/American+Society+for+Testing+and+Materials.png" alt="ASTM" className="h-[4.5rem] w-auto opacity-80 hover:opacity-100 transition-opacity" />
          <img src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/1709222328000-JGEZ6PWV13SOJTHJTC0S/Board+Of+Certification+Accreditation.png" alt="BOC" className="h-[4.5rem] w-auto opacity-80 hover:opacity-100 transition-opacity" />
          <img src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/1709222328806-G9LUR4M3RNM5QUBYNVS3/The+Academy+AAOP.png" alt="AAOP" className="h-[4.5rem] w-auto opacity-80 hover:opacity-100 transition-opacity" />
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center text-sm text-[#8c9ca8] font-sans">
          &copy; {new Date().getFullYear()} BionicSkins™ All rights reserved.
        </div>
        
      </div>
    </footer>
  );
}
