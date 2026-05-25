import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Drum, Award, Calendar, User } from "lucide-react";
import { motion } from "motion/react";

export default function VerifyCertificate() {
  const { id } = useParams();
  
  // Mock verification data
  const certData = {
    id: id || "CERT-2026-001",
    holder: "Jane Smith",
    seminar: "SEL Success Training - Level 1",
    date: "March 15, 2026",
    status: "Verified",
  };

  return (
    <div className="min-h-screen bg-accent/5 py-24 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white">
            <div className="bg-primary p-12 text-primary-foreground text-center space-y-4">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-serif font-bold">Certificate Verification</h1>
              <Badge variant="secondary" className="bg-green-500 text-white border-none px-4 py-1">
                <CheckCircle2 className="w-4 h-4 mr-2" /> {certData.status}
              </Badge>
            </div>
            
            <CardContent className="p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <User className="w-3 h-3" /> Certificate Holder
                  </span>
                  <p className="text-xl font-serif font-bold">{certData.holder}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Award className="w-3 h-3" /> Certification
                  </span>
                  <p className="text-xl font-serif font-bold">{certData.seminar}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Issue Date
                  </span>
                  <p className="text-xl font-serif font-bold">{certData.date}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Certificate ID
                  </span>
                  <p className="text-xl font-mono font-bold text-primary">{certData.id}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <Drum className="h-6 w-6 text-primary" />
                  <span className="font-serif font-bold">Root Drumming Systems</span>
                </div>
                <p className="text-xs text-muted-foreground text-center md:text-right max-w-[200px]">
                  This certificate was issued by Root Drumming Systems, LLC following 
                  successful completion of the required training.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-center mt-8 text-sm text-muted-foreground">
            Questions about this certification? <a href="/contact" className="text-primary font-bold hover:underline">Contact us</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
