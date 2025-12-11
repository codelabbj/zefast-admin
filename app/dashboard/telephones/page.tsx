"use client"

import { useState } from "react"
import { useTelephones, useDeleteTelephone, type Telephone, type TelephoneFilters } from "@/hooks/useTelephones"
import { useNetworks } from "@/hooks/useNetworks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2, Search } from "lucide-react"
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
  const [filters, setFilters] = useState<TelephoneFilters>({
    page: 1,
    page_size: 10,
  })
  const { data: telephonesData, isLoading } = useTelephones(filters)
  const { data: networks } = useNetworks()
  const deleteTelephone = useDeleteTelephone()
  
  const telephones = telephonesData?.results || []

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
    return networks?.results?.find((n) => n.id === networkId)?.public_name || "Unknown"
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

      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-semibold">Filtres</CardTitle>
          <CardDescription className="text-sm">Rechercher et filtrer les téléphones</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher par numéro..."
                  value={filters.search || ""}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined, page: 1 })}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="network">Réseau</Label>
              <Select
                value={filters.network?.toString() || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, network: value === "all" ? undefined : Number.parseInt(value), page: 1 })
                }
              >
                <SelectTrigger id="network">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les Réseaux</SelectItem>
                  {networks?.results?.map((network) => (
                    <SelectItem key={network.id} value={network.id.toString()}>
                      {network.public_name}
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
              <CardTitle className="text-lg font-semibold">Liste des Téléphones</CardTitle>
              <CardDescription className="text-sm mt-1">Total : {telephonesData?.count || 0} téléphones</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : telephones && telephones.length > 0 ? (
            <>
              <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                      <TableHead className="font-semibold text-muted-foreground h-12">ID</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Numéro de Téléphone</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Réseau</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Utilisateur Telegram</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Créé le</TableHead>
                      <TableHead className="text-right font-semibold text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {telephones.map((telephone, index) => (
                      <TableRow key={telephone.id} className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                        <TableCell className="font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        {telephone.id}
                        <CopyButton value={telephone.id} />
                      </div>
                    </TableCell>
                        <TableCell className="text-foreground">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{telephone.phone}</Badge>
                        <CopyButton value={telephone.phone} />
                      </div>
                    </TableCell>
                        <TableCell className="text-foreground">{getNetworkName(telephone.network)}</TableCell>
                        <TableCell className="text-foreground">{telephone.telegram_user || "-"}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{new Date(telephone.created_at).toLocaleDateString()}</TableCell>
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
              </div>
              {telephonesData && (telephonesData.next || telephonesData.previous) && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
                  <div className="text-sm text-muted-foreground">
                    Page {filters.page || 1} sur {Math.ceil((telephonesData.count || 0) / (filters.page_size || 10))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                      disabled={!telephonesData.previous}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                      disabled={!telephonesData.next}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Aucun téléphone trouvé</div>
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
