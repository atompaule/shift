import * as React from "react"

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute top-[70px] left-0 right-0 bottom-0 p-4">
      {children}
    </div>
  )
}

export default Container
