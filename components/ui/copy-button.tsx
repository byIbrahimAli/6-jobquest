"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  label?: string
}

export function CopyButton({
  value,
  className,
  label = "Copy",
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  const copyToClipboard = React.useCallback((value: string) => {
    navigator.clipboard.writeText(value)
    setHasCopied(true)
  }, [])

  return (
    <TooltipProvider>
        <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                    "relative z-10 h-6 w-6 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
                    className
                    )}
                    onClick={(e) => {
                        e.stopPropagation() // Prevent triggering parent clicks (like expanding a card if applicable)
                        copyToClipboard(value)
                    }}
                    {...props}
                >
                    <span className="sr-only">{label}</span>
                    {hasCopied ? (
                    <Check className="h-3 w-3" />
                    ) : (
                    <Copy className="h-3 w-3" />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
                {hasCopied ? "Copied!" : "Copy to clipboard"}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}
