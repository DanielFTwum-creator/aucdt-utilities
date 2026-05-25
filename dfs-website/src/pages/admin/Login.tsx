import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Drum, Lock } from "lucide-react";
import { toast } from "sonner";

import { auditLogService } from "@/services/auditLogService";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("admin_auth", "true");
      auditLogService.log("Login Success", "Administrator accessed the portal");
      toast.success("Logged in as Admin");
      navigate("/admin/dashboard");
    } else {
      auditLogService.log("Login Failure", "Failed attempt with password: " + password);
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-[32px] border-none shadow-2xl">
        <CardHeader className="text-center space-y-4 pt-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Drum className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-serif">Admin Portal</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Administrator Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="pl-10"
                />
                <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 rounded-full font-bold">
              Enter Dashboard
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground">
            Authorized personnel only. All access is logged.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
