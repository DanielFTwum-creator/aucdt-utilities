import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Users, Building2, Clock, TrendingUp } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const floatCard = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="font-sans">
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-techbridge-navy">
        <div className="absolute top-0 left-0 right-0 flex h-2 z-10">
          <div className="flex-1 bg-ghana-red" />
          <div className="flex-1 bg-ghana-gold" />
          <div className="flex-1 bg-ghana-green" />
        </div>

        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse at 70% 40%, #1a4b8c 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, #006B3F 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-4xl"
          >
            <motion.p
              variants={fadeUp}
              className="text-techbridge-gold font-semibold uppercase tracking-widest text-sm mb-6"
            >
              Techbridge Education Services Ghana
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl lg:text-7xl font-bold text-white leading-tight mb-8"
            >
              Ghana's Digital Skills Partner —{' '}
              <span className="text-techbridge-gold">Ready Now.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl lg:text-2xl text-slate-300 leading-relaxed mb-4 max-w-3xl"
            >
              The One Million Coders Programme deserves a partner already operating at scale in Ghana.
              Techbridge is Ghanaian-led, locally accountable, and ready to deploy within 8 weeks.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-base text-slate-400 mb-12 max-w-2xl"
            >
              Submitted to the Ministry of Communications &amp; Digitalization, Presidential Special
              Initiatives, Youth &amp; Employment Agency, and Ghana Digital Centre.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-20">
              <Link
                to="/platform"
                className="inline-flex items-center gap-2 bg-techbridge-gold text-techbridge-navy font-bold px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors duration-200 text-base"
              >
                See the Platform
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white hover:text-techbridge-navy transition-colors duration-200 text-base"
              >
                Government Partnership
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl"
          >
            {[
              { label: '8 Weeks to Deploy', icon: Clock, accent: 'text-techbridge-gold' },
              { label: '15,000+ Students Trained', icon: Users, accent: 'text-ghana-green' },
              { label: '50+ Institutions', icon: Building2, accent: 'text-techbridge-blue' },
            ].map(({ label, icon: Icon, accent }) => (
              <motion.div
                key={label}
                variants={floatCard}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 flex items-center gap-4"
              >
                <Icon className={`w-8 h-8 flex-shrink-0 ${accent}`} />
                <span className="text-white font-semibold text-sm lg:text-base">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-techbridge-green py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white font-semibold text-base lg:text-lg text-center sm:text-left">
            The One Million Coders Programme selection window is open.{' '}
            <span className="text-techbridge-gold">Techbridge is operational today.</span>
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-techbridge-gold text-techbridge-navy font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
          >
            Engage Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-techbridge-navy mb-4">
              Why Techbridge Over Foreign Vendors
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              International vendors bring global scale but no local accountability. Techbridge brings
              both — built for Ghana, by Ghanaians.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Local Accountability',
                body: 'Ghanaian-founded and operated. Profits stay in Ghana. Our leadership team is answerable to Ghanaian institutions, ministries, and the communities we serve — not a foreign board.',
                icon: Building2,
                border: 'border-ghana-green',
                iconColor: 'text-ghana-green',
              },
              {
                title: 'Platform Ready Now',
                body: 'techbridge.edu.gh already serves 8,000+ concurrent users. Infrastructure, content, and support teams are operational today — no setup delay, no pilot phase required.',
                icon: TrendingUp,
                border: 'border-techbridge-blue',
                iconColor: 'text-techbridge-blue',
              },
              {
                title: '8-Week Deployment',
                body: 'International vendors typically require 6+ months to configure, localise, and staff. Techbridge can onboard the first cohort of One Million Coders within 8 weeks of contract signing.',
                icon: Clock,
                border: 'border-ghana-gold',
                iconColor: 'text-academic-amber',
              },
            ].map(({ title, body, icon: Icon, border, iconColor }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className={`bg-techbridge-light rounded-2xl p-8 border-t-4 ${border}`}
              >
                <Icon className={`w-10 h-10 mb-5 ${iconColor}`} />
                <h3 className="font-serif text-2xl font-bold text-techbridge-navy mb-3">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-techbridge-navy py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-4">
              Credentials at a Glance
            </h2>
            <p className="text-slate-400 text-lg">
              Proven impact across Ghana's education and employment ecosystem.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { stat: '5+', label: 'Years in Ghana', sub: 'Established 2019' },
              { stat: '50+', label: 'Partner Institutions', sub: 'Universities, polytechnics, TVETs' },
              { stat: '15,000+', label: 'Students Trained', sub: 'Active platform users' },
              { stat: '2,400+', label: 'Internships Facilitated', sub: 'Industry placements' },
            ].map(({ stat, label, sub }) => (
              <motion.div
                key={label}
                variants={floatCard}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-white/10 border border-white/20 rounded-2xl p-8 text-center"
              >
                <p className="font-serif text-5xl font-bold text-techbridge-gold mb-2">{stat}</p>
                <p className="text-white font-semibold text-lg mb-1">{label}</p>
                <p className="text-slate-400 text-sm">{sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-techbridge-navy mb-4">
              Programme Alignment
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Techbridge's mandate maps directly to the priorities of Ghana's national digital
              transformation agenda.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                programme: 'One Million Coders Programme',
                points: [
                  'Scalable curriculum for 1M+ learners',
                  'Regional delivery centres across Ghana',
                  'Industry-validated credentials',
                  'Employer linkage and placement pipeline',
                ],
              },
              {
                programme: 'Ghana Digital Transformation Agenda',
                points: [
                  'Local digital infrastructure investment',
                  'Ghanaian talent pipeline for tech sector',
                  'Data residency and sovereignty compliant',
                  'Integration with Ghana.gov digital systems',
                ],
              },
              {
                programme: 'Ministry of Communications & Digitalization',
                points: [
                  'Alignment with National ICT Policy 2025',
                  'Support for Digital Skills for All initiative',
                  'Rural and peri-urban access programmes',
                  'Reporting and compliance frameworks ready',
                ],
              },
            ].map(({ programme, points }) => (
              <motion.div
                key={programme}
                variants={fadeUp}
                className="bg-techbridge-light rounded-2xl p-8"
              >
                <h3 className="font-serif text-xl font-bold text-techbridge-navy mb-6 leading-snug">
                  {programme}
                </h3>
                <ul className="space-y-3">
                  {points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-ghana-green flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-techbridge-green py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
              Techbridge is ready to deliver in 8 weeks.
            </h2>
            <p className="text-green-200 text-xl mb-12 max-w-2xl mx-auto">
              Let's build Ghana's digital workforce together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/why-techbridge"
                className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white hover:text-techbridge-green transition-colors duration-200 text-base"
              >
                Why Techbridge
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-techbridge-gold text-techbridge-navy font-bold px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors duration-200 text-base"
              >
                Start Partnership Conversation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
