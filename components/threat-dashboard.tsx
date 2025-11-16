"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Shield, TrendingUp, Zap } from "lucide-react"
import { useState, useEffect } from "react"

interface ThreatDashboardProps {
  result: any
}

export function ThreatDashboard({ result }: ThreatDashboardProps) {
  const [explanation, setExplanation] = useState("")

  useEffect(() => {
    if (result?.explanation) {
      setExplanation(result.explanation)
    }
  }, [result])

  const threatLevel = result?.threat_level || "Unknown"
  const score = result?.malicious_score || result?.combined_score || 0
  const confidence = result?.confidence || 0

  const getThreatColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "critical":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      case "very low":
        return "text-green-400"
      default:
        return "text-muted-foreground"
    }
  }

  const getThreatBg = (level: string) => {
    switch (level.toLowerCase()) {
      case "critical":
        return "bg-red-950/30"
      case "high":
        return "bg-orange-950/30"
      case "medium":
        return "bg-yellow-950/30"
      case "low":
        return "bg-green-950/30"
      case "very low":
        return "bg-green-900/20"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="text-red-500" />
            Threat Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`p-4 rounded-lg ${getThreatBg(threatLevel)} border border-current/20`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Threat Level</span>
              <span className={`text-3xl font-bold ${getThreatColor(threatLevel)}`}>{threatLevel}</span>
            </div>
          </div>

          <div className="bg-input rounded-lg p-4 border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-foreground font-medium">Malicious Score</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                {(score * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-border/50 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-accent via-secondary to-accent h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(score * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-input rounded-lg p-3 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Model Confidence</p>
              <p className="text-xl font-bold text-accent">{(confidence * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-input rounded-lg p-3 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Detection Count</p>
              <p className="text-xl font-bold text-secondary">{result?.detected_threats?.length || 0}</p>
            </div>
          </div>

          {explanation && (
            <div className="space-y-2 border-t border-border pt-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                AI Explanation
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic">{explanation}</p>
            </div>
          )}

          {result?.detected_threats && result.detected_threats.length > 0 && (
            <div className="space-y-2 border-t border-border pt-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-500" />
                Detected Threats ({result.detected_threats.length})
              </h3>
              <div className="space-y-2">
                {result.detected_threats.map((threat: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded border border-border/30"
                  >
                    <span className="text-xs font-mono text-foreground">{threat.type}</span>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xs font-semibold text-accent">
                          {((threat.score || threat.confidence) * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-muted-foreground">confidence</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result?.cti_analysis && (
            <div className="space-y-2 border-t border-border pt-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                CTI Analysis
              </h3>
              <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded font-mono max-h-32 overflow-y-auto">
                {typeof result.cti_analysis === "object"
                  ? JSON.stringify(result.cti_analysis, null, 2)
                  : result.cti_analysis}
              </div>
            </div>
          )}

          {result?.ids_analysis && (
            <div className="space-y-2 border-t border-border pt-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                IDS Analysis
              </h3>
              <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded font-mono max-h-32 overflow-y-auto">
                {typeof result.ids_analysis === "object"
                  ? JSON.stringify(result.ids_analysis, null, 2)
                  : result.ids_analysis}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
