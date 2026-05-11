import { motion } from 'motion/react';

export default function Cover() {
  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      {/* Masthead */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center justify-between py-8 px-6 border-b border-rule max-w-[1200px] mx-auto w-full"
      >
        <div className="flex-1">
          <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center">
            <span className="font-bebas text-gold text-xl tracking-widest mt-1">AJM</span>
          </div>
        </div>
        <div className="flex-1 text-center">
          <h1 className="font-playfair font-black text-2xl md:text-3xl tracking-widest uppercase text-cream">Ajumapro</h1>
          <p className="font-bebas text-gold tracking-[0.35em] text-xs md:text-sm mt-1">Tech Consulting</p>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="text-right">
            <p className="font-bebas text-gold tracking-widest text-sm mt-1">Issue 04</p>
            <p className="font-dm text-gold-pale text-[10px] md:text-xs uppercase tracking-wider">Spring 2026</p>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="max-w-[820px] mx-auto pt-20 pb-16 px-6 text-center"
      >
        <p className="font-bebas text-gold tracking-[0.4em] text-sm md:text-lg mb-6 uppercase">The Architecture of Tomorrow</p>
        <h2 className="font-playfair font-black text-5xl md:text-7xl lg:text-8xl leading-[0.92] uppercase text-cream mb-4">
          Student Management
          <br />
          <span className="font-playfair italic text-gold text-6xl md:text-8xl lg:text-9xl lowercase block mt-2">system</span>
        </h2>
        <p className="font-cormorant font-light text-lg md:text-2xl text-cream max-w-2xl mx-auto mt-8 leading-relaxed">
          Engineering the future of Africa through rigorous academics, uncompromising standards, and visionary leadership.
        </p>
      </motion.section>

      {/* Feature Band */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
        className="border-y border-rule bg-ink/50 backdrop-blur-sm"
      >
        <div className="max-w-[820px] mx-auto flex flex-wrap divide-x divide-rule">
          {[
            { icon: "🏛️", label: "Academics", sub: "Rigorous Standards" },
            { icon: "⚙️", label: "Engineering", sub: "Practical Innovation" },
            { icon: "🌍", label: "Impact", sub: "Continental Scale" },
            { icon: "📊", label: "Systems", sub: "Data-Driven" }
          ].map((item, i) => (
            <div key={i} className="flex-1 py-6 px-4 text-center min-w-[150px]">
              <div className="text-2xl mb-2 grayscale opacity-80">{item.icon}</div>
              <h3 className="font-bebas text-gold tracking-[0.2em] text-lg mt-1">{item.label}</h3>
              <p className="font-cormorant italic text-gold-pale text-sm mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Content Grid */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="max-w-[820px] mx-auto py-16 px-6 flex flex-col md:flex-row gap-12 flex-1"
      >
        {/* Sidebar */}
        <aside className="w-full md:w-[220px] shrink-0 flex flex-col gap-12">
          <div>
            <div className="font-bebas text-gold text-6xl leading-none">2026</div>
            <div className="font-dm text-gold-pale text-xs uppercase tracking-widest mt-2 border-t border-rule pt-2">
              Year of the SMS Launch
            </div>
          </div>
          
          <div className="relative">
            <span className="absolute -top-6 -left-4 font-playfair text-6xl text-gold opacity-30 leading-none">"</span>
            <p className="font-cormorant italic text-gold-pale text-xl leading-relaxed relative z-10">
              The School Management System represents a paradigm shift in how we orchestrate academic excellence.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-10">
          {[
            { num: "01", title: "System Architecture", desc: "A robust three-tier foundation built on Django and PostgreSQL." },
            { num: "02", title: "Role-Based Access", desc: "Precision control across nine distinct institutional personas." },
            { num: "03", title: "Academic Integrity", desc: "Automated GPA computations and immutable result workflows." },
            { num: "04", title: "Financial Clearance", desc: "Integrated fee structures and real-time exam access control." }
          ].map((item, i) => (
            <div key={i} className="pl-6 border-l border-gold relative">
              <div className="absolute -left-[1px] top-0 w-[2px] h-8 bg-gold-light"></div>
              <div className="flex items-baseline gap-4 mb-2">
                <span className="font-bebas text-gold-light text-xl tracking-widest">{item.num}</span>
                <h3 className="font-playfair font-bold text-xl md:text-2xl text-cream uppercase tracking-wide">{item.title}</h3>
              </div>
              <p className="font-cormorant italic text-gold-pale text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="border-t border-rule py-6 px-6 mt-auto bg-ink"
      >
        <div className="max-w-[820px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-cormorant italic text-gold-pale text-lg">Student Management System</p>
          <div className="flex gap-6">
            <a href="#/admin" aria-label="Navigate to Admin Portal" title="Admin Portal" className="font-dm text-gold text-xs uppercase tracking-widest hover:text-gold-light transition-colors">Admin Portal</a>
            <a href="#/docs" aria-label="Navigate to Documentation" title="Documentation" className="font-dm text-gold text-xs uppercase tracking-widest hover:text-gold-light transition-colors">Documentation</a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
