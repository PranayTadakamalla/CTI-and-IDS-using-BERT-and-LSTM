"use client"

import { useState } from "react"
import { ThreatAnalyzerForm } from "@/components/threat-analyzer-form"
import { ThreatDashboard } from "@/components/threat-dashboard"
import { ModelMetrics } from "@/components/model-metrics"
import { APILogsViewer } from "@/components/api-logs-viewer"
import { LoadingAnimation } from "@/components/loading-animation"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [threatResult, setThreatResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState(null)
  const [activeTab, setActiveTab] = useState("analysis")

  const handleAnalyze = async (data: any) => {
    setLoading(true)
    try {
      setThreatResult(data)
      setActiveTab("results")

      // Fetch real metrics from backend
      try {
        const metricsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/metrics`)
        const metricsData = await metricsResponse.json()
        setMetrics(metricsData)
      } catch (err) {
        console.error("Failed to fetch metrics:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="results">Results {loading && <span className="ml-2 animate-spin">⟳</span>}</TabsTrigger>
            <TabsTrigger value="logs">Logs & Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            {loading && (
              <div className="flex justify-center items-center py-12">
                <LoadingAnimation />
              </div>
            )}
            {!loading && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <ThreatAnalyzerForm onAnalyze={handleAnalyze} loading={loading} />
                </div>
                <div className="lg:col-span-2">{threatResult && <ThreatDashboard result={threatResult} />}</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <LoadingAnimation />
              </div>
            ) : threatResult ? (
              <div className="space-y-6">
                <ThreatDashboard result={threatResult} />
                {metrics && <ModelMetrics metrics={metrics} />}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                No analysis results yet. Submit a threat analysis to see results.
              </div>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <APILogsViewer />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
