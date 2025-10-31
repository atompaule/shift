import { useState } from "react"

import type { LogEntry } from "@/lib/api/types"

import LogEntryCard from "./LogEntryCard"

const LogEntryList = ({
  logEntries,
  handleDelete,
}: {
  logEntries: LogEntry[]
  handleDelete: (id: string) => void
}) => {
  const [activeContextMenuId, setActiveContextMenuId] = useState<string | null>(
    null
  )

  const handleContextMenuOpenChange = (id: string) => (open: boolean) => {
    setActiveContextMenuId((prev) => (open ? id : prev === id ? null : prev))
  }

  return (
    <div className="flex flex-col gap-2 pb-4">
      {logEntries.map((logEntry) => {
        return (
          <LogEntryCard
            key={logEntry.id}
            logEntry={logEntry}
            onDelete={handleDelete}
            isDimmed={
              activeContextMenuId !== null &&
              activeContextMenuId !== logEntry.id
            }
            onContextMenuOpenChange={handleContextMenuOpenChange(logEntry.id)}
          />
        )
      })}
    </div>
  )
}

export default LogEntryList
