"use client"

import { useState, useRef } from "react"
import { JobApplication } from "@/lib/types"
import { updateJob, fetchUrlMetadata, deleteJob } from "@/lib/actions"
import { StatusBadge } from "./StatusBadge"
import { BookmarkCard } from "./BookmarkCard"
import { Input } from "@/components/ui/input"
import { Link as LinkIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CopyButton } from "@/components/ui/copy-button"

export function JobBlock({ job }: { job: JobApplication }) {
  const [data, setData] = useState(job)
  const [loadingMeta, setLoadingMeta] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // ... state
  
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

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteJob(job.id)
    // The component will likely be unmounted by a parent re-fetch or optimistically removed
  }

  return (
    <div className="group relative border border-transparent hover:border-border/50 rounded-xl p-4 bg-background/60 backdrop-blur-xl border-muted/50 shadow-sm hover:shadow-lg transition-all duration-300">
       <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-3">
           <div className="flex-1 space-y-1 w-full">
                {/* Title */}
                <div className="group/title relative">
                    <Input 
                        autoFocus={!data.title}
                        value={data.title} 
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Job Title"
                        className="magic-focus text-xl font-bold font-heading bg-transparent dark:bg-transparent border-none px-0 shadow-none focus-visible:ring-0 h-auto p-0 placeholder:text-muted-foreground/30 transition-all focus:bg-transparent -ml-0.5 rounded-none w-full pb-1 pr-8"
                    />
                    {data.title && (
                        <div className="absolute right-0 top-0 bottom-0 flex items-center opacity-0 group-hover/title:opacity-100 transition-opacity">
                            <CopyButton value={data.title} className="h-5 w-5 opacity-50 hover:opacity-100 text-muted-foreground" />
                        </div>
                    )}
                </div>
                
                {/* Employer */}
                <div className="flex items-center gap-2 text-base text-muted-foreground relative group/employer w-full">
                    <span>at</span>
                    <Input 
                        value={data.employer} 
                        onChange={(e) => handleChange('employer', e.target.value)}
                        placeholder="Company Name"
                        className="magic-focus font-medium bg-transparent dark:bg-transparent border-none px-0 shadow-none focus-visible:ring-0 h-auto p-0 w-full inline-block placeholder:text-muted-foreground/30 focus:bg-transparent rounded-none pb-1 pr-8"
                    />
                    {data.employer && (
                        <div className="absolute right-0 top-0 bottom-0 flex items-center opacity-0 group-hover/employer:opacity-100 transition-opacity">
                            <CopyButton value={data.employer} className="h-5 w-5 opacity-50 hover:opacity-100 text-muted-foreground" />
                        </div>
                    )}
                </div>
           </div>
           
           <div className="flex items-center gap-4 self-start md:self-center">
                <StatusBadge status={data.status} onStatusChange={(s) => handleChange('status', s)} />
                
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Job Block?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the job entry for <span className="font-semibold text-foreground">{data.title || 'Untitled'}</span> at <span className="font-semibold text-foreground">{data.employer || 'Unknown Company'}</span>. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                {isDeleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
           </div>
       </div>

       {/* ... rest of the component (grid and URL section) ... */}
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-3">
            <div className="space-y-0.5 relative group/cat">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70">Category</label>
                <div className="relative">
                    <Input 
                        value={data.category} 
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="magic-focus h-7 bg-transparent dark:bg-transparent border-none shadow-none focus-visible:ring-0 p-0 font-medium text-sm rounded-none pr-6"
                        placeholder="General"
                    />
                    {data.category && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover/cat:opacity-100 transition-opacity">
                             <CopyButton value={data.category} className="h-4 w-4 opacity-50 hover:opacity-100" />
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-0.5 relative group/applied">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70">Applied</label>
                <div className="relative">
                    <Input 
                        type="date"
                        value={data.dateApplied ? new Date(data.dateApplied).toISOString().split('T')[0] : ''} 
                        onChange={(e) => handleChange('dateApplied', e.target.value)}
                        className="magic-focus h-7 bg-transparent dark:bg-transparent border-none shadow-none focus-visible:ring-0 p-0 font-medium text-sm rounded-none pr-6"
                    />
                    {data.dateApplied && (
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover/applied:opacity-100 transition-opacity">
                             <CopyButton value={new Date(data.dateApplied).toLocaleDateString()} label="Copy Date" className="h-4 w-4 opacity-50 hover:opacity-100" />
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-0.5 relative group/interview">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70">Interviewed</label>
                 <div className="relative">
                    <Input 
                        type="date"
                        value={data.dateInterviewed ? new Date(data.dateInterviewed).toISOString().split('T')[0] : ''} 
                        onChange={(e) => handleChange('dateInterviewed', e.target.value)}
                        className="magic-focus h-7 bg-transparent dark:bg-transparent border-none shadow-none focus-visible:ring-0 p-0 font-medium text-sm text-muted-foreground focus:text-foreground rounded-none pr-6"
                        placeholder="Add date"
                    />
                    {data.dateInterviewed && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover/interview:opacity-100 transition-opacity">
                             <CopyButton value={new Date(data.dateInterviewed).toLocaleDateString()} label="Copy Date" className="h-4 w-4 opacity-50 hover:opacity-100" />
                        </div>
                    )}
                </div>
            </div>
       </div>

       {/* URL Section */}
       <div className="space-y-2">
            {(!data.urlMeta && !data.url) && (
                <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity p-0 group/url relative">
                    <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <Input 
                        value={data.url || ''} 
                        onChange={handleUrlChange} 
                        placeholder="Paste Job URL..."
                        className="magic-focus bg-transparent dark:bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-7 text-xs w-full rounded-none pr-8"
                    />
                     {data.url && (
                        <div className="absolute right-0 top-0 bottom-0 flex items-center opacity-0 group-hover/url:opacity-100 transition-opacity">
                            <CopyButton value={data.url} className="h-4 w-4 opacity-50 hover:opacity-100" />
                        </div>
                    )}
                </div>
            )}
            
            {(data.url || data.urlMeta) && (
                <div className="relative group/bookmark animate-in fade-in zoom-in-95 duration-300">
                    <div className="absolute -top-2 -right-2 z-10 opacity-0 group-hover/bookmark:opacity-100 transition-all scale-90 group-hover/bookmark:scale-100 flex gap-1">
                         <CopyButton value={data.url || ''} className="h-6 w-6 rounded-full shadow-md bg-background border hover:bg-muted" />
                         <Button variant="destructive" size="icon" className="h-6 w-6 rounded-full shadow-md" onClick={clearUrl}>
                            <Trash2 className="h-3 w-3" />
                         </Button>
                    </div>
                    <BookmarkCard 
                        url={data.url || '#'} 
                        meta={data.urlMeta ? JSON.parse(data.urlMeta) : null} 
                    />
                </div>
            )}
            {loadingMeta && (
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground animate-pulse">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" />
                    Fetching metadata...
                </div>
            )}
       </div>
    </div>
  )
}
