"use client"

import { useState } from "react"
import { JobApplication } from "@/lib/types"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { EditorInterface } from "@/components/editor/EditorInterface"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs" // Removed to fix hydration mismatch

export function JobQuestApp({ jobs }: { jobs: JobApplication[] }) {
  const [viewMode, setViewMode] = useState<'detailed' | 'concise'>('detailed')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  
  const filteredJobs = jobs.filter(job => {
      if (statusFilter !== 'All' && job.status !== statusFilter) return false
      if (categoryFilter !== 'All' && job.category !== categoryFilter) return false
      return true
  })
  
  const categories = Array.from(new Set(jobs.map(j => j.category).filter(c => c && c.trim() !== '')))
  
  return (
     <div className="container mx-auto p-4 space-y-8">
        <DashboardHeader jobs={jobs} />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 bg-background z-10 py-4 border-b">
            <div className="flex items-center gap-2">
                <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
                    <button
                        onClick={() => setViewMode('detailed')}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${viewMode === 'detailed' ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50 hover:text-foreground'}`}
                        data-state={viewMode === 'detailed' ? 'active' : 'inactive'}
                    >
                        Detailed
                    </button>
                    <button
                        onClick={() => setViewMode('concise')}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${viewMode === 'concise' ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50 hover:text-foreground'}`}
                        data-state={viewMode === 'concise' ? 'active' : 'inactive'}
                    >
                        Concise
                    </button>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Interested">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-slate-500" />
                                <span>Interested</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="Applied">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <span>Applied</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="Interviewing">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500" />
                                <span>Interviewing</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="Successful">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>Successful</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="Unsuccessful">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-500" />
                                <span>Unsuccessful</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Categories</SelectItem>
                        {categories.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
        
        <EditorInterface jobs={filteredJobs} viewMode={viewMode} />
     </div>
  )
}
