import { signOut } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { auth } from "@/lib/firebase"
import { cn } from "@/lib/utils"

const NavBar = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login", { replace: true })
  }

  return (
    <NavigationMenu className="px-4">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/logbook">Logbook</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/topic-cloud">Topic Cloud</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/insight-net">Insight Net</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(navigationMenuTriggerStyle(), "text-rose-400")}
          >
            <Button className="cursor-pointer" onClick={handleLogout}>
              Logout
            </Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default NavBar
