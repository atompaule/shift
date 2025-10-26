import { cn } from "@/lib/utils"

type LoaderProps = {
  fullscreen?: boolean
  className?: string
}

export const Loader = ({ fullscreen = false, className }: LoaderProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        fullscreen && "min-h-screen",
        className
      )}
    >
      <div
        className="relative flex size-10 items-center justify-center"
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading</span>
        <span className="absolute inset-0 m-auto size-5.5 origin-center animate-[loader-ping_1.4s_ease-out_infinite] rounded-full bg-primary/20 will-change-[transform,opacity]" />
        <span className="size-5.5 animate-[pulse_1.4s_ease-in-out_infinite] rounded-full bg-primary will-change-[transform,opacity]" />
      </div>
    </div>
  )
}
