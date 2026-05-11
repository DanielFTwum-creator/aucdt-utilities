import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div>
            <a href="#top" className="text-2xl font-serif font-bold tracking-tight text-gray-900 mb-6 block">
              Muniratu<span className="text-orange-500">.</span>
            </a>
            <p className="text-gray-600 mb-6">
              Elevating brands through clarity, simplicity, and impactful design.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-600">
                <Phone className="w-5 h-5 text-orange-500" />
                <span>0598571539</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span>Oyibi, Ghana</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-5 h-5 text-orange-500" />
                <span>hello@muniratu.com</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#top" className="text-gray-600 hover:text-orange-500 transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-600 hover:text-orange-500 transition-colors">About Us</a></li>
              <li><a href="#services" className="text-gray-600 hover:text-orange-500 transition-colors">Services</a></li>
              <li><a href="#projects" className="text-gray-600 hover:text-orange-500 transition-colors">Projects</a></li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Working Hours</h3>
            <p className="text-gray-600 mb-2">Mon - Fri: 9:00AM - 5:00PM</p>
            <p className="text-gray-600">Sat - Sun: Closed</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 Muniratu Portfolio. All rights reserved.</p>
          <p>Designed with ❤️ in Ghana.</p>
        </div>
      </div>
    </footer>
  );
}
