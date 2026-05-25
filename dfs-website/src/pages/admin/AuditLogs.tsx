import { useState, useEffect } from "react";
import { History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auditLogService, AuditLogEntry } from "@/services/auditLogService";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setLogs(auditLogService.getLogs());
  }, []);

  const clearLogs = () => {
    auditLogService.clearLogs();
    setLogs([]);
  };

  return (
    <Card className="rounded-[32px] border-none shadow-sm overflow-hidden dark:bg-muted/50">
      <CardHeader className="p-8 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl font-serif">Security Audit Logs</CardTitle>
        </div>
        <Button variant="outline" size="sm" onClick={clearLogs}>Clear History</Button>
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
  );
}
