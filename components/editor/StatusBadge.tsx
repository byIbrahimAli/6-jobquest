"use client"

import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useState } from "react"

const STATUSES = [
  { label: "Interested", color: "bg-slate-500 hover:bg-slate-600" },
  { label: "Applied", color: "bg-blue-500 hover:bg-blue-600" },
  { label: "Interviewing", color: "bg-amber-500 hover:bg-amber-600" },
  { label: "Successful", color: "bg-green-500 hover:bg-green-600" },
  { label: "Unsuccessful", color: "bg-red-500 hover:bg-red-600" },
]

export function StatusBadge({ status, onStatusChange }: { status: string, onStatusChange: (s: string) => void }) {
  const [open, setOpen] = useState(false)
  const currentStatus = STATUSES.find(s => s.label === status) || STATUSES[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge className={cn("cursor-pointer", currentStatus.color)}>
          {status}
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
                >
                  <div className={cn("mr-2 h-2 w-2 rounded-full", s.color.split(" ")[0])} />
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
