"use client"

import {useState} from "react"
import { useUserAppIds, useDeleteUserAppId, type UserAppId } from "@/hooks/useUserAppIds"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {Loader2, Plus, Pencil, Trash2, Search} from "lucide-react"
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
import ContentPagination from "@/components/content-pagination";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {usePlatforms} from "@/hooks/usePlatforms";

export default function UserAppIdsPage() {

    const {data: platforms } = usePlatforms({})
    const deleteUserAppId = useDeleteUserAppId()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedUserAppId, setSelectedUserAppId] = useState<UserAppId | undefined>()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [userAppIdToDelete, setUserAppIdToDelete] = useState<UserAppId | null>(null)
    const [platformFilter, setPlatformFilter] = useState<string>("all")
    const [search, setSearch] = useState<string>("")

    const { data: userAppIds, isLoading } = useUserAppIds({
        search:search,
        app_name:platformFilter === "all" ? undefined : platformFilter,
    })

    const [currentPage, setCurrentPage] = useState<number>(1)
    const itemsPerPage = 10

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedUserAppIds = userAppIds?.slice(startIndex, endIndex)??[]



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

    const handleSearchChange = (e : React.ChangeEvent<HTMLInputElement>)=>{
        setSearch(e.target.value)
        setCurrentPage(1)
    }

    const handleNetworkChange = (value:string)=>{
        setPlatformFilter(value)
        setCurrentPage(1)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">IDs de Paris</h2>
                    <p className="text-muted-foreground">Gérez les identifiants de paris</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter ID Paris
                </Button>
            </div>

            <Card className="border border-border/50 shadow-sm">
                <CardHeader className="border-b border-border/50 bg-muted/30">
                    <CardTitle className="text-lg font-semibold">Filtres</CardTitle>
                    <CardDescription className="text-sm">Rechercher et filtrer les ids de paris</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="search">Rechercher</Label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Rechercher par IDs de paris"
                                    value={search}
                                    onChange={handleSearchChange}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        {
                            platforms!==undefined && platforms!==null && platforms.length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="status">Réseaux</Label>
                                    <Select defaultValue="all" value={platformFilter} onValueChange={handleNetworkChange}>
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tous</SelectItem>
                                            {
                                                platforms.map(platform => (
                                                    <SelectItem key={platform.id} value={String(platform.id)}>{platform.name}</SelectItem>
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
                    <CardTitle>Liste des IDs de paris</CardTitle>
                    <CardDescription>Total : {userAppIds?.length || 0} IDs de paris</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : userAppIds && userAppIds.length > 0 ? (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID de paris</TableHead>
                                        <TableHead>Plateforme</TableHead>
                                        <TableHead>Créé le</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedUserAppIds.map((userAppId) => (
                                        <TableRow key={userAppId.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">{userAppId.user_app_id}</Badge>
                                                    <CopyButton value={userAppId.user_app_id} />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">{userAppId.app_details.name}</TableCell>
                                            <TableCell>{new Date(userAppId.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(userAppId)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="hover:bg-gray-500/10 dark:hover:bg-white/10" onClick={() => handleDelete(userAppId)}>
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
                                length={userAppIds.length}
                                startIndex={startIndex}
                                endIndex={endIndex}
                                onChangePage={setCurrentPage}
                            />
                        </>
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
                        <AlertDialogCancel className="hover:bg-primary/10">Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
