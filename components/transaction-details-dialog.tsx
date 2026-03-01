"use client"

import type React from "react"
import { type Transaction } from "@/hooks/useTransactions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CopyButton } from "@/components/copy-button"

interface TransactionDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction: Transaction | null
}

export function TransactionDetailsDialog({ open, onOpenChange, transaction }: TransactionDetailsDialogProps) {
    if (!transaction) return null

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
    }

    const renderDataSection = (title: string, data: any) => {
        if (!data) return null

        let parsedData = data
        if (typeof data === "string") {
            try {
                parsedData = JSON.parse(data.replace(/'/g, '"'))
            } catch (e) {
                return (
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-muted-foreground">{title}</p>
                        <p className="text-sm p-3 bg-muted rounded-md">{data}</p>
                    </div>
                )
            }
        }

        const formatValue = (val: any): string => {
            if (val === null || val === undefined) return "-"
            if (typeof val === "boolean") return val ? "Oui" : "Non"
            if (typeof val === "object") return "[Détails imbriqués]"
            return String(val)
        }

        const keyLabels: Record<string, string> = {
            // Webhook data
            uid: "ID Unique",
            recipient_phone: "Téléphone Destinataire",
            created_by: "Créé par",
            confirmed_at: "Confirmé le",
            expires_at: "Expire le",
            external_id: "ID Externe",
            // Mobcash response
            Summa: "Somme",
            OperationId: "ID Opération",
            Success: "Réussite",
            Message: "Message API",
        }

        return (
            <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">{title}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-muted/30 p-3 rounded-lg border border-border/50">
                    {Object.entries(parsedData).map(([key, value]) => {
                        if (key === "fcm_notifications" || key === "all_status") return null
                        return (
                            <div key={key} className="flex justify-between items-center text-sm border-b border-border/20 last:border-0 pb-1 last:pb-0">
                                <span className="text-muted-foreground">{keyLabels[key] || key}:</span>
                                <span className="font-medium text-right">{formatValue(value)}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Détails de la Transaction
                    </DialogTitle>
                    <DialogDescription>
                        Informations complètes pour la référence: <code className="bg-muted px-1 rounded">{transaction.reference}</code>
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-full pr-4 mt-4">
                    <div className="space-y-8 pb-4">
                        {/* Header Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-card border shadow-sm space-y-1">
                                <p className="text-xs font-bold text-muted-foreground uppercase">Montant</p>
                                <p className="text-xl font-bold text-primary">{transaction.amount.toLocaleString()} FCFA</p>
                            </div>
                            <div className="p-4 rounded-xl bg-card border shadow-sm space-y-1">
                                <p className="text-xs font-bold text-muted-foreground uppercase">Type</p>
                                <Badge variant="default" className="w-fit">{transaction.type_trans === 'deposit' ? 'Dépôt' : 'Retrait'}</Badge>
                            </div>
                            <div className="p-4 rounded-xl bg-card border shadow-sm space-y-1">
                                <p className="text-xs font-bold text-muted-foreground uppercase">Statut Actuel</p>
                                <Badge variant="outline" className="w-fit border-primary/30 text-primary">{transaction.status}</Badge>
                            </div>
                        </div>

                        {/* Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-1 bg-primary rounded-full" />
                                    <h4 className="font-bold text-lg">Informations Client</h4>
                                </div>
                                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Nom complet:</span>
                                        <span className="font-medium">{transaction.user.first_name} {transaction.user.last_name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Email:</span>
                                        <span className="font-medium underline decoration-primary/30">{transaction.user.email}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Téléphone:</span>
                                        <span className="font-medium font-mono">{transaction.phone_number || "-"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">ID Application:</span>
                                        <span className="font-medium text-primary bg-primary/5 px-2 rounded">{transaction.user_app_id || "-"}</span>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-1 bg-accent rounded-full" />
                                    <h4 className="font-bold text-lg">Configuration App</h4>
                                </div>
                                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Plateforme:</span>
                                        <span className="font-medium">{transaction.app_details?.name || "-"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Réseau:</span>
                                        <Badge variant="secondary">{transaction.network || "-"}</Badge>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Localisation:</span>
                                        <span className="font-medium text-xs">{transaction.app_details?.city}, {transaction.app_details?.street}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Référence:</span>
                                        <div className="flex items-center gap-1">
                                            <span className="font-mono text-xs">{transaction.reference}</span>
                                            <CopyButton value={transaction.reference} />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Timeline */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-1 bg-muted-foreground rounded-full" />
                                <h4 className="font-bold text-lg">Suivi Temporel</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-lg border">
                                    <div className="text-muted-foreground text-xs uppercase font-bold Rotate-90">Création</div>
                                    <div className="text-sm font-medium">{formatDate(transaction.created_at)}</div>
                                </div>
                                <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-lg border">
                                    <div className="text-muted-foreground text-xs uppercase font-bold Rotate-90">Validation</div>
                                    <div className="text-sm font-medium">{transaction.validated_at ? formatDate(transaction.validated_at) : "Non validé"}</div>
                                </div>
                            </div>
                        </section>

                        {/* Response Data Sections */}
                        <section className="space-y-6 pt-2 border-t">
                            <h4 className="font-bold text-lg">Réponses du Système</h4>
                            {renderDataSection("Données Webhook (Paiement)", transaction.webhook_data)}
                            {renderDataSection("Réponse Partenaire (MobCash)", (transaction as any).mobcash_response)}

                            {transaction.error_message && (
                                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl space-y-1">
                                    <p className="text-sm font-bold text-destructive uppercase">Détails de l'Erreur</p>
                                    <p className="text-sm">{transaction.error_message}</p>
                                </div>
                            )}
                        </section>
                    </div>
                </ScrollArea>

                <DialogFooter className="border-t pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="px-8 shadow-sm">Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
