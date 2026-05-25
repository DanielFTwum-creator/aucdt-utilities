import { Activity, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDiagnostics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="rounded-[32px] border-none shadow-sm dark:bg-muted/50">
        <CardHeader className="p-8">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            <CardTitle className="text-xl font-serif">System Health</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8 space-y-6">
          <div className="space-y-4">
            {[
              { label: "API Connectivity", status: "Healthy", color: "text-green-500" },
              { label: "Database Latency", status: "24ms", color: "text-green-500" },
              { label: "Storage Capacity", status: "12% Used", color: "text-green-500" },
              { label: "SSL Certificate", status: "Valid (245 days)", color: "text-green-500" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b dark:border-border last:border-0">
                <span className="text-sm font-medium">{item.label}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full rounded-full">Run Full System Scan</Button>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border-none shadow-sm dark:bg-muted/50">
        <CardHeader className="p-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-xl font-serif">Security Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8 space-y-6">
          <div className="space-y-4">
            {[
              { label: "Firewall Status", status: "Active", color: "text-green-500" },
              { label: "DDoS Protection", status: "Enabled", color: "text-green-500" },
              { label: "Failed Login Attempts (24h)", status: "3", color: "text-amber-500" },
              { label: "Last Security Audit", status: "2 days ago", color: "text-muted-foreground" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b dark:border-border last:border-0">
                <span className="text-sm font-medium">{item.label}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full rounded-full">Manage Security Keys</Button>
        </CardContent>
      </Card>
    </div>
  );
}
