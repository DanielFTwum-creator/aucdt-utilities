import { motion } from "motion/react";

export default function Contact() {
  return (
    <div className="w-full max-w-[1000px] mx-auto px-10 py-20 flex gap-16" role="main" aria-labelledby="contact-heading">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-1/2"
      >
        <h2 className="font-bebas text-gold tracking-[0.4em] text-xl mb-4 uppercase" aria-hidden="true">Enquiries</h2>
        <h1 id="contact-heading" className="font-playfair font-black text-5xl text-theme-text mb-8 leading-none">Acquisitions &<br/>Commissions</h1>
        <p className="font-cormorant font-light text-xl text-gold-pale leading-relaxed mb-12">
          For information regarding available pieces, exhibition loans, or private studio visits, please submit your details.
        </p>

        <div className="space-y-8">
          <section aria-labelledby="location-heading">
            <h4 id="location-heading" className="font-dmsans font-medium text-gold text-xs uppercase tracking-[0.2em] mb-2">Studio Location</h4>
            <address className="font-cormorant text-xl text-theme-text not-italic">The Old Kiln, Valley Road<br/>Ceramic District, 10024</address>
          </section>
          <section aria-labelledby="email-heading">
            <h4 id="email-heading" className="font-dmsans font-medium text-gold text-xs uppercase tracking-[0.2em] mb-2">Direct Contact</h4>
            <p className="font-cormorant text-xl text-theme-text"><a href="mailto:archive@krpots.com" className="hover:text-gold transition-colors" aria-label="Email archive@krpots.com">archive@krpots.com</a></p>
          </section>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="w-1/2 bg-theme-bg/50 border border-theme-border p-10 backdrop-blur-sm"
      >
        <form className="space-y-6" aria-label="Contact form">
          <div>
            <label htmlFor="contact-name" className="block font-dmsans font-medium text-gold text-xs uppercase tracking-[0.2em] mb-2">Name</label>
            <input id="contact-name" type="text" required aria-required="true" className="w-full bg-transparent border-b border-theme-border text-theme-text font-cormorant text-xl py-2 focus:outline-none focus:border-gold transition-colors" />
          </div>
          <div>
            <label htmlFor="contact-email" className="block font-dmsans font-medium text-gold text-xs uppercase tracking-[0.2em] mb-2">Email</label>
            <input id="contact-email" type="email" required aria-required="true" className="w-full bg-transparent border-b border-theme-border text-theme-text font-cormorant text-xl py-2 focus:outline-none focus:border-gold transition-colors" />
          </div>
          <div>
            <label htmlFor="contact-subject" className="block font-dmsans font-medium text-gold text-xs uppercase tracking-[0.2em] mb-2">Subject</label>
            <select id="contact-subject" className="w-full bg-transparent border-b border-theme-border text-theme-text font-cormorant text-xl py-2 focus:outline-none focus:border-gold transition-colors appearance-none">
              <option className="bg-theme-bg text-theme-text">Piece Acquisition</option>
              <option className="bg-theme-bg text-theme-text">Exhibition Enquiry</option>
              <option className="bg-theme-bg text-theme-text">General Contact</option>
            </select>
          </div>
          <div>
            <label htmlFor="contact-message" className="block font-dmsans font-medium text-gold text-xs uppercase tracking-[0.2em] mb-2">Message</label>
            <textarea id="contact-message" rows={4} required aria-required="true" className="w-full bg-transparent border-b border-theme-border text-theme-text font-cormorant text-xl py-2 focus:outline-none focus:border-gold transition-colors resize-none"></textarea>
          </div>
          <button type="submit" className="w-full bg-gold text-ink font-bebas tracking-[0.25em] text-lg uppercase py-4 hover:bg-gold-light transition-colors mt-4" aria-label="Submit enquiry">
            Send Enquiry
          </button>
        </form>
      </motion.div>
    </div>
  );
}
