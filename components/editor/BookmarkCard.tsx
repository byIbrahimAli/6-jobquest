/* eslint-disable @next/next/no-img-element */
import { Card } from "@/components/ui/card"

interface MetaData {
  title: string
  description: string
  image: string
}

export function BookmarkCard({ url, meta }: { url: string, meta: MetaData | null }) {
  if (!meta) return <div className="text-sm text-blue-500 underline truncate">{url}</div>

  return (
    <a href={url} target="_blank" rel="noreferrer" className="block no-underline">
      <Card className="flex h-24 overflow-hidden hover:bg-accent/50 transition-colors">
        <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
          <div className="font-medium truncate leading-none mb-1.5">{meta.title || url}</div>
          <div className="text-xs text-muted-foreground truncate">{new URL(url).hostname}</div>
        </div>
        {meta.image && (
          <div className="w-32 h-full relative bg-muted hidden sm:block">
            <img 
                src={meta.image} 
                alt={meta.title} 
                className="w-full h-full object-cover" 
            />
          </div>
        )}
      </Card>
    </a>
  )
}
