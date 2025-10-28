import { Suspense, useEffect, useState } from "react"

import LogEntryCard from "@/components/LogEntryCard"
import UserInput from "@/components/UserInput"
import { backendClient } from "@/lib/api/backend"
import type { LogEntry } from "@/lib/api/types"

const LogBookPage = () => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [activeContextMenuId, setActiveContextMenuId] = useState<string | null>(
    null
  )

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

  const handleDelete = async (id: string) => {
    await backendClient.deleteLogEntry(id)
    fetchLogEntries()
  }

  const handleContextMenuOpenChange = (id: string) => (open: boolean) => {
    setActiveContextMenuId((prev) => (open ? id : prev === id ? null : prev))
  }

  useEffect(() => {
    fetchLogEntries()
  }, [])

  return (
    <div className="flex flex-col h-full w-full justify-between items-center">
      <div className="flex-1 min-h-0 w-full max-w-[600px] overflow-y-auto [scrollbar-width:none]">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="h-[56px]" />
          <div className="flex flex-col gap-2 pb-4">
            {logEntries.map((logEntry) => (
              <LogEntryCard
                key={logEntry.id}
                logEntry={logEntry}
                onDelete={handleDelete}
                isDimmed={
                  activeContextMenuId !== null &&
                  activeContextMenuId !== logEntry.id
                }
                onContextMenuOpenChange={handleContextMenuOpenChange(
                  logEntry.id
                )}
              />
            ))}
          </div>
        </Suspense>
      </div>

      <UserInput onSend={sendMessage} onRecord={recordMessage} />
    </div>
  )
}

export default LogBookPage
