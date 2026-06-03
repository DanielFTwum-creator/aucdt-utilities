import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  Award, 
  TrendingUp, 
  LogOut, 
  Drum, 
  MessageSquare,
  ChevronRight,
  FileText,
  Activity,
  ShieldCheck,
  History,
  Settings,
  Play,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auditLogService, AuditLogEntry } from "@/services/auditLogService";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") {
      navigate("/admin/login");
    } else {
      setIsAuth(true);
      setLogs(auditLogService.getLogs());
    }
  }, [navigate]);

  const handleLogout = () => {
    auditLogService.log("Logout", "Administrator signed out");
    localStorage.removeItem("admin_auth");
    navigate("/admin/login");
  };

  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults(null);
    auditLogService.log("Test Run", "Started Playwright test suite");
    
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/admin/run-tests`, { method: "POST" });
      const data = await response.json();
      setTestResults(data.results);
      if (data.success) {
        toast.success("Tests completed successfully!");
        auditLogService.log("Test Success", "All critical journeys passed");
      } else {
        toast.error("Some tests failed.");
        auditLogService.log("Test Failure", "One or more tests failed in the suite");
      }
    } catch (error) {
      toast.error("Failed to run tests.");
      console.error(error);
    } finally {
      setIsRunningTests(false);
    }
  };

  if (!isAuth) return null;

  const stats = [
    { label: "Total Registrations", value: "1,248", icon: Users, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
    { label: "Revenue (YTD)", value: "$42,500", icon: TrendingUp, color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" },
    { label: "Active Inquiries", value: "12", icon: MessageSquare, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" },
    { label: "Certificates Issued", value: "856", icon: Award, color: "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400" },
  ];

  return (
    <div className="min-h-screen bg-accent/5 flex dark:bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-secondary-foreground flex flex-col border-r dark:border-border">
        <div className="p-8 flex items-center gap-2">
          <Drum className="h-6 w-6 text-primary" />
          <span className="font-serif font-bold">RDS Admin</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {[
            { name: "Dashboard", icon: TrendingUp, path: "/admin/dashboard" },
            { name: "Inquiries", icon: MessageSquare, path: "/admin/inquiries" },
            { name: "Seminars", icon: Calendar, path: "/admin/seminars" },
            { name: "Certificates", icon: Award, path: "/admin/certificates" },
            { name: "Blog Posts", icon: FileText, path: "/admin/blog" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-8 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between px-4">
            <span className="text-xs font-medium text-white/40">Theme</span>
            <ThemeToggle />
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-white/60 hover:text-white" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 space-y-12 overflow-y-auto">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif font-bold">Admin Control Center</h1>
            <p className="text-muted-foreground">System health and administrative overview.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-full" onClick={() => setLogs(auditLogService.getLogs())}>
              <History className="w-4 h-4 mr-2" /> Refresh Logs
            </Button>
            <Button className="rounded-full">Create New Seminar</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-white dark:bg-muted p-1 rounded-full border shadow-sm">
            <TabsTrigger value="overview" className="rounded-full px-8">Overview</TabsTrigger>
            <TabsTrigger value="audit" className="rounded-full px-8">Audit Logs</TabsTrigger>
            <TabsTrigger value="diagnostics" className="rounded-full px-8">Diagnostics</TabsTrigger>
            <TabsTrigger value="testing" className="rounded-full px-8">Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <Card key={stat.label} className="rounded-[24px] border-none shadow-sm dark:bg-muted/50">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-serif font-bold">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Recent Inquiries */}
              <Card className="rounded-[32px] border-none shadow-sm overflow-hidden dark:bg-muted/50">
                <CardHeader className="p-8 border-b flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-serif">Recent Inquiries</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary font-bold">View All</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y dark:divide-border">
                    {[
                      { school: "Oakwood Elementary", district: "USD 4", status: "New", date: "2h ago" },
                      { school: "Brattleboro Middle", district: "VT-9", status: "In Review", date: "5h ago" },
                      { school: "Boston Charter", district: "MA-12", status: "Proposal Sent", date: "1d ago" },
                    ].map((item) => (
                      <div key={item.school} className="p-6 flex items-center justify-between hover:bg-accent/5 transition-colors cursor-pointer">
                        <div className="space-y-1">
                          <p className="font-bold">{item.school}</p>
                          <p className="text-xs text-muted-foreground">{item.district}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="rounded-full">{item.status}</Badge>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Seminars */}
              <Card className="rounded-[32px] border-none shadow-sm overflow-hidden dark:bg-muted/50">
                <CardHeader className="p-8 border-b flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-serif">Upcoming Seminars</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary font-bold">Manage</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y dark:divide-border">
                    {[
                      { title: "Level 1 Certification", location: "Brattleboro, VT", date: "June 15", seats: "18/20" },
                      { title: "Advanced Rhythm", location: "Online", date: "July 22", seats: "12/15" },
                      { title: "Level 1 Certification", location: "Boston, MA", date: "Aug 10", seats: "5/25" },
                    ].map((item) => (
                      <div key={item.title + item.date} className="p-6 flex items-center justify-between hover:bg-accent/5 transition-colors cursor-pointer">
                        <div className="space-y-1">
                          <p className="font-bold">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.location} • {item.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-bold">{item.seats}</p>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Seats</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit">
            <Card className="rounded-[32px] border-none shadow-sm overflow-hidden dark:bg-muted/50">
              <CardHeader className="p-8 border-b flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl font-serif">Security Audit Logs</CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  auditLogService.clearLogs();
                  setLogs([]);
                }}>Clear History</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-accent/5 dark:bg-muted border-b dark:border-border">
                      <tr>
                        <th className="p-4 font-bold">Timestamp</th>
                        <th className="p-4 font-bold">Action</th>
                        <th className="p-4 font-bold">User</th>
                        <th className="p-4 font-bold">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-border">
                      {logs.length > 0 ? logs.map((log) => (
                        <tr key={log.id} className="hover:bg-accent/5 transition-colors">
                          <td className="p-4 text-muted-foreground whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <Badge variant={log.action.includes("Failure") ? "destructive" : "secondary"} className="rounded-full">
                              {log.action}
                            </Badge>
                          </td>
                          <td className="p-4 font-medium">{log.user}</td>
                          <td className="p-4 text-muted-foreground">{log.details}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="p-12 text-center text-muted-foreground">
                            No audit logs found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagnostics">
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
          </TabsContent>

          <TabsContent value="testing">
            <Card className="rounded-[32px] border-none shadow-sm overflow-hidden dark:bg-muted/50">
              <CardHeader className="p-8 border-b flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl font-serif">Playwright Self-Test</CardTitle>
                </div>
                <Button 
                  onClick={runTests} 
                  disabled={isRunningTests}
                  className="rounded-full px-8"
                >
                  {isRunningTests ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Full Suite
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="p-8">
                {testResults ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                        <p className="text-xs font-bold uppercase tracking-widest text-green-600 dark:text-green-400">Passed</p>
                        <p className="text-3xl font-serif font-bold text-green-700 dark:text-green-300">
                          {testResults.stats?.expected || 0}
                        </p>
                      </div>
                      <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                        <p className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400">Failed</p>
                        <p className="text-3xl font-serif font-bold text-red-700 dark:text-red-300">
                          {testResults.stats?.unexpected || 0}
                        </p>
                      </div>
                      <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Duration</p>
                        <p className="text-3xl font-serif font-bold text-blue-700 dark:text-blue-300">
                          {(testResults.stats?.duration / 1000).toFixed(2)}s
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-serif font-bold text-lg">Test Details</h3>
                      <div className="divide-y dark:divide-border border rounded-2xl overflow-hidden">
                        {testResults.suites?.[0]?.specs?.map((spec: any, idx: number) => (
                          <div key={idx} className="p-4 flex items-center justify-between bg-white dark:bg-transparent">
                            <div className="flex items-center gap-3">
                              {spec.tests[0].status === "expected" ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                              <span className="font-medium">{spec.title}</span>
                            </div>
                            <Badge variant="outline" className="rounded-full">
                              {spec.tests[0].results[0].duration}ms
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-20 h-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-serif font-bold">No Test Results</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Run the Playwright test suite to verify critical user journeys and system integrity.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
