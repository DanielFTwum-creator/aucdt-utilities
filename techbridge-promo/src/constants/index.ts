import { Program, PromoEvent, Stat } from "../types";

export const STATS: Stat[] = [
  { label: "Programmes", value: 15, suffix: "+" },
  { label: "Students", value: 2400, suffix: "+" },
  { label: "Years of Excellence", value: 10, suffix: "+" },
  { label: "Career Support", value: 100, suffix: "%" },
];

export const PROGRAMS: Program[] = [
  {
    name: "Engineering & Technology",
    desc: "Civil, Electrical, Mechanical and Computer Engineering programmes designed for Africa's infrastructure future.",
    icon: "⚙️",
  },
  {
    name: "Computing & IT",
    desc: "Software Engineering, Cybersecurity, Data Science and AI programmes at the cutting edge of the digital economy.",
    icon: "💻",
  },
  {
    name: "Architecture & Built Environment",
    desc: "Designing sustainable buildings and cities that reflect African identity and global standards.",
    icon: "🏗️",
  },
  {
    name: "Business & Management",
    desc: "Entrepreneurship, Finance and Project Management — building Africa's next generation of business leaders.",
    icon: "💼",
  },
];

export const CURRENT_EVENT: PromoEvent = {
  title: "Open Day & Admissions Fair",
  subtitle: "2025 – 2026 Academic Year",
  description: "Meet faculty, tour facilities, attend live demos, and receive on-the-spot admissions guidance across all programmes.",
  date: "March 15, 2025",
  time: "9:00 AM – 4:00 PM",
  venue: "Main Campus, Accra",
};
