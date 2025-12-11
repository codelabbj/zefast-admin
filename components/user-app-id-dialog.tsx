"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useCreateUserAppId, useUpdateUserAppId, type UserAppId, type UserAppIdInput } from "@/hooks/useUserAppIds"
import { usePlatforms } from "@/hooks/usePlatforms"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface UserAppIdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userAppId?: UserAppId
}

interface SearchUserResponse {
  UserId: number
  Name: string
  CurrencyId: number
}

export function UserAppIdDialog({ open, onOpenChange, userAppId }: UserAppIdDialogProps) {
  const createUserAppId = useCreateUserAppId()
  const updateUserAppId = useUpdateUserAppId()
  const { data: platforms, isLoading: platformsLoading } = usePlatforms()

  const [formData, setFormData] = useState<UserAppIdInput>({
    user_app_id: "",
    app_name: "",
  })
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    if (userAppId) {
      setFormData({
        user_app_id: userAppId.user_app_id,
        app_name: userAppId.app_name,
      })
    } else {
      setFormData({
        user_app_id: "",
        app_name: "",
      })
    }
  }, [userAppId])

  const verifyBetId = async (appId: string, userId: string): Promise<boolean> => {
    try {
      const response = await api.post<SearchUserResponse>("/mobcash/search-user", {
        app_id: appId,
        userid: userId,
      })

      const { UserId, CurrencyId, Name } = response.data

      // Check if user exists
      if (UserId === 0) {
        toast.error("Utilisateur non trouvé. Veuillez vérifier l'ID de pari.")
        return false
      }

      // Check currency
      if (CurrencyId !== 27) {
        toast.error("Cet utilisateur n'utilise pas la devise XOF. Veuillez vérifier votre compte.")
        return false
      }

      // Success - show confirmation
      toast.success(`Utilisateur vérifié: ${Name}`)
      return true
    } catch (error: any) {
      // Handle field-specific error messages
      const errorData = error.response?.data

      if (error.response?.status === 400) {
        const errorMessage =
          errorData?.error_time_message ||
          errorData?.userid?.[0] ||
          errorData?.app_id?.[0] ||
          errorData?.detail ||
          "Erreur lors de la vérification de l'ID utilisateur"

        toast.error(errorMessage)
      } else {
        toast.error("Erreur lors de la vérification de l'ID utilisateur")
      }

      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // For updates, skip verification
    if (userAppId) {
      updateUserAppId.mutate(
        { id: userAppId.id, data: formData },
        {
          onSuccess: () => onOpenChange(false),
        },
      )
      return
    }

    // For creates, verify bet ID first
    if (!formData.app_name || !formData.user_app_id) {
      toast.error("Veuillez remplir tous les champs")
      return
    }

    setIsVerifying(true)
    try {
      const isValid = await verifyBetId(formData.app_name, formData.user_app_id)

      if (isValid) {
        // Proceed with creation after successful verification
      createUserAppId.mutate(formData, {
        onSuccess: () => {
          onOpenChange(false)
          setFormData({ user_app_id: "", app_name: "" })
        },
      })
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const isPending = createUserAppId.isPending || updateUserAppId.isPending || isVerifying

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{userAppId ? "Modifier l'ID Utilisateur App" : "Ajouter un ID Utilisateur App"}</DialogTitle>
          <DialogDescription>
            {userAppId ? "Mettez à jour les détails de l'ID utilisateur app ci-dessous." : "Ajoutez un nouvel ID utilisateur app au système."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_app_id">ID Utilisateur App *</Label>
            <Input
              id="user_app_id"
              value={formData.user_app_id}
              onChange={(e) => setFormData({ ...formData, user_app_id: e.target.value })}
              placeholder="ABC123456789"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="app_name">Plateforme *</Label>
            <Select
              value={formData.app_name}
              onValueChange={(value) => setFormData({ ...formData, app_name: value })}
              disabled={isPending || platformsLoading}
            >
              <SelectTrigger id="app_name">
                <SelectValue placeholder="Sélectionner une plateforme" />
              </SelectTrigger>
              <SelectContent>
                {platforms?.results?.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending || !formData.app_name || !formData.user_app_id}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isVerifying ? "Vérification..." : userAppId ? "Mise à jour..." : "Création..."}
                </>
              ) : userAppId ? (
                "Mettre à jour"
              ) : (
                "Créer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
