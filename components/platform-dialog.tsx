"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useCreatePlatform, useUpdatePlatform, type Platform, type PlatformInput } from "@/hooks/usePlatforms"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FileInput } from "@/components/ui/file-input"
import { Loader2, Eye, EyeOff } from "lucide-react"

interface PlatformDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  platform?: Platform
}

export function PlatformDialog({ open, onOpenChange, platform }: PlatformDialogProps) {
  const createPlatform = useCreatePlatform()
  const updatePlatform = useUpdatePlatform()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showCashierPass, setShowCashierPass] = useState(false)

  const [formData, setFormData] = useState<PlatformInput>({
    name: "",
    image: "",
    enable: true,
    hash: null,
    cashdeskid: null,
    cashierpass: null,
    deposit_tuto_link: null,
    withdrawal_tuto_link: null,
    why_withdrawal_fail: null,
    order: null,
    city: null,
    street: null,
    minimun_deposit: 200,
    max_deposit: 100000,
    minimun_with: 300,
    max_win: 1000000,
    active_for_deposit: false,
    active_for_with: false,
  })

  useEffect(() => {
    if (platform) {
      setFormData({
        name: platform.name,
        image: platform.image,
        enable: platform.enable,
        hash: platform.hash,
        cashdeskid: platform.cashdeskid,
        cashierpass: platform.cashierpass,
        deposit_tuto_link: platform.deposit_tuto_link,
        withdrawal_tuto_link: platform.withdrawal_tuto_link,
        why_withdrawal_fail: platform.why_withdrawal_fail,
        order: platform.order,
        city: platform.city,
        street: platform.street,
        minimun_deposit: platform.minimun_deposit,
        max_deposit: platform.max_deposit,
        minimun_with: platform.minimun_with,
        max_win: platform.max_win,
        active_for_deposit: platform.active_for_deposit ?? false,
        active_for_with: platform.active_for_with ?? false,
      })
      setSelectedFile(null)
      setPreviewUrl(platform.image || null)
    } else {
      setFormData({
        name: "",
        image: "",
        enable: true,
        hash: null,
        cashdeskid: null,
        cashierpass: null,
        deposit_tuto_link: null,
        withdrawal_tuto_link: null,
        why_withdrawal_fail: null,
        order: null,
        city: null,
        street: null,
        minimun_deposit: 200,
        max_deposit: 100000,
        minimun_with: 300,
        max_win: 1000000,
        active_for_deposit: false,
        active_for_with: false,
      })
      setSelectedFile(null)
      setPreviewUrl(null)
    }
  }, [platform])

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

    try {
      let imageUrl = formData.image

      // If a file is selected, upload it first
      if (selectedFile) {
        setIsUploading(true)
        imageUrl = await uploadFile(selectedFile)
      }

      if (platform) {
        // Update mode - only include hash, cashdeskid, cashierpass if they have values
        const updateData: Partial<PlatformInput> = {
          name: formData.name,
          image: imageUrl,
          enable: formData.enable,
          deposit_tuto_link: formData.deposit_tuto_link,
          withdrawal_tuto_link: formData.withdrawal_tuto_link,
          why_withdrawal_fail: formData.why_withdrawal_fail,
          order: formData.order,
          city: formData.city,
          street: formData.street,
          minimun_deposit: formData.minimun_deposit,
          max_deposit: formData.max_deposit,
          minimun_with: formData.minimun_with,
          max_win: formData.max_win,
          active_for_deposit: formData.active_for_deposit,
          active_for_with: formData.active_for_with,
        }

        // Only include these fields if they have values
        if (formData.hash) {
          updateData.hash = formData.hash
        }
        if (formData.cashdeskid) {
          updateData.cashdeskid = formData.cashdeskid
        }
        if (formData.cashierpass) {
          updateData.cashierpass = formData.cashierpass
        }

        updatePlatform.mutate(
          { id: platform.id, data: updateData },
          {
            onSuccess: () => {
              onOpenChange(false)
            },
          },
        )
      } else {
        // Create mode - include all fields
        const submitData: PlatformInput = {
          ...formData,
          image: imageUrl,
        }

        createPlatform.mutate(submitData, {
      onSuccess: () => {
        onOpenChange(false)
        setFormData({
          name: "",
          image: "",
          enable: true,
              hash: null,
              cashdeskid: null,
              cashierpass: null,
          deposit_tuto_link: null,
          withdrawal_tuto_link: null,
          why_withdrawal_fail: null,
          order: null,
          city: null,
          street: null,
          minimun_deposit: 200,
          max_deposit: 100000,
          minimun_with: 300,
          max_win: 1000000,
              active_for_deposit: false,
              active_for_with: false,
        })
            setSelectedFile(null)
            setPreviewUrl(null)
      },
    })
  }
    } catch (error) {
      // Error is already handled by uploadFile
    } finally {
      setIsUploading(false)
    }
  }

  const isPending = createPlatform.isPending || updatePlatform.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{platform ? "Modifier la Plateforme" : "Créer une Plateforme"}</DialogTitle>
          <DialogDescription>
            {platform ? "Mettez à jour les détails de la plateforme ci-dessous." : "Ajoutez une nouvelle plateforme de paris au système."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isPending || isUploading}
              />
            </div>

            <div className="space-y-2">
              <FileInput
                label="Image *"
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                onFileChange={handleFileChange}
                previewUrl={previewUrl}
                description="Formats acceptés: JPG, PNG, GIF (max 5MB) ou entrez une URL"
                disabled={isPending || isUploading}
              />
              <Input
                id="image-url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Ou entrez une URL d'image..."
                disabled={isPending || isUploading || !!selectedFile}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hash">Hash</Label>
              <Input
                id="hash"
                value={formData.hash || ""}
                onChange={(e) => setFormData({ ...formData, hash: e.target.value || null })}
                placeholder="abc123hashvalue"
                disabled={isPending || isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cashdeskid">Cashdesk ID</Label>
              <Input
                id="cashdeskid"
                value={formData.cashdeskid || ""}
                onChange={(e) => setFormData({ ...formData, cashdeskid: e.target.value || null })}
                placeholder="cashdesk_001"
                autoComplete="off"
                disabled={isPending || isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cashierpass">Cashier Password</Label>
              <div className="relative">
                <Input
                  id="cashierpass"
                  type={showCashierPass ? "text" : "password"}
                  value={formData.cashierpass || ""}
                  onChange={(e) => setFormData({ ...formData, cashierpass: e.target.value || null })}
                  placeholder="securePass@123"
                  autoComplete="off"
                  disabled={isPending || isUploading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCashierPass(!showCashierPass)}
                  disabled={isPending || isUploading}
                >
                  {showCashierPass ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={formData.city || ""}
                onChange={(e) => setFormData({ ...formData, city: e.target.value || null })}
                disabled={isPending || isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Rue</Label>
              <Input
                id="street"
                value={formData.street || ""}
                onChange={(e) => setFormData({ ...formData, street: e.target.value || null })}
                disabled={isPending || isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimun_deposit">Dépôt Minimum *</Label>
              <Input
                id="minimun_deposit"
                type="number"
                value={formData.minimun_deposit}
                onChange={(e) => setFormData({ ...formData, minimun_deposit: Number.parseInt(e.target.value) })}
                required
                disabled={isPending || isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_deposit">Dépôt Maximum *</Label>
              <Input
                id="max_deposit"
                type="number"
                value={formData.max_deposit}
                onChange={(e) => setFormData({ ...formData, max_deposit: Number.parseInt(e.target.value) })}
                required
                disabled={isPending || isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimun_with">Retrait Minimum *</Label>
              <Input
                id="minimun_with"
                type="number"
                value={formData.minimun_with}
                onChange={(e) => setFormData({ ...formData, minimun_with: Number.parseInt(e.target.value) })}
                required
                disabled={isPending || isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_win">Gain Maximum *</Label>
              <Input
                id="max_win"
                type="number"
                value={formData.max_win}
                onChange={(e) => setFormData({ ...formData, max_win: Number.parseInt(e.target.value) })}
                required
                disabled={isPending || isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Ordre</Label>
              <Input
                id="order"
                type="number"
                value={formData.order || ""}
                onChange={(e) =>
                  setFormData({ ...formData, order: e.target.value ? Number.parseInt(e.target.value) : null })
                }
                disabled={isPending || isUploading}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="enable">Activer</Label>
              <Switch
                id="enable"
                checked={formData.enable}
                onCheckedChange={(checked) => setFormData({ ...formData, enable: checked })}
                disabled={isPending || isUploading}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="active_for_deposit">Actif pour Dépôt</Label>
              <Switch
                id="active_for_deposit"
                checked={formData.active_for_deposit}
                onCheckedChange={(checked) => setFormData({ ...formData, active_for_deposit: checked })}
                disabled={isPending || isUploading}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="active_for_with">Actif pour Retrait</Label>
              <Switch
                id="active_for_with"
                checked={formData.active_for_with}
                onCheckedChange={(checked) => setFormData({ ...formData, active_for_with: checked })}
                disabled={isPending || isUploading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deposit_tuto_link">Lien Tutoriel Dépôt</Label>
            <Input
              id="deposit_tuto_link"
              value={formData.deposit_tuto_link || ""}
              onChange={(e) => setFormData({ ...formData, deposit_tuto_link: e.target.value || null })}
              placeholder="https://example.com/deposit-tutorial"
              disabled={isPending || isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal_tuto_link">Lien Tutoriel Retrait</Label>
            <Input
              id="withdrawal_tuto_link"
              value={formData.withdrawal_tuto_link || ""}
              onChange={(e) => setFormData({ ...formData, withdrawal_tuto_link: e.target.value || null })}
              placeholder="https://example.com/withdrawal-tutorial"
              disabled={isPending || isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="why_withdrawal_fail">Lien Aide Retrait Échoué</Label>
            <Input
              id="why_withdrawal_fail"
              value={formData.why_withdrawal_fail || ""}
              onChange={(e) => setFormData({ ...formData, why_withdrawal_fail: e.target.value || null })}
              placeholder="https://example.com/withdrawal-help"
              disabled={isPending || isUploading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending || isUploading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending || isUploading || (!selectedFile && !formData.image)}>
              {isPending || isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? "Téléchargement..." : platform ? "Mise à jour..." : "Création..."}
                </>
              ) : platform ? (
                "Mettre à jour la Plateforme"
              ) : (
                "Créer la Plateforme"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
