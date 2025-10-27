import axios, { type AxiosInstance } from "axios"

import { type LogEntry } from "@/lib/api/types"

export class BackendClient {
  private client: AxiosInstance
  private baseUrl: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000"

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  async getLogEntries(): Promise<LogEntry[]> {
    try {
      const response = await this.client.get<LogEntry[]>("/log-entries")
      return response.data
    } catch (error) {
      console.error("Error in getLogEntries request:", error)
      throw error
    }
  }

  async createLogEntry(content: string): Promise<void> {
    try {
      await this.client.post(`/log-entries`, { content })
    } catch (error) {
      console.error("Error in createLogEntry request:", error)
      throw error
    }
  }

  async deleteLogEntry(id: string): Promise<void> {
    try {
      await this.client.delete(`/log-entries/${id}`)
    } catch (error) {
      console.error("Error in deleteLogEntry request:", error)
      throw error
    }
  }
}

export const backendClient = new BackendClient()
