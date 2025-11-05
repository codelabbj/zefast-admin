"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return
    }
    
    // Client-side authentication check
    const checkAuth = () => {
      try {
        const authenticated = isAuthenticated()
        if (!authenticated) {
          router.push("/login")
        } else {
          setIsChecking(false)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // On error, redirect to login as fallback
        router.push("/login")
      }
    }
    
    // Small delay to ensure localStorage is ready
    const timer = setTimeout(checkAuth, 100)
    
    // Fallback timeout - if still checking after 2 seconds, proceed anyway
    const fallbackTimer = setTimeout(() => {
      setIsChecking(false)
    }, 2000)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(fallbackTimer)
    }
  }, [router])
  
  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium">Chargement...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex w-72 flex-col border-r border-border/40 bg-card/30 backdrop-blur-sm h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="p-6">
            <DashboardNav />
          </div>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-5rem)]">{children}</main>
      </div>
    </div>
  )
}
