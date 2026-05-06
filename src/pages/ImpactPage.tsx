import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Building2, Briefcase, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
}

const studentGrowthData = [
  { year: '2020', students: 420 },
  { year: '2021', students: 1850 },
  { year: '2022', students: 4200 },
  { year: '2023', students: 8900 },
  { year: '2024', students: 12400 },
  { year: '2025', students: 15247 },
]

const regionData = [
  { region: 'Greater Accra', students: 4800 },
  { region: 'Ashanti', students: 3200 },
  { region: 'Western', students: 1900 },
  { region: 'Eastern', students: 1600 },
  { region: 'Northern', students: 1200 },
  { region: 'Central', students: 1100 },
  { region: 'Volta', students: 900 },
  { region: 'Other', students: 547 },
]

const programmeData = [
  { name: 'Software Dev', value: 4800 },
  { name: 'AI & ML', value: 3600 },
  { name: 'Cloud Computing', value: 3200 },
  { name: 'Data Science', value: 2400 },
  { name: 'Digital Marketing', value: 1247 },
]

const programmeColors = ['#006B3F', '#1a4b8c', '#FCD116', '#CE1126', '#f59e0b']

const salaryData = [
  { range: 'Same salary', pct: 16 },
  { range: '1-1.5x growth', pct: 17 },
  { range: '1.5-2x growth', pct: 31 },
  { range: '2-3x growth', pct: 25 },
  { range: '3x+ growth', pct: 11 },
]

const radarData = [
  { metric: 'Uptime', techbridge: 98.5, benchmark: 95 },
  { metric: 'Student Satisfaction', techbridge: 91, benchmark: 82 },
  { metric: 'Course Completion', techbridge: 78, benchmark: 65 },
  { metric: 'Employment Rate', techbridge: 84, benchmark: 71 },
  { metric: 'Employer Satisfaction', techbridge: 89, benchmark: 75 },
  { metric: 'Time to Deploy', techbridge: 95, benchmark: 40 },
]

const projectionData = [
  { year: 'Year 1', enrolled: 50000, graduated: 35000, employed: 29400 },
  { year: 'Year 2', enrolled: 150000, graduated: 112500, employed: 94500 },
  { year: 'Year 3', enrolled: 300000, graduated: 234000, employed: 196560 },
  { year: 'Year 5', enrolled: 1000000, graduated: 800000, employed: 672000 },
]

const kpis = [
  {
    label: 'Students Trained',
    value: '15,247',
    icon: Users,
    color: 'bg-techbridge-green',
  },
  {
    label: 'Institutions Served',
    value: '53',
    icon: Building2,
    color: 'bg-techbridge-blue',
  },
  {
    label: 'Internships Placed',
    value: '2,418',
    icon: Briefcase,
    color: 'bg-ghana-red',
  },
  {
    label: 'Employment Rate',
    value: '84%',
    icon: TrendingUp,
    color: 'bg-academic-navy',
  },
]

function SectionCard({ title, children, index }: { title: string; children: React.ReactNode; index: number }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md p-6 md:p-8"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      custom={index}
    >
      <h2 className="font-serif text-2xl md:text-3xl text-techbridge-navy mb-6">{title}</h2>
      {children}
    </motion.div>
  )
}

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-techbridge-light font-sans">
      <section className="relative bg-techbridge-navy overflow-hidden">
        <div className="absolute inset-x-0 top-0 flex h-2">
          <div className="flex-1 bg-ghana-red" />
          <div className="flex-1 bg-ghana-gold" />
          <div className="flex-1 bg-ghana-green" />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-28 pt-10 text-center">
          <motion.h1
            className="font-serif text-5xl md:text-6xl text-white mb-4 pt-8"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Impact Dashboard
          </motion.h1>
          <motion.p
            className="text-techbridge-light text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Measurable outcomes from 5 years of delivering digital skills across Ghana.
          </motion.p>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex h-2">
          <div className="flex-1 bg-ghana-green" />
          <div className="flex-1 bg-ghana-gold" />
          <div className="flex-1 bg-ghana-red" />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
            >
              <div className={`${kpi.color} text-white rounded-xl p-3 shrink-0`}>
                <kpi.icon size={28} />
              </div>
              <div>
                <p className="text-3xl font-bold text-techbridge-navy">{kpi.value}</p>
                <p className="text-sm text-gray-500 mt-1">{kpi.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <SectionCard title="Student Enrolment Growth 2020–2025" index={0}>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={studentGrowthData} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }} />
              <YAxis tick={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }} tickFormatter={(v) => v.toLocaleString()} />
              <Tooltip formatter={(v) => (typeof v === 'number' ? v.toLocaleString() : '')} />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#006B3F"
                strokeWidth={3}
                dot={{ r: 5, fill: '#006B3F' }}
                activeDot={{ r: 7 }}
                name="Students"
              />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Students by Region" index={1}>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={regionData} margin={{ top: 8, right: 24, left: 0, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="region"
                tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }} tickFormatter={(v) => v.toLocaleString()} />
              <Tooltip formatter={(v) => (typeof v === 'number' ? v.toLocaleString() : '')} />
              <Bar dataKey="students" fill="#1a4b8c" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SectionCard title="Enrolment by Programme Track" index={2}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={programmeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={true}
                >
                  {programmeData.map((_, i) => (
                    <Cell key={i} fill={programmeColors[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => (typeof v === 'number' ? v.toLocaleString() : '')} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {programmeData.map((entry, i) => (
                <span key={entry.name} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: programmeColors[i] }} />
                  {entry.name}
                </span>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Salary Growth for Techbridge Graduates (18 months post-completion)" index={3}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryData} layout="vertical" margin={{ top: 8, right: 32, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }} unit="%" domain={[0, 40]} />
                <YAxis dataKey="range" type="category" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }} width={120} />
                <Tooltip formatter={(v) => (typeof v === 'number' ? `${v}%` : '')} />
                <Bar dataKey="pct" fill="#006B3F" radius={[0, 4, 4, 0]} name="Graduates %" />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        <SectionCard title="Techbridge vs Industry Benchmark" index={4}>
          <p className="text-sm text-gray-500 mb-4">
            Scores are normalised to 100. For Time to Deploy, Techbridge achieves deployment in 8 weeks vs the industry average of 6 months — reflected as a higher score.
          </p>
          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={radarData} margin={{ top: 16, right: 32, left: 32, bottom: 16 }}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }} />
              <Radar name="Techbridge" dataKey="techbridge" stroke="#006B3F" fill="#006B3F" fillOpacity={0.25} />
              <Radar name="Industry Benchmark" dataKey="benchmark" stroke="#CE1126" fill="#CE1126" fillOpacity={0.15} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>

        <motion.div
          className="bg-white rounded-2xl shadow-md p-8 md:p-10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          custom={5}
        >
          <h2 className="font-serif text-2xl md:text-3xl text-techbridge-navy mb-4">ROI for Government</h2>
          <div className="border-l-4 border-ghana-gold pl-6 mb-8">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Every <span className="font-bold text-techbridge-navy">GHS 1</span> invested in Techbridge's programme returns{' '}
              <span className="font-bold text-techbridge-green text-2xl">GHS 4.20</span> in economic value through employment outcomes, reduced skills gap, and local tech sector growth.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Average Salary Uplift', value: 'GHS 2,800/mo', sub: 'vs GHS 1,100 pre-programme' },
              { label: 'Jobs Created', value: '12,806', sub: 'Direct tech employment' },
              { label: 'Est. Tax Revenue Generated', value: 'GHS 47.2M', sub: 'Cumulative 2020–2025' },
            ].map((stat) => (
              <div key={stat.label} className="bg-techbridge-light rounded-xl p-5 text-center">
                <p className="text-2xl font-bold text-techbridge-navy">{stat.value}</p>
                <p className="text-sm font-medium text-gray-700 mt-1">{stat.label}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <SectionCard title="Projected Programme Impact — One Million Coders" index={6}>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={projectionData} margin={{ top: 8, right: 24, left: 16, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }} />
              <YAxis tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }} tickFormatter={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)} />
              <Tooltip formatter={(v) => (typeof v === 'number' ? v.toLocaleString() : '')} />
              <Legend />
              <Bar dataKey="enrolled" name="Enrolled" stackId="a" fill="#1a4b8c" radius={[0, 0, 0, 0]} />
              <Bar dataKey="graduated" name="Graduated" stackId="b" fill="#006B3F" />
              <Bar dataKey="employed" name="Employed" stackId="c" fill="#FCD116" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-3">
            Projections based on current completion (70%) and employment rates (84%). Bars are independent for comparison — not stacked segments.
          </p>
        </SectionCard>

        <motion.div
          className="rounded-2xl overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={7}
        >
          <div className="flex h-2">
            <div className="flex-1 bg-ghana-red" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-green" />
          </div>
          <div className="bg-techbridge-navy px-8 py-14 text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
              These numbers represent real Ghanaians whose lives were changed.
            </h2>
            <p className="text-techbridge-gold text-xl md:text-2xl font-serif mb-10">
              Imagine One Million.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-ghana-gold text-techbridge-navy font-bold text-lg px-10 py-4 rounded-full hover:bg-yellow-300 transition-colors duration-200"
            >
              Partner With Us
            </Link>
          </div>
          <div className="flex h-2">
            <div className="flex-1 bg-ghana-green" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-red" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
