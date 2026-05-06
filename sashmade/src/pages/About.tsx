import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, ExternalLink, Clock } from 'lucide-react';

const team = [
  { role: 'Executive Director', name: 'George Kofi Tego', image: '/images/Nana Kofi.jpeg' },
  { role: 'CEO & Founder', name: 'Sharon Akua Begah', image: '/images/Sharon Akua Begah.jpeg' },
  { role: 'Director of Operations', name: 'Stephanie Acquah-Djan', image: '/images/Stephanie.jpeg' },
  { role: 'HR Executive', name: 'Deborah Owusu Afriyie' },
  { role: 'Marketing & Client Relations', name: 'Ursula', image: '/images/Ursula.jpeg' },
  { role: 'Creative Director', name: 'Samuel', image: '/images/Samuel.jpeg' },
  { role: 'IT Executive', name: 'Mandela' },
];

const clients = [
  'Jospong Group of Companies',
  'African Agribusiness Consortium',
  'Zoomlion Ghana',
  'Asanska University',
  'Hallpax',
  'Genero',
  'Envoy Ghana',
  'Akwaaba Trip',
  'Transitions Ghana',
  'Kofih BME',
  'Ceana',
];

const services = [
  {
    title: 'Custom Kente Sash Design & Production',
    description:
      'We design and produce personalised kente sashes for graduations, pageants, church events, awards, and special ceremonies, tailored to your colours, logos, and messages.',
  },
  {
    title: 'Printing & Embroidery Services',
    description:
      'Professional embroidery and printing services on sashes, fabrics, and selected materials, ensuring clear, durable, and elegant finishing for names, logos, and event details.',
  },
  {
    title: 'Kente Cloth Sales',
    description:
      'Authentic and affordable kente cloth in a variety of colours and patterns for individuals, designers, and institutions.',
  },
  {
    title: 'Curated Gift Packages',
    description:
      'Customised gift packages for graduations, birthdays, corporate events, and special occasions, carefully selected and packaged to suit your theme and budget.',
  },
  {
    title: 'Event Planning & Management',
    description:
      'Event coordination and management services, helping to organise ceremonies, celebrations, and special occasions smoothly and professionally.',
  },
];

const coreValues = [
  {
    label: '01',
    title: 'Customer-Centered',
    description:
      'Our customers are at the heart of everything we create. Customization, clear communication, and delivering beyond expectations.',
  },
  {
    label: '02',
    title: 'Integrity & Professionalism',
    description:
      'We operate with honesty, transparency, and accountability — fair pricing, reliable delivery, and ethical sourcing.',
  },
  {
    label: '03',
    title: 'Growth & Empowerment',
    description:
      'We aim to grow not just a brand, but a community — empowering local artisans, investing in skills development.',
  },
  {
    label: '04',
    title: 'Unity in Craft',
    description:
      'We operate as one team with a shared vision — every stitch, design, and delivery reflects collective effort.',
  },
];

/* ─── Shared section heading ─────────────────────────────── */
function SectionHeading({ eyebrow, title, light = false }: { eyebrow: string; title: React.ReactNode; light?: boolean }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-3">
        <div style={{ width: '24px', height: '2px', background: '#E87722', flexShrink: 0 }} />
        <span
          className="font-sans text-[11px] font-medium uppercase tracking-[0.16em]"
          style={{ color: '#E87722' }}
        >
          {eyebrow}
        </span>
      </div>
      <h2
        className="font-serif font-bold leading-[1.05]"
        style={{
          fontSize: 'clamp(28px, 4vw, 44px)',
          letterSpacing: '-0.02em',
          color: light ? '#ffffff' : '#1a1a1a',
        }}
      >
        {title}
      </h2>
    </div>
  );
}

export function About() {
  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="hero-grain relative overflow-hidden"
        style={{ background: '#3d4a35', paddingTop: '80px' }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(3rem, 6vw, 6rem)',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
          className="about-hero-grid"
        >
          {/* Left — flyer image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div
              style={{
                position: 'absolute', inset: '-12px',
                border: '1px solid rgba(232,119,34,0.15)',
                borderRadius: '8px',
                pointerEvents: 'none',
              }}
            />
            <div className="overflow-hidden rounded-lg shadow-2xl" style={{ aspectRatio: '4/5' }}>
              <img
                src="/images/about_flyer.png"
                alt="Get Your Kente Stole at an Affordable Price — SashMade"
                className="w-full h-full object-cover"
                style={{ objectPosition: '50% 20%' }}
              />
            </div>
          </motion.div>

          {/* Right — text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div style={{ width: '24px', height: '2px', background: '#E87722' }} />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: '#E87722' }}>
                Our Story
              </span>
            </div>

            <h1
              className="font-serif font-black text-white leading-[1.0] mb-8"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}
            >
              About<br /><em style={{ color: '#E87722' }}>SashMade</em>
            </h1>

            <div className="space-y-5" style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 300, fontSize: 'clamp(14px, 1.4vw, 16px)', lineHeight: 1.75 }}>
              <p>
                We specialize in transforming your graduation day into a truly memorable and personalized experience.
              </p>
              <p>
                We craft customized stoles that reflect your unique journey and style. Each stole is a canvas for your story, a symbol of your hard work and dedication.
              </p>
              <p>
                Whether you're looking for a touch of elegance, a dash of personality, or a splash of color — we're here to help you celebrate this milestone in your own special way.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-10 mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              {[['12K+', 'Graduates Served'], ['47', 'Countries'], ['500+', 'Designs']].map(([num, label]) => (
                <div key={label}>
                  <div className="font-serif font-bold" style={{ fontSize: '2rem', color: '#E87722', letterSpacing: '-0.02em', lineHeight: 1 }}>{num}</div>
                  <div className="font-sans text-[11px] font-medium uppercase tracking-[0.1em] mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="kente-strip" style={{ position: 'relative', zIndex: 1 }} />
      </section>

      {/* ── FOUNDER'S MESSAGE ────────────────────────────── */}
      <section style={{ background: '#F5F0E8', padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <SectionHeading eyebrow="Founder's Note" title={<>Message from Our <em style={{ fontStyle: 'italic', color: '#3d4a35' }}>Founder</em></>} />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: '#ffffff',
              border: '1px solid rgba(61,74,53,0.12)',
              borderRadius: '4px',
              padding: 'clamp(2rem, 4vw, 3rem)',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(220px, 280px) 1fr',
                gap: 'clamp(1.5rem, 4vw, 2.5rem)',
                alignItems: 'start',
              }}
              className="founder-note-grid"
            >
              <div>
                <div
                  className="overflow-hidden rounded-lg shadow-lg"
                  style={{ aspectRatio: '4 / 5', background: '#e8e3da' }}
                >
                  <img
                    src="/images/Sharon Akua Begah.jpeg"
                    alt="Sharon Akua Begah"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center top' }}
                  />
                </div>
                <div className="mt-4">
                  <p className="font-serif font-bold text-lg" style={{ color: '#3d4a35' }}>
                    Sharon Akua Begah
                  </p>
                  <p className="font-sans text-xs uppercase tracking-[0.14em]" style={{ color: '#E87722' }}>
                    CEO & Founder
                  </p>
                </div>
              </div>

              <blockquote>
                <div
                  className="font-serif"
                  style={{ fontSize: '5rem', color: '#E87722', lineHeight: 0.8, marginBottom: '1.5rem', opacity: 0.6 }}
                >
                  "
                </div>

                <div className="space-y-5 font-sans" style={{ color: 'rgba(26,26,26,0.72)', fontWeight: 300, fontSize: 'clamp(14px, 1.4vw, 16px)', lineHeight: 1.8 }}>
                  <p>
                    Sashmade was never just about fabric, design, or even celebration — it was born from a deeply
                    personal moment. During my Master's journey, I longed for something that could truly represent the
                    years of hard work, the identity we had built as a class, and the pride of reaching that milestone.
                    What I found in the market didn't reflect that depth, that meaning, or that story. So, we created our own.
                  </p>
                  <p>
                    What started as a simple desire to feel seen and represented quickly became something much bigger.
                    The response from other students who felt the same need — who wanted more than just a decorative
                    sash — sparked the beginning of Sashmade.
                  </p>
                  <p>
                    Today, Sashmade stands as a Ghanaian brand rooted in purpose, culture, and craftsmanship. We create
                    premium customised kente sashes that go beyond aesthetics. Every piece is designed to embody
                    achievement, identity, and cultural pride. Each sash carries a story — your story.
                  </p>
                  <p>
                    When I think about the future of Sashmade — what it could become, the lives it could touch — it both
                    excites and humbles me. We have come a long way, and this is only the beginning.
                  </p>
                  <p>Thank you for being part of this journey.</p>
                </div>

                <footer className="mt-8 font-serif font-bold text-lg" style={{ color: '#3d4a35' }}>
                  — Sharon A., Sashmade
                </footer>
              </blockquote>
            </div>

            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px',
              background: 'repeating-linear-gradient(180deg,#C0392B 0px,#C0392B 8px,#C9941A 8px,#C9941A 16px,#2E7D32 16px,#2E7D32 24px)',
              borderRadius: '4px 0 0 4px',
            }} />
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section style={{ background: '#1a1a1a', padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <SectionHeading eyebrow="What We Do" title={<span style={{ color: '#ffffff' }}>Our <em style={{ fontStyle: 'italic', color: '#E87722' }}>Services</em></span>} light />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.07)' }}>
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: '#1a1a1a', padding: '2rem', cursor: 'default' }}
                className="group hover:bg-[#252525] transition-colors duration-200"
              >
                <div
                  className="font-serif font-bold mb-4"
                  style={{ fontSize: '2.5rem', color: 'rgba(232,119,34,0.25)', lineHeight: 1 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3
                  className="font-serif font-bold mb-3"
                  style={{ fontSize: 'clamp(16px, 1.6vw, 20px)', color: '#ffffff', letterSpacing: '-0.01em' }}
                >
                  {service.title}
                </h3>
                <p
                  className="font-sans leading-relaxed"
                  style={{ fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.5)' }}
                >
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="kente-strip mt-16" style={{ maxWidth: '100%' }} />
      </section>

      {/* ── CORE VALUES ──────────────────────────────────── */}
      <section style={{ background: '#3d4a35', padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <SectionHeading eyebrow="What Drives Us" title={<span style={{ color: '#ffffff' }}>Core <em style={{ fontStyle: 'italic', color: '#E87722' }}>Values</em></span>} light />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {coreValues.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  padding: '2rem',
                }}
              >
                <div
                  className="font-serif font-black mb-4"
                  style={{ fontSize: '2rem', color: 'rgba(232,119,34,0.4)', lineHeight: 1 }}
                >
                  {value.label}
                </div>
                <h3 className="font-serif font-bold text-white mb-3" style={{ fontSize: '1.1rem' }}>
                  {value.title}
                </h3>
                <p className="font-sans" style={{ fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────── */}
      <section style={{ background: '#F5F0E8', padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <SectionHeading eyebrow="The People" title={<>The Team Behind <em style={{ fontStyle: 'italic', color: '#3d4a35' }}>Every Weave</em></>} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(61,74,53,0.12)',
                  borderRadius: '4px',
                  padding: '1rem',
                  textAlign: 'center',
                }}
              >
                {member.image ? (
                  <div
                    className="overflow-hidden rounded-lg mb-4"
                    style={{ aspectRatio: '4 / 5', background: '#e8e3da' }}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center top' }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: '52px', height: '52px',
                      background: '#3d4a35',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 1rem',
                    }}
                  >
                    <span className="font-serif font-bold text-xl" style={{ color: '#E87722' }}>
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
                <p className="font-serif font-bold text-sm" style={{ color: '#1a1a1a' }}>{member.name}</p>
                <p className="font-sans text-xs mt-1" style={{ color: 'rgba(26,26,26,0.45)', fontWeight: 400 }}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTS ──────────────────────────────────────── */}
      <section style={{ background: '#1a1a1a', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="flex items-center gap-2 mb-8">
            <div style={{ width: '24px', height: '2px', background: '#E87722' }} />
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: '#E87722' }}>
              Trusted By
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {clients.map((client, i) => (
              <span
                key={i}
                className="font-sans text-sm font-medium"
                style={{
                  padding: '8px 18px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '2px',
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.02em',
                }}
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT & HOURS ──────────────────────────────── */}
      <section style={{ background: '#F5F0E8', padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <SectionHeading eyebrow="Reach Us" title={<>Get in <em style={{ fontStyle: 'italic', color: '#3d4a35' }}>Touch</em></>} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

            {/* Contact card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ ease: [0.16, 1, 0.3, 1] }}
              style={{ background: '#3d4a35', borderRadius: '4px', padding: '2.5rem' }}
            >
              <h3 className="font-serif font-bold text-white mb-6" style={{ fontSize: '1.25rem' }}>Contact</h3>
              <ul className="space-y-4">
                {[
                  { Icon: Phone, text: '0247 139 986', href: 'tel:+233247139986' },
                  { Icon: Mail, text: 'info@sashmade.com', href: 'mailto:info@sashmade.com' },
                  { Icon: Mail, text: 'support@sashmade.com', href: 'mailto:support@sashmade.com' },
                  { Icon: ExternalLink, text: 'Instagram: @sashmade', href: 'https://www.instagram.com/sashmade' },
                  { Icon: ExternalLink, text: 'LinkedIn: Sashmade', href: 'https://www.linkedin.com/company/sashmade/' },
                  { Icon: ExternalLink, text: 'X: @sashwoveit', href: 'https://x.com/sashwoveit' },
                ].map(({ Icon, text, href }) => (
                  <li key={text} className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#E87722' }} />
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-sans text-sm transition-colors"
                      style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 300 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Hours card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: '#ffffff', border: '1px solid rgba(61,74,53,0.12)', borderRadius: '4px', padding: '2.5rem' }}
            >
              <h3 className="font-serif font-bold mb-6 flex items-center gap-2" style={{ fontSize: '1.25rem', color: '#1a1a1a' }}>
                <Clock className="w-5 h-5" style={{ color: '#E87722' }} />
                Opening Hours
              </h3>
              <ul className="space-y-0 font-sans">
                {[
                  { day: 'Monday – Friday', hours: '7:00 AM – 10:00 PM' },
                  { day: 'Saturday', hours: '7:00 AM – 10:00 PM' },
                  { day: 'Sunday', hours: 'Closed' },
                ].map(({ day, hours }, i, arr) => (
                  <li
                    key={day}
                    className="flex justify-between items-center py-4"
                    style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(61,74,53,0.1)' : 'none' }}
                  >
                    <span className="text-sm font-medium" style={{ color: 'rgba(26,26,26,0.7)' }}>{day}</span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: hours === 'Closed' ? '#C0392B' : '#3d4a35' }}
                    >
                      {hours}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="font-sans text-xs mt-6 leading-relaxed" style={{ color: 'rgba(26,26,26,0.45)', fontWeight: 300 }}>
                For a more guided and personalised experience, our client support team is available to help you choose
                the perfect sash design, kente pattern, or gift package.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
