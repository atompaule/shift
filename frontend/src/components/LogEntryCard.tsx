import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import type { LogEntry } from "@/lib/api/types"

type LogEntryCardProps = {
  logEntry: LogEntry
  onDelete?: (id: string) => void
}

const LogEntryCard = ({ logEntry, onDelete }: LogEntryCardProps) => {
  const handleDeleteSelect = () => {
    onDelete?.(logEntry.id)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="rounded-lg bg-card text-card-foreground transition-colors hover:bg-accent/20">
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
