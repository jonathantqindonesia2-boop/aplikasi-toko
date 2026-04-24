"use client"

import { useMemo } from "react"
import { TransactionItem } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SalesReportProps {
  initialItems: TransactionItem[]
}

interface ProductSummary {
  product_id: string
  product_name: string
  quantity: number
  revenue: number
  profit: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function SalesReport({ initialItems }: SalesReportProps) {
  const productSummaries = useMemo(() => {
    const map = new Map<string, ProductSummary>()

    initialItems.forEach((item) => {
      const existing = map.get(item.product_id)
      if (existing) {
        existing.quantity += item.quantity
        existing.revenue += item.subtotal
        existing.profit += item.profit
      } else {
        map.set(item.product_id, {
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          revenue: item.subtotal,
          profit: item.profit,
        })
      }
    })

    return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity)
  }, [initialItems])

  const totalRevenue = productSummaries.reduce((sum, item) => sum + item.revenue, 0)
  const totalProfit = productSummaries.reduce((sum, item) => sum + item.profit, 0)
  const totalQuantity = productSummaries.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Laporan Penjualan Produk</CardTitle>
      </CardHeader>
      <CardContent>
        {productSummaries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Belum ada penjualan untuk tanggal ini.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Total Produk Terjual</p>
                <p className="text-2xl font-bold">{totalQuantity}</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Total Keuntungan</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalProfit)}</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead className="text-right">Pendapatan</TableHead>
                    <TableHead className="text-right">Keuntungan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productSummaries.map((item) => (
                    <TableRow key={item.product_id}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.revenue)}</TableCell>
                      <TableCell className="text-right text-primary">
                        {formatCurrency(item.profit)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
