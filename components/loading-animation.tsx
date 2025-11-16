"use client"

import { useState, useEffect } from "react"

export function LoadingAnimation() {
  const [dots, setDots] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated threat scanner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-transparent border-t-accent border-r-secondary rounded-full animate-spin"></div>
        <div
          className="absolute inset-2 border-4 border-transparent border-b-accent/50 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>
        <div className="absolute inset-4 border-2 border-accent/30 rounded-full animate-pulse"></div>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-accent animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Status text with animated dots */}
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground">Analyzing Threat</p>
        <p className="text-sm text-muted-foreground h-6">Running models{".".repeat(dots)}</p>
      </div>

      {/* Progress indicators */}
      <div className="space-y-2 w-40">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>BERT Analysis</span>
          <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-accent/70 rounded-full animate-pulse" style={{ width: "75%" }}></div>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>LSTM Sequence</span>
          <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-secondary/70 rounded-full animate-pulse" style={{ width: "50%" }}></div>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>CNN Detection</span>
          <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-accent/50 rounded-full animate-pulse" style={{ width: "25%" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
