import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Brain,
  Cloud,
  BarChart2,
  Code2,
  UserCheck,
  BookOpen,
  Briefcase,
  MapPin,
  Target,
  CheckCircle,
  ArrowRight,
  Users,
} from 'lucide-react'

const EASE = 'easeOut' as const

function inView(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay, ease: EASE },
  }
}

function onMount(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: EASE },
  }
}

const tracks = [
  {
    icon: Brain,
    title: 'Artificial Intelligence & Machine Learning',
    description:
      'Hands-on curriculum covering supervised and unsupervised learning, neural networks, NLP, and responsible AI deployment using Python, TensorFlow, and Hugging Face.',
    accent: 'bg-techbridge-blue',
  },
  {
    icon: Cloud,
    title: 'Cloud Computing',
    description:
      'Practical training on Google Cloud Platform and AWS — compute, storage, serverless, containers, and cloud architecture — leading to vendor certifications.',
    accent: 'bg-techbridge-green',
  },
  {
    icon: BarChart2,
    title: 'Data Science & Analytics',
    description:
      'Industry-relevant data pipelines, statistical analysis, visualisation with Power BI and Tableau, SQL, and Python-based data engineering for real-world datasets.',
    accent: 'bg-ghana-red',
  },
  {
    icon: Code2,
    title: 'Software Development & DevOps',
    description:
      'Full-stack development, version control with GitHub, CI/CD pipelines, containerisation with Docker and Kubernetes, and agile delivery practices.',
    accent: 'bg-academic-navy',
  },
]

const steps = [
  {
    number: '01',
    icon: UserCheck,
    title: 'Enrol',
    description:
      'Students at partner universities register through techbridge.edu.gh, select their technology track, and receive access to the Techbridge learning environment.',
  },
  {
    number: '02',
    icon: BookOpen,
    title: 'Learn & Build',
    description:
      'Project-based learning using real industry tools — GitHub, AWS, MongoDB, and Google Cloud — with structured cohorts, weekly deliverables, and industry mentors.',
  },
  {
    number: '03',
    icon: Briefcase,
    title: 'Get Certified & Employed',
    description:
      'Earn verifiable Skill Wallet credentials upon completion, enter the internship placement pipeline, and get matched to hiring partners across Ghana and globally.',
  },
]

const regions = [
  { name: 'Greater Accra', institutions: 18 },
  { name: 'Ashanti', institutions: 14 },
  { name: 'Western', institutions: 6 },
  { name: 'Eastern', institutions: 5 },
  { name: 'Northern', institutions: 4 },
  { name: 'Volta', institutions: 3 },
  { name: 'Central', institutions: 3 },
  { name: 'Brong-Ahafo', institutions: 3 },
]

const targets = [
  {
    year: 'Year 1',
    students: '50,000',
    universities: '30 universities',
    colour: 'border-techbridge-gold',
    bg: 'bg-techbridge-gold/10',
  },
  {
    year: 'Year 2',
    students: '150,000',
    universities: '50 universities',
    colour: 'border-techbridge-green',
    bg: 'bg-techbridge-green/10',
  },
  {
    year: 'Year 3',
    students: '300,000',
    universities: 'All accredited institutions',
    colour: 'border-techbridge-blue',
    bg: 'bg-techbridge-blue/10',
  },
  {
    year: 'Year 5',
    students: '1,000,000',
    universities: 'National milestone',
    colour: 'border-ghana-red',
    bg: 'bg-ghana-red/10',
  },
]

const partners = [
  { name: 'Google Cloud', bg: 'bg-white', text: 'text-techbridge-navy' },
  { name: 'GitHub', bg: 'bg-gray-900', text: 'text-white' },
  { name: 'Microsoft', bg: 'bg-techbridge-blue', text: 'text-white' },
  { name: 'Amazon Web Services', bg: 'bg-amber-400', text: 'text-gray-900' },
  { name: 'MongoDB', bg: 'bg-green-700', text: 'text-white' },
]

const experientialFeatures = [
  "Real project work on live industry briefs and open-source contributions",
  "Industry mentors from Ghana's leading tech companies and global firms",
  'Collaborative development environments mirroring professional workflows',
  'Portfolio-building assessments that produce tangible, shareable artefacts',
  'Internship placement pipeline with vetted employer partners',
  'Peer cohort system fostering collaboration, accountability, and community',
]

const skillWalletItems = ['Project Portfolio', 'Certification Badge', 'Employer Match Score', 'Internship Placement']

export default function ProgrammePage() {
  return (
    <div className="font-sans bg-white text-techbridge-navy">

      <section className="relative bg-techbridge-navy overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-2 flex">
            <div className="flex-1 bg-ghana-red" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-green" />
          </div>
        </div>
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 40%, #FCD116 0%, transparent 60%)' }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-24">
          <motion.div
            {...onMount(0)}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-techbridge-gold/40 bg-techbridge-gold/10"
          >
            <span className="w-2 h-2 rounded-full bg-techbridge-gold animate-pulse" />
            <span className="text-techbridge-gold text-sm font-medium tracking-wide">
              Government of Ghana Initiative
            </span>
          </motion.div>

          <motion.h1
            {...onMount(0.1)}
            className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight max-w-4xl mb-6"
          >
            The One Million Coders Programme
            <span className="block text-techbridge-gold mt-1">Delivered by Techbridge</span>
          </motion.h1>

          <motion.p
            {...onMount(0.2)}
            className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed mb-10"
          >
            Ghana's national digital skills initiative, implemented through Techbridge's
            local-first experiential learning ecosystem — equipping one million young
            Ghanaians with the coding and technology skills needed to compete in the global economy.
          </motion.p>

          <motion.div
            {...onMount(0.3)}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/platform"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-techbridge-gold text-techbridge-navy font-semibold hover:bg-yellow-300 transition-colors"
            >
              Explore the Platform <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Partner with Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 2 + 7: National Context & Opportunity */}
      <section className="py-20 bg-techbridge-light">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="max-w-3xl mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-techbridge-navy mb-5">
              Background &amp; National Context
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Ghana faces a structural digital skills deficit at a pivotal moment in its economic
              development. With a youth population of over 15 million and 46% of 15–35 year-olds
              classified as unemployed or underemployed, the inability to access formal technology
              training represents both a crisis and an opportunity.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              The Government of Ghana's One Million Coders Programme is a flagship national
              initiative designed to equip young Ghanaians — particularly at tertiary level — with
              critical coding, cloud, data, and AI skills demanded by the global digital economy.
              Techbridge proposes to implement this programme through a proven, locally-operated
              experiential learning ecosystem already serving 15,000+ active learners.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { stat: '15M+', label: 'Youth Population', sub: 'Ages 15–35 in Ghana' },
              { stat: '46%', label: 'Youth Underemployment', sub: 'Formal sector skills gap' },
              { stat: '3.2%', label: 'GDP Uplift Potential', sub: 'From digital skills investment' },
              { stat: '$4.2B', label: 'Digital Economy Target', sub: 'Ghana 2030 agenda' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                {...inView(i * 0.08)}
                className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm"
              >
                <div className="font-serif text-4xl font-bold text-techbridge-blue mb-1">{item.stat}</div>
                <div className="font-semibold text-techbridge-navy text-sm mb-1">{item.label}</div>
                <div className="text-gray-500 text-xs">{item.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: National Opportunity */}
      <section className="py-16 bg-ghana-green">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              The National Opportunity for Ghana's Digital Workforce
            </h2>
            <p className="text-green-100 max-w-2xl mx-auto text-lg">
              Training one million Ghanaians in digital skills is not just a social policy — it
              is the single highest-return economic investment available to Ghana today.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Employment Creation',
                body: 'Every 100 software developers trained creates an estimated 40 additional indirect jobs in the Ghanaian economy through supplier and demand effects.',
                accent: 'border-techbridge-gold',
              },
              {
                title: 'Export Revenue',
                body: 'Ghana\'s technology services export market could reach $1.2B annually by 2030 if a skilled workforce pipeline is established at national scale now.',
                accent: 'border-white',
              },
              {
                title: 'Import Substitution',
                body: 'Ghana currently spends $800M+ annually on foreign technology services. A domestically-skilled workforce recaptures this spend inside the Ghanaian economy.',
                accent: 'border-techbridge-gold',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                {...inView(i * 0.1)}
                className={`bg-white/10 border-t-4 ${card.accent} rounded-xl p-7 text-white`}
              >
                <h3 className="font-serif text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-green-100 text-sm leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-techbridge-navy mb-3">
              The 4 Core Technology Tracks
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every track is designed around industry standards, certification pathways, and
              real-world project outcomes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {tracks.map((track, i) => {
              const Icon = track.icon
              return (
                <motion.div
                  key={track.title}
                  {...inView(i * 0.08)}
                  className="flex gap-5 p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <div className={`shrink-0 w-12 h-12 rounded-xl ${track.accent} flex items-center justify-center`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-techbridge-navy text-lg mb-2">{track.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{track.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-techbridge-navy">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              The Experiential Learning Model
            </h2>
            <p className="text-blue-200 max-w-xl mx-auto">
              A three-step journey from registration to employment — powered by real tools and
              verified outcomes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-techbridge-gold/30" />

            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  {...inView(i * 0.1)}
                  className="relative text-center"
                >
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-techbridge-blue border-2 border-techbridge-gold mb-6">
                    <Icon size={28} className="text-techbridge-gold" />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-techbridge-gold text-techbridge-navy text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-3">
                    Step {step.number}: {step.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed text-sm">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 11 + 13: Scope of Work & Project Lifecycle */}
      <section className="py-20 bg-techbridge-light">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-techbridge-navy mb-3">
              Scope of Work &amp; Project Lifecycle
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Each learner follows a structured project lifecycle — from onboarding through to
              employer-ready certification. Every stage produces a measurable, verified outcome.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-techbridge-gold via-techbridge-green to-techbridge-blue" />

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  phase: '01',
                  title: 'Enrolment & Track Selection',
                  detail: 'Student registers via techbridge.edu.gh, selects technology track, and completes diagnostic assessment to place into appropriate cohort.',
                  colour: 'bg-techbridge-gold',
                  textAccent: 'text-techbridge-gold',
                },
                {
                  phase: '02',
                  title: 'Foundations Module',
                  detail: 'Core concepts, tools setup, version control (GitHub), and collaborative workflow training. Assessed via hands-on practical tasks.',
                  colour: 'bg-techbridge-blue',
                  textAccent: 'text-techbridge-blue',
                },
                {
                  phase: '03',
                  title: 'Industry Project Sprint',
                  detail: 'Cohort works on a real industry brief — sourced from Techbridge employer partners — under the guidance of a sector mentor.',
                  colour: 'bg-ghana-green',
                  textAccent: 'text-ghana-green',
                },
                {
                  phase: '04',
                  title: 'Assessment & Credential',
                  detail: 'External assessors evaluate project deliverables. Successful learners receive a Techbridge Skill Wallet badge and certification record.',
                  colour: 'bg-academic-amber',
                  textAccent: 'text-academic-amber',
                },
                {
                  phase: '05',
                  title: 'Placement Pipeline',
                  detail: 'Graduates enter the Techbridge employer matching algorithm — connected to internship openings, graduate roles, and freelance opportunities.',
                  colour: 'bg-ghana-red',
                  textAccent: 'text-ghana-red',
                },
              ].map((phase, i) => (
                <motion.div
                  key={phase.phase}
                  {...inView(i * 0.1)}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className={`w-12 h-12 rounded-full ${phase.colour} flex items-center justify-center mb-4 shadow-lg z-10`}>
                    <span className="text-white font-bold text-sm">{phase.phase}</span>
                  </div>
                  <h4 className={`font-semibold ${phase.textAccent} text-sm mb-2 leading-tight`}>{phase.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{phase.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            {...inView(0.2)}
            className="mt-12 bg-white rounded-2xl border border-gray-200 p-7 shadow-sm"
          >
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              {[
                { label: 'Programme Duration', value: '12–16 weeks per cohort' },
                { label: 'Cohort Cadence', value: '4 intakes per year nationally' },
                { label: 'Delivery Mode', value: 'Blended online + on-campus labs' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="font-serif text-xl font-bold text-techbridge-navy mb-1">{item.value}</div>
                  <div className="text-gray-500 text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-techbridge-navy mb-3">
              Partner University Coverage
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Techbridge operates across Ghana's university ecosystem — with active partnerships
              at more than 50 accredited tertiary institutions spanning every major region.
            </p>
          </motion.div>

          <motion.div
            {...inView(0.05)}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin size={20} className="text-techbridge-green" />
              <span className="font-semibold text-techbridge-navy text-lg">
                50+ partner institutions across Ghana's university ecosystem
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {regions.map((region, i) => (
                <motion.div
                  key={region.name}
                  {...inView(i * 0.06)}
                  className="p-4 rounded-xl bg-techbridge-light border border-techbridge-blue/10 text-center"
                >
                  <div className="text-2xl font-bold text-techbridge-blue mb-1">
                    {region.institutions}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{region.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">institutions</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-techbridge-navy mb-3">
              Programme Targets
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A phased national rollout reaching one million coders by Year 5.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {targets.map((target, i) => (
              <motion.div
                key={target.year}
                {...inView(i * 0.1)}
                className={`rounded-2xl border-2 ${target.colour} ${target.bg} p-7 text-center`}
              >
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">
                  {target.year}
                </div>
                <div className="font-serif text-4xl font-bold text-techbridge-navy mb-2">
                  {target.students}
                </div>
                <div className="text-sm text-gray-600 font-medium">students enrolled</div>
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                  {target.universities}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...inView(0.1)}
            className="mt-8 flex items-center gap-3 justify-center"
          >
            <Target size={18} className="text-ghana-red" />
            <span className="text-gray-600 text-sm font-medium">
              National target: 1,000,000 digitally skilled Ghanaians by 2030
            </span>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-techbridge-navy">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...inView()} className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              Technology Partner Ecosystem
            </h2>
            <p className="text-blue-200 max-w-xl mx-auto">
              Techbridge students learn and are assessed on the world's leading platforms,
              earning credentials that are globally recognised by employers.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.name}
                {...inView(i * 0.08)}
                className={`${partner.bg} ${partner.text} px-6 py-3 rounded-full font-semibold text-sm shadow-md`}
              >
                {partner.name}
              </motion.div>
            ))}
          </div>

          <motion.p
            {...inView(0.1)}
            className="text-center text-blue-300 text-sm"
          >
            — and more global technology partners joining the ecosystem
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-techbridge-light">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <motion.div {...inView()}>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-techbridge-navy mb-4">
                What Makes This Experiential?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                The Techbridge model is not a lecture series with a certificate at the end.
                Every element of the programme is designed to produce graduates who have
                already done the work — and can prove it.
              </p>

              <ul className="space-y-4">
                {experientialFeatures.map((feature, i) => (
                  <motion.li
                    key={feature}
                    {...inView(i * 0.07)}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle size={20} className="text-techbridge-green shrink-0 mt-0.5" />
                    <span className="text-gray-700 leading-snug">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...inView(0.1)}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-techbridge-blue flex items-center justify-center">
                  <Users size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-techbridge-navy">Skill Wallet Credentials</div>
                  <div className="text-sm text-gray-500">Verifiable digital portfolio</div>
                </div>
              </div>

              <div className="space-y-4">
                {skillWalletItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-techbridge-light">
                    <div className="w-2 h-2 rounded-full bg-techbridge-green" />
                    <span className="text-sm font-medium text-techbridge-navy">{item}</span>
                    <span className="ml-auto text-xs text-techbridge-green font-semibold">Included</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Every graduate receives a Techbridge Skill Wallet — a portable, verified
                  record of their competencies, projects, and certifications accessible by
                  employers globally.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-techbridge-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-1 flex">
            <div className="flex-1 bg-ghana-red" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-green" />
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div {...inView()}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Build Ghana's Digital Future?
            </h2>
            <p className="text-blue-200 text-lg mb-10 leading-relaxed">
              Explore the Techbridge platform or get in touch to discuss how your institution
              or organisation can participate in the One Million Coders Programme.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/platform"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-techbridge-gold text-techbridge-navy font-semibold text-lg hover:bg-yellow-300 transition-colors"
              >
                Explore the Platform <ArrowRight size={20} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Partner with Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
