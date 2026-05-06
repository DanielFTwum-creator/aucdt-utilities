import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  Award,
  CheckCircle,
  ArrowRight,
  Globe,
  BookOpen,
  Shield,
  Cpu,
  Cloud,
  BarChart3,
  Megaphone,
  Lightbulb,
  Code2,
  Star,
  ChevronRight,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stats = [
  {
    value: '5+',
    label: 'Years Operating',
    description: 'In Ghana\'s digital education sector',
    icon: Award,
    color: 'techbridge-gold',
  },
  {
    value: '50+',
    label: 'Institution Partnerships',
    description: 'Educational partners across Ghana',
    icon: Building2,
    color: 'techbridge-green',
  },
  {
    value: '15,000+',
    label: 'Students Trained',
    description: 'Ghanaian students through digital programmes',
    icon: Users,
    color: 'techbridge-blue',
  },
  {
    value: '2,400+',
    label: 'Internships Facilitated',
    description: 'Industry placements from 2020 to 2025',
    icon: Briefcase,
    color: 'ghana-red',
  },
  {
    value: '850+',
    label: 'Graduates Placed',
    description: 'In tech roles across Africa and globally',
    icon: Globe,
    color: 'techbridge-gold',
  },
  {
    value: '67%',
    label: 'Salary Growth Rate',
    description: 'Trainees earning 2–3x within 18 months',
    icon: TrendingUp,
    color: 'techbridge-green',
  },
];

const timelineMilestones = [
  {
    year: '2020',
    title: 'Founded',
    description:
      'Launched techbridge.edu.gh with the first 5 partner institutions. Established core digital learning infrastructure and admitted the inaugural student cohort.',
    highlight: 'Foundation Year',
  },
  {
    year: '2021',
    title: 'Growth',
    description:
      'Expanded partnerships to 15 institutions across Ghana. Launched the AI tools hub, giving students access to industry-grade development environments.',
    highlight: '15 Institutions',
  },
  {
    year: '2022',
    title: 'Scale',
    description:
      '5,000+ students trained across programmes. Executed the first major internship cohort with 400+ industry placements in the private sector.',
    highlight: '5,000+ Students',
  },
  {
    year: '2023',
    title: 'Impact',
    description:
      '10,000+ cumulative students trained. Launched ai.techbridge.edu.gh — a dedicated AI learning platform delivering personalised curriculum pathways.',
    highlight: 'AI Platform Live',
  },
  {
    year: '2024',
    title: 'Recognition',
    description:
      'Reached 50+ partner institutions and achieved 98.5% platform uptime — demonstrating enterprise-grade reliability at national scale.',
    highlight: '98.5% Uptime',
  },
  {
    year: '2025',
    title: 'National Readiness',
    description:
      '15,000+ students trained, 2,400+ internships completed, 850+ graduates placed. Techbridge is ready to deliver the One Million Coders Programme.',
    highlight: 'Ready to Scale',
  },
];

const outcomCards = [
  {
    stat: '850+',
    label: 'Graduates Placed',
    body: 'Techbridge graduates are employed in tech roles across Ghana, across Africa, and globally — in companies ranging from Ghanaian startups to international technology firms.',
    icon: Globe,
    accent: 'techbridge-gold',
  },
  {
    stat: '67%',
    label: 'Salary Transformation',
    body: '67% of programme graduates report earning 2–3x their previous salary within 18 months of completing a Techbridge programme — a measurable, life-changing outcome.',
    icon: TrendingUp,
    accent: 'techbridge-green',
  },
  {
    stat: '2,400+',
    label: 'Internships Delivered',
    body: 'Over 2,400 structured internship placements facilitated between 2020 and 2025, connecting Ghanaian talent with industry partners in fintech, healthtech, and agritech.',
    icon: Briefcase,
    accent: 'techbridge-blue',
  },
];

const techPartners = [
  {
    name: 'Google',
    detail: 'Cloud Infrastructure & Developer Tools',
    icon: Cloud,
  },
  {
    name: 'GitHub / Microsoft',
    detail: 'Version Control & DevOps Workflows',
    icon: Code2,
  },
  {
    name: 'AWS',
    detail: 'Scalable Cloud Infrastructure',
    icon: Cpu,
  },
  {
    name: 'MongoDB',
    detail: 'Modern Database Technologies',
    icon: BarChart3,
  },
  {
    name: 'Ghana Tech Ecosystem',
    detail: 'Local Innovation & Industry Partners',
    icon: Building2,
  },
];

const programmes = [
  { title: 'Artificial Intelligence', description: 'Machine learning, neural networks, and practical AI application in real-world Ghanaian contexts.', icon: Cpu },
  { title: 'Cloud Computing', description: 'Hands-on AWS, Google Cloud, and Azure training with industry-recognised certification pathways.', icon: Cloud },
  { title: 'Data Science', description: 'Statistical analysis, data visualisation, and Python-driven insights for business decision-making.', icon: BarChart3 },
  { title: 'Software Development', description: 'Full-stack engineering from fundamentals to deployment — web, mobile, and API development.', icon: Code2 },
  { title: 'Digital Marketing', description: 'SEO, social media strategy, analytics, and growth frameworks for the African digital economy.', icon: Megaphone },
  { title: 'Cybersecurity Fundamentals', description: 'Threat modelling, ethical hacking basics, and security best practices for modern organisations.', icon: Shield },
  { title: 'Entrepreneurship & Innovation', description: 'Lean startup methodology, business model design, and funding pathways for Ghanaian tech founders.', icon: Lightbulb },
];

const testimonials = [
  {
    quote:
      "We integrated Techbridge's platform across our three campuses and the reliability has been exceptional. 98.5% uptime is not a marketing number — our students have experienced it. This is a partner that understands what educational institutions need.",
    name: 'Prof. Abena Mensah-Barimah',
    title: 'Vice Chancellor, Kumasi Institute of Technology',
    role: 'Academic Leader',
  },
  {
    quote:
      'When I enrolled, I was earning minimum wage in a clerical job. Eighteen months after completing the Software Development track, I am a backend engineer at a fintech company in Accra. Techbridge changed the entire trajectory of my life.',
    name: 'Kwame Asante-Doku',
    title: 'Backend Engineer, Accra Fintech Ltd',
    role: 'Programme Graduate',
  },
  {
    quote:
      'We have hired twelve Techbridge graduates over the past two years and every single one has exceeded expectations. Their practical training — especially the internship component — means they contribute from week one. We will continue to partner with Techbridge.',
    name: 'Ama Kyeremeh',
    title: 'Head of Engineering, Volta Digital Solutions',
    role: 'Corporate Partner',
  },
];

export default function TrackRecordPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      <section className="relative bg-techbridge-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-techbridge-blue via-techbridge-navy to-black" />
        </div>
        <div className="absolute top-0 left-0 right-0 flex h-2">
          <div className="flex-1 bg-ghana-red" />
          <div className="flex-1 bg-ghana-gold" />
          <div className="flex-1 bg-ghana-green" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-28 pt-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-techbridge-gold/20 border border-techbridge-gold/40 text-techbridge-gold text-sm font-semibold px-4 py-2 rounded-full mb-6 tracking-wide uppercase"
          >
            <CheckCircle size={14} />
            Proven Track Record
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6"
          >
            Five Years.{' '}
            <span className="text-techbridge-gold">Proven Results.</span>{' '}
            Ghanaian-Built.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed"
          >
            While other vendors propose new platforms, Techbridge has already delivered.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/impact"
              className="inline-flex items-center gap-2 bg-techbridge-gold text-techbridge-navy font-bold px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              View Impact Data
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors"
            >
              Partner with Techbridge
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex h-1">
          <div className="flex-1 bg-ghana-red" />
          <div className="flex-1 bg-ghana-gold" />
          <div className="flex-1 bg-ghana-green" />
        </div>
      </section>

      <section className="bg-techbridge-light py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-techbridge-navy mb-4">
                The Numbers That Matter
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Five years of consistent delivery across Ghana's education sector — every figure independently verifiable.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
                    className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm transition-shadow"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${
                      stat.color === 'techbridge-gold' ? 'bg-yellow-50 text-yellow-500' :
                      stat.color === 'techbridge-green' ? 'bg-green-50 text-green-700' :
                      stat.color === 'techbridge-blue' ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-600'
                    }`}>
                      <Icon size={22} />
                    </div>
                    <div className="font-serif text-5xl font-bold text-techbridge-navy mb-2">
                      {stat.value}
                    </div>
                    <div className="text-base font-bold text-gray-800 mb-1">{stat.label}</div>
                    <div className="text-sm text-gray-500 leading-relaxed">{stat.description}</div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-techbridge-navy mb-4">
                Techbridge's Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A deliberate progression from foundation to national scale — built in Ghana, for Ghana.
              </p>
            </motion.div>
          </AnimatedSection>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-techbridge-gold via-techbridge-blue to-techbridge-green" />
            <div className="space-y-12">
              {timelineMilestones.map((milestone, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className={`relative flex items-start gap-6 md:gap-0 ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-techbridge-gold border-4 border-white shadow-md z-10 mt-1.5" />
                    <div className={`pl-16 md:pl-0 md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <div className="inline-flex items-center gap-2 bg-techbridge-navy text-techbridge-gold text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-widest uppercase">
                        {milestone.year}
                      </div>
                      <h3 className="font-serif text-2xl text-techbridge-navy mb-1">{milestone.title}</h3>
                      <div className="text-xs font-bold text-techbridge-blue uppercase tracking-wider mb-2">{milestone.highlight}</div>
                      <p className="text-gray-600 text-sm leading-relaxed">{milestone.description}</p>
                    </div>
                    <div className="hidden md:block md:w-1/2" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-techbridge-navy py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
                Employment Outcomes
              </h2>
              <p className="text-lg text-blue-200 max-w-2xl mx-auto">
                The ultimate measure of a training institution is what happens after graduation. Techbridge's numbers speak for themselves.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {outcomCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 ${
                      card.accent === 'techbridge-gold' ? 'bg-yellow-500/20 text-techbridge-gold' :
                      card.accent === 'techbridge-green' ? 'bg-green-500/20 text-green-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      <Icon size={22} />
                    </div>
                    <div className="font-serif text-5xl font-bold text-techbridge-gold mb-2">{card.stat}</div>
                    <div className="text-white font-bold text-lg mb-3">{card.label}</div>
                    <p className="text-blue-200 text-sm leading-relaxed">{card.body}</p>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-techbridge-light py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-techbridge-navy mb-4">
                Technology Partnerships
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Techbridge programmes are backed by the world's leading technology platforms — giving Ghanaian learners access to globally recognised skills and certifications.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {techPartners.map((partner, i) => {
                const Icon = partner.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-xl p-6 flex items-start gap-4 border border-gray-100 shadow-sm"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-techbridge-navy flex items-center justify-center">
                      <Icon size={18} className="text-techbridge-gold" />
                    </div>
                    <div>
                      <div className="font-bold text-techbridge-navy text-base mb-1">{partner.name}</div>
                      <div className="text-gray-500 text-sm">{partner.detail}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-techbridge-navy mb-4">
                Programme Breadth
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Techbridge already delivers across seven critical disciplines — the curriculum is battle-tested, not theoretical.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {programmes.map((programme, i) => {
                const Icon = programme.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    whileHover={{ boxShadow: '0 12px 32px rgba(15,37,69,0.12)', y: -4 }}
                    className="group rounded-xl border border-gray-100 bg-techbridge-light p-6 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-techbridge-navy group-hover:bg-techbridge-blue transition-colors flex items-center justify-center mb-4">
                      <Icon size={18} className="text-techbridge-gold" />
                    </div>
                    <h3 className="font-bold text-techbridge-navy text-base mb-2">{programme.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{programme.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-techbridge-light py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-techbridge-navy mb-4">
                What Partners and Graduates Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Outcomes validated by the people who have lived them — institutions, graduates, and employers.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col"
                >
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={14} className="fill-techbridge-gold text-techbridge-gold" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 text-sm leading-relaxed flex-1 mb-6 font-serif text-base">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t border-gray-100 pt-5">
                    <div className="font-bold text-techbridge-navy text-sm">{testimonial.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{testimonial.title}</div>
                    <div className="inline-flex items-center gap-1 bg-techbridge-navy/10 text-techbridge-navy text-xs font-semibold px-2 py-0.5 rounded-full mt-2">
                      {testimonial.role}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-gradient-to-br from-techbridge-navy via-techbridge-blue to-techbridge-navy py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-techbridge-gold/20 border border-techbridge-gold/40 text-techbridge-gold text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
              <BookOpen size={12} />
              The Credential
            </div>
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-8 leading-tight">
              Techbridge is not a proposal.{' '}
              <span className="text-techbridge-gold">We are a proven Ghanaian institution.</span>
            </h2>
            <p className="text-xl text-blue-200 leading-relaxed max-w-3xl mx-auto mb-4">
              With 5 years of delivering results across Ghana's education sector, Techbridge has already demonstrated what others only promise. The One Million Coders Programme deserves a partner who has already done it.
            </p>
            <div className="flex items-center justify-center gap-3 mt-3 mb-12">
              <div className="h-1 w-12 rounded-full bg-ghana-red" />
              <div className="h-1 w-12 rounded-full bg-ghana-gold" />
              <div className="h-1 w-12 rounded-full bg-ghana-green" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/impact"
                  className="inline-flex items-center gap-2 bg-techbridge-gold text-techbridge-navy font-bold px-10 py-4 rounded-xl text-base hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20"
                >
                  View Impact Data
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-10 py-4 rounded-xl text-base hover:border-white hover:bg-white/10 transition-all"
                >
                  Partner with Techbridge
                  <ChevronRight size={18} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
