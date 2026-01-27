import { KPICards } from "./KPICards"
import { StatusChart } from "./StatusChart"
import { RecentActivity } from "./RecentActivity"
import { JobApplication } from "@/lib/types"

export function DashboardHeader({ jobs }: { jobs: JobApplication[] }) {
  const total = jobs.length
  const successful = jobs.filter(j => j.status === 'Successful').length
  const closed = jobs.filter(j => ['Successful', 'Unsuccessful'].includes(j.status)).length
  const active = jobs.filter(j => !['Successful', 'Unsuccessful'].includes(j.status)).length
  const rejected = jobs.filter(j => j.status === 'Unsuccessful').length
  
  const successRate = closed > 0 ? (successful / closed) * 100 : 0
  
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const chartData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  


  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold font-heading bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Overview</h1>
        <p className="text-muted-foreground">Track and manage your job search progress.</p>
      </div>

      <KPICards total={total} successRate={successRate} active={active} rejected={rejected} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-4">
            <StatusChart data={chartData} />
        </div>
        <div className="col-span-3 space-y-4">
            <RecentActivity jobs={jobs} />
        </div>
      </div>
    </div>
  )
}
