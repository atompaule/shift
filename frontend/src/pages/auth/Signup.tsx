import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { AppIcon } from "@/components/ui/icons/app-icon"
import GoogleIcon from "@/components/ui/icons/google"
import { Input } from "@/components/ui/input"
import { auth } from "@/lib/firebase"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleEmailPassword = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Google sign-in failed"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      <div className="absolute left-4 top-4 right-4 md:left-8 md:top-8 md:right-8 flex flex-row items-center justify-between">
        <AppIcon />
        <Button variant="link" onClick={() => navigate("/login")}>
          Sign in
        </Button>
      </div>

      <div className="w-full max-w-md space-y-6 px-4">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="space-y-3">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            disabled={isSubmitting}
          />
          <Input
            id="password"
            type="password"
            autoComplete={"new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={"At least 6 characters"}
            disabled={isSubmitting}
          />
          <Button
            onClick={handleEmailPassword}
            disabled={isSubmitting || !email || !password}
            className="w-full"
          >
            {isSubmitting ? "Please wait..." : "Sign In with Email"}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={handleGoogle}
            disabled={isSubmitting}
            className="w-full justify-center"
          >
            <GoogleIcon className="h-4 w-4" />
            <span>Google</span>
          </Button>
        </div>

        <p className="px-2 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline underline-offset-4">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default Signup
