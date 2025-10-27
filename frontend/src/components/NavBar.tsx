import { signOut } from "firebase/auth"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { HamburgerIcon } from "@/components/ui/hamburger-icon"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { auth } from "@/lib/firebase"
import { cn } from "@/lib/utils"

const navLinks = [
  { to: "/logbook", label: "Logbook" },
  { to: "/topic-cloud", label: "Topic Cloud" },
  { to: "/insight-net", label: "Insight Net" },
]

const NavBar = () => {
  const navigate = useNavigate()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobileMenuOpen(false)
      }
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login", { replace: true })
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="relative">
      <NavigationMenu className="hidden px-4 md:flex">
        <NavigationMenuList>
          {navLinks.map(({ to, label }) => (
            <NavigationMenuItem key={to}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to={to}>{label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
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

      <div className="flex items-center md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "group rounded-full transition-colors",
            isMobileMenuOpen && "bg-accent text-accent-foreground"
          )}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-controls="mobile-navigation"
          aria-expanded={isMobileMenuOpen}
        >
          <HamburgerIcon />
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="absolute right-0 top-full z-20 mt-2 w-48 rounded-md border bg-background p-2 shadow-md md:hidden"
        >
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Button
            className="block w-full rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground text-rose-400 cursor-pointer"
            variant="ghost"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  )
}

export default NavBar
