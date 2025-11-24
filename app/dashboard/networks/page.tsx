"use client"

import { useState } from "react"
import { useNetworks, useDeleteNetwork, type Network } from "@/hooks/useNetworks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { NetworkDialog } from "@/components/network-dialog"
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

            <Card>
                <CardHeader>
                    <CardTitle>Liste des Réseaux</CardTitle>
                    <CardDescription>Total : {networks?.length || 0} réseaux</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : networks && networks.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Nom Public</TableHead>
                                    <TableHead>Pays</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Dépôt</TableHead>
                                    <TableHead>Retrait</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {networks.map((network) => (
                                    <TableRow key={network.id}>
                                        <TableCell className="font-medium">{network.name}</TableCell>
                                        <TableCell>{network.public_name}</TableCell>
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
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(network)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="hover:bg-gray-500/10 dark:hover:bg-white/10" onClick={() => handleDelete(network)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">Aucun réseau trouvé</div>
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
                        <AlertDialogCancel className="hover:bg-primary/10">Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
