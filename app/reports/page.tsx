import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/app-sidebar"
import { DailyReport } from "@/components/daily-report"
import { SalesReport } from "@/components/sales-report"

export const dynamic = "force-dynamic"

async function getTodayTransactions() {
  const supabase = await createClient()

  const today = new Date().toISOString().split("T")[0]
  const startOfDay = `${today}T00:00:00.000Z`
  const endOfDay = `${today}T23:59:59.999Z`

  const { data } = await supabase
    .from("transactions")
    .select(`
      *,
      items:transaction_items(*)
    `)
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay)
    .order("created_at", { ascending: false })

  return data || []
}

async function getTodaySalesItems() {
  const supabase = await createClient()

  const today = new Date().toISOString().split("T")[0]
  const startOfDay = `${today}T00:00:00.000Z`
  const endOfDay = `${today}T23:59:59.999Z`

  const { data } = await supabase
    .from("transaction_items")
    .select("*")
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay)
    .order("product_name", { ascending: true })

  return data || []
}

export default async function ReportsPage() {
  const today = new Date().toISOString().split("T")[0]
  const transactions = await getTodayTransactions()
  const salesItems = await getTodaySalesItems()

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Laporan Harian</h1>
            <p className="text-muted-foreground">
              Lihat ringkasan penjualan dan keuntungan harian
            </p>
          </div>

          <div className="space-y-6">
            <DailyReport initialTransactions={transactions} initialDate={today} />
            <SalesReport initialItems={salesItems} />
          </div>
        </div>
      </main>
    </div>
  )
}
