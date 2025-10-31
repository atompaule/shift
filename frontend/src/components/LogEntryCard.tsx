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
  isDimmed?: boolean
  onContextMenuOpenChange?: (open: boolean) => void
}

const LogEntryCard = ({
  logEntry,
  onDelete,
  isDimmed = false,
  onContextMenuOpenChange,
}: LogEntryCardProps) => {
  const handleDeleteSelect = () => {
    onDelete?.(logEntry.id)
  }

  return (
    <ContextMenu onOpenChange={onContextMenuOpenChange}>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            "rounded-lg bg-card text-card-foreground transition-colors hover:bg-accent/20 select-none",
            isDimmed && "text-muted-foreground/50"
          )}
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
