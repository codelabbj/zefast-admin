"use client"

import { useState } from "react"
import { useNotifications } from "@/hooks/useNotifications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus } from "lucide-react"
import { SendNotificationDialog } from "@/components/send-notification-dialog"
import { CopyButton } from "@/components/copy-button"

export default function NotificationsPage() {
  const [page, setPage] = useState(1)
  const { data: notificationsData, isLoading } = useNotifications(page)
  const [dialogOpen, setDialogOpen] = useState(false)

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
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : notificationsData && notificationsData.results.length > 0 ? (
            <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                    <TableHead className="font-semibold text-muted-foreground h-12">ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Titre</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Contenu</TableHead>
                      {/* <TableHead className="font-semibold text-muted-foreground">Statut</TableHead> */}
                    <TableHead className="font-semibold text-muted-foreground">Créé le</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationsData.results.map((notification, index) => (
                    <TableRow key={notification.id} className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          {notification.id}
                          <CopyButton value={notification.id} />
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">{notification.title}</TableCell>
                        <TableCell className="text-muted-foreground whitespace-normal break-words">{notification.content}</TableCell>
                        {/* <TableCell>
                        <Badge variant={notification.is_read ? "secondary" : "default"} className="font-medium">
                          {notification.is_read ? "Lu" : "Non lu"}
                        </Badge>
                        </TableCell> */}
                      <TableCell className="text-muted-foreground text-sm">{new Date(notification.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
              {notificationsData && (notificationsData.next || notificationsData.previous) && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
                  <div className="text-sm text-muted-foreground">
                    Page {page} sur {Math.ceil((notificationsData.count || 0) / 10)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={!notificationsData.previous || page <= 1}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={!notificationsData.next}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Aucune notification trouvée</div>
          )}
        </CardContent>
      </Card>

      <SendNotificationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
