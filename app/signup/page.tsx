'use client'

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimatedGrid } from '@/components/animated-grid'
import { AnimatedText } from '@/components/animated-text'
import { Zap } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log('Signup attempt with:', email, password, confirmPassword)
  }

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-bold">Content Genie</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center relative">
        <AnimatedGrid />
        <div className="w-full max-w-md space-y-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg relative z-10">
          <div className="text-center">
            <AnimatedText
              text="Create Your Account"
              className="text-3xl font-bold tracking-tight"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Join Content Genie and start optimizing your product content
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-orange-500 text-white hover:bg-orange-600">
              Sign up
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-orange-600 hover:text-orange-500">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

