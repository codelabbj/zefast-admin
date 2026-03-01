"use client"

import type React from "react"
import { useProcessTransaction, type Transaction } from "@/hooks/useTransactions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ProcessTransactionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction: Transaction | null
}

export function ProcessTransactionDialog({ open, onOpenChange, transaction }: ProcessTransactionDialogProps) {
    const processTransaction = useProcessTransaction()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!transaction) return

        processTransaction.mutate(
            {
                reference: transaction.reference,
            },
            {
                onSuccess: () => onOpenChange(false),
            },
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Traiter la Transaction</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir traiter la transaction : {transaction?.reference} ?
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm">
                            <strong>Référence:</strong> {transaction?.reference}
                        </p>
                        <p className="text-sm">
                            <strong>Montant:</strong> {transaction?.amount} FCFA
                        </p>
                        <p className="text-sm">
                            <strong>Statut actuel:</strong> {transaction?.status}
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processTransaction.isPending}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processTransaction.isPending}>
                            {processTransaction.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Traitement...
                                </>
                            ) : (
                                "Confirmer le traitement"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
