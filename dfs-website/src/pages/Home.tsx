import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight, Heart, ScanFace, HeartHandshake, Handshake, Scale } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section — Warm, grounded, community-centered */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden" style={{background: "linear-gradient(135deg, #1c3a28 0%, #2d6a4f 50%, #3d5a2a 100%)"}}>
        {/* Real drum circle photo as background */}
        <div className="absolute inset-0 z-0">
          <img src={`${import.meta.env.BASE_URL}photos/circle.jpg`} alt="" className="w-full h-full object-cover" aria-hidden="true" />
          <div className="absolute inset-0" style={{background: "linear-gradient(135deg, rgba(28,58,40,0.88) 0%, rgba(45,106,79,0.78) 50%, rgba(28,58,40,0.85) 100%)"}} />
        </div>

        <div className="container mx-auto px-4 z-10 py-24">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="space-y-7"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-white/90 text-xs font-bold uppercase tracking-widest border border-white/20">
                🍁 Rooted in Vermont for 45 Years — Norwich · Bennington · Beyond
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight text-white">
                SEL Professional Development<br />
                <span className="italic" style={{color: "#f5c842"}}>That Educators Actually Use.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
                We trained the teachers, counselors, and staff in the Bennington School District (SVSU) from 2021–2025 — giving them a sustainable, CASEL-aligned rhythm program they use every day. <span style={{color: "#f5c842", fontStyle: "italic"}}>Your school is next.</span>
              </p>
              <p className="text-xs font-medium text-white/40 uppercase tracking-widest">
                Formerly Drumming for Success &nbsp;·&nbsp; Serving Schools Since 2016
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button render={<Link to="/contact" />} size="lg" className="rounded-full px-8 h-14 text-base font-bold" style={{background: "#c8921a", color: "#fff", border: "none"}} nativeButton={false}>
                  Schedule a PD Training <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button render={<Link to="/programs" />} variant="outline" size="lg" className="rounded-full px-8 h-14 text-base font-semibold border-white/30 text-white hover:bg-white/10" nativeButton={false}>
                  How It Works
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Concentric circle motif — community, rhythm */}
        <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 opacity-10 hidden lg:block">
          <svg width="600" height="600" viewBox="0 0 600 600" fill="none">
            <circle cx="300" cy="300" r="280" stroke="white" strokeWidth="1.5"/>
            <circle cx="300" cy="300" r="220" stroke="white" strokeWidth="1.5"/>
            <circle cx="300" cy="300" r="160" stroke="white" strokeWidth="1.5"/>
            <circle cx="300" cy="300" r="100" stroke="white" strokeWidth="1.5"/>
            <circle cx="300" cy="300" r="40" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
      </section>

      {/* Value Proposition - CASEL Framework */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">CASEL-Aligned Outcomes</span>
            <h2 className="text-4xl md:text-5xl font-serif">What Your Staff<br />Will Be Able To Do</h2>
            <p className="text-muted-foreground text-lg">
              After training, your educators can facilitate rhythm-based activities that build all five core SEL competencies — no prior music experience required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Self-Awareness",
                desc: "Staff learn to guide students in recognizing their own emotional states through breath, pulse, and rhythmic grounding.",
                icon: ScanFace,
                bg: "bg-rose-50",
                iconColor: "text-rose-600",
                border: "border-rose-200",
              },
              {
                title: "Social Awareness",
                desc: "Educators facilitate ensemble drumming where students must listen and respond — building empathy and perspective-taking in real time.",
                icon: HeartHandshake,
                bg: "bg-blue-50",
                iconColor: "text-blue-600",
                border: "border-blue-200",
              },
              {
                title: "Relationship Skills",
                desc: "Staff gain facilitation tools for non-verbal communication and trust-building that transfer directly to the classroom.",
                icon: Handshake,
                bg: "bg-teal-50",
                iconColor: "text-teal-700",
                border: "border-teal-200",
              },
              {
                title: "Responsible Decisions",
                desc: "Rhythm-based activities teach cause-and-effect and group accountability — skills educators can reinforce across all subject areas.",
                icon: Scale,
                bg: "bg-amber-50",
                iconColor: "text-amber-700",
                border: "border-amber-200",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn("p-8 rounded-[24px] bg-card text-card-foreground border-2 hover:shadow-xl transition-all group", item.border)}
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", item.bg)}>
                  <item.icon className={cn("w-8 h-8", item.iconColor)} />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vermont Roots */}
      <section className="py-24 bg-muted dark:bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Homegrown. Not Franchised.</span>
                <h2 className="text-4xl md:text-5xl font-serif leading-tight text-foreground">Built in Vermont.<br />Over 45 Years.</h2>
              </div>
              <p className="text-foreground/70 leading-relaxed text-lg">
                Steve Ferraris has lived and worked in Vermont since 1980. Root Drumming Systems wasn't developed in a conference room — it was cultivated school by school, district by district, across the Green Mountain State over four decades.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                From 2021 to 2025, Steve served as the in-residence SEL drumming trainer for the <strong>Bennington, Vermont school district (SVSU)</strong> — training teachers, counselors, and staff across multiple buildings in a sustained, multi-year professional development partnership.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                That's not a one-day workshop. That's a community relationship. That's what we bring to every school we work with.
              </p>
              <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4">
                {[
                  { stat: "45", label: "Years in Vermont" },
                  { stat: "4", label: "Years in SVSU / Bennington" },
                  { stat: "100%", label: "Vermont-Based & Independent" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <span className="text-3xl font-serif font-bold text-primary">{item.stat}</span>
                    <p className="text-xs uppercase tracking-wide font-bold text-foreground/50">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vermont outdoor drums photo */}
            <div className="relative">
              <div className="w-full aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl">
                <img src={`${import.meta.env.BASE_URL}photos/outdoor.jpg`} alt="Drumming for SEL — outdoor classroom, Vermont" className="w-full h-full object-cover" />
              </div>
              {/* Quote overlay card */}
              <div className="absolute -bottom-6 -left-6 bg-card text-card-foreground p-6 rounded-[20px] shadow-xl max-w-xs hidden lg:block border-l-4" style={{borderColor: "#c8921a"}}>
                <p className="font-serif italic text-sm leading-snug text-foreground/80">"Learners are engaged and enthusiastic, and look forward to sharing their new skills with others."</p>
                <p className="text-xs font-bold uppercase tracking-widest mt-3" style={{color: "#2d6a4f"}}>— Laura Boudreaux, Asst. Supt. · SVSU 2024</p>
              </div>
              <div className="absolute -top-4 -right-4 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg" style={{background: "#c8921a"}}>
                🍁
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PD Format Options */}
      <section className="py-24 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif">Training Formats</h2>
              <p className="text-muted-foreground text-lg">
                Flexible professional development options designed to fit your school calendar — from a single in-service day to a multi-day staff residency.
              </p>
            </div>
            <Button render={<Link to="/programs" />} variant="link" className="text-primary font-bold text-lg p-0" nativeButton={false}>
              View all details <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Single-Day In-Service",
                desc: "A full day of rhythm-based SEL facilitation training. Your staff leaves with immediately usable techniques and a complete curriculum toolkit.",
                tag: "Most Popular",
                tagColor: "bg-primary/10 text-primary",
                border: "border-primary/30",
              },
              {
                title: "Multi-Day Residency",
                desc: "Two to three days of deep-dive training, practice facilitation, and school-specific SEL program design. Ideal for district-wide PD rollout.",
                tag: "Most Comprehensive",
                tagColor: "bg-secondary/10 text-secondary",
                border: "border-secondary/20",
              },
              {
                title: "Train-the-Trainer",
                desc: "Certify one or more staff members as on-site SEL drumming facilitators. A self-sustaining model that outlasts any single residency.",
                tag: "Long-Term Impact",
                tagColor: "bg-accent/10 text-amber-700",
                border: "border-accent/20",
              },
            ].map((format) => (
              <div key={format.title} className={`group cursor-pointer bg-card text-card-foreground rounded-[24px] border-2 ${format.border} p-8 hover:shadow-xl transition-all space-y-4`}>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${format.tagColor}`}>
                  {format.tag}
                </span>
                <h3 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">{format.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{format.desc}</p>
                <Link to="/contact" className="inline-flex items-center text-sm font-bold text-primary gap-1 group-hover:gap-2 transition-all">
                  Request this format <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What a Session Looks Like */}
      <section className="py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
          <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
            <img src={`${import.meta.env.BASE_URL}photos/workshop.jpg`} alt="SEL drumming workshop — staff training session" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
            <img src={`${import.meta.env.BASE_URL}photos/students.jpg`} alt="Students in a drumming circle — Bennington Vermont" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Heart key={s} className="w-6 h-6 text-primary fill-primary" />
                ))}
              </div>
              <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed text-foreground">
                "Drumming for Success has become part of the tools that we use in our district to support our learners in whole and small group settings linked to trauma informed practices. Professional staff have enjoyed Steve's facilitation of drumming strategies as part of professional learning. Learners are engaged and enthusiastic, and look forward to sharing their new skills with others."
              </blockquote>
              <cite className="block not-italic space-y-1">
                <span className="font-bold text-lg text-foreground">Laura Boudreaux</span>
                <span className="block text-foreground/70">Assistant Superintendent, SVSU — Bennington, Vermont · 2024</span>
              </cite>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 overflow-hidden relative" style={{background: "linear-gradient(135deg, #7c3d12 0%, #2d6a4f 100%)"}}>
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif max-w-3xl mx-auto text-white leading-snug">
            Give your staff an SEL tool they'll actually use — starting day one.
          </h2>
          <p className="text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
            No music background required. We bring the instruments, the curriculum, and the training. Your staff leaves ready to facilitate on their own.
          </p>
          <Button render={<Link to="/contact" />} size="lg" className="rounded-full px-12 h-14 text-lg font-bold" style={{background: "#c8921a", color: "#fff", border: "none"}} nativeButton={false}>
            Request a PD Proposal
          </Button>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      </section>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
