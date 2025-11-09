import { useMemo, useState } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import type { LogEntry } from "@/lib/api/types"

import LogEntryCard from "./LogEntryCard"

const COLOR_PALETTE = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#6366F1", // Indigo
  "#F97316", // Orange
  "#84CC16", // Lime
  "#14B8A6", // Teal
  "#A855F7", // Violet
  "#F43F5E", // Rose
  "#22C55E", // Green
  "#0EA5E9", // Sky
  "#D946EF", // Fuchsia
  "#64748B", // Slate
  "#EAB308", // Yellow
  "#FB923C", // Orange (lighter)
  "#34D399", // Emerald (lighter)
]

type LogEntryListProps = {
  logEntries: LogEntry[]
  handleDelete: (id: string) => void
  isLoading?: boolean
  isCreating?: boolean
}

const LogEntryList = ({
  logEntries,
  handleDelete,
  isLoading = false,
  isCreating = false,
}: LogEntryListProps) => {
  const [activeContextMenuId, setActiveContextMenuId] = useState<string | null>(
    null
  )

  const handleContextMenuOpenChange = (id: string) => (open: boolean) => {
    setActiveContextMenuId((prev) => (open ? id : prev === id ? null : prev))
  }

  const colorsByThreadId = useMemo(() => {
    const map = new Map<string, string>()

    const uniqueThreadIds = Array.from(
      new Set(
        logEntries
          .map((logEntry) => logEntry.thread_id ?? "none")
          .filter((id) => id !== "none")
      )
    )

    uniqueThreadIds.sort()

    uniqueThreadIds.forEach((threadId, index) => {
      const colorIndex = index % COLOR_PALETTE.length
      map.set(threadId, COLOR_PALETTE[colorIndex])
    })

    map.set("none", "")

    return map
  }, [logEntries])

  return (
    <div className="flex flex-col gap-2 pb-4">
      {isCreating && <Skeleton className="h-5 w-full" />}
      {isLoading &&
        Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={`log-entry-skeleton-${index}`}
            className="h-5 w-full"
          />
        ))}
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
