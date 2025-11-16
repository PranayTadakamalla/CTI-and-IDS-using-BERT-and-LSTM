// New component to display real-time API request/response logs for debugging
"use client"

import { useState, useEffect } from "react"
import { ctiidsClient } from "@/lib/api-client"
import { logger } from "@/lib/logger"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function APILogsViewer() {
  const [apiLogs, setApiLogs] = useState<any[]>([])
  const [systemLogs, setSystemLogs] = useState<any[]>([])
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoRefresh) {
        setApiLogs(ctiidsClient.getRequestLogs(50))
        setSystemLogs(logger.getLogs(50))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const handleExport = (type: "api" | "system") => {
    const logs = type === "api" ? ctiidsClient.exportRequestLogs() : logger.exportLogs()
    const blob = new Blob([logs], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-logs-${Date.now()}.json`
    a.click()
  }

  return (
    <Card className="w-full border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-accent">API & System Logs</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "bg-accent text-accent-foreground" : ""}
            >
              {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="api">API Requests ({apiLogs.length})</TabsTrigger>
            <TabsTrigger value="system">System Logs ({systemLogs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-3">
            <div className="flex gap-2 mb-3">
              <Button size="sm" variant="outline" onClick={() => handleExport("api")}>
                Export API Logs
              </Button>
              <Button size="sm" variant="outline" onClick={() => ctiidsClient.clearRequestLogs()}>
                Clear Logs
              </Button>
            </div>
            <ScrollArea className="w-full h-96 border border-border rounded-lg bg-muted p-3">
              <div className="space-y-2">
                {apiLogs.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No API logs yet</p>
                ) : (
                  apiLogs.map((log) => (
                    <div key={log.id} className="p-2 border-l-2 border-accent bg-card rounded text-xs font-mono">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={log.method === "GET" ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"}
                        >
                          {log.method}
                        </Badge>
                        <code className="text-accent">{log.endpoint}</code>
                        {log.status && (
                          <Badge
                            className={log.status < 300 ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}
                          >
                            {log.status}
                          </Badge>
                        )}
                        <span className="text-muted-foreground ml-auto">{log.duration}ms</span>
                      </div>
                      {log.error && <div className="text-red-600 text-xs">{log.error}</div>}
                      <div className="text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="system" className="space-y-3">
            <div className="flex gap-2 mb-3">
              <Button size="sm" variant="outline" onClick={() => handleExport("system")}>
                Export System Logs
              </Button>
              <Button size="sm" variant="outline" onClick={() => logger.clearLogs()}>
                Clear Logs
              </Button>
            </div>
            <ScrollArea className="w-full h-96 border border-border rounded-lg bg-muted p-3">
              <div className="space-y-2">
                {systemLogs.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No system logs yet</p>
                ) : (
                  systemLogs.map((log, idx) => (
                    <div key={idx} className="p-2 border-l-2 border-purple-500 bg-card rounded text-xs font-mono">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={
                            log.level === "error"
                              ? "bg-red-100 text-red-900"
                              : log.level === "warn"
                                ? "bg-yellow-100 text-yellow-900"
                                : "bg-blue-100 text-blue-900"
                          }
                        >
                          {log.level.toUpperCase()}
                        </Badge>
                        <code className="text-accent">{log.component}</code>
                      </div>
                      <div className="text-foreground mb-1">{log.message}</div>
                      {log.data && (
                        <div className="text-muted-foreground text-xs truncate">{JSON.stringify(log.data)}</div>
                      )}
                      <div className="text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
