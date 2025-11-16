import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulated metrics - in production, fetch from your ML models
    const metrics = {
      bert_accuracy: 0.92,
      bert_precision: 0.89,
      lstm_accuracy: 0.88,
      lstm_precision: 0.85,
      cnn_accuracy: 0.9,
      cnn_precision: 0.87,
      total_detections: 1243,
      true_positive_rate: 0.91,
      false_positive_rate: 0.08,
      time_series: [
        { time: "00:00", detections: 12 },
        { time: "04:00", detections: 19 },
        { time: "08:00", detections: 28 },
        { time: "12:00", detections: 32 },
        { time: "16:00", detections: 26 },
        { time: "20:00", detections: 18 },
      ],
    }

    console.log("[Metrics API] Fetched model metrics")

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("[Metrics API] Error:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
