import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import type { NewsArticle } from '../../types'
import { useAppStore } from '../../store/appStore'

interface Props {
  article: NewsArticle
}

export default function AudioPlayer({ article }: Props) {
  const { setPlayingArticleId } = useAppStore()
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const duration = article.duration ?? 120

  useEffect(() => {
    setProgress(0)
    setIsPaused(false)
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= duration) {
          clearInterval(intervalRef.current!)
          setPlayingArticleId(null)
          return 0
        }
        return p + 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [article.id, duration, setPlayingArticleId])

  const togglePause = () => {
    setIsPaused((v) => {
      if (v) {
        intervalRef.current = setInterval(() => {
          setProgress((p) => {
            if (p >= duration) {
              clearInterval(intervalRef.current!)
              setPlayingArticleId(null)
              return 0
            }
            return p + 1
          })
        }, 1000)
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
      return !v
    })
  }

  const pct = (progress / duration) * 100

  return (
    <div className="flex items-center gap-2 flex-1">
      <button
        onClick={togglePause}
        className="text-obs-accent hover:text-obs-purple transition-colors"
      >
        {isPaused ? <Play size={10} /> : <Pause size={10} />}
      </button>

      {/* Waveform bars */}
      {!isPaused && (
        <div className="flex items-center gap-0.5 h-4">
          <div className="waveform-bar" style={{ animationDelay: '0s' }} />
          <div className="waveform-bar" style={{ animationDelay: '0.1s' }} />
          <div className="waveform-bar" style={{ animationDelay: '0.2s' }} />
          <div className="waveform-bar" style={{ animationDelay: '0.3s' }} />
          <div className="waveform-bar" style={{ animationDelay: '0.2s' }} />
        </div>
      )}

      {/* Progress bar */}
      <div className="flex-1 h-1 bg-obs-border rounded-full overflow-hidden">
        <div
          className="h-full bg-obs-accent rounded-full transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>

      <span className="text-obs-muted text-xs tabular-nums">
        {Math.floor(progress / 60)}:{String(progress % 60).padStart(2, '0')}
      </span>
    </div>
  )
}
