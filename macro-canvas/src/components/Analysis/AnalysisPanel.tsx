import { useState } from 'react'
import { X, BarChart2, LineChart, GitCompare, Sigma } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import StatisticsCard from './StatisticsCard'
import TimeSeriesChart from '../Charts/TimeSeriesChart'
import ScatterPlot from '../Charts/ScatterPlot'
import DistributionChart from '../Charts/DistributionChart'

type TabKey = 'stats' | 'timeseries' | 'scatter' | 'distribution'

const TABS: { key: TabKey; icon: React.ElementType; label: string }[] = [
  { key: 'stats', icon: Sigma, label: 'Stats' },
  { key: 'timeseries', icon: LineChart, label: 'Time Series' },
  { key: 'scatter', icon: GitCompare, label: 'Scatter' },
  { key: 'distribution', icon: BarChart2, label: 'Distribution' },
]

export default function AnalysisPanel() {
  const { activeAnalysis, setActiveAnalysis } = useAppStore()
  const [tab, setTab] = useState<TabKey>('stats')

  if (!activeAnalysis) return null

  const { seriesA, seriesB } = activeAnalysis

  return (
    <div className="flex flex-col h-full animate-fade-in-right">
      {/* Header */}
      <div className="px-3.5 py-3 border-b border-white/[0.06] shrink-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-obs-subtle mb-1.5">
              Statistical Analysis
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: seriesA.color + '18', color: seriesA.color }}
              >
                {seriesA.fredId}
              </span>
              <span className="text-obs-subtle text-xs">↔</span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: seriesB.color + '18', color: seriesB.color }}
              >
                {seriesB.fredId}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveAnalysis(null)}
            className="p-1 rounded-lg hover:bg-white/[0.06] text-obs-subtle hover:text-obs-muted transition-colors shrink-0"
          >
            <X size={13} />
          </button>
        </div>

        <div className="text-[10px] text-obs-subtle font-light leading-snug">
          {seriesA.name} <span className="text-obs-subtle/40">vs</span> {seriesB.name}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.06] shrink-0">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-all duration-150 ${
                tab === t.key
                  ? 'text-obs-accent border-b border-obs-accent bg-obs-accent/[0.05]'
                  : 'text-obs-subtle hover:text-obs-muted hover:bg-white/[0.03]'
              }`}
            >
              <Icon size={10} strokeWidth={tab === t.key ? 2 : 1.75} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3.5 animate-slide-in">
        {tab === 'stats' && <StatisticsCard result={activeAnalysis} />}

        {tab === 'timeseries' && (
          <div>
            <p className="text-[9px] text-obs-subtle uppercase tracking-[0.1em] font-semibold mb-2.5">
              Overlapping Time Series
            </p>
            <TimeSeriesChart result={activeAnalysis} />
            <p className="text-[10px] text-obs-subtle mt-2.5 font-light leading-relaxed">
              Dual-axis chart — left for {seriesA.fredId}, right for {seriesB.fredId}.
              Showing {Math.min(activeAnalysis.aligned.length, 60)} aligned observations.
            </p>
          </div>
        )}

        {tab === 'scatter' && (
          <div>
            <p className="text-[9px] text-obs-subtle uppercase tracking-[0.1em] font-semibold mb-2.5">
              Correlation Scatter Plot
            </p>
            <ScatterPlot result={activeAnalysis} />
            <p className="text-[10px] text-obs-subtle mt-2.5 font-light leading-relaxed">
              Each point is a shared observation date. Dashed line is OLS regression.
              r = {activeAnalysis.correlation.toFixed(4)}, r² = {activeAnalysis.rSquared.toFixed(4)}.
            </p>
          </div>
        )}

        {tab === 'distribution' && (
          <div className="space-y-4">
            <p className="text-[9px] text-obs-subtle uppercase tracking-[0.1em] font-semibold">
              Value Distributions
            </p>
            <DistributionChart
              data={activeAnalysis.dataA.map((d) => d.value)}
              color={seriesA.color}
              label={`${seriesA.name} (${seriesA.unit})`}
            />
            <DistributionChart
              data={activeAnalysis.dataB.map((d) => d.value)}
              color={seriesB.color}
              label={`${seriesB.name} (${seriesB.unit})`}
            />
            <div className="text-[10px] text-obs-subtle space-y-1.5 border border-white/[0.06] rounded-xl p-3 bg-white/[0.02]">
              <div className="flex justify-between">
                <span>{seriesA.fredId} Mean</span>
                <span className="font-mono text-obs-muted">{activeAnalysis.meanA.toFixed(3)} {seriesA.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>{seriesA.fredId} StdDev</span>
                <span className="font-mono text-obs-muted">±{activeAnalysis.stdDevA.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span>{seriesB.fredId} Mean</span>
                <span className="font-mono text-obs-muted">{activeAnalysis.meanB.toFixed(3)} {seriesB.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>{seriesB.fredId} StdDev</span>
                <span className="font-mono text-obs-muted">±{activeAnalysis.stdDevB.toFixed(3)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3.5 py-2 border-t border-white/[0.06] shrink-0">
        <p className="text-[9px] text-obs-subtle font-light">
          FRED · {activeAnalysis.aligned.length} aligned observations
        </p>
      </div>
    </div>
  )
}
