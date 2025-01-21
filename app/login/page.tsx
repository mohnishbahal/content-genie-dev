'use client'

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimatedGrid } from '@/components/animated-grid'
import { AnimatedText } from '@/components/animated-text'
import { Zap } from 'lucide-react'
import { Header } from '@/components/header'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login attempt with:', email, password)
  }

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center relative">
        <AnimatedGrid />
        <div className="w-full max-w-md space-y-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg relative z-10">
          <div className="text-center">
            <AnimatedText
              text="Welcome Back"
              className="text-3xl font-bold tracking-tight"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-orange-600 hover:text-orange-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full bg-orange-500 text-white hover:bg-orange-600">
              Sign in
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Not a member?{" "}
            <Link href="/signup" className="font-medium text-orange-600 hover:text-orange-500">
              Sign up now
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

