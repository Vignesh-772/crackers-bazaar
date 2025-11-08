import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reportsApi } from "@/lib/api";

const ReportsPanel = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleExport = async () => {
    if (!from || !to) return;
    const blob = await reportsApi.exportAuditLogs(from, to);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${from}-to-${to}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm">From</label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">To</label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button onClick={handleExport} disabled={!from || !to}>Export Audit Logs</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsPanel;


