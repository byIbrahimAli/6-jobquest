"use client"

import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useState } from "react"

const STATUSES = [
  { label: "Interested", color: "bg-gradient-to-r from-slate-500/80 to-slate-600/80 border-slate-500/50 text-slate-100", indicator: "bg-slate-500" },
  { label: "Applied", color: "bg-gradient-to-r from-blue-500/80 to-blue-600/80 border-blue-500/50 text-blue-100", indicator: "bg-blue-500" },
  { label: "Interviewing", color: "bg-gradient-to-r from-amber-500/80 to-amber-600/80 border-amber-500/50 text-amber-100", indicator: "bg-amber-500" },
  { label: "Successful", color: "bg-gradient-to-r from-green-500/80 to-green-600/80 border-green-500/50 text-green-100", indicator: "bg-green-500" },
  { label: "Unsuccessful", color: "bg-gradient-to-r from-red-500/80 to-red-600/80 border-red-500/50 text-red-100", indicator: "bg-red-500" },
]

export function StatusBadge({ status, onStatusChange }: { status: string, onStatusChange: (s: string) => void }) {
  const [open, setOpen] = useState(false)
  const currentStatus = STATUSES.find(s => s.label === status) || STATUSES[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge 
            className={cn(
                "cursor-pointer relative overflow-hidden border px-3 py-1 shadow-md transition-all hover:scale-105 active:scale-95",
                currentStatus.color
            )}
        >
          <span className="relative z-10 font-medium tracking-wide shadow-black/20 drop-shadow-sm">{status}</span>
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 z-0 flex -translate-x-full animate-shimmer items-center justify-center">
            <div className="h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {STATUSES.map((s) => (
                <CommandItem
                  key={s.label}
                  onSelect={() => {
                    onStatusChange(s.label)
                    setOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <div className={cn("mr-2 h-2 w-2 rounded-full", s.indicator)} />
                  {s.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
