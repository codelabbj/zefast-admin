"use client"

import Link from "next/link"
import { AlertCircle, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-md mx-auto">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Page non trouvée</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          Vérifiez l'URL ou retournez à la page d'accueil.
        </p>

        <div className="flex gap-4 justify-center">
          <Button asChild variant="default">
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Link>
          </Button>
          <Button asChild variant="outline" onClick={() => window.history.back()}>
            <div className="cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}


