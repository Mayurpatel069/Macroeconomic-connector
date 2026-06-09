import { ArrowLeft, TrendingUp, TrendingDown, Minus, Clock, Play } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useAppStore } from '../../store/appStore'
import AudioPlayer from './AudioPlayer'
import { MACRO_SERIES } from '../../data/fredSeries'

const sentimentConfig = {
  positive: { icon: TrendingUp, color: 'text-obs-green', label: 'Bullish' },
  negative: { icon: TrendingDown, color: 'text-obs-red', label: 'Bearish' },
  neutral: { icon: Minus, color: 'text-obs-muted', label: 'Neutral' },
}

export default function ArticleDetail() {
  const { articles, activeArticleId, setActiveArticleId, playingArticleId, setPlayingArticleId } = useAppStore()
  const article = articles.find((a) => a.id === activeArticleId)
  if (!article) return null

  const cfg = sentimentConfig[article.sentiment]
  const Icon = cfg.icon
  const isPlaying = playingArticleId === article.id
  const relatedSeries = MACRO_SERIES.filter((s) => article.relatedSeriesIds.includes(s.id))
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })

  return (
    <div className="flex flex-col h-full animate-slide-in">
      <div className="px-3 py-2.5 border-b border-obs-border flex items-center gap-2">
        <button
          onClick={() => setActiveArticleId(null)}
          className="p-1 rounded hover:bg-white/5 text-obs-muted hover:text-obs-text transition-colors"
        >
          <ArrowLeft size={14} />
        </button>
        <span className="text-xs font-medium text-obs-muted truncate">{article.source}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs flex items-center gap-1 ${cfg.color}`}>
            <Icon size={12} /> {cfg.label}
          </span>
          <span className="text-xs text-obs-muted">·</span>
          <span className="text-xs text-obs-muted">{article.category}</span>
        </div>

        <h2 className="text-sm font-semibold text-obs-text leading-snug">{article.title}</h2>

        <div className="flex items-center gap-2 text-xs text-obs-muted">
          <Clock size={10} />
          <span>{timeAgo}</span>
        </div>

        {/* Audio player */}
        <div className="border border-obs-border rounded-lg p-2.5 bg-obs-bg">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setPlayingArticleId(isPlaying ? null : article.id)}
              className={`flex items-center gap-1.5 text-xs rounded px-2.5 py-1.5 transition-colors font-medium ${
                isPlaying
                  ? 'bg-obs-accent/20 text-obs-accent'
                  : 'bg-obs-accent text-white hover:bg-obs-accent/80'
              }`}
            >
              <Play size={10} fill="currentColor" />
              {isPlaying ? 'Playing' : 'Listen Now'}
            </button>
            {article.duration && (
              <span className="text-xs text-obs-muted">{Math.floor(article.duration / 60)}m {article.duration % 60}s</span>
            )}
          </div>
          {isPlaying && <AudioPlayer article={article} />}
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-obs-accent/5 border border-obs-accent/10 p-2.5">
          <p className="text-xs text-obs-text leading-relaxed">{article.summary}</p>
        </div>

        {/* Full content */}
        <div className="space-y-2">
          {article.content.split('\n\n').map((para, i) => (
            <p key={i} className="text-xs text-obs-muted leading-relaxed">{para}</p>
          ))}
        </div>

        {/* Related indicators */}
        {relatedSeries.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-obs-muted mb-2 uppercase tracking-wider">Related Indicators</p>
            <div className="flex flex-wrap gap-1.5">
              {relatedSeries.map((s) => (
                <span
                  key={s.id}
                  className="text-xs px-2 py-1 rounded-full border border-obs-border text-obs-muted"
                  style={{ borderColor: s.color + '40', color: s.color }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {article.tags.map((tag) => (
            <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-obs-muted">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
