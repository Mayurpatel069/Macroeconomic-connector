import { Play, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { NewsArticle } from '../../types'
import { useAppStore } from '../../store/appStore'
import AudioPlayer from './AudioPlayer'

interface Props {
  article: NewsArticle
}

const sentimentConfig = {
  positive: { icon: TrendingUp, color: 'text-obs-green', bg: 'bg-obs-green/10 border-obs-green/20' },
  negative: { icon: TrendingDown, color: 'text-obs-red', bg: 'bg-obs-red/10 border-obs-red/20' },
  neutral: { icon: Minus, color: 'text-obs-muted', bg: 'bg-white/5 border-white/10' },
}

export default function ArticleCard({ article }: Props) {
  const { setActiveArticleId, playingArticleId, setPlayingArticleId } = useAppStore()
  const isPlaying = playingArticleId === article.id
  const cfg = sentimentConfig[article.sentiment]
  const Icon = cfg.icon

  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })

  return (
    <div className="rounded-lg border border-obs-border bg-obs-bg hover:border-obs-accent/40 transition-colors group overflow-hidden">
      <button
        className="w-full text-left p-3"
        onClick={() => setActiveArticleId(article.id)}
      >
        <div className="flex items-start gap-2 mb-2">
          <span className={`text-xs px-1.5 py-0.5 rounded border ${cfg.bg} ${cfg.color} flex items-center gap-1 shrink-0 mt-0.5`}>
            <Icon size={10} />
            {article.category}
          </span>
        </div>
        <h3 className="text-sm font-medium text-obs-text leading-snug mb-1.5 group-hover:text-obs-accent transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-obs-muted line-clamp-2 leading-relaxed">
          {article.summary}
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-obs-muted">
          <Clock size={10} />
          <span>{timeAgo}</span>
          <span className="mx-1">·</span>
          <span>{article.source}</span>
        </div>
      </button>

      {/* Audio controls */}
      <div className="border-t border-obs-border px-3 py-2 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setPlayingArticleId(isPlaying ? null : article.id)
          }}
          className={`flex items-center gap-1.5 text-xs rounded px-2 py-1 transition-colors ${
            isPlaying
              ? 'bg-obs-accent/20 text-obs-accent'
              : 'hover:bg-white/5 text-obs-muted hover:text-obs-text'
          }`}
        >
          <Play size={10} fill={isPlaying ? 'currentColor' : 'none'} />
          {isPlaying ? 'Playing' : 'Listen'}
        </button>
        {article.duration && (
          <span className="text-xs text-obs-muted">{Math.floor(article.duration / 60)}:{String(article.duration % 60).padStart(2, '0')}</span>
        )}
        {isPlaying && <AudioPlayer article={article} />}
      </div>
    </div>
  )
}
