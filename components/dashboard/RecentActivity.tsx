"use client"
import { useState, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JobApplication } from "@/lib/types"

// Since I don't recall seeing date-fns in package.json, I'll use a simple helper or native Intl.RelativeTimeFormat
// Actually, let's stick to standard JS for simplicity unless I see date-fns installed.
// Checking package.json earlier, date-fns wasn't there.

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export function RecentActivity({ jobs }: { jobs: JobApplication[] }) {
  // Get 5 most recent jobs by updatedAt or createdAt
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  // Fix hydration mismatch by only rendering relative time on client
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card className="h-full bg-background/60 backdrop-blur-xl border-muted/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-heading font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentJobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between group">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {job.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {job.employer}
                </p>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap ml-4" suppressHydrationWarning>
                {mounted ? timeAgo(job.updatedAt) : new Date(job.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
          {recentJobs.length === 0 && (
             <div className="text-sm text-muted-foreground text-center py-4">No recent activity</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
