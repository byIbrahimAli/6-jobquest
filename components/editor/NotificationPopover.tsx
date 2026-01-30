
"use client"

import { useState, useRef } from "react"
import { Bell, BellRing, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { JobNotification } from "@/lib/types"
import { createNotification, deleteNotification, toggleNotificationStatus } from "@/lib/actions"
import { cn } from "@/lib/utils"

interface NotificationPopoverProps {
  jobId: string
  notifications: JobNotification[]
}

export function NotificationPopover({ jobId, notifications = [] }: NotificationPopoverProps) {
  const [open, setOpen] = useState(false)
  const [addMode, setAddMode] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sort: Incomplete first, then by date (newest first). Completed last.
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.completed === b.completed) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    return a.completed ? 1 : -1
  })

  // Count only active notifications for badge
  const activeCount = notifications.filter(n => !n.completed).length
  const hasNotifications = activeCount > 0

  const handleAdd = async () => {
    if (!inputValue.trim()) return
    setIsSubmitting(true)
    await createNotification(jobId, inputValue)
    setInputValue("")
    setAddMode(false)
    setIsSubmitting(false)
  }

  const handleToggle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // Optimistic UI could be handled by parent revalidation or local state if component owned it.
    // For now rely on server action revalidate.
    await toggleNotificationStatus(id)
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteNotification(id)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
                "h-7 w-7 text-muted-foreground hover:text-foreground relative",
                hasNotifications && "text-foreground"
            )}
        >
            {hasNotifications ? (
                <BellRing className="h-3.5 w-3.5 text-orange-500 fill-orange-500/20" />
            ) : (
                <Bell className="h-3.5 w-3.5" />
            )}
            {hasNotifications && (
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 border border-background" />
            )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/40">
            <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Tasks</h4>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{activeCount}/{notifications.length}</span>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 relative min-h-[100px]">
            {notifications.length === 0 && !addMode && (
                <div className="flex flex-col items-center justify-center h-[120px] text-center p-4">
                    <Bell className="h-8 w-8 text-muted-foreground/20 mb-2" />
                    <p className="text-sm text-muted-foreground/50">No tasks yet</p>
                    <p className="text-xs text-muted-foreground/30">Add reminders or tracking steps</p>
                </div>
            )}

            {sortedNotifications.map((note) => (
                <div 
                    key={note.id} 
                    onClick={(e) => handleToggle(note.id, e)}
                    className={cn(
                        "group flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-muted/60 transition-all text-sm border border-transparent hover:border-border/50 cursor-pointer select-none",
                        note.completed ? "bg-muted/20 opacity-60" : "bg-muted/40"
                    )}
                >
                    <div className="flex gap-3 items-start flex-1">
                        <div className={cn(
                            "mt-0.5 h-4 w-4 shrink-0 rounded border border-primary/20 transition-colors flex items-center justify-center",
                            note.completed ? "bg-primary border-primary" : "bg-transparent group-hover:border-primary/50"
                        )}>
                            {note.completed && <Plus className="h-3 w-3 text-primary-foreground rotate-45" />} 
                            {/* Visual checkmark/x trick */}
                        </div>
                        <p className={cn(
                            "leading-snug break-words transition-all",
                            note.completed ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground/90"
                        )}>
                            {note.content}
                        </p>
                    </div>
                    
                    <button 
                        onClick={(e) => handleDelete(note.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all shrink-0 -mr-1"
                    >
                        <Trash2 className="h-3 w-3" />
                    </button>
                </div>
            ))}
        </div>

        <div className="p-2 border-t bg-muted/20">
            {addMode ? (
                <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <Input 
                        autoFocus
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type notification..."
                        className="h-8 text-sm"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAdd()
                            if (e.key === 'Escape') setAddMode(false)
                        }}
                    />
                    <Button 
                        size="sm" 
                        className="h-8 px-3" 
                        onClick={handleAdd}
                        disabled={!inputValue.trim() || isSubmitting}
                    >
                        Add
                    </Button>
                </div>
            ) : (
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full h-8 gap-2 text-muted-foreground hover:text-primary"
                    onClick={() => setAddMode(true)}
                >
                    <Plus className="h-3.5 w-3.5" />
                    Add Item
                </Button>
            )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
