import * as React from "react"

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col h-screen items-center p-4 pt-[70px]">
      {children}
    </div>
  )
}

export default Container
