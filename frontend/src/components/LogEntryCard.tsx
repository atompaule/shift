import type { CSSProperties } from "react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import type { LogEntry } from "@/lib/api/types"
import { cn } from "@/lib/utils"

type LogEntryCardProps = {
  logEntry: LogEntry
  onDelete?: (id: string) => void
  color?: string
  isDimmed?: boolean
  onContextMenuOpenChange?: (open: boolean) => void
}

const LogEntryCard = ({
  logEntry,
  onDelete,
  color,
  isDimmed = false,
  onContextMenuOpenChange,
}: LogEntryCardProps) => {
  const handleDeleteSelect = () => {
    onDelete?.(logEntry.id)
  }

  const dynamicStyle: CSSProperties = {
    borderLeftColor: color ?? "transparent",
    borderLeftStyle: color ? "solid" : undefined,
    borderLeftWidth: "2px",
    borderRadius: "0px",
    opacity: isDimmed ? 0.2 : 1,
    transition: "opacity 200ms ease",
  }

  return (
    <ContextMenu onOpenChange={onContextMenuOpenChange}>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            "rounded-lg bg-card text-card-foreground transition-colors hover:bg-accent/20 px-2 select-none"
          )}
          style={dynamicStyle}
        >
          {logEntry.content}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onSelect={handleDeleteSelect} variant="destructive">
          Delete log
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default LogEntryCard
