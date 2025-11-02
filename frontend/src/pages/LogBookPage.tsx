import { useEffect, useState } from "react"

import LogEntryList from "@/components/LogEntryList"
import UserInput from "@/components/UserInput"
import { backendClient } from "@/lib/api/backend"
import type { LogEntry } from "@/lib/api/types"

const LogBookPage = () => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (message: string) => {
    setIsCreating(true)

    try {
      await backendClient.createLogEntry(message)
      await fetchLogEntries()
    } finally {
      setIsCreating(false)
    }
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

  useEffect(() => {
    setIsLoading(true)
    fetchLogEntries().finally(() => {
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="flex flex-col h-full w-full justify-between items-center">
      <div className="flex-1 min-h-0 w-full max-w-[600px] overflow-y-auto [scrollbar-width:none]">
        <div className="h-[56px]" />
        <LogEntryList
          logEntries={logEntries}
          handleDelete={handleDelete}
          isLoading={isLoading}
          isCreating={isCreating}
        />
      </div>

      <UserInput onSend={sendMessage} onRecord={recordMessage} />
    </div>
  )
}

export default LogBookPage
