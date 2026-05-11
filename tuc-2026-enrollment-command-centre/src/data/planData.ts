import { 
  School, 
  Clock, 
  Briefcase 
} from "lucide-react";

export const WEEKS = [
  { wk: 'Wk 1', dt: 'May 11', blue: 'Set up WhatsApp nurture sequence', teal: 'Audit all pending applications', amber: 'Call every cold applicant personally', purple: 'Assign dedicated admissions contact' },
  { wk: 'Wk 2', dt: 'May 18', blue: 'Launch Instagram & TikTok content', teal: 'Create parent info pack (PDF)', amber: 'Film 2 student transformation videos', purple: 'Fix website mobile load speed' },
  { wk: 'Wk 3', dt: 'May 25', blue: 'Run gap-year targeted Facebook/IG ads', teal: 'Host virtual parent info session', amber: 'Add WhatsApp chat button to website', purple: 'Recruit 8–10 student ambassadors' },
  { wk: 'Wk 4', dt: 'Jun 1',  blue: 'SHS workshop — 2 schools in Accra', teal: 'Film 2 more student stories', amber: 'Launch "Apply in 2 minutes" mobile form', purple: 'Referral discount program live' },
  { wk: 'Wk 5', dt: 'Jun 8',  blue: 'LinkedIn push — working adult segment', teal: 'Open day on campus (hands-on)', amber: 'Google My Business fully optimised', purple: 'Re-engagement WhatsApp blast to all leads' },
  { wk: 'Wk 6', dt: 'Jun 15', blue: 'SHS workshop — 2 more schools', teal: 'Alumni testimonial campaign', amber: '2nd parent info session (in-person)', purple: 'Review ad performance, reallocate budget' },
  { wk: 'Wk 7', dt: 'Jun 22', blue: 'Final social media push — urgency content', teal: 'Personal calls to all warm leads', amber: 'Last-chance open day', purple: 'Confirm enrollment with deposited students' },
  { wk: 'Wk 8', dt: 'Jun 29', blue: 'Final applicant follow-up sweep', teal: 'Onboarding comms to enrolled students', amber: '', purple: 'Document what worked for Jan 2027' }
];

export const SEGMENTS = [
  {
    icon: School, iconClass: 'blue',
    title: 'Fresh SHS graduates',
    mindset: '"I want university but not sure I\'ll make the cut-off"',
    items: [
      { t: 'Run design/entrepreneurship workshops inside SHS schools — not just a table at a career fair', tag: 'Wk 4 & 6' },
      { t: 'Recruit student ambassadors to recruit from their own former schools', tag: 'Wk 3' },
      { t: 'TikTok & IG Reels — campus life, studio work, student projects', tag: 'Wk 2' },
      { t: 'Peer testimonial content — "why I chose TUC" short videos', tag: 'Wk 3' }
    ]
  },
  {
    icon: Clock, iconClass: 'teal',
    title: 'Gap year / missed cut-off',
    mindset: '"I\'m stuck — I need a solution now"',
    items: [
      { t: 'Facebook & IG ads targeted at 18–22s in Accra — "smart pivot" framing, not consolation', tag: 'Wk 3' },
      { t: 'Dedicated landing page: "Didn\'t get your first choice? Here\'s why TUC is the better outcome"', tag: 'Wk 2' },
      { t: 'WhatsApp direct line — staffed by a real admissions person, not a bot', tag: 'Wk 1' },
      { t: 'Student stories from people who were in the same position and thrived at TUC', tag: 'Wk 4' }
    ]
  },
  {
    icon: Briefcase, iconClass: 'amber',
    title: 'Working adults',
    mindset: '"I need to upskill but I can\'t quit my job"',
    items: [
      { t: 'LinkedIn sponsored posts — target professionals in Accra, age 25–40', tag: 'Wk 5' },
      { t: 'Confirm evening/weekend programme availability — this is their #1 barrier', tag: 'Wk 1' },
      { t: 'Approach HR managers at mid-size Ghanaian firms for staff development partnerships', tag: 'Wk 5–6' },
      { t: 'Pitch is career ROI: "Earn your degree while keeping your salary"', tag: 'Wk 5' }
    ]
  }
];

export const FUNNEL_DATA = [
  { label: 'Awareness', pct: 100, fill: 'var(--color-blue-bg)', stroke: 'var(--color-blue-border)', textCol: 'var(--color-blue-text)', badge: '' },
  { label: 'Application', pct: 75, fill: 'var(--color-teal-bg)', stroke: 'var(--color-teal-border)', textCol: 'var(--color-teal-text)', badge: 'Working well' },
  { label: 'Post-apply', pct: 45, fill: 'var(--color-amber-bg)', stroke: 'var(--color-amber-border)', textCol: 'var(--color-amber-text)', badge: '⚠ Silence gap' },
  { label: 'Parent buy-in', pct: 30, fill: 'var(--color-amber-bg)', stroke: 'var(--color-amber-border)', textCol: 'var(--color-amber-text)', badge: '⚠ Parent gap' },
  { label: 'Enrolled', pct: 18, fill: 'var(--color-purple-bg)', stroke: 'var(--color-purple-border)', textCol: 'var(--color-purple-text)', badge: 'Target: 35–40%' }
];

export const CHECKLIST_SECTIONS = [
  {
    label: 'Must do — plug the conversion leak first',
    badge: 'Conversion priority',
    badgeClass: 'bg-teal-bg text-teal-text border-teal-border',
    items: [
      { t: 'Audit every pending application — how many, how old, where they\'re from', meta: 'Admissions lead · 2 hrs' },
      { t: 'Assign one person as the dedicated admissions follow-up contact', meta: 'Management decision · 30 mins' },
      { t: 'Call every cold applicant personally', meta: 'Admissions lead · half day' },
      { t: 'Draft the 7-day WhatsApp nurture sequence (4 messages)', meta: 'Marketing team · 3 hrs' },
      { t: 'Confirm whether evening/weekend classes are available for working adults', meta: 'Academic team · 1 hr' }
    ]
  },
  {
    label: 'Start this week — top of funnel',
    badge: 'Awareness',
    badgeClass: 'bg-blue-bg text-blue-text border-blue-border',
    items: [
      { t: 'Set up or claim Google My Business listing and fill it out completely', meta: 'Marketing · 1 hr · free' },
      { t: 'Film one "day in the life at TUC" short video with a current student', meta: 'Marketing · half day' },
      { t: 'Add a WhatsApp chat button to the TUC website homepage', meta: 'Web person · 1 hr' },
      { t: 'Identify 8–10 current students to become paid/incentivised ambassadors', meta: 'Student affairs · 2 hrs' }
    ]
  }
];
