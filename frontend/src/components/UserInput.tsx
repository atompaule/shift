import { useState } from "react"

import { MicrophoneIcon } from "@/components/ui/icons/heroicons-microphone"
import { ArrowUpIcon } from "@/components/ui/icons/lucide-arrow-up"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { backendClient } from "@/lib/api/backend"

const UserInput = () => {
  const [message, setMessage] = useState("")

  const onMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  }

  const sendMessage = async () => {
    console.log(message)
    await backendClient.createLogEntry(message)
    setMessage("")
  }

  const recordMessage = () => {
    console.log("recordMessage")
  }

  return (
    <div className="flex flex-row justify-center absolute bottom-0 left-0 right-0">
      <div className="w-[600px] pb-4">
        <InputGroup>
          <InputGroupTextarea
            placeholder="Type your message here."
            value={message}
            onChange={onMessageChange}
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton
              variant="default"
              className="rounded-full bg-blue-500 ml-auto"
              size="icon-xs"
              onClick={recordMessage}
            >
              <MicrophoneIcon />
              <span className="sr-only">Record</span>
            </InputGroupButton>
            <InputGroupButton
              variant="default"
              className="rounded-full"
              size="icon-xs"
              disabled={message === ""}
              onClick={sendMessage}
            >
              <ArrowUpIcon />
              <span className="sr-only">Send</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  )
}

export default UserInput
