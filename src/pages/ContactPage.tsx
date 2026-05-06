import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail, Phone, MapPin, Clock, Users, Monitor,
  CheckCircle, ArrowRight, AlertCircle, Building2,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
}

const contactCards = [
  {
    icon: Users,
    title: 'Government Relations',
    description: 'Direct line for Ministry officials and government representatives.',
    detail: 'Email: government@techbridge.edu.gh',
    note: 'Response within 4 business hours',
    color: 'from-techbridge-blue to-techbridge-navy',
  },
  {
    icon: Monitor,
    title: 'Technical Demonstration',
    description: 'Request a live walkthrough of the One Million Coders platform.',
    detail: 'Email: demo@techbridge.edu.gh',
    note: 'Available Mon–Fri 8am–6pm GMT',
    color: 'from-techbridge-green to-emerald-700',
  },
  {
    icon: MapPin,
    title: 'Headquarters',
    description: 'Techbridge Education Services Ghana',
    detail: 'Accra, Ghana',
    note: 'techbridge.edu.gh',
    color: 'from-ghana-red to-red-700',
  },
]

const reasons = [
  {
    title: 'Fast Response',
    body: 'Government enquiries are prioritised. We respond within 4 business hours.',
    icon: Clock,
  },
  {
    title: 'Direct Access',
    body: "You'll speak directly with Techbridge's leadership — no intermediaries, no overseas handoffs.",
    icon: Users,
  },
  {
    title: 'Flexible Engagement',
    body: 'We can present at your offices, schedule a platform demo, or arrange a site visit to our Accra operations.',
    icon: MapPin,
  },
]

const steps = [
  { step: '01', label: 'Submit enquiry' },
  { step: '02', label: 'Receive confirmation within 4 hours' },
  { step: '03', label: 'Schedule briefing call or in-person meeting' },
  { step: '04', label: 'Receive formal proposal and platform demonstration' },
]

const ministries = [
  'Ministry of Communications and Digitalization',
  'Presidential Special Initiatives',
  'Youth and Employment Agency',
  'Ghana Digital Centre',
]

interface FormState {
  fullName: string
  organisation: string
  role: string
  email: string
  phone: string
  enquiryType: string
  message: string
}

const initialForm: FormState = {
  fullName: '',
  organisation: '',
  role: '',
  email: '',
  phone: '',
  enquiryType: '',
  message: '',
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-techbridge-light font-sans">

      <section className="relative bg-techbridge-navy overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-2 flex">
            <div className="flex-1 bg-ghana-red" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-green" />
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-block text-techbridge-gold font-sans text-sm font-semibold tracking-widest uppercase mb-4">
              One Million Coders Programme
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="font-serif text-5xl md:text-6xl text-white leading-tight mb-6"
          >
            Begin the Partnership.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Techbridge is ready to discuss implementation with the Ghana Government.
            Contact us to schedule a briefing.
          </motion.p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-4xl text-techbridge-navy mb-3">Contact Information</h2>
          <p className="text-techbridge-blue max-w-xl mx-auto">
            Reach the right team directly. All government enquiries are handled with priority.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${card.color} p-6 flex items-center gap-4`}>
                <div className="bg-white/20 rounded-xl p-3">
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-serif text-xl text-white">{card.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-3 leading-relaxed">{card.description}</p>
                <p className="font-semibold text-techbridge-navy text-sm mb-2">{card.detail}</p>
                <p className="text-xs text-techbridge-blue font-medium uppercase tracking-wide">
                  {card.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl text-techbridge-navy mb-3">Government Enquiry Form</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Complete the form below and a member of our government relations team will respond promptly.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-ghana-green/10 border border-ghana-green/30 rounded-2xl p-10 text-center"
            >
              <div className="flex justify-center mb-5">
                <div className="bg-ghana-green rounded-full p-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="font-serif text-2xl text-techbridge-navy mb-4">Enquiry Submitted</h3>
              <p className="text-gray-700 leading-relaxed max-w-md mx-auto">
                Thank you. A member of Techbridge's government relations team will contact you within
                4 business hours.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-techbridge-navy mb-2" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Hon. Kwame Asante"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-techbridge-blue/40 focus:border-techbridge-blue transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-techbridge-navy mb-2" htmlFor="organisation">
                    Organisation / Ministry
                  </label>
                  <input
                    id="organisation"
                    name="organisation"
                    type="text"
                    required
                    value={form.organisation}
                    onChange={handleChange}
                    placeholder="Ministry of Communications"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-techbridge-blue/40 focus:border-techbridge-blue transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-techbridge-navy mb-2" htmlFor="role">
                    Role / Position
                  </label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    required
                    value={form.role}
                    onChange={handleChange}
                    placeholder="Deputy Minister"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-techbridge-blue/40 focus:border-techbridge-blue transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-techbridge-navy mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="official@ministry.gov.gh"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-techbridge-blue/40 focus:border-techbridge-blue transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-techbridge-navy mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+233 XX XXX XXXX"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-techbridge-blue/40 focus:border-techbridge-blue transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-techbridge-navy mb-2" htmlFor="enquiryType">
                    Nature of Enquiry
                  </label>
                  <select
                    id="enquiryType"
                    name="enquiryType"
                    required
                    value={form.enquiryType}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-techbridge-blue/40 focus:border-techbridge-blue transition bg-white"
                  >
                    <option value="" disabled>Select enquiry type</option>
                    <option value="partnership">Partnership Discussion</option>
                    <option value="demo">Platform Demonstration Request</option>
                    <option value="programme">Programme Design Enquiry</option>
                    <option value="technical">Technical Assessment</option>
                    <option value="media">Media / Press</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-techbridge-navy mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Please describe your enquiry or the nature of your interest in the One Million Coders Programme..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-techbridge-blue/40 focus:border-techbridge-blue transition resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-techbridge-blue hover:bg-techbridge-navy text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-base"
                >
                  Send Enquiry
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-4xl text-techbridge-navy mb-3">Why Contact Us</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Three reasons government partners choose to engage with Techbridge directly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <div className="bg-techbridge-blue/10 rounded-xl p-3 w-fit mb-5">
                <reason.icon className="w-6 h-6 text-techbridge-blue" />
              </div>
              <h3 className="font-serif text-xl text-techbridge-navy mb-3">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">{reason.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-techbridge-navy py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="font-serif text-4xl text-white mb-3">Next Steps After Contact</h2>
            <p className="text-blue-200 max-w-lg mx-auto">
              A clear, simple process from first enquiry to formal partnership proposal.
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-white/10" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {steps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="text-center"
                >
                  <div className="bg-techbridge-gold text-techbridge-navy font-bold text-lg w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 font-sans relative z-10">
                    {item.step}
                  </div>
                  <p className="text-white text-sm leading-relaxed">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="bg-ghana-red/5 border-2 border-ghana-red/20 rounded-2xl p-10"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-ghana-red rounded-xl p-3 flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-3xl text-techbridge-navy mb-1">Emergency / Direct Contact</h2>
              <p className="text-gray-600">
                For urgent government matters, contact our Director directly:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div className="flex items-center gap-3 bg-white rounded-xl p-5 shadow-sm">
              <div className="bg-techbridge-blue/10 rounded-lg p-2">
                <Phone className="w-5 h-5 text-techbridge-blue" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Direct Line</p>
                <p className="text-techbridge-navy font-semibold">+233 XX XXX XXXX</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl p-5 shadow-sm">
              <div className="bg-techbridge-blue/10 rounded-lg p-2">
                <Mail className="w-5 h-5 text-techbridge-blue" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Director Email</p>
                <p className="text-techbridge-navy font-semibold">director@techbridge.edu.gh</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl text-techbridge-navy mb-3">Proposal Submitted To</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Techbridge has already engaged the relevant government bodies.
              This proposal has been formally presented to:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ministries.map((ministry, i) => (
              <motion.div
                key={ministry}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex items-center gap-4 bg-techbridge-light rounded-xl p-5"
              >
                <div className="bg-ghana-green rounded-full p-2 flex-shrink-0">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <p className="font-semibold text-techbridge-navy text-sm leading-snug">{ministry}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
