"use client"

import { useState } from "react"
import { useNetworks, useDeleteNetwork, type Network } from "@/hooks/useNetworks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2, MoreVertical } from "lucide-react"
import { NetworkDialog } from "@/components/network-dialog"
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

export default function NetworksPage() {
  const { data: networks, isLoading } = useNetworks()
  const deleteNetwork = useDeleteNetwork()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [networkToDelete, setNetworkToDelete] = useState<Network | null>(null)

  const handleEdit = (network: Network) => {
    setSelectedNetwork(network)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedNetwork(undefined)
    setDialogOpen(true)
  }

  const handleDelete = (network: Network) => {
    setNetworkToDelete(network)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (networkToDelete) {
      deleteNetwork.mutate(networkToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setNetworkToDelete(null)
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Réseaux</h2>
          <p className="text-muted-foreground">Gérez les réseaux de paiement</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter Réseau
        </Button>
      </div>


      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Liste des Réseaux</CardTitle>
              <CardDescription className="text-sm mt-1">Total : {networks?.length || 0} réseaux</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : networks && networks.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                      <TableHead className="font-semibold text-muted-foreground h-12">Nom</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Nom Public</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Pays</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Statut</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Dépôt</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Retrait</TableHead>
                      <TableHead className="text-right font-semibold text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {networks.map((network, index) => (
                      <TableRow key={network.id} className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                        <TableCell className="font-medium text-foreground">{network.name}</TableCell>
                        <TableCell className="text-foreground">{network.public_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {network.country_code} (+{network.indication})
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={network.enable ? "default" : "secondary"}>
                            {network.enable ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={network.active_for_deposit ? "default" : "secondary"}>
                            {network.active_for_deposit ? "Oui" : "Non"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={network.active_for_with ? "default" : "secondary"}>
                            {network.active_for_with ? "Oui" : "Non"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(network)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(network)} className="text-destructive">
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
            <div className="text-center py-12 text-muted-foreground">Aucun réseau trouvé</div>
          )}
        </CardContent>
      </Card>

      <NetworkDialog open={dialogOpen} onOpenChange={setDialogOpen} network={selectedNetwork} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Ceci supprimera définitivement le réseau "{networkToDelete?.public_name}". Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {deleteNetwork.isPending ? (
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
