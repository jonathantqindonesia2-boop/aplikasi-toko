"use client"

import { useState, Fragment } from "react"
import { Transaction, TransactionItem } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp } from "lucide-react"

interface TransactionHistoryProps {
  initialTransactions: (Transaction & { items: TransactionItem[] })[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  const hours = date.getUTCHours().toString().padStart(2, "0")
  const minutes = date.getUTCMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

export function TransactionHistory({ initialTransactions }: TransactionHistoryProps) {
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Riwayat Transaksi</CardTitle>
      </CardHeader>
      <CardContent>
        {initialTransactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Belum ada transaksi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead className="text-right">Item</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Keuntungan</TableHead>
                  <TableHead className="text-right">Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialTransactions.map((transaction, index) => (
                  <Fragment key={transaction.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        setExpandedTransaction(
                          expandedTransaction === transaction.id ? null : transaction.id
                        )
                      }
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{formatTime(transaction.created_at)}</TableCell>
                      <TableCell className="text-right">
                        {transaction.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(transaction.total)}
                      </TableCell>
                      <TableCell className="text-right text-primary">
                        {formatCurrency(transaction.profit)}
                      </TableCell>
                      <TableCell className="text-right">
                        {expandedTransaction === transaction.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </TableCell>
                    </TableRow>
                    {expandedTransaction === transaction.id && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-muted/30 p-4">
                          <div className="space-y-2">
                            {transaction.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between gap-4 rounded-lg bg-background p-2 text-sm"
                              >
                                <div className="min-w-0 truncate">
                                  {item.product_name} x {item.quantity}
                                </div>
                                <div className="text-right font-medium">
                                  {formatCurrency(item.subtotal)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
