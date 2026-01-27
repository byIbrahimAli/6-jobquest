"use client"

import { useState, useEffect } from "react"
import { JobApplication } from "@/lib/types"
import { createJob, updateJob } from "@/lib/actions"
import { JobBlock } from "./JobBlock"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Plus } from "lucide-react"
import { StatusBadge } from "./StatusBadge"

export function EditorInterface({ jobs, viewMode }: { jobs: JobApplication[], viewMode: 'detailed' | 'concise' }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const addJobBlock = async () => {
    setOpen(false)
    await createJob({
      title: "",
      employer: "",
      dateApplied: new Date(),
    })
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={addJobBlock}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Insert Job Block</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {viewMode === 'detailed' ? (
          <div className="space-y-6">
            {jobs.map((job) => (
                <JobBlock key={job.id} job={job} />
            ))}
          </div>
      ) : (
          <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-medium text-sm">
                  <div className="col-span-5">Job Title</div>
                  <div className="col-span-4">Employer</div>
                  <div className="col-span-3">Status</div>
              </div>
              <div className="divide-y">
                  {jobs.map((job) => (
                      <div key={job.id} className="grid grid-cols-12 gap-4 p-4 items-center bg-card hover:bg-accent/50 transition-colors">
                          <div className="col-span-5 font-medium truncate">{job.title || "Untitled"}</div>
                          <div className="col-span-4 truncate">{job.employer || "-"}</div>
                          <div className="col-span-3">
                              <StatusBadge status={job.status} onStatusChange={async (s) => {
                                   await updateJob(job.id, { status: s })
                              }} />
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
      
       {jobs.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
              Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"><span className="text-xs">/</span></kbd> to add a job block.
          </div>
      )}
    </div>
  )
}
