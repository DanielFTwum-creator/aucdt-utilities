import { motion } from "motion/react";
import { Award, BookOpen, Heart, MapPin, TreePine, Clock } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="py-24" style={{background: "linear-gradient(135deg, #1c3a28 0%, #2d6a4f 100%)"}}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-white/80 text-xs font-bold uppercase tracking-widest border border-white/20">
              🍁 Norwich, Vermont
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight">
              45 Years of Vermont.<br />
              <span className="italic" style={{color: "#f5c842"}}>One Lifelong Practice.</span>
            </h1>
            <p className="text-xl text-white/75 leading-relaxed max-w-2xl">
              Root Drumming Systems wasn't built in a boardroom. It grew out of four decades of living, teaching, and drumming in Vermont communities — school by school, town by town.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline / Vermont Story */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="space-y-10">
              {/* Steve photo */}
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg shrink-0 border-4" style={{borderColor: "#c8921a"}}>
                  <img src={`${import.meta.env.BASE_URL}photos/steve.jpg`} alt="Steve Ferraris" className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <h2 className="text-4xl font-serif">Steve Ferraris</h2>
                  <p className="font-bold uppercase tracking-widest text-sm mt-1" style={{color: "#2d6a4f"}}>Founder · Trainer · Vermont Resident since 1980</p>
                </div>
              </div>

              <p className="text-foreground/70 leading-relaxed text-lg">
                Steve moved to Vermont in 1980 and never left. Over the next 45 years, he developed a deep relationship with the state's schools, communities, and students — bringing West African and world percussion traditions into classrooms long before "SEL" was a buzzword.
              </p>

              <p className="text-foreground/70 leading-relaxed">
                What began as community drumming circles evolved into a structured, evidence-based professional development system. As the research on rhythm and social-emotional learning matured, so did the program — formally becoming <strong>Drumming for SEL Success</strong>, explicitly aligned with the CASEL framework.
              </p>

              <p className="text-foreground/70 leading-relaxed">
                From <strong>2021 to 2025</strong>, Steve served the <strong>Bennington, Vermont school district (SVSU)</strong> as an in-residence SEL drumming trainer — a sustained, multi-year partnership that trained staff across multiple buildings and grade levels. Not a one-day workshop. A real, lasting community investment.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                {[
                  { stat: "1980", label: "Arrived in Vermont" },
                  { stat: "45 yrs", label: "Vermont Community Work" },
                  { stat: "2021–25", label: "SVSU / Bennington Residency" },
                  { stat: "CASEL", label: "Aligned Curriculum" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <span className="text-3xl font-serif font-bold" style={{color: "#2d6a4f"}}>{item.stat}</span>
                    <p className="text-xs uppercase tracking-widest font-bold text-foreground/40">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Vermont milestones */}
            <div className="space-y-6">
              <h3 className="text-2xl font-serif font-bold text-foreground/80">The Vermont Journey</h3>
              {[
                {
                  year: "1980",
                  title: "Arrived in Vermont",
                  desc: "Steve relocates to Vermont and begins integrating West African and world percussion into local schools and community programs.",
                  icon: MapPin,
                },
                {
                  year: "Early 2000s",
                  title: "Drumming for Success",
                  desc: "The program formalizes as \"Drumming for Success\" — a structured school residency model for K–12 students across Vermont.",
                  icon: TreePine,
                },
                {
                  year: "2016",
                  title: "Pivots to Professional Development",
                  desc: "As SEL research matures, Steve shifts focus from student programs to training educators — the train-the-trainer model that sustains itself long after the residency ends.",
                  icon: Award,
                },
                {
                  year: "2021–2025",
                  title: "SVSU — Bennington School District",
                  desc: "A four-year in-residence partnership with the Bennington Vermont school district. Teachers, counselors, and staff trained across multiple buildings in a sustained, district-wide SEL drumming program.",
                  icon: Heart,
                },
                {
                  year: "Today",
                  title: "Drumming for SEL Success",
                  desc: "A refined, CASEL-aligned PD system — built on 45 years of Vermont community work — now available to districts across the Northeast.",
                  icon: Clock,
                },
              ].map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-5"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{background: "#2d6a4f"}}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    {i < 4 && <div className="w-px flex-1 mt-2" style={{background: "#2d6a4f", opacity: 0.2}} />}
                  </div>
                  <div className="pb-8 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{color: "#c8921a"}}>{item.year}</span>
                    <h4 className="font-serif font-bold text-lg">{item.title}</h4>
                    <p className="text-sm text-foreground/60 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vermont Identity Banner */}
      <section className="py-16" style={{background: "#f0ebe0"}}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { emoji: "🍁", title: "Vermont Independent", desc: "Not a national franchise. Not a corporate PD vendor. One Vermont educator with 45 years of community roots." },
              { emoji: "🥁", title: "We Bring Everything", desc: "Instruments, curriculum, facilitation guides, and ongoing support. Your staff just needs to show up ready to learn." },
              { emoji: "🏔️", title: "Built for the Northeast", desc: "From the Green Mountains to the Northeast Kingdom — our PD is designed for the schools and communities we know." },
            ].map((item) => (
              <div key={item.title} className="space-y-4 p-8 rounded-[24px] bg-white shadow-sm">
                <span className="text-4xl">{item.emoji}</span>
                <h3 className="text-xl font-serif font-bold">{item.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evidence-Based Foundation */}
      <section className="py-24" style={{background: "linear-gradient(135deg, #7c3d12 0%, #2d6a4f 100%)"}}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-4xl font-serif text-white">Evidence-Based Foundation</h2>
            <p className="text-white/60 text-lg">
              Rooted in Vermont practice. Grounded in peer-reviewed research. Aligned with national SEL standards.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Neuroscience",
                desc: "Rhythmic entrainment reduces cortisol and improves executive function in developing brains — giving educators a tool that works at the physiological level.",
                icon: Award,
              },
              {
                title: "Social Psychology",
                desc: "Group drumming creates 'collective effervescence' — a state of shared emotion proven to build social cohesion and belonging in school communities.",
                icon: BookOpen,
              },
              {
                title: "CASEL Aligned",
                desc: "Every lesson and facilitation technique maps directly to the five core SEL competencies. PD credits available.",
                icon: Heart,
              },
            ].map((item) => (
              <div key={item.title} className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white">{item.title}</h3>
                <p className="text-white/55 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
