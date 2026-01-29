"use client"

import { useState, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface JobNoteProps {
    note: string | null
    onUpdate: (note: string) => void
    onDelete?: () => void
    className?: string
}

export function JobNote({ note, onUpdate, onDelete, className }: JobNoteProps) {
    const [value, setValue] = useState(note || "")
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setValue(note || "")
    }, [note])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        setValue(newValue)

        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            onUpdate(newValue)
        }, 1000)
    }

    return (
        <div className={cn("w-full animate-in fade-in slide-in-from-top-1 duration-200", className)}>
            <div className="relative">
                <Textarea 
                    value={value}
                    onChange={handleChange}
                    placeholder="Add notes, interview details, or thoughts..."
                    className="min-h-[80px] bg-muted/30 border-none resize-y text-sm focus-visible:ring-0 p-3 rounded-lg placeholder:text-muted-foreground/40 magic-focus focus-visible:ring-offset-0"
                    spellCheck={false}
                />
                 <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onDelete && (
                        <button 
                            onClick={onDelete}
                            className="p-1.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                            title="Clear Note"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                    )}
                 </div>
            </div>
        </div>
    )
}
