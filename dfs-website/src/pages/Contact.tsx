import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Send, Drum } from "lucide-react";
import { toast } from "sonner";

type InquiryForm = {
  schoolName: string;
  district: string;
  contactName: string;
  email: string;
  phone: string;
  gradeLevels: string;
  preferredDates: string;
  programType: string;
};

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InquiryForm>();

  const onSubmit = async (data: InquiryForm) => {
    const res = await fetch(`${import.meta.env.BASE_URL}api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setIsSubmitted(true);
      toast.success("Inquiry sent successfully!");
    } else {
      toast.error("Something went wrong. Please try again or email us directly.");
    }
  };

  return (
    <div className="min-h-screen bg-accent/5 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="text-center mb-12 space-y-4">
                  <h1 className="text-4xl md:text-6xl font-serif">Request In-Service Training</h1>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Empower your staff with the power of rhythmic facilitation. Fill out the form below 
                    and we will get back to you with a professional development proposal within 2 business days.
                  </p>
                </div>

                <Card className="rounded-[32px] border-none shadow-2xl overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="bg-primary p-12 text-primary-foreground space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-serif font-bold">Why SEL Success Training?</h3>
                        <p className="text-primary-foreground/80 text-sm leading-relaxed">
                          We provide the instruments, the curriculum, and the expert 
                          training. Our seminars are designed to be immediately 
                          actionable for teachers, counselors, and administrators.
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <Drum className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Instruments Provided</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Professional Development Credits</span>
                      </div>
                    </div>

                    <CardContent className="md:col-span-2 p-12 bg-white">
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="schoolName">School / Organization Name</Label>
                            <Input 
                              id="schoolName" 
                              {...register("schoolName", { required: "Organization name is required" })} 
                              placeholder="Oakwood Elementary"
                            />
                            {errors.schoolName && <p className="text-xs text-red-500">{errors.schoolName.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="district">District / Region</Label>
                            <Input id="district" {...register("district")} placeholder="Unified School District 4" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="contactName">Contact Name</Label>
                            <Input 
                              id="contactName" 
                              {...register("contactName", { required: "Contact name is required" })} 
                              placeholder="Jane Doe"
                            />
                            {errors.contactName && <p className="text-xs text-red-500">{errors.contactName.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              {...register("email", { required: "Email is required" })} 
                              placeholder="jane@school.edu"
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" {...register("phone")} placeholder="(555) 000-0000" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gradeLevels">Target Student Grades</Label>
                            <Input id="gradeLevels" {...register("gradeLevels")} placeholder="K-5, 6-8, etc." />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="preferredDates">Preferred Dates / Timeframe</Label>
                          <Input id="preferredDates" {...register("preferredDates")} placeholder="e.g. Fall 2026, or specific in-service days" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="programType">Training Type Interest</Label>
                          <select 
                            id="programType" 
                            {...register("programType")}
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="seminar">In-Service Seminar (1 Day)</option>
                            <option value="intensive">Multi-Day Staff Residency</option>
                            <option value="custom">Custom Professional Development</option>
                          </select>
                        </div>

                        <Button type="submit" className="w-full h-12 rounded-full text-lg font-bold" disabled={isSubmitting}>
                          {isSubmitting ? "Sending..." : "Send Inquiry"} <Send className="ml-2 h-5 w-5" />
                        </Button>
                      </form>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 space-y-8"
              >
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-serif font-bold">Thank You!</h2>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Your inquiry has been received. Steve Ferraris or a member of our 
                    team will review it and contact you shortly.
                  </p>
                </div>
                <Button variant="outline" onClick={() => setIsSubmitted(false)} className="rounded-full">
                  Send Another Inquiry
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
