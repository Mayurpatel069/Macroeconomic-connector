import { Newspaper } from 'lucide-react'
import NewsFeed from '../News/NewsFeed'

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
        <Newspaper size={13} className="text-obs-accent" strokeWidth={1.75} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-obs-muted">
          Blue Business Bytes
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <NewsFeed />
      </div>
    </div>
  )
}
