import { KPICards } from "./KPICards"
import { StatusChart } from "./StatusChart"
import { CategoryList } from "./CategoryList"
import { JobApplication } from "@/lib/types"

export function DashboardHeader({ jobs }: { jobs: JobApplication[] }) {
  const total = jobs.length
  const successful = jobs.filter(j => j.status === 'Successful').length
  const closed = jobs.filter(j => ['Successful', 'Unsuccessful'].includes(j.status)).length
  const successRate = closed > 0 ? (successful / closed) * 100 : 0
  
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const chartData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  
  const categoryCounts = jobs.reduce((acc, job) => {
    acc[job.category] = (acc[job.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const categoryData = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-4">
      <KPICards total={total} successRate={successRate} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
            <StatusChart data={chartData} />
        </div>
        <div className="col-span-3">
            <CategoryList data={categoryData} />
        </div>
      </div>
    </div>
  )
}
