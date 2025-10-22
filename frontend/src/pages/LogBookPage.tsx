import { Suspense, useEffect, useState } from "react"

import UserInput from "@/components/UserInput"
import { backendClient } from "@/lib/api/backend"
import type { LogEntry } from "@/lib/api/types"

const LogBookPage = () => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])

  const sendMessage = async (message: string) => {
    await backendClient.createLogEntry(message)
    fetchLogEntries()
  }

  const recordMessage = () => {
    console.log("recordMessage")
  }

  const fetchLogEntries = async () => {
    const logEntries = await backendClient.getLogEntries()
    setLogEntries(logEntries)
  }

  useEffect(() => {
    fetchLogEntries()
  }, [])

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div>
          {logEntries.map((logEntry) => (
            <div key={logEntry.created_at!}>{logEntry.content}</div>
          ))}
        </div>
      </Suspense>

      <UserInput onSend={sendMessage} onRecord={recordMessage} />
    </>
  )
}

export default LogBookPage
