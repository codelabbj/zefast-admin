"use client"

import type React from "react"
import { useState } from "react"
import { useUpdateTransactionStatus, type Transaction } from "@/hooks/useTransactions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertTriangle } from "lucide-react"

interface UpdateTransactionStatusDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction: Transaction | null
}

const statusOptions = [
    { value: "pending", label: "En attente" },
    { value: "init_payment", label: "Une étape sur 2" },
    { value: "accept", label: "Accepté" },
    { value: "error", label: "Erreur" },
    { value: "timeout", label: "Timeout" },
]

export function UpdateTransactionStatusDialog({ open, onOpenChange, transaction }: UpdateTransactionStatusDialogProps) {
    const [newStatus, setNewStatus] = useState<string>("")
    const [showConfirmation, setShowConfirmation] = useState(false)
    const updateStatus = useUpdateTransactionStatus()

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newStatus) return
        setShowConfirmation(true)
    }

    const handleConfirm = () => {
        if (!transaction || !newStatus) return

        updateStatus.mutate(
            {
                reference: transaction.reference,
                new_status: newStatus,
            },
            {
                onSuccess: () => {
                    onOpenChange(false)
                    setShowConfirmation(false)
                    setNewStatus("")
                },
            },
        )
    }

    const selectedStatusLabel = statusOptions.find((s) => s.value === newStatus)?.label

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val)
            if (!val) {
                setShowConfirmation(false)
                setNewStatus("")
            }
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mettre à jour le statut</DialogTitle>
                    <DialogDescription>
                        Modifier le statut de la transaction : {transaction?.reference}
                    </DialogDescription>
                </DialogHeader>

                {!showConfirmation ? (
                    <form onSubmit={handleNext} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-status">Nouveau Statut</Label>
                            <Select value={newStatus} onValueChange={setNewStatus} required>
                                <SelectTrigger id="new-status">
                                    <SelectValue placeholder="Sélectionnez un statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="bg-muted p-3 rounded-md">
                            <p className="text-sm">
                                <strong>Statut actuel:</strong> {transaction?.status}
                            </p>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={!newStatus}>
                                Suivant
                            </Button>
                        </DialogFooter>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                            <p className="text-sm font-medium">Confirmation requise</p>
                        </div>

                        <p className="text-sm">
                            Êtes-vous sûr de vouloir changer le statut de la transaction <strong>{transaction?.reference}</strong> de <strong>{transaction?.status}</strong> à <strong>{selectedStatusLabel}</strong> ?
                        </p>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowConfirmation(false)}
                                disabled={updateStatus.isPending}
                            >
                                Retour
                            </Button>
                            <Button onClick={handleConfirm} disabled={updateStatus.isPending}>
                                {updateStatus.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Mise à jour...
                                    </>
                                ) : (
                                    "Confirmer le changement"
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
