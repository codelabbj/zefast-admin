"use client"

import type React from "react"

import { useState } from "react"
import { useSendNotification } from "@/hooks/useNotifications"
import { useBotUsers, type BotUser } from "@/hooks/useBotUsers"
import { useUsers, type User } from "@/hooks/useUsers"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search } from "lucide-react"

interface SendNotificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type UserType = "normal" | "bot" | "all"

export function SendNotificationDialog({ open, onOpenChange }: SendNotificationDialogProps) {
  const sendNotification = useSendNotification()
  const [userType, setUserType] = useState<UserType>("normal")
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch users based on type
  const { data: botUsers, isLoading: isLoadingBotUsers } = useBotUsers(
    userType === "bot" ? { search: searchTerm || undefined } : {}
  )
  const { data: normalUsersData, isLoading: isLoadingNormalUsers } = useUsers(
    userType === "normal" ? { search: searchTerm || undefined } : {}
  )

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    user_id: "",
  })

  const isLoadingUsers = userType === "bot" ? isLoadingBotUsers : isLoadingNormalUsers

  // Filter users based on search term
  const filteredBotUsers = botUsers?.filter((user) => {
    const searchLower = searchTerm.toLowerCase()
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()
    const email = (user.email || "").toLowerCase()
    const telegramId = user.telegram_user_id.toLowerCase()
    
    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      telegramId.includes(searchLower)
    )
  }) || []

  const filteredNormalUsers = normalUsersData?.results?.filter((user) => {
    const searchLower = searchTerm.toLowerCase()
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()
    const email = (user.email || "").toLowerCase()
    const phone = (user.phone || "").toLowerCase()
    
    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      phone.includes(searchLower)
    )
  }) || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // If "all users" is selected, don't include user_id
    const payload = userType === "all" 
      ? { title: formData.title, content: formData.content }
      : { title: formData.title, content: formData.content, user_id: formData.user_id }

    sendNotification.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false)
        setFormData({ title: "", content: "", user_id: "" })
        setSearchTerm("")
        setUserType("normal")
      },
    })
  }

  const handleUserTypeChange = (value: UserType) => {
    setUserType(value)
    setFormData({ ...formData, user_id: "" })
    setSearchTerm("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Envoyer une Notification</DialogTitle>
          <DialogDescription>Envoyer une notification à un utilisateur spécifique</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_type">Type d'Utilisateur *</Label>
            <Select value={userType} onValueChange={handleUserTypeChange} disabled={sendNotification.isPending}>
              <SelectTrigger id="user_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Utilisateur Normal</SelectItem>
                <SelectItem value="bot">Utilisateur Bot</SelectItem>
                <SelectItem value="all">Tous les Utilisateurs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {userType !== "all" && (
          <div className="space-y-2">
            <Label htmlFor="user_id">Sélectionner un Utilisateur *</Label>
            {isLoadingUsers ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                      placeholder={
                        userType === "bot"
                          ? "Rechercher un utilisateur bot par nom, email ou ID..."
                          : "Rechercher un utilisateur par nom, email ou téléphone..."
                      }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    disabled={sendNotification.isPending}
                  />
                </div>
                <Select
                  value={formData.user_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, user_id: value })
                    setSearchTerm("") // Clear search after selection
                  }}
                  disabled={sendNotification.isPending}
                >
                  <SelectTrigger id="user_id">
                    <SelectValue placeholder="Choisir un utilisateur..." />
                  </SelectTrigger>
                  <SelectContent>
                      {userType === "bot" ? (
                        filteredBotUsers.length > 0 ? (
                          filteredBotUsers.map((user) => (
                        <SelectItem key={user.id} value={user.telegram_user_id}>
                          {user.first_name} {user.last_name} ({user.email || 'Aucun email'})
                        </SelectItem>
                      ))
                        ) : (
                          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                            Aucun utilisateur bot trouvé
                          </div>
                        )
                      ) : (
                        filteredNormalUsers.length > 0 ? (
                          filteredNormalUsers.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.first_name} {user.last_name} ({user.email || 'Aucun email'})
                            </SelectItem>
                          ))
                    ) : (
                      <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                        Aucun utilisateur trouvé
                      </div>
                        )
                    )}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre de la notification"
              required
              disabled={sendNotification.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Contenu de la notification..."
              rows={4}
              required
              disabled={sendNotification.isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sendNotification.isPending}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={sendNotification.isPending || (userType !== "all" && !formData.user_id)}
            >
              {sendNotification.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                "Envoyer la Notification"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
