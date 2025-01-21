'use client'

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimatedGrid } from '@/components/animated-grid'
import { AnimatedText } from '@/components/animated-text'
import { Zap } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle forgot password logic here
    console.log('Password reset requested for:', email)
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
              text="Forgot Your Password?"
              className="text-3xl font-bold tracking-tight"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              No worries, we'll send you reset instructions
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

            <Button type="submit" className="w-full bg-orange-500 text-white hover:bg-orange-600">
              Reset Password
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-orange-600 hover:text-orange-500">
              Back to login
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

