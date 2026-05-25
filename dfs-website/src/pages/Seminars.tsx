import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, MapPin, Users, Clock, ArrowRight, Award, FileCheck } from "lucide-react";
import { motion } from "motion/react";

const seminars = [
  {
    id: 1,
    title: "Level 1 Facilitator Certification",
    date: "June 15-16, 2026",
    location: "Brattleboro, VT",
    price: "$495",
    deposit: "$150",
    status: "Open",
    capacity: "20 seats left",
  },
  {
    id: 2,
    title: "Advanced Rhythm for SEL",
    date: "July 22-23, 2026",
    location: "Online (Live Zoom)",
    price: "$395",
    deposit: "$100",
    status: "Limited",
    capacity: "5 seats left",
  },
  {
    id: 3,
    title: "Level 1 Facilitator Certification",
    date: "August 10-11, 2026",
    location: "Boston, MA",
    price: "$495",
    deposit: "$150",
    status: "Open",
    capacity: "25 seats left",
  },
];

export default function Seminars() {
  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif">In-Service Training Seminars</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Bring the "Drumming for SEL Success" training to your school. Learn the techniques, 
              curriculum, and science behind our professional development approach.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {seminars.map((seminar, i) => (
              <motion.div
                key={seminar.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="rounded-[32px] overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow group">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-primary p-8 md:w-64 flex flex-col justify-center items-center text-primary-foreground text-center space-y-2">
                      <span className="text-xs font-bold uppercase tracking-widest opacity-70">Starting at</span>
                      <span className="text-4xl font-serif font-bold">{seminar.price}</span>
                      <Badge variant="secondary" className="mt-2">{seminar.status}</Badge>
                    </div>
                    <CardContent className="p-8 flex-1 flex flex-col md:flex-row justify-between items-center gap-8">
                      <div className="space-y-4 flex-1">
                        <h3 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">
                          {seminar.title.replace("Facilitator Certification", "SEL Success Training")}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-primary" />
                            {seminar.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            {seminar.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            {seminar.capacity}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            In-Service Intensive
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-primary" />
                            12 PD Credits · 1.2 CEU
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 w-full md:w-auto">
                        <Button render={<Link to="/contact" />} className="rounded-full px-8 font-bold" nativeButton={false}>
                          Register Now
                        </Button>
                        <Button render={<Link to="/programs" />} variant="outline" className="rounded-full px-8" nativeButton={false}>
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* PD Credits Explainer */}
          <div className="rounded-[24px] overflow-hidden border-2" style={{borderColor: "#2d6a4f33"}}>
            <div className="p-8 md:p-10" style={{background: "linear-gradient(135deg, #e8f5ee, #dff0e8)"}}>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="space-y-3 flex-1">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{color: "#c8921a"}}>Vermont AOE · IACET Standard</span>
                  <h3 className="text-3xl font-serif font-bold">PD Credits Included</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    All trainings qualify for professional development credit per <strong>Vermont Agency of Education</strong> guidelines. <strong>1 contact hour = 1 PD credit.</strong> A two-day seminar earns <strong>12 PD credits (1.2 CEU)</strong> — ready to submit for educator relicensure.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 shrink-0">
                  {[
                    { n: "6", label: "Credits\n1-Day" },
                    { n: "12", label: "Credits\n2-Day" },
                    { n: "30", label: "Credits\nTrain-the-Trainer" },
                  ].map(item => (
                    <div key={item.label} className="bg-white rounded-[16px] p-4 text-center shadow-sm">
                      <span className="text-3xl font-serif font-bold" style={{color: "#2d6a4f"}}>{item.n}</span>
                      <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line font-bold uppercase tracking-wide">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-8 md:px-10 py-5 flex items-center gap-3" style={{background: "#1c3a28"}}>
              <FileCheck className="w-5 h-5 text-white/70 shrink-0" />
              <p className="text-sm text-white/70">
                Every participant receives a signed <strong className="text-white">Certificate of Completion</strong> documenting hours, credits, CASEL competencies, and facilitator credentials — suitable for district HR submission.
              </p>
            </div>
          </div>

          <div className="bg-accent/5 rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-serif font-bold">What's Included?</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Full SEL Success Curriculum",
                  "Access to Resource Library",
                  "Professional Development Credits",
                  "Ongoing Facilitator Support",
                  "Implementation Materials",
                  "Video Training Guides",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full md:w-1/3 aspect-square rounded-[32px] overflow-hidden">
              <img 
                src="https://picsum.photos/seed/seminar/600/600" 
                alt="Seminar Experience" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
