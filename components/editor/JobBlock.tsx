"use client"

import { useState, useRef } from "react"
import { JobApplication } from "@/lib/types"
import { updateJob, fetchUrlMetadata } from "@/lib/actions"
import { StatusBadge } from "./StatusBadge"
import { BookmarkCard } from "./BookmarkCard"
import { Input } from "@/components/ui/input"
import { Link as LinkIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function JobBlock({ job }: { job: JobApplication }) {
  const [data, setData] = useState(job)
  const [loadingMeta, setLoadingMeta] = useState(false)
  
  const updateTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleChange = (field: keyof JobApplication, value: string | Date | null) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    
    if (updateTimeout.current) clearTimeout(updateTimeout.current)
    
    updateTimeout.current = setTimeout(async () => {
       await updateJob(job.id, { [field]: value })
    }, 500)
  }

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setData({ ...data, url })
    
    // Check if valid URL
    try {
        new URL(url)
    } catch {
        // If empty, clear meta
        if (!url) {
            handleChange('urlMeta', null)
        }
        return // Invalid URL
    }

    if (updateTimeout.current) clearTimeout(updateTimeout.current)
    
    setLoadingMeta(true)
    const meta = await fetchUrlMetadata(url)
    setLoadingMeta(false)
    
    const metaString = meta ? JSON.stringify(meta) : null
    
    // Update DB with URL and Meta
    await updateJob(job.id, { url, urlMeta: metaString })
    setData(prev => ({ ...prev, url, urlMeta: metaString }))
  }

  const clearUrl = () => {
      handleChange('url', '')
      handleChange('urlMeta', null)
  }

  return (
    <div className="group relative border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition-all">
       <div className="flex items-start justify-between gap-4 mb-4">
           <div className="flex-1 space-y-1">
                <Input 
                    value={data.title} 
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Job Title"
                    className="text-lg font-bold border-none px-0 shadow-none focus-visible:ring-0 h-auto p-0"
                />
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">at</span>
                    <Input 
                        value={data.employer} 
                        onChange={(e) => handleChange('employer', e.target.value)}
                        placeholder="Employer"
                        className="font-medium border-none px-0 shadow-none focus-visible:ring-0 h-auto p-0 w-auto inline-block"
                    />
                </div>
           </div>
           <StatusBadge status={data.status} onStatusChange={(s) => handleChange('status', s)} />
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-4">
            <div>
                <label className="text-xs text-muted-foreground block mb-1">Category</label>
                <Input 
                    value={data.category} 
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="h-8"
                />
            </div>
            <div>
                <label className="text-xs text-muted-foreground block mb-1">Applied</label>
                <Input 
                    type="date"
                    value={data.dateApplied ? new Date(data.dateApplied).toISOString().split('T')[0] : ''} 
                    onChange={(e) => handleChange('dateApplied', e.target.value)}
                    className="h-8"
                />
            </div>
            <div>
                <label className="text-xs text-muted-foreground block mb-1">Interviewed</label>
                 <Input 
                    type="date"
                    value={data.dateInterviewed ? new Date(data.dateInterviewed).toISOString().split('T')[0] : ''} 
                    onChange={(e) => handleChange('dateInterviewed', e.target.value)}
                    className="h-8"
                />
            </div>
       </div>

       {/* URL Section */}
       <div className="space-y-2">
            {(!data.urlMeta && !data.url) && (
                <div className="flex items-center gap-2 opacity-50 focus-within:opacity-100 transition-opacity">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <Input 
                        value={data.url || ''} 
                        onChange={handleUrlChange} 
                        placeholder="Paste Job URL..."
                        className="border-none shadow-none focus-visible:ring-0 px-0 h-8 text-sm"
                    />
                </div>
            )}
            
            {(data.url || data.urlMeta) && (
                <div className="relative group/bookmark">
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover/bookmark:opacity-100 transition-opacity">
                         <Button variant="destructive" size="icon" className="h-6 w-6" onClick={clearUrl}>
                            <Trash2 className="h-3 w-3" />
                         </Button>
                    </div>
                    <BookmarkCard 
                        url={data.url || '#'} 
                        meta={data.urlMeta ? JSON.parse(data.urlMeta) : null} 
                    />
                </div>
            )}
            {loadingMeta && <div className="text-xs text-muted-foreground">Fetching metadata...</div>}
       </div>
    </div>
  )
}
