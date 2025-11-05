"use client"

import { useState } from "react"
import { useTelephones, useDeleteTelephone, type Telephone } from "@/hooks/useTelephones"
import { useNetworks } from "@/hooks/useNetworks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { TelephoneDialog } from "@/components/telephone-dialog"
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

export default function TelephonesPage() {
  const { data: telephones, isLoading } = useTelephones()
  const { data: networks } = useNetworks()
  const deleteTelephone = useDeleteTelephone()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTelephone, setSelectedTelephone] = useState<Telephone | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [telephoneToDelete, setTelephoneToDelete] = useState<Telephone | null>(null)

  const handleEdit = (telephone: Telephone) => {
    setSelectedTelephone(telephone)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedTelephone(undefined)
    setDialogOpen(true)
  }

  const handleDelete = (telephone: Telephone) => {
    setTelephoneToDelete(telephone)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (telephoneToDelete) {
      deleteTelephone.mutate(telephoneToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setTelephoneToDelete(null)
        },
      })
    }
  }

  const getNetworkName = (networkId: number) => {
    return networks?.find((n) => n.id === networkId)?.public_name || "Unknown"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Téléphones</h2>
          <p className="text-muted-foreground">Gérez les numéros de téléphone des utilisateurs</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un Téléphone
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Téléphones</CardTitle>
          <CardDescription>Total : {telephones?.length || 0} téléphones</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : telephones && telephones.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Numéro de Téléphone</TableHead>
                  <TableHead>Réseau</TableHead>
                  <TableHead>Utilisateur Telegram</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {telephones.map((telephone) => (
                  <TableRow key={telephone.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {telephone.id}
                        <CopyButton value={telephone.id} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{telephone.phone}</Badge>
                        <CopyButton value={telephone.phone} />
                      </div>
                    </TableCell>
                    <TableCell>{getNetworkName(telephone.network)}</TableCell>
                    <TableCell>{telephone.telegram_user || "-"}</TableCell>
                    <TableCell>{new Date(telephone.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(telephone)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(telephone)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Aucun téléphone trouvé</div>
          )}
        </CardContent>
      </Card>

      <TelephoneDialog open={dialogOpen} onOpenChange={setDialogOpen} telephone={selectedTelephone} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Ceci supprimera définitivement le téléphone "{telephoneToDelete?.phone}". Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {deleteTelephone.isPending ? (
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
