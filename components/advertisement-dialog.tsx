"use client"

import type React from "react"

import { useState } from "react"
import { useCreateAdvertisement, type AdvertisementInput } from "@/hooks/useAdvertisements"
import { uploadFile } from "@/lib/upload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FileInput } from "@/components/ui/file-input"
import { Loader2 } from "lucide-react"

interface AdvertisementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdvertisementDialog({ open, onOpenChange }: AdvertisementDialogProps) {
  const createAdvertisement = useCreateAdvertisement()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [enable, setEnable] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file)
    if (file) {
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      alert("Veuillez sélectionner une image")
      return
    }

    try {
      setIsUploading(true)
      // Upload file first
      const uploadedUrl = await uploadFile(selectedFile)

      const formData: AdvertisementInput = {
        image: uploadedUrl,
        enable,
      }

      createAdvertisement.mutate(formData, {
        onSuccess: () => {
          onOpenChange(false)
          setSelectedFile(null)
          setPreviewUrl(null)
          setEnable(true)
        },
      })
    } catch (error) {
      // Error is already handled by uploadFile
    } finally {
      setIsUploading(false)
    }
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setSelectedFile(null)
      setPreviewUrl(null)
      setEnable(true)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer une Publicité</DialogTitle>
          <DialogDescription>Ajoutez une nouvelle publicité avec une image</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FileInput
            label="Image *"
            accept="image/*"
            maxSize={5 * 1024 * 1024}
            onFileChange={handleFileChange}
            previewUrl={previewUrl}
            description="Formats acceptés: JPG, PNG, GIF (max 5MB)"
            disabled={createAdvertisement.isPending || isUploading}
            required
          />

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="enable">Activer la publicité</Label>
            <Switch
              id="enable"
              checked={enable}
              onCheckedChange={setEnable}
              disabled={createAdvertisement.isPending || isUploading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
              disabled={createAdvertisement.isPending || isUploading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={createAdvertisement.isPending || isUploading || !selectedFile}>
              {createAdvertisement.isPending || isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? "Téléchargement..." : "Création..."}
                </>
              ) : (
                "Créer la Publicité"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

