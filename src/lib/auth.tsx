import type { User } from "firebase/auth"
import { onAuthStateChanged } from "firebase/auth"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

import { auth } from "./firebase"

type AuthContextValue = { user: User | null; loading: boolean }
const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
