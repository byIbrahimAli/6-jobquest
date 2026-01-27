"use client"

import { useState } from "react"
import { JobApplication } from "@/lib/types"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { EditorInterface } from "@/components/editor/EditorInterface"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'detailed' | 'concise')}>
                    <TabsList>
                        <TabsTrigger value="detailed">Detailed</TabsTrigger>
                        <TabsTrigger value="concise">Concise</TabsTrigger>
                    </TabsList>
                </Tabs>
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
