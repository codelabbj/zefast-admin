"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

interface CopyButtonProps {
  value: string | number
  className?: string
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(value))
      setCopied(true)
      toast.success("Copié dans le presse-papiers")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Échec de la copie")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-6 w-6 ${className || ""}`}
      onClick={handleCopy}
      title="Copier"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-primary" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
      )}
    </Button>
  )
}

