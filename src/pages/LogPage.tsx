import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ArrowUpIcon } from "@/components/ui/icons/lucide-arrow-up"
import { Textarea } from "@/components/ui/textarea"

const LogPage = () => {
  const [message, setMessage] = useState("")

  const onMessageChange = () => {
    console.log(event.target.value)
    setMessage(event.target.value)
  }

  const onSubmit = () => {
    console.log(message)
  }

  return (
    <div className="flex flex-row justify-center absolute bottom-0 left-0 right-0">
      <div className="flex flex-row gap-3 w-[600px] p-4">
        <Textarea
          placeholder="Type your message here."
          onChange={onMessageChange}
        />
        <div className="flex flex-col justify-end">
          <Button
            variant="outline"
            size="icon"
            aria-label="Submit"
            onClick={onSubmit}
          >
            <ArrowUpIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LogPage
