"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ctiidsClient } from "@/lib/api-client"
import { logger } from "@/lib/logger"
import { AlertTriangle } from "lucide-react"

interface ThreatAnalyzerFormProps {
  onAnalyze: (data: any) => void
  loading: boolean
}

export function ThreatAnalyzerForm({ onAnalyze, loading }: ThreatAnalyzerFormProps) {
  const [mailHeaders, setMailHeaders] = useState("")
  const [description, setDescription] = useState("")
  const [indicator, setIndicator] = useState("")
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!mailHeaders.trim() && !description.trim()) {
      setError("Please provide email headers or threat description")
      logger.warn("ThreatForm", "Form submission failed - empty inputs")
      return
    }

    logger.info("ThreatForm", "Submitting threat analysis request", {
      hasMailHeaders: !!mailHeaders.trim(),
      hasDescription: !!description.trim(),
      hasIndicator: !!indicator.trim(),
      hasScreenshot: !!screenshotFile,
    })

    try {
      const response = await ctiidsClient.analyzeThreat({
        mailHeaders: mailHeaders.trim(),
        description: description.trim(),
        indicator: indicator.trim(),
      })

      logger.info("ThreatForm", "Analysis successful", response)
      onAnalyze(response)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error"
      setError(`Analysis failed: ${errorMsg}`)
      logger.error("ThreatForm", "Analysis request failed", { error: errorMsg })
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-accent">Threat Analysis</CardTitle>
        <CardDescription>Submit email headers, screenshots or threat details for analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert className="bg-destructive/15 border-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Headers / Mail Content</label>
            <Textarea
              placeholder="Paste email headers here (from, to, subject, SPF, DKIM, etc.)"
              value={mailHeaders}
              onChange={(e) => setMailHeaders(e.target.value)}
              className="min-h-32 bg-input border-border text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Threat Description / IOC Details</label>
            <Textarea
              placeholder="Describe the threat, suspicious behavior, or paste IOCs (IP, domain, hash)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 bg-input border-border text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Threat Indicator (Optional)</label>
            <Input
              placeholder="e.g., IP address, domain, file hash"
              value={indicator}
              onChange={(e) => setIndicator(e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Screenshot / Evidence (Optional)</label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshotFile(e.files?.[0] || null)}
                className="bg-input border-border text-foreground file:bg-accent file:text-accent-foreground file:border-0 file:px-3 file:py-2"
              />
              {screenshotFile && <span className="text-xs text-muted-foreground">{screenshotFile.name}</span>}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || (!mailHeaders && !description)}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {loading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4">⟳</div>
                Analyzing...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Analyze Threat
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
