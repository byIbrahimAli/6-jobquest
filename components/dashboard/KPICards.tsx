import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Trophy, Briefcase, XCircle } from "lucide-react"

export function KPICards({ total, successRate, active, rejected }: { total: number, successRate: number, active: number, rejected: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-background/60 backdrop-blur-xl border-muted/50 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase className="w-16 h-16 text-primary" />
         </div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-heading">{total}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-background/60 backdrop-blur-xl border-muted/50 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="w-16 h-16 text-yellow-500" />
         </div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-heading">{successRate.toFixed(1)}%</div>
        </CardContent>
      </Card>

       <Card className="bg-background/60 backdrop-blur-xl border-muted/50 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-16 h-16 text-blue-500" />
         </div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Processes</CardTitle>
          <Activity className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-heading">{active}</div>
        </CardContent>
      </Card>

      <Card className="bg-background/60 backdrop-blur-xl border-muted/50 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <XCircle className="w-16 h-16 text-red-500" />
         </div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Unsuccessful</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-heading">{rejected}</div>
        </CardContent>
      </Card>
    </div>
  )
}

