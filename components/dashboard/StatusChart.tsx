"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const STATUS_COLORS: Record<string, string> = {
  "Interested": "#64748b", // slate-500
  "Applied": "#3b82f6", // blue-500
  "Interviewing": "#f59e0b", // amber-500
  "Successful": "#22c55e", // green-500
  "Unsuccessful": "#ef4444", // red-500
}

export function StatusChart({ data }: { data: { name: string, value: number }[] }) {
  return (
    <Card className="col-span-4 bg-background/60 backdrop-blur-xl border-muted/50 shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading">Application Status</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[250px] w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                cursor={{fill: 'var(--accent)', opacity: 0.1}}
                contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1000}>
                 {data.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={STATUS_COLORS[entry.name] || "#64748b"} 
                        className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                    />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
