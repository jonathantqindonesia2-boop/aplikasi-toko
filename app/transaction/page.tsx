import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/app-sidebar"
import { TransactionCart } from "@/components/transaction-cart"
import { TransactionHistory } from "@/components/transaction-history"

export const dynamic = "force-dynamic"

async function getProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*")
    .gt("stock", 0)
    .order("name")
  return data || []
}

async function getHistoryTransactions() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("transactions")
    .select("*, items:transaction_items(*)")
    .order("created_at", { ascending: false })
    .limit(10)
  return data || []
}

export default async function TransactionPage() {
  const products = await getProducts()
  const historyTransactions = await getHistoryTransactions()

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Transaksi</h1>
            <p className="text-muted-foreground">
              Catat penjualan dan kelola transaksi
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="xl:col-span-2">
              <TransactionCart products={products} />
            </div>
            <div className="space-y-6">
              <TransactionHistory transactions={historyTransactions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
