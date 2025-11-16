import { logger } from "./logger"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface AnalysisRequest {
  mailHeaders?: string
  description?: string
  email_text?: string
  packets?: number[]
  indicator?: string
  screenshot?: string
}

export interface AnalysisResponse {
  threat_level: string
  malicious_score: number
  bert_confidence?: number
  lstm_confidence?: number
  cnn_confidence?: number
  cti_analysis?: string
  ids_analysis?: string
  indicators?: string[]
  timestamp?: string
  confidence?: number
}

interface RequestLog {
  id: string
  method: string
  endpoint: string
  timestamp: string
  requestBody?: any
  responseBody?: any
  status?: number
  duration: number
  error?: string
}

export class CTIIDSClient {
  private requestLogs: RequestLog[] = []
  private maxLogs = 500

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private logRequest(id: string, method: string, endpoint: string, body?: any) {
    const entry: RequestLog = {
      id,
      method,
      endpoint,
      timestamp: new Date().toISOString(),
      requestBody: body,
      duration: 0,
    }

    logger.info("API-Client", `${method} ${endpoint}`, { requestId: id })
    if (body) {
      logger.debug("API-Client", `Request body`, body)
    }

    return entry
  }

  private logResponse(log: RequestLog, response: any, status: number) {
    log.responseBody = response
    log.status = status
    log.duration = Date.now() - new Date(log.timestamp).getTime()

    this.requestLogs.push(log)
    if (this.requestLogs.length > this.maxLogs) {
      this.requestLogs.shift()
    }

    logger.info("API-Client", `${log.method} ${log.endpoint} - Status: ${status} - Duration: ${log.duration}ms`, {
      requestId: log.id,
    })
    logger.debug("API-Client", "Response body", response)
  }

  private logError(log: RequestLog, error: any) {
    log.error = error.message
    log.duration = Date.now() - new Date(log.timestamp).getTime()

    this.requestLogs.push(log)
    if (this.requestLogs.length > this.maxLogs) {
      this.requestLogs.shift()
    }

    logger.error("API-Client", `${log.method} ${log.endpoint} failed`, {
      requestId: log.id,
      error: error.message,
      duration: log.duration,
    })
  }

  async analyzeThreat(request: AnalysisRequest): Promise<AnalysisResponse> {
    const requestId = this.generateRequestId()
    const endpoint = "/api/analyze"
    const log = this.logRequest(requestId, "POST", endpoint, request)

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })

      const data = await response.json()

      this.logResponse(log, data, response.status)

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      return data
    } catch (error) {
      this.logError(log, error as Error)
      throw error
    }
  }

  async getMetrics() {
    const requestId = this.generateRequestId()
    const endpoint = "/api/metrics"
    const log = this.logRequest(requestId, "GET", endpoint)

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`)

      const data = await response.json()
      this.logResponse(log, data, response.status)

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      return data
    } catch (error) {
      this.logError(log, error as Error)
      throw error
    }
  }

  async fetchCTI(indicator: string) {
    const requestId = this.generateRequestId()
    const endpoint = `/api/cti/fetch?indicator=${encodeURIComponent(indicator)}`
    const log = this.logRequest(requestId, "GET", endpoint)

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`)

      const data = await response.json()
      this.logResponse(log, data, response.status)

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      return data
    } catch (error) {
      this.logError(log, error as Error)
      throw error
    }
  }

  async processIDS(packets: any[]) {
    const requestId = this.generateRequestId()
    const endpoint = "/api/ids/process"
    const log = this.logRequest(requestId, "POST", endpoint, packets)

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packets),
      })

      const data = await response.json()
      this.logResponse(log, data, response.status)

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      return data
    } catch (error) {
      this.logError(log, error as Error)
      throw error
    }
  }

  async healthCheck() {
    const requestId = this.generateRequestId()
    const endpoint = "/health"
    const log = this.logRequest(requestId, "GET", endpoint)

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`)

      const data = await response.json()
      this.logResponse(log, data, response.status)

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      return data
    } catch (error) {
      this.logError(log, error as Error)
      throw error
    }
  }

  getRequestLogs(limit = 100): RequestLog[] {
    return this.requestLogs.slice(-limit)
  }

  clearRequestLogs() {
    this.requestLogs = []
    logger.info("API-Client", "Request logs cleared")
  }

  exportRequestLogs(): string {
    return JSON.stringify(this.requestLogs, null, 2)
  }
}

export const ctiidsClient = new CTIIDSClient()
