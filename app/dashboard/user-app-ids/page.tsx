"use client"

import { useState } from "react"
import { useUserAppIds, useDeleteUserAppId, type UserAppId, type UserAppIdFilters } from "@/hooks/useUserAppIds"
import { usePlatforms } from "@/hooks/usePlatforms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2, Search, MoreVertical } from "lucide-react"
import { UserAppIdDialog } from "@/components/user-app-id-dialog"
import { CopyButton } from "@/components/copy-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const [filters, setFilters] = useState<UserAppIdFilters>({})
  const { data: userAppIds, isLoading } = useUserAppIds(filters)
  const { data: platforms } = usePlatforms({})
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

      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-semibold">Filtres</CardTitle>
          <CardDescription className="text-sm">Rechercher et filtrer les IDs utilisateur app</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher par ID utilisateur app..."
                  value={filters.search || ""}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="app_name">Plateforme</Label>
              <Select
                value={filters.app_name || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, app_name: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger id="app_name">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les Plateformes</SelectItem>
                  {platforms?.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Liste des IDs Utilisateur App</CardTitle>
              <CardDescription className="text-sm mt-1">Total : {userAppIds?.length || 0} IDs utilisateur app</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : userAppIds && userAppIds.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                      <TableHead className="font-semibold text-muted-foreground h-12">ID Utilisateur App</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Nom de l'App</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Utilisateur Telegram</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Crée le</TableHead>
                      <TableHead className="text-right font-semibold text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userAppIds.map((userAppId, index) => (
                      <TableRow key={userAppId.id} className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                        <TableCell className="text-foreground">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono">{userAppId.user_app_id}</Badge>
                            <CopyButton value={userAppId.user_app_id} className="h-7 w-7" />
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">
                          {userAppId.app_details?.name || userAppId.app_name || "-"}
                        </TableCell>
                        <TableCell className="text-foreground">{userAppId.telegram_user || "-"}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{new Date(userAppId.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(userAppId)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(userAppId)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Aucun ID utilisateur app trouvé</div>
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
