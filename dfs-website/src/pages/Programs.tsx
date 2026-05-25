import { motion } from "motion/react";
import { CheckCircle2, Clock, Users, Globe, ArrowRight, Award, GraduationCap, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Programs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-serif">In-Service Training</h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-2xl">
              Empowering educators, counselors, and staff with the techniques to 
              facilitate group drumming for student SEL Success.
            </p>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl font-serif">Training Structure</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our in-service seminars are designed for teachers, counselors, and administrators. 
                  Steve Ferraris leads your team through the power and techniques of rhythmic 
                  facilitation, providing a turnkey system for SEL Success in your school.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  {
                    title: "Target Audience",
                    desc: "Teachers, counselors, staff, and administration.",
                    icon: Users,
                  },
                  {
                    title: "Focus",
                    desc: "Techniques for facilitating group drumming with students.",
                    icon: CheckCircle2,
                  },
                  {
                    title: "Flexible Format",
                    desc: "Single-day seminars or multi-day intensive residencies.",
                    icon: Clock,
                  },
                  {
                    title: "Service Area",
                    desc: "Available for on-site training across the Northeast US.",
                    icon: Globe,
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-accent/5 rounded-[32px] space-y-4">
                <h3 className="text-2xl font-serif font-bold">Train the Trainer</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We don't just teach the students; we empower your staff to sustain 
                  the rhythm. Our goal is to leave your school with a self-sustaining 
                  SEL program that continues long after the seminar ends.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="https://picsum.photos/seed/p1/400/600" alt="Program" className="rounded-[32px] w-full object-cover aspect-[2/3]" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/p2/400/400" alt="Program" className="rounded-[32px] w-full object-cover aspect-square" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-4 pt-12">
                <img src="https://picsum.photos/seed/p3/400/400" alt="Program" className="rounded-[32px] w-full object-cover aspect-square" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/p4/400/600" alt="Program" className="rounded-[32px] w-full object-cover aspect-[2/3]" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PD Credits */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest" style={{color: "#c8921a"}}>Vermont Agency of Education · IACET Standard</span>
              <h2 className="text-4xl font-serif">Professional Development Credits</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                All Drumming for SEL Success trainings qualify for PD credit per Vermont Agency of Education guidelines. <strong>1 contact hour = 1 PD credit.</strong>
              </p>
            </div>

            {/* Credits table */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { format: "Single-Day In-Service", hours: "6 hrs", credits: "6 PD Credits", ceu: "0.6 CEU", icon: Clock, color: "#2d6a4f" },
                { format: "Multi-Day Residency", hours: "12–18 hrs", credits: "12–18 PD Credits", ceu: "1.2–1.8 CEU", icon: Award, color: "#c8921a" },
                { format: "Train-the-Trainer", hours: "20–30 hrs", credits: "20–30 PD Credits", ceu: "2.0–3.0 CEU", icon: GraduationCap, color: "#7c3d12" },
              ].map((item) => (
                <div key={item.format} className="rounded-[20px] border-2 p-8 space-y-4 bg-white" style={{borderColor: item.color + "33"}}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{background: item.color + "15"}}>
                    <item.icon className="w-7 h-7" style={{color: item.color}} />
                  </div>
                  <h3 className="font-serif font-bold text-xl">{item.format}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Contact Hours</span>
                      <span className="font-bold">{item.hours}</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">PD Credits</span>
                      <span className="font-bold" style={{color: item.color}}>{item.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CEU Value</span>
                      <span className="font-bold">{item.ceu}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Certificate callout */}
            <div className="rounded-[24px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8" style={{background: "linear-gradient(135deg, #1c3a28 0%, #2d6a4f 100%)"}}>
              <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-white space-y-2">
                <h3 className="font-serif text-2xl font-bold">Certificate of Completion Provided</h3>
                <p className="text-white/70 leading-relaxed">
                  Every participant receives a signed Certificate of Completion documenting contact hours, PD credits earned, CASEL competencies addressed, and facilitator credentials — ready to submit to your district HR or state agency for relicensure.
                </p>
              </div>
              <Button render={<Link to="/contact" />} className="rounded-full px-8 shrink-0 font-bold" style={{background: "#c8921a", color: "#fff", border: "none"}} nativeButton={false}>
                Request a Training
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-secondary text-secondary-foreground text-center">
        <div className="container mx-auto px-4 space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif max-w-2xl mx-auto">
            Ready to design a program for your school?
          </h2>
          <Button render={<Link to="/contact" />} size="lg" className="rounded-full px-12 h-16 text-xl font-bold" nativeButton={false}>
            Request a Proposal
          </Button>
        </div>
      </section>
    </div>
  );
}
