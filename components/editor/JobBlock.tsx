"use client"

import { useState, useRef } from "react"
import { JobApplication } from "@/lib/types"
import { updateJob, fetchUrlMetadata, deleteJob } from "@/lib/actions"
import { StatusBadge } from "./StatusBadge"
import { BookmarkCard } from "./BookmarkCard"
import { JobNote } from "./JobNote"
import { CustomCheckbox } from "./CustomCheckbox"
import { NotificationPopover } from "./NotificationPopover"
import { Input } from "@/components/ui/input"
import { Link as LinkIcon, Trash2, StickyNote, Edit2 } from "lucide-react"
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
import { cn } from "@/lib/utils"

export function JobBlock({ job }: { job: JobApplication }) {
  const [data, setData] = useState(job)
  const [loadingMeta, setLoadingMeta] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showNotes, setShowNotes] = useState(!!job.notes)
  const [isEditingUrl, setIsEditingUrl] = useState(false)
  
  // Local state for URL to prevent re-render lag during typing
  const [localUrl, setLocalUrl] = useState(job.url || "")
  
  // ... state
  
  const updateTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleChange = (field: keyof JobApplication, value: string | Date | null | boolean) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    
    if (updateTimeout.current) clearTimeout(updateTimeout.current)
    
    updateTimeout.current = setTimeout(async () => {
       await updateJob(job.id, { [field]: value })
    }, 500)
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setLocalUrl(url) // Immediate local update
    
    // Debounce the heavy stuff (Validation, DB update, Metadata fetch)
    if (updateTimeout.current) clearTimeout(updateTimeout.current)
    
    updateTimeout.current = setTimeout(async () => {
        // Validation check
        try {
            new URL(url)
        } catch {
            // Invalid? Just update text in DB, clear meta
            if (!url) {
                 await updateJob(job.id, { url: null, urlMeta: null })
                 setData(prev => ({ ...prev, url: null, urlMeta: null }))
            } else {
                 await updateJob(job.id, { url })
                 setData({ ...data, url })
            }
            return
        }

        // Valid URL - Fetch Meta
        setLoadingMeta(true)
        const meta = await fetchUrlMetadata(url)
        setLoadingMeta(false)
        
        const metaString = meta ? JSON.stringify(meta) : null
        
        // Update DB
        await updateJob(job.id, { url, urlMeta: metaString })
        
        // Update main data state to match (reconcile)
        setData(prev => ({ ...prev, url, urlMeta: metaString }))
    }, 500) // 500ms wait
  }

  const clearUrl = () => {
      setLocalUrl('')
      handleChange('url', '')
      handleChange('urlMeta', null)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteJob(job.id)
    // The component will likely be unmounted by a parent re-fetch or optimistically removed
  }

  return (
    <div className="group relative border border-transparent hover:border-border/50 rounded-xl bg-background/60 backdrop-blur-xl border-muted/50 shadow-sm hover:shadow-lg transition-all duration-300 flex overflow-hidden">
       {/* Left Strip Checkbox */}
       <CustomCheckbox 
          checked={!!data.customCheck} 
          onToggle={() => handleChange('customCheck', !data.customCheck)}
          disabled={isDeleting}
       />
       
       {/* Main Content Area */}
       <div className="flex-1 p-3 min-w-0">
        {/* Header: Status | Title | Employer | Actions */}
       <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-2">
           <StatusBadge status={data.status} onStatusChange={(s) => handleChange('status', s)} />
           
           <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2 w-full">
                {/* Title */}
                <div className="group/title relative flex-shrink-0 flex-1 min-w-[200px]">
                    <Input 
                        autoFocus={!data.title}
                        value={data.title} 
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Job Title"
                        className="magic-focus text-lg font-bold font-heading bg-transparent dark:bg-transparent border-none px-0 shadow-none focus-visible:ring-0 h-auto p-0 placeholder:text-muted-foreground/30 transition-all focus:bg-transparent -ml-0.5 rounded-none w-full pb-0"
                    />
                </div>
                
                {/* Employer */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground relative group/employer min-w-0 flex-1">
                    <span className="opacity-50">at</span>
                    <Input 
                        value={data.employer} 
                        onChange={(e) => handleChange('employer', e.target.value)}
                        placeholder="Company"
                        className="magic-focus font-medium bg-transparent dark:bg-transparent border-none px-0 shadow-none focus-visible:ring-0 h-auto p-0 inline-block placeholder:text-muted-foreground/30 focus:bg-transparent rounded-none pb-0 truncate w-full"
                    />
                </div>
           </div>
           
           {/* Actions - Mobile: Top Right Absolute | Desktop: Static, Hover-revealed (mostly) */}
           <div className="absolute top-2 right-2 md:static flex items-center gap-1 self-end md:self-auto z-10">
                <div className={cn(
                    "transition-opacity duration-200",
                    /* Desktop: Hide by default unless has notifications or hovering group */
                    (job.notifications && job.notifications.length > 0) ? "opacity-100" : "opacity-100 md:opacity-0 group-hover:opacity-100"
                )}>
                    <NotificationPopover jobId={job.id} notifications={job.notifications || []} />
                </div>
                
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowNotes(!showNotes)}
                    className={cn(
                        "h-7 w-7 text-muted-foreground hover:text-foreground transition-opacity duration-200",
                        /* Show if notes exist/open, otherwise hide on desktop until hover */
                        (showNotes || data.notes) 
                            ? "text-primary bg-primary/10 opacity-100" 
                            : "opacity-100 md:opacity-0 group-hover:opacity-100"
                    )}
                >
                    <StickyNote className="h-3.5 w-3.5" />
                </Button>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-opacity duration-200 opacity-100 md:opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Job Block?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the job entry for <span className="font-semibold text-foreground">{data.title || 'Untitled'}</span> at <span className="font-semibold text-foreground">{data.employer || 'Unknown Company'}</span>.
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

       {/* Sub Row: Category | Applied | Interviewed */}
       <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground mb-2 px-1">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <span className="font-semibold text-[10px] uppercase tracking-wider opacity-50 flex-shrink-0">Category</span>
                <Input 
                    value={data.category} 
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="magic-focus h-5 bg-transparent border-none shadow-none focus-visible:ring-0 p-0 text-xs w-full"
                    placeholder="General"
                />
            </div>
            
            <div className="flex items-center gap-2">
                <span className="font-semibold text-[10px] uppercase tracking-wider opacity-50">Applied</span>
                 <Input 
                    type="date"
                    value={data.dateApplied ? new Date(data.dateApplied).toISOString().split('T')[0] : ''} 
                    onChange={(e) => handleChange('dateApplied', e.target.value)}
                    className="magic-focus h-5 bg-transparent border-none shadow-none focus-visible:ring-0 p-0 text-xs w-auto min-w-[110px]"
                />
            </div>

            <div className="flex items-center gap-2">
                <span className="font-semibold text-[10px] uppercase tracking-wider opacity-50">Interview</span>
                 <Input 
                    type="date"
                    value={data.dateInterviewed ? new Date(data.dateInterviewed).toISOString().split('T')[0] : ''} 
                    onChange={(e) => handleChange('dateInterviewed', e.target.value)}
                    className="magic-focus h-5 bg-transparent border-none shadow-none focus-visible:ring-0 p-0 text-xs w-auto min-w-[110px] placeholder:text-muted-foreground/50"
                    placeholder="Add date"
                />
            </div>
       </div>

       {/* Bottom Section: Flexible Row for Notes & URL */}
       <div className="flex flex-col md:flex-row gap-4 mt-2 empty:hidden">
            {/* Notes Section */}
            {(showNotes || data.notes) && (
                <div className="flex-1 min-w-0 pt-2 border-t border-border/40 md:border-none md:pt-0 group relative">
                    <JobNote 
                        note={data.notes} 
                        onUpdate={(note) => handleChange('notes', note)} 
                        onDelete={() => {
                            handleChange('notes', '')
                            setShowNotes(false)
                        }}
                        className={showNotes ? "" : "hidden"}
                    />
                </div>
            )}

            {/* URL Section - Compact */}
            {/* Show if has Data OR Editing OR (Notes are present, to balance row? No, hide if empty) */}
            {/* Actually user said "split it 50/50... layout of job block". If URL is empty/hidden, notes take full width? */}
            {/* "When a note is added it'll be on the same row as the url link it just splits it 50/50" */}
            <div className={cn(
                "flex-1 min-w-0 space-y-2",
                !showNotes && !data.notes ? "w-full" : "", // Full width if no notes
                (showNotes || data.notes) && "md:border-l md:border-border/40 md:pl-4" // Separation if notes exist
            )}>
                 {/* Input Mode: Show if (No Data) OR (Editing) */}
                 {((!data.urlMeta && !data.url) || isEditingUrl) && (
                     <div className="flex items-center gap-2 opacity-100 transition-opacity p-0 group/url relative animate-in fade-in slide-in-from-top-1 duration-200 mt-1">
                         <LinkIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                         <Input 
                             autoFocus={isEditingUrl}
                             value={localUrl} 
                             onChange={handleUrlChange} 
                             onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                     setIsEditingUrl(false)
                                 }
                             }}
                             onBlur={() => {
                                 // Close when clicking away
                                 setIsEditingUrl(false)
                             }}
                             placeholder="Paste Job URL (auto-scrapes)"
                             className="magic-focus bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-6 text-[10px] w-full"
                         />
                     </div>
                 )}
                 
                 {/* Card Mode: Show if (Has Data) AND (Not Editing) */}
                 {(data.url || data.urlMeta) && !isEditingUrl && (
                     <div className="relative group/bookmark animate-in fade-in zoom-in-95 duration-300">
                         <div className="absolute -top-2 -right-2 z-10 opacity-0 group-hover/bookmark:opacity-100 transition-all scale-90 group-hover/bookmark:scale-100 flex gap-1">
                              <CopyButton value={data.url || ''} className="h-6 w-6 rounded-full shadow-md bg-background border hover:bg-muted" />
                              <Button 
                                 variant="secondary" 
                                 size="icon" 
                                 className="h-6 w-6 rounded-full shadow-md bg-background border hover:bg-muted text-muted-foreground hover:text-foreground" 
                                 onClick={() => setIsEditingUrl(true)}
                                 title="Edit URL"
                             >
                                 <Edit2 className="h-3 w-3" />
                              </Button>
                         </div>
                         <BookmarkCard 
                             url={data.url || '#'} 
                             meta={data.urlMeta ? JSON.parse(data.urlMeta) : null} 
                         />
                     </div>
                 )}
                 
                 {loadingMeta && (
                     <div className="flex items-center gap-2 text-[10px] text-muted-foreground animate-pulse mt-1">
                         <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" />
                         Fetching metadata...
                     </div>
                 )}
            </div>
       </div>

       </div>
    </div>
  )
}
