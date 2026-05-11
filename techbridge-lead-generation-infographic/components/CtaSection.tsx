import React, { useCallback, useState } from 'react';
import type { AuditLogEntry } from '../types';

interface CtaSectionProps {
  addAuditLogEntry: (entry: AuditLogEntry) => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ addAuditLogEntry }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleEnquiry = useCallback(async () => {
    if (!email) {
      alert('Please enter your email address to enquire about Techbridge University College programmes.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsSending(true);

    try {
      const emailData = {
        applicantId: Date.now().toString(),
        fullName: email.split('@')[0],
        message: `Hello TUC Admissions Team,\n\nI am interested in learning more about the programmes offered at Techbridge University College.\n\nPlease provide me with detailed programme information, admission requirements, and financial aid opportunities.\n\nMy contact email: ${email}\n\nBest regards`,
        receiverEmailId: "info@aucdt.edu.gh",
        ccEmailId: "marketing@aucdt.edu.gh",
        senderEmailId: email,
        subject: "Programme Enquiry - TUC Admissions Information Request"
      };
      
      const response = await fetch('https://portal.aucdt.edu.gh/aucdt-dev/emailEnquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        alert('Thank you for your interest in TUC! Your enquiry has been sent successfully. Our admissions team will contact you shortly.');
        addAuditLogEntry({ email, timestamp: new Date().toISOString(), status: 'Success' });
        setEmail('');
      } else {
        throw new Error(`Enquiry submission failed: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      addAuditLogEntry({ email, timestamp: new Date().toISOString(), status: 'Failed' });
      alert('Sorry, there was an error submitting your enquiry. Please try again or contact us directly at info@aucdt.edu.gh.');
    } finally {
      setIsSending(false);
    }
  }, [email, addAuditLogEntry]);

  return (
    <section className="bg-gradient-to-br from-[#8B1538] to-[#A52A4A] text-white p-8 rounded-2xl border-2 border-yellow-400 shadow-xl relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-yellow-400/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-yellow-400 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.3)]">
          Ready to Start Your Journey?
        </h2>
        <p className="mt-3 mb-6 max-w-2xl mx-auto opacity-90">
          Enter your email below to receive detailed programme information, admission requirements, and bursary opportunities directly in your inbox.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-grow w-full px-5 py-4 rounded-xl border-2 border-yellow-400/50 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-yellow-500 transition-all duration-300 disabled:opacity-70"
            aria-label="Email for enquiry"
            disabled={isSending}
          />
          <button
            onClick={handleEnquiry}
            disabled={isSending}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-red-800 font-bold uppercase tracking-wide px-8 py-4 rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSending ? 'Sending...' : 'Enquire Now'}
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-left text-sm">
            <div>
                <p className="font-bold text-yellow-400">Contact Admissions</p>
                <p>Email: <a href="mailto:info@aucdt.edu.gh" className="underline hover:text-yellow-300">info@aucdt.edu.gh</a></p>
                <p>Phone: <a href="tel:+233540124400" className="underline hover:text-yellow-300">+233 (0) 54 012 4400</a></p>
            </div>
             <div>
                <p className="font-bold text-yellow-400">Find Us</p>
                <p>Location: Oyibi (off the Adenta – Dodowa Road)</p>
                <p>Postal Address: P. O. Box VV 179, Oyibi – Accra</p>
                <p>Digital Address: GM-274-6332</p>
            </div>
        </div>

      </div>
    </section>
  );
};

export default CtaSection;