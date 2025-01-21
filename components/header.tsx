'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Zap, Github } from "lucide-react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500 fill-orange-500" />
              <span className="text-base font-semibold">Content Genie</span>
            </Link>

            <nav className="flex items-center space-x-6">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm text-gray-600 hover:text-gray-900">Features</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 w-[400px] md:w-[500px] bg-white">
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            {
                              icon: "⚡️",
                              title: "AI Generation",
                              description: "Generate content in seconds"
                            },
                            {
                              icon: "🌍",
                              title: "Multilingual",
                              description: "Arabic & English support"
                            },
                            {
                              icon: "📈",
                              title: "SEO Optimized",
                              description: "Rank higher naturally"
                            },
                            {
                              icon: "🔄",
                              title: "API Access",
                              description: "Easy integration"
                            }
                          ].map((feature) => (
                            <div
                              key={feature.title}
                              className="flex gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="mt-1 h-6 w-6 text-orange-500">
                                {feature.icon}
                              </div>
                              <div>
                                <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <button className="text-sm text-gray-600 hover:text-gray-900">How It Works</button>
              <button className="text-sm text-gray-600 hover:text-gray-900">Testimonials</button>
              <button className="text-sm text-gray-600 hover:text-gray-900">Contact Team</button>
            </nav>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href="/login">
                <User className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href="https://github.com/mohnish-bahal/content-genie-dev" target="_blank">
                <Github className="h-4 w-4" />
              </Link>
            </Button>
            {isHomePage && (
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm" 
                asChild
              >
                <Link href="/generate">Try Now</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 