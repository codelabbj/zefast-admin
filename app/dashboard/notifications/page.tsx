"use client"

import { useState } from "react"
import { useNotifications} from "@/hooks/useNotifications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus } from "lucide-react"
import { SendNotificationDialog } from "@/components/send-notification-dialog"
import TablePagination from "@/components/table-pagination";

export default function NotificationsPage() {
    const [page,setPage] = useState(1)
    const { data: notificationsData, isLoading } = useNotifications(page)
    const [dialogOpen, setDialogOpen] = useState(false)
    const pageSize = 10

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Notifications</h2>
                    <p className="text-muted-foreground">Gérez et envoyez des notifications aux utilisateurs</p>
                </div>
                <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Envoyer Notification
                </Button>
            </div>

            <Card className="border border-border/50 shadow-sm">
                <CardHeader className="border-b border-border/50 bg-muted/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold">Liste des Notifications</CardTitle>
                            <CardDescription className="text-sm mt-1">Total : {notificationsData?.count || 0} notifications</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : notificationsData && notificationsData.results.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                                        <TableHead className="font-semibold text-muted-foreground">Titre</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground">Contenu</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground">Créé le</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {notificationsData.results.map((notification, index) => (
                                        <TableRow key={notification.id} className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                                            <TableCell className="font-semibold text-foreground">{notification.title}</TableCell>
                                            <TableCell className="max-w-md align-middle whitespace-normal break-words text-muted-foreground">{notification.content}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{new Date(notification.created_at).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination page={page} pageSize={pageSize} total={notificationsData.count} disableNextPage={!notificationsData.next} disablePreviousPage={!notificationsData.previous} onChangePage={setPage}/>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">Aucune notification trouvée</div>
                    )}
                </CardContent>
            </Card>

            <SendNotificationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
    )
}
