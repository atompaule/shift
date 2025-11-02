import { useMemo, useState } from "react"

import type { LogEntry } from "@/lib/api/types"

import LogEntryCard from "./LogEntryCard"

const seededHue = (seed: string) => {
  let hash = 0

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index)
    hash |= 0
  }

  const random = Math.abs(Math.sin(hash) * 10000)
  return Math.floor(random % 360)
}

const threadIdToColor = (threadId: string) =>
  `hsl(${seededHue(threadId)}, 65%, 55%)`

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

  const colorsByThreadId = useMemo(() => {
    const map = new Map<string, string>()

    logEntries.forEach((logEntry) => {
      const threadId = logEntry.thread_id ?? "none"

      if (!map.has(threadId)) {
        if (threadId === "none") {
          map.set(threadId, "")
        } else {
          map.set(threadId, threadIdToColor(threadId))
        }
      }
    })

    return map
  }, [logEntries])

  return (
    <div className="flex flex-col gap-2 pb-4">
      {logEntries.map((logEntry) => {
        const threadId = logEntry.thread_id ?? "none"
        const color = colorsByThreadId.get(threadId)

        return (
          <LogEntryCard
            key={logEntry.id}
            logEntry={logEntry}
            onDelete={handleDelete}
            color={color}
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
