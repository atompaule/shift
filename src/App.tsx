import { useState } from 'react' 
import './App.css'
import { Button } from "@/components/ui/button"


import { Textarea } from "@/components/ui/textarea"


function App() { 

  return (
    <> 
    <Textarea placeholder="Type your message here." />
    <Button variant="outline">Button</Button>

    </>
  )
}

export default App
