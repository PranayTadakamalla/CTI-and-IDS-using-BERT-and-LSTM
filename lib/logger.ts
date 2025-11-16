// Comprehensive logging system for frontend request/response tracking and debugging
type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  timestamp: string
  level: LogLevel
  component: string
  message: string
  data?: any
  duration?: number
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000

  private getLogLevel(): LogLevel {
    const level = process.env.NEXT_PUBLIC_LOG_LEVEL || "info"
    return level as LogLevel
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    }
    return levels[level] >= levels[this.getLogLevel()]
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, component, message, duration } = entry
    const durationStr = duration ? ` [${duration.toFixed(2)}ms]` : ""
    return `[${timestamp}] [${level.toUpperCase()}] [${component}]${durationStr} ${message}`
  }

  log(level: LogLevel, component: string, message: string, data?: any) {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data,
    }

    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    if (process.env.NEXT_PUBLIC_ENABLE_CONSOLE_LOGS !== "false") {
      const formatted = this.formatLog(entry)
      const logFn = level === "error" ? console.error : level === "warn" ? console.warn : console.log
      logFn(formatted, data || "")
    }
  }

  debug(component: string, message: string, data?: any) {
    this.log("debug", component, message, data)
  }

  info(component: string, message: string, data?: any) {
    this.log("info", component, message, data)
  }

  warn(component: string, message: string, data?: any) {
    this.log("warn", component, message, data)
  }

  error(component: string, message: string, data?: any) {
    this.log("error", component, message, data)
  }

  getLogs(limit = 100): LogEntry[] {
    return this.logs.slice(-limit)
  }

  clearLogs() {
    this.logs = []
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

export const logger = new Logger()
