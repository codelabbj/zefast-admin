"use client"

import { useState } from "react"
import { useUserAppIds, useDeleteUserAppId, type UserAppId } from "@/hooks/useUserAppIds"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { UserAppIdDialog } from "@/components/user-app-id-dialog"
import { CopyButton } from "@/components/copy-button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function UserAppIdsPage() {
  const { data: userAppIds, isLoading } = useUserAppIds()
  const deleteUserAppId = useDeleteUserAppId()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUserAppId, setSelectedUserAppId] = useState<UserAppId | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userAppIdToDelete, setUserAppIdToDelete] = useState<UserAppId | null>(null)

  const handleEdit = (userAppId: UserAppId) => {
    setSelectedUserAppId(userAppId)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedUserAppId(undefined)
    setDialogOpen(true)
  }

  const handleDelete = (userAppId: UserAppId) => {
    setUserAppIdToDelete(userAppId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userAppIdToDelete) {
      deleteUserAppId.mutate(userAppIdToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setUserAppIdToDelete(null)
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">IDs Utilisateur App</h2>
          <p className="text-muted-foreground">Gérez les identifiants d'application utilisateur</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter ID Utilisateur App
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des IDs Utilisateur App</CardTitle>
          <CardDescription>Total : {userAppIds?.length || 0} IDs utilisateur app</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : userAppIds && userAppIds.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>ID Utilisateur App</TableHead>
                  <TableHead>Nom de l'App</TableHead>
                  <TableHead>Utilisateur Telegram</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAppIds.map((userAppId) => (
                  <TableRow key={userAppId.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {userAppId.id}
                        <CopyButton value={userAppId.id} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{userAppId.user_app_id}</Badge>
                        <CopyButton value={userAppId.user_app_id} />
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{userAppId.app_name}</TableCell>
                    <TableCell>{userAppId.telegram_user || "-"}</TableCell>
                    <TableCell>{new Date(userAppId.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(userAppId)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(userAppId)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Aucun ID utilisateur app trouvé</div>
          )}
        </CardContent>
      </Card>

      <UserAppIdDialog open={dialogOpen} onOpenChange={setDialogOpen} userAppId={selectedUserAppId} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Ceci supprimera définitivement l'ID utilisateur app "{userAppIdToDelete?.user_app_id}". Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {deleteUserAppId.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
