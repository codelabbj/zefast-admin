"use client"

import {useEffect, useState} from "react"
import { useTelephones, useDeleteTelephone, type Telephone } from "@/hooks/useTelephones"
import { useNetworks } from "@/hooks/useNetworks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {Loader2, Plus, Pencil, Trash2, Search} from "lucide-react"
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
import ContentPagination from "@/components/content-pagination";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function TelephonesPage() {
    const { data: networks } = useNetworks()
    const deleteTelephone = useDeleteTelephone()

    const [telephones, setTelephones] = useState<Telephone[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedTelephone, setSelectedTelephone] = useState<Telephone | undefined>()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [telephoneToDelete, setTelephoneToDelete] = useState<Telephone | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [search, setSearch] = useState("")
    const [networkFilter, setNetworkFilter] = useState<string>("all")
    const itemsPerPage = 10

    const params = {
        search: search|| undefined,
    }

    const { data: RawTelephones, isLoading } = useTelephones(params)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedTelephones = telephones?.slice(startIndex, endIndex)??[]


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

    const handleSearchChange = (e : React.ChangeEvent<HTMLInputElement>)=>{
        setSearch(e.target.value)
        setCurrentPage(1)
    }

    const handleNetworkChange = (value:string)=>{
        setNetworkFilter(value)
        setCurrentPage(1)
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

    useEffect(() => {
        if (!networkFilter || !RawTelephones) return
        if (networkFilter === "all") {
            setTelephones(RawTelephones)
            return;
        }
        const data = RawTelephones.filter((t)=> t.network === parseInt(networkFilter))
        setTelephones(data)
    }, [networks,networkFilter]);

    useEffect(() => {
        setTelephones(RawTelephones??[])
    }, [RawTelephones]);

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
                    <CardDescription className="text-sm">Rechercher et filtrer les numéros de téléphones</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="search">Rechercher</Label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Rechercher par numéros de téléphones"
                                    value={search}
                                    onChange={handleSearchChange}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        {
                            networks!==undefined && networks!==null && networks.length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="status">Réseaux</Label>
                                    <Select defaultValue="all" value={networkFilter} onValueChange={handleNetworkChange}>
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tous</SelectItem>
                                            {
                                                networks.map(network => (
                                                    <SelectItem key={network.id} value={String(network.id)}>{network.public_name}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }
                    </div>
                </CardContent>
            </Card>

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
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Numéro de Téléphone</TableHead>
                                        <TableHead>Réseau</TableHead>
                                        <TableHead>Créé le</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedTelephones.map((telephone) => (
                                        <TableRow key={telephone.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">{telephone.phone}</Badge>
                                                    <CopyButton value={telephone.phone} />
                                                </div>
                                            </TableCell>
                                            <TableCell>{getNetworkName(telephone.network)}</TableCell>
                                            <TableCell>{new Date(telephone.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(telephone)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="hover:bg-gray-500/10 dark:hover:bg-white/10" onClick={() => handleDelete(telephone)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <ContentPagination
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                length={telephones.length}
                                startIndex={startIndex}
                                endIndex={endIndex}
                                onChangePage={setCurrentPage}
                            />
                        </>
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
                        <AlertDialogCancel className="hover:bg-primary/10">Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
