import NavBar from "@/components/NavBar"
import { AppIcon } from "@/components/ui/icons/app-icon"

const Header = () => {
  return (
    <div className="absolute top-0 left-0 right-0 flex flex-row justify-between items-center h-[70px] px-4">
      <AppIcon />
      <NavBar />
    </div>
  )
}

export default Header
