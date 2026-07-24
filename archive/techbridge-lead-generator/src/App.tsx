import { useState } from 'react';
import './index.css';

// ----------  UI COMPONENTS  ----------
const ProgramCard = ({ icon, title, description, colorClass }) => (
  <div className={`${colorClass} text-white p-6 rounded-2xl text-center transition-transform duration-300 cursor-pointer hover:scale-105 hover:-translate-y-1 border-2`}>
    <div className="text-4xl mb-4">{icon}</div>
    <div className="text-lg font-semibold mb-2 leading-snug">{title}</div>
    <div className="text-sm opacity-90 leading-relaxed">{description}</div>
  </div>
);

const StatItem = ({ number, label }) => (
  <div className="text-center p-5">
    <div className="text-4xl font-bold text-yellow-400 mb-1 tracking-wide">{number}</div>
    <div className="text-sm text-gray-500 uppercase tracking-wider leading-relaxed">{label}</div>
  </div>
);

const FeatureList = () => {
  const features = [
    'Industry-experienced faculty with real-world expertise',
    'State-of-the-art design studios and technology labs',
    'Degree, Diploma & Certificate programmes available',
    'Strategic location in Oyibi-Accra with easy access',
    'Organised programmes with industry partnerships',
    'Flexible learning options including short programmes',
  ];
  return (
    <ul className="list-none mt-5 space-y-3">
      {features.map((feature, idx) => (
        <li key={idx} className="pl-8 relative leading-relaxed">
          <span className="absolute left-0 text-yellow-400 font-bold text-lg">✓</span>
          {feature}
        </li>
      ))}
    </ul>
  );
};

// ----------  CONTACT FORM  ----------
const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async () => {
    setMessage('');
    setStatus('idle');

    if (!email) {
      setMessage('Please enter your email address.');
      setStatus('error');
      return;
    }
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    const phoneText = phone ? `\n\nPhone Number: ${phone}` : '';
    const payload = {
      applicantId: Date.now().toString(),
      fullName: email.split('@')[0],
      message: `Hello TUC Admissions Team,\n\nI am interested in learning more about the programmes offered at Techbridge University College.\n\nPlease provide me with detailed programme information, admission requirements, and financial aid opportunities.\n\nMy contact email: ${email}${phoneText}\n\nBest regards`,
      receiverEmailId: 'admissions@techbridge.edu.gh',
      senderEmailId: email,
      subject: 'Programme Enquiry - TUC Admissions Information Request',
      ccEmailId: 'marketing@techbridge.edu.gh',
    };

    try {
      const res = await fetch('https://portal.techbridge.edu.gh/tuc-dev/emailEnquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(String(res.status));

      setStatus('success');
      setMessage(
        'Thank you! Your enquiry has been sent successfully. Our admissions team will contact you shortly.'
      );
      setEmail('');
      setPhone('');
    } catch {
      setStatus('error');
      setMessage(
        'Sorry, there was an error submitting your enquiry. Please try again or contact us directly.'
      );
    }
  };

  const handleInput = (setter) => (e) => {
    setter(e.target.value);
    if (status !== 'idle') {
      setStatus('idle');
      setMessage('');
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={handleInput(setEmail)}
        placeholder="Enter your email address"
        className="w-full px-5 py-3 rounded-full border-2 border-yellow-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
        disabled={status === 'loading'}
        aria-label="Email address"
      />
      <input
        type="tel"
        value={phone}
        onChange={handleInput(setPhone)}
        placeholder="Enter your phone number (optional)"
        className="w-full px-5 py-3 rounded-full border-2 border-yellow-400 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
        disabled={status === 'loading'}
        aria-label="Phone number"
      />
      <button
        onClick={handleSubmit}
        disabled={status === 'loading'}
        className="w-full max-w-xs mx-auto block bg-yellow-400 text-gray-900 font-semibold uppercase tracking-wide px-8 py-3 rounded-full shadow-lg hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-400/30 transition-all disabled:opacity-50">
        {status === 'loading' ? 'Sending…' : 'Get Info'}
      </button>

      {message && (
        <div
          className={`text-sm font-medium text-center ${
            status === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
          {message}
        </div>
      )}
    </div>
  );
};

// ----------  MAIN PAGE  ----------
export default function App() {
  const programs = [
    {
      icon: '👗',
      title: 'Fashion Design',
      description: 'Create stunning fashion pieces and launch your design career',
      colorClass: 'bg-gradient-to-br from-amber-900 to-amber-700 border-yellow-400',
    },
    {
      icon: '💎',
      title: 'Jewellery Design',
      description: 'Master the art of luxury jewellery and accessory design',
      colorClass: 'bg-gradient-to-br from-green-600 to-green-500 border-yellow-400',
    },
    {
      icon: '📱',
      title: 'Product Design',
      description: 'Design innovative products that solve real-world problems',
      colorClass: 'bg-gradient-to-br from-yellow-500 to-yellow-300 text-gray-900 border-green-600',
    },
    {
      icon: '🎨',
      title: 'Digital Media & Communication',
      description: 'Excel in digital design and modern communication',
      colorClass: 'bg-gradient-to-br from-amber-900 to-amber-700 border-yellow-400',
    },
  ];

  const stats = [
    { number: '60%', label: 'Practice-Based Learning' },
    { number: 'GTEC', label: 'Accredited' },
    { number: 'UEW', label: 'Affiliated' },
  ];

  const scrollToForm = () =>
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-amber-800 p-5 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-amber-900 to-amber-800 text-white p-10 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse top-[20%] left-[20%]"></div>
            <div className="absolute w-3 h-3 bg-white/5 rounded-full animate-pulse top-[40%] right-[20%] animate-delay-2000"></div>
            <div className="absolute w-1 h-1 bg-yellow-400/20 rounded-full animate-pulse bottom-[30%] left-[15%] animate-delay-4000"></div>
            <div className="absolute w-2 h-2 bg-yellow-400/10 rounded-full animate-pulse top-[60%] right-[30%] animate-delay-1000"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-3 tracking-wide">TUC</h1>
            <p className="text-lg opacity-90 mb-6 leading-relaxed">
              Techbridge University College
            </p>
            <button
              onClick={scrollToForm}
              className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-semibold border-2 border-yellow-300 hover:bg-yellow-300 hover:-translate-y-1 hover:shadow-lg transition-all">
              Start Your Creative Journey
            </button>
          </div>
        </div>

        <div className="p-10 space-y-16">
          {/* Programmes */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-700 text-center mb-8 relative">
              Transform Your Creativity Into Career Success
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-yellow-400 to-green-600 rounded"></span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
              {programs.map((p, i) => (
                <ProgramCard key={i} {...p} />
              ))}
            </div>
          </section>

          {/* Why TUC */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-700 text-center mb-8 relative">
              Why Choose TUC?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-yellow-400 to-green-600 rounded"></span>
            </h2>
            <div className="flex justify-around flex-wrap mb-8">
              {stats.map((s, i) => (
                <StatItem key={i} {...s} />
              ))}
            </div>
            <div className="bg-gradient-to-br from-amber-900 to-amber-800 text-white p-8 rounded-2xl border-2 border-yellow-400">
              <h3 className="text-2xl font-semibold text-center mb-6">
                Your Success Is Our Mission
              </h3>
              <FeatureList />
            </div>
          </section>

          {/* CTA + Form */}
          <section
            id="contact-form"
            className="bg-gradient-to-br from-amber-900 via-amber-800 to-green-800 text-white p-10 rounded-2xl border-2 border-yellow-400/30">
            <div className="text-center">
              <h2 className="text-4xl font-semibold text-yellow-400 mb-4">
                Ready to Design Your Future?
              </h2>
              <p className="mb-8 max-w-2xl mx-auto text-gray-200">
                Get detailed programme information sent directly to your inbox.
              </p>
              <div className="max-w-md mx-auto mb-10">
                <ContactForm />
              </div>

              <div className="pt-8 border-t border-white/20 grid md:grid-cols-2 gap-6 text-sm text-gray-200">
                <div>
                  <p className="font-bold text-yellow-400 mb-1">Contact Admissions</p>
                  <p>Email: <a href="mailto:admissions@techbridge.edu.gh" className="underline">admissions@techbridge.edu.gh</a></p>
                  <p>Phone: <a href="tel:+233540124400" className="underline">+233 (0) 54 012 4400</a></p>
                </div>
                <div>
                  <p className="font-bold text-yellow-400 mb-1">Find Us</p>
                  <p>Location: Oyibi (off Adenta-Dodowa Rd)</p>
                  <p>Postal: P. O. Box VV 179, Oyibi – Accra</p>
                  <p>Digital Address: GM-274-6332</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}