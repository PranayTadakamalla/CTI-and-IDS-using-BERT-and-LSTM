"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from "recharts"

interface ModelMetricsProps {
  metrics: any
}

export function ModelMetrics({ metrics }: ModelMetricsProps) {
  const performanceData = [
    {
      model: "BERT",
      accuracy: metrics?.bert_accuracy || 0.94,
      precision: metrics?.bert_precision || 0.92,
      f1: metrics?.bert_f1 || 0.93,
    },
    {
      model: "LSTM",
      accuracy: metrics?.lstm_accuracy || 0.91,
      precision: metrics?.lstm_precision || 0.89,
      f1: metrics?.lstm_f1 || 0.9,
    },
    {
      model: "CNN",
      accuracy: metrics?.cnn_accuracy || 0.89,
      precision: metrics?.cnn_precision || 0.87,
      f1: metrics?.cnn_f1 || 0.88,
    },
  ]

  const metricsComparisonData = [
    { metric: "Accuracy", BERT: 94, LSTM: 91, CNN: 89 },
    { metric: "Precision", BERT: 92, LSTM: 89, CNN: 87 },
    { metric: "Recall", BERT: 90, LSTM: 88, CNN: 85 },
    { metric: "F1-Score", BERT: 93, LSTM: 90, CNN: 88 },
    { metric: "AUC-ROC", BERT: 95, LSTM: 92, CNN: 90 },
  ]

  const timeSeriesData = metrics?.time_series || [
    { time: "00:00", detections: 12, threats: 3 },
    { time: "04:00", detections: 19, threats: 5 },
    { time: "08:00", detections: 28, threats: 8 },
    { time: "12:00", detections: 32, threats: 10 },
    { time: "16:00", detections: 26, threats: 7 },
    { time: "20:00", detections: 18, threats: 4 },
  ]

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-accent">Model Performance Comparison</CardTitle>
          <CardDescription>Real-time accuracy, precision, and F1-score metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis dataKey="model" stroke="hsl(var(--color-foreground))" />
              <YAxis stroke="hsl(var(--color-foreground))" domain={[0, 1]} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--color-card))", border: "1px solid hsl(var(--color-border))" }}
              />
              <Legend />
              <Bar dataKey="accuracy" fill="hsl(var(--color-accent))" name="Accuracy" />
              <Bar dataKey="precision" fill="hsl(var(--color-secondary))" name="Precision" />
              <Bar dataKey="f1" fill="#a855f7" name="F1-Score" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-accent">Detailed Metrics Overview</CardTitle>
          <CardDescription>Comprehensive model performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={metricsComparisonData}>
              <PolarGrid stroke="hsl(var(--color-border))" />
              <PolarAngleAxis dataKey="metric" stroke="hsl(var(--color-foreground))" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(var(--color-border))" />
              <Tooltip
                contentStyle={{ background: "hsl(var(--color-card))", border: "1px solid hsl(var(--color-border))" }}
              />
              <Scatter name="BERT" dataKey="BERT" fill="hsl(var(--color-accent))" />
              <Scatter name="LSTM" dataKey="LSTM" fill="hsl(var(--color-secondary))" />
              <Scatter name="CNN" dataKey="CNN" fill="#a855f7" />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-accent">Detection Trends</CardTitle>
          <CardDescription>Threat detections and threat count over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis dataKey="time" stroke="hsl(var(--color-foreground))" />
              <YAxis stroke="hsl(var(--color-foreground))" />
              <Tooltip
                contentStyle={{ background: "hsl(var(--color-card))", border: "1px solid hsl(var(--color-border))" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="detections"
                stroke="hsl(var(--color-accent))"
                strokeWidth={2}
                name="Total Detections"
              />
              <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} name="Threat Count" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Detections", value: metrics?.total_detections || "1,243", color: "accent" },
          {
            label: "True Positive Rate",
            value: `${((metrics?.true_positive_rate || 0.91) * 100).toFixed(1)}%`,
            color: "green",
          },
          {
            label: "False Positive Rate",
            value: `${((metrics?.false_positive_rate || 0.08) * 100).toFixed(1)}%`,
            color: "orange",
          },
          {
            label: "Avg Confidence",
            value: `${((metrics?.average_confidence || 0.88) * 100).toFixed(0)}%`,
            color: "blue",
          },
        ].map((stat, idx) => (
          <Card key={idx} className="bg-card border-border">
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-lg font-bold text-${stat.color}-500`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
