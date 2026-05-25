import { useState } from "react";
import { Play, CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auditLogService } from "@/services/auditLogService";
import { toast } from "sonner";

export default function AdminTesting() {
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults(null);
    auditLogService.log("Test Run", "Started Puppeteer test suite");
    
    try {
      const response = await fetch("/api/admin/run-tests", { method: "POST" });
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

  return (
    <Card className="rounded-[32px] border-none shadow-sm overflow-hidden dark:bg-muted/50">
      <CardHeader className="p-8 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl font-serif">Puppeteer Self-Test</CardTitle>
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
                  {testResults.passed || 0}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400">Failed</p>
                <p className="text-3xl font-serif font-bold text-red-700 dark:text-red-300">
                  {testResults.failed || 0}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Duration</p>
                <p className="text-3xl font-serif font-bold text-blue-700 dark:text-blue-300">
                  {testResults.duration}s
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg">Test Details</h3>
              <div className="divide-y dark:divide-border border rounded-2xl overflow-hidden">
                {testResults.tests?.map((test: any, idx: number) => (
                  <div key={idx} className="p-4 flex items-center justify-between bg-white dark:bg-transparent">
                    <div className="flex items-center gap-3">
                      {test.status === "passed" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="font-medium">{test.name}</span>
                    </div>
                    <Badge variant="outline" className="rounded-full">
                      {test.duration}ms
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
                Run the Puppeteer test suite to verify critical user journeys and system integrity.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
