"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileToolbarProps {
  onAdd: () => void
}

export function MobileToolbar({ onAdd }: MobileToolbarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe-area-inset-bottom md:hidden pointer-events-none">
       {/* Floating Wrapper */}
      <div className="flex items-center justify-end max-w-4xl mx-auto pointer-events-auto">
         {/* Add Button */}
         <div className="bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-full p-1.5 flex items-center gap-2">
            <Button 
                onClick={onAdd}
                size="icon"
                className="rounded-full h-12 w-12 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
            >
                <Plus className="h-6 w-6" />
            </Button>
         </div>
      </div>
    </div>
  )
}
