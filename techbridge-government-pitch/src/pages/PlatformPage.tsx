import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Server,
  Brain,
  BookOpen,
  Shield,
  Zap,
  Globe,
  GitBranch,
  BarChart2,
  Smartphone,
  Users,
  Award,
  Briefcase,
  ArrowRight,
  Activity,
  Cloud,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

function useCountUp(target: number, suffix: string, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { ref, display: `${count.toLocaleString()}${suffix}` };
}

const pillars = [
  {
    domain: 'techbridge.edu.gh',
    label: 'Main Learning Management System',
    icon: BookOpen,
    color: 'from-techbridge-navy to-techbridge-blue',
    accent: 'border-techbridge-gold',
    description:
      'The primary hub for student enrolment, course delivery, and academic progress management across all partner institutions.',
    stats: [
      { label: 'Active Learners', value: '15,000+' },
      { label: 'Courses Live', value: '200+' },
    ],
    features: [
      'Course catalogue',
      'Student dashboard',
      'Educator portal',
      'Grade management',
    ],
  },
  {
    domain: 'ai-tools.techbridge.edu.gh',
    label: 'AI Tools Hub',
    icon: Zap,
    color: 'from-techbridge-blue to-academic-blue',
    accent: 'border-ghana-green',
    description:
      'A curated suite of AI applications that enhance student productivity, research quality, and learning outcomes.',
    stats: [
      { label: 'AI Tools Available', value: '30+' },
      { label: 'Weekly Active Users', value: '6,500+' },
    ],
    features: [
      'AI writing assistant',
      'Code helpers',
      'Data analysis tools',
      'Research aids',
    ],
  },
  {
    domain: 'ai.techbridge.edu.gh',
    label: 'AI Learning Platform',
    icon: Brain,
    color: 'from-ghana-green to-techbridge-blue',
    accent: 'border-academic-blue',
    description:
      'Advanced adaptive learning powered by AI — delivering personalised academic journeys at scale for every student.',
    stats: [
      { label: 'Learning Paths', value: '500+' },
      { label: 'Avg. Completion Rate', value: '87%' },
    ],
    features: [
      'Personalised learning paths',
      'AI tutor',
      'Skill gap analysis',
      'Competency mapping',
    ],
  },
];

const infraItems = [
  {
    icon: Cloud,
    title: 'Scalable Cloud Architecture',
    desc: 'AWS + Google Cloud dual-provider redundancy ensuring maximum availability across Ghana.',
  },
  {
    icon: Users,
    title: 'Real-Time Collaboration',
    desc: 'Live document editing, group workspaces, and synchronous peer learning tools built in.',
  },
  {
    icon: GitBranch,
    title: 'GitHub Integration',
    desc: 'Native version control workflows connecting student projects to industry-standard repositories.',
  },
  {
    icon: Server,
    title: 'Dev Environments',
    desc: 'Pre-configured, browser-based coding environments matching industry toolchains.',
  },
  {
    icon: BarChart2,
    title: 'Analytics Dashboard',
    desc: 'Institutional-level reporting on learner progress, engagement, and outcome metrics.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-Responsive',
    desc: "Full feature parity on mobile — critical for Ghana's smartphone-first learner base.",
  },
];

const readyItems = [
  'Zero deployment lead time — live today',
  '15,000+ active Ghanaian learners onboarded',
  'Proven 98.5% uptime since 2020',
  'Ghana-specific content and context built in',
  'Local institutional relationships established',
  'Regulatory compliance already achieved',
  'Bilingual and multilingual support ready',
  'Mobile-first UX optimised for Ghanaian networks',
];

const notReadyItems = [
  'Requires 6+ months of platform build time',
  'Needs Ghana-specific customisation from scratch',
  'No proven Ghanaian user base',
  'Untested at national scale',
  'Local partnership and MoU negotiations pending',
  'Compliance and regulatory approval outstanding',
  'Content localisation effort required',
  'Risk of poor mobile performance on local networks',
];

const skillBadges = ['Python', 'Cloud', 'AI', 'Data'];

const metricCards = [
  { target: 8000, suffix: '+', label: 'Concurrent Users', icon: Users },
  { target: 985, suffix: '/1000', label: 'Uptime Score', icon: Activity },
  { target: 50, suffix: '+', label: 'Partner Institutions', icon: Globe },
  { target: 15000, suffix: '+', label: 'Active Learners', icon: Award },
];

function MetricCard({
  target,
  suffix,
  label,
  icon: Icon,
  index,
}: {
  target: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  index: number;
}) {
  const { ref, display } = useCountUp(target, suffix);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="flex flex-col items-center gap-3 rounded-2xl bg-white border border-techbridge-light p-8 shadow-sm"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-techbridge-navy/10">
        <Icon className="w-6 h-6 text-techbridge-navy" />
      </div>
      <span className="text-4xl font-bold text-techbridge-navy font-sans tabular-nums">
        {display}
      </span>
      <span className="text-sm font-medium text-techbridge-blue/80 uppercase tracking-wider text-center">
        {label}
      </span>
    </motion.div>
  );
}

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-techbridge-light font-sans">

      <section className="relative overflow-hidden bg-techbridge-navy">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-1 bg-ghana-red" />
          <div className="absolute top-1 left-0 right-0 h-1 bg-ghana-gold" />
          <div className="absolute top-2 left-0 right-0 h-1 bg-ghana-green" />
        </div>

        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, #FCD116 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1a4b8c 0%, transparent 50%)',
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36 text-center">
          <motion.div
            variants={fadeIn}
            custom={0}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-techbridge-gold/40 bg-techbridge-gold/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-techbridge-gold animate-pulse" />
            <span className="text-techbridge-gold text-sm font-medium tracking-wide">
              Live Infrastructure — Operational Since 2020
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            The Platform —{' '}
            <span className="text-techbridge-gold">Live, Proven,</span>{' '}
            Ghanaian.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="visible"
            className="text-techbridge-light/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            No deployment needed. Techbridge's digital infrastructure is
            operational today, serving thousands of Ghanaian students across
            three integrated platforms.
          </motion.p>
        </div>
      </section>

      <section className="bg-ghana-green">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {[
              { value: '98.5%', label: 'Uptime' },
              { value: '8,000+', label: 'Concurrent Users' },
              { value: 'Live Since 2020', label: 'Proven Track Record' },
              { value: 'Zero', label: 'Downtime During Peak Periods' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                variants={fadeIn}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <Shield className="w-5 h-5 text-ghana-gold shrink-0" />
                <div>
                  <span className="font-bold text-white text-base md:text-lg">
                    {item.value}
                  </span>
                  <span className="text-white/70 text-sm ml-2">{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-techbridge-navy mb-4">
              Three Platforms. One Unified Ecosystem.
            </h2>
            <p className="text-techbridge-blue/70 text-lg max-w-2xl mx-auto">
              Each platform serves a distinct function within Ghana's digital
              education stack — fully integrated and ready to scale nationally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.domain}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  className={`rounded-2xl border-t-4 ${pillar.accent} bg-white shadow-md overflow-hidden flex flex-col`}
                >
                  <div className={`bg-gradient-to-br ${pillar.color} p-8`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white/60 text-xs font-mono uppercase tracking-wider">
                        Platform {i + 1}
                      </span>
                    </div>
                    <h3 className="text-white font-mono text-lg font-semibold mb-1">
                      {pillar.domain}
                    </h3>
                    <p className="text-white/80 text-sm">{pillar.label}</p>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <p className="text-techbridge-blue/70 text-sm leading-relaxed mb-6">
                      {pillar.description}
                    </p>

                    <div className="flex gap-4 mb-6">
                      {pillar.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex-1 rounded-xl bg-techbridge-light p-3 text-center"
                        >
                          <div className="font-bold text-techbridge-navy text-lg">
                            {stat.value}
                          </div>
                          <div className="text-techbridge-blue/60 text-xs mt-0.5">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <ul className="space-y-2 mt-auto">
                      {pillar.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-ghana-green shrink-0" />
                          <span className="text-sm text-techbridge-navy">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-techbridge-light">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-ghana-green bg-ghana-green/10 px-3 py-1 rounded-full mb-4">
                Skill Wallet
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-techbridge-navy mb-5 leading-tight">
                Digital Credentials That Open Doors
              </h2>
              <p className="text-techbridge-blue/70 text-base leading-relaxed mb-8">
                Every learner on the Techbridge platform earns a portable,
                employer-ready Skill Wallet — a verifiable portfolio of
                competencies, certifications, and real project work.
              </p>

              <ul className="space-y-4">
                {[
                  {
                    icon: Award,
                    text: 'Digital credential issuance with blockchain-backed verification',
                  },
                  {
                    icon: Shield,
                    text: "Industry-recognised certifications aligned to Ghana's NQF",
                  },
                  {
                    icon: Briefcase,
                    text: 'Portfolio building across projects and assessments',
                  },
                  {
                    icon: Users,
                    text: 'Employer-facing profiles with searchable skills index',
                  },
                  {
                    icon: Zap,
                    text: 'AI-powered internship matching algorithm',
                  },
                ].map((item, i) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.li
                      key={item.text}
                      variants={fadeUp}
                      custom={i + 1}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-techbridge-navy/10 flex items-center justify-center shrink-0 mt-0.5">
                        <ItemIcon className="w-4 h-4 text-techbridge-navy" />
                      </div>
                      <span className="text-techbridge-navy/80 text-sm leading-relaxed">
                        {item.text}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="w-full max-w-sm">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-techbridge-gold/30">
                  <div className="bg-gradient-to-br from-techbridge-navy to-techbridge-blue px-6 pt-6 pb-10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-techbridge-gold text-xs font-bold uppercase tracking-widest">
                        Techbridge Skill Wallet
                      </span>
                      <Shield className="w-5 h-5 text-techbridge-gold" />
                    </div>
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-full bg-techbridge-gold/20 border-2 border-techbridge-gold/40 flex items-center justify-center mb-3">
                        <span className="text-techbridge-gold font-bold text-lg">
                          AK
                        </span>
                      </div>
                      <h4 className="text-white font-semibold text-lg">
                        Ama Korantema
                      </h4>
                      <p className="text-white/50 text-xs">
                        BSc. Computer Science · Cohort 2025
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {skillBadges.map((badge) => (
                        <span
                          key={badge}
                          className="px-3 py-1 rounded-full bg-techbridge-gold/20 text-techbridge-gold text-xs font-semibold border border-techbridge-gold/30"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-ghana-green animate-pulse" />
                      <span className="text-white/70 text-xs">
                        Credential Level: Advanced Practitioner
                      </span>
                    </div>
                  </div>

                  <div className="bg-white px-6 py-5 flex items-center justify-between">
                    <div>
                      <p className="text-techbridge-navy font-semibold text-sm">
                        Employer-Ready Profile
                      </p>
                      <p className="text-techbridge-blue/50 text-xs mt-0.5">
                        Scan to view verified credentials
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-lg border-2 border-techbridge-navy/20 bg-techbridge-light flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-0.5">
                        {Array.from({ length: 9 }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-3 h-3 rounded-sm ${
                              [0, 2, 6, 8, 4].includes(idx)
                                ? 'bg-techbridge-navy'
                                : 'bg-techbridge-light'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-techbridge-navy mb-4">
              Enterprise-Grade Technical Infrastructure
            </h2>
            <p className="text-techbridge-blue/70 text-lg max-w-xl mx-auto">
              Built to support national-scale deployment from day one.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {infraItems.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  className="rounded-2xl border border-techbridge-light bg-techbridge-light/50 p-6 hover:border-techbridge-blue/30 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-techbridge-navy flex items-center justify-center mb-4">
                    <ItemIcon className="w-5 h-5 text-techbridge-gold" />
                  </div>
                  <h3 className="font-semibold text-techbridge-navy mb-2">
                    {item.title}
                  </h3>
                  <p className="text-techbridge-blue/60 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-techbridge-navy">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
              Ready Now vs. Start From Scratch
            </h2>
            <p className="text-techbridge-light/60 text-lg max-w-xl mx-auto">
              The case for Techbridge is simple: the infrastructure exists,
              the learners are here, and the clock is ticking.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl bg-ghana-green/10 border border-ghana-green/30 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-ghana-green flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">
                  Techbridge Platform
                  <span className="ml-2 text-ghana-green text-sm font-normal">
                    Ready Now
                  </span>
                </h3>
              </div>
              <ul className="space-y-3">
                {readyItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-ghana-green shrink-0 mt-0.5" />
                    <span className="text-techbridge-light/80 text-sm">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl bg-ghana-red/10 border border-ghana-red/30 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-ghana-red flex items-center justify-center shrink-0">
                  <XCircle className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">
                  New Platform Deployment
                  <span className="ml-2 text-ghana-red text-sm font-normal">
                    SmartBridge / Others
                  </span>
                </h3>
              </div>
              <ul className="space-y-3">
                {notReadyItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-ghana-red shrink-0 mt-0.5" />
                    <span className="text-techbridge-light/50 text-sm">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-techbridge-light">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-techbridge-navy mb-4">
              Live Metrics
            </h2>
            <p className="text-techbridge-blue/70 text-lg max-w-xl mx-auto">
              Real numbers from a real platform — not projections.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricCards.map((card, i) => (
              <MetricCard
                key={card.label}
                target={card.target}
                suffix={card.suffix}
                label={card.label}
                icon={card.icon}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-techbridge-navy via-techbridge-blue to-techbridge-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-ghana-red" />
          <div className="absolute bottom-1 left-0 right-0 h-1 bg-ghana-gold" />
          <div className="absolute bottom-2 left-0 right-0 h-1 bg-ghana-green" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-techbridge-gold/20 text-techbridge-gold text-sm font-semibold mb-6 border border-techbridge-gold/30">
              Deployment Timeline: 8 Weeks
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Deploy Nationally{' '}
              <span className="text-techbridge-gold">in 8 Weeks</span>
            </h2>
            <p className="text-techbridge-light/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              The platform is live. The learners are enrolled. The
              infrastructure is proven. All that remains is the national
              mandate to scale Ghana's digital future.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/implementation"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-techbridge-gold text-techbridge-navy font-bold text-base hover:bg-ghana-gold transition-colors"
              >
                View Implementation Plan
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
