"use client"

import { cn } from "@/lib/utils"

interface CustomCheckboxProps {
  checked: boolean
  onToggle: () => void
  disabled?: boolean
}

export function CustomCheckbox({ checked, onToggle, disabled }: CustomCheckboxProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className="group relative w-10 shrink-0 cursor-pointer border-r border-border/10 transition-all hover:w-12 disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        backgroundColor: checked ? '#22c55e' : '#ef4444', // Solid Green / Solid Red
        alignSelf: 'stretch',
      }}
      title={checked ? "Marked: Yes" : "Marked: No"}
      aria-label={checked ? "Toggle to No" : "Toggle to Yes"}
    >
      {/* Visual Feedback on Hover/Input */}
      <div className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/10" />
    </button>
  )
}
