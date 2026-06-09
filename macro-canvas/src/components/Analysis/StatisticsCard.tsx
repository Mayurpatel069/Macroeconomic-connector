import type { AnalysisResult } from '../../types'
import { correlationLabel, correlationColor, formatStat } from '../../utils/statistics'

interface StatRow {
  label: string
  value: string
  sub?: string
  color?: string
}

interface Props {
  result: AnalysisResult
}

function StatRowItem({ row }: { row: StatRow }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/[0.05] last:border-0">
      <span className="text-[11px] text-obs-subtle font-light">{row.label}</span>
      <div className="text-right">
        <span
          className="text-[11px] font-mono font-medium"
          style={{ color: row.color ?? '#f5f5f7' }}
        >
          {row.value}
        </span>
        {row.sub && <span className="ml-1 text-[10px] text-obs-subtle">{row.sub}</span>}
      </div>
    </div>
  )
}

export default function StatisticsCard({ result }: Props) {
  const corrColor = correlationColor(result.correlation)
  const corrLabel = correlationLabel(result.correlation)
  const corrSign = result.correlation >= 0 ? '+' : ''

  const rows: StatRow[] = [
    {
      label: 'Correlation (r)',
      value: `${corrSign}${result.correlation.toFixed(4)}`,
      color: corrColor,
    },
    {
      label: 'R-squared (r²)',
      value: result.rSquared.toFixed(4),
      sub: `${(result.rSquared * 100).toFixed(1)}% variance`,
      color: corrColor,
    },
    {
      label: 'Covariance',
      value: formatStat(result.covariance, 4),
    },
    { label: `Std Dev — ${result.seriesA.fredId}`, value: formatStat(result.stdDevA, 4), sub: result.seriesA.unit },
    { label: `Std Dev — ${result.seriesB.fredId}`, value: formatStat(result.stdDevB, 4), sub: result.seriesB.unit },
    { label: `CV — ${result.seriesA.fredId}`, value: `${result.cvA.toFixed(2)}%` },
    { label: `CV — ${result.seriesB.fredId}`, value: `${result.cvB.toFixed(2)}%` },
    { label: `Mean — ${result.seriesA.fredId}`, value: formatStat(result.meanA, 2), sub: result.seriesA.unit },
    { label: `Mean — ${result.seriesB.fredId}`, value: formatStat(result.meanB, 2), sub: result.seriesB.unit },
    { label: 'Aligned observations', value: String(result.aligned.length) },
  ]

  return (
    <div className="space-y-1">
      {/* Interpretation banner */}
      <div
        className="rounded-xl px-3 py-2.5 mb-3.5 border"
        style={{ background: corrColor + '0d', borderColor: corrColor + '25' }}
      >
        <p className="text-[11px] font-semibold" style={{ color: corrColor }}>{corrLabel}</p>
        <p className="text-[10px] text-obs-subtle mt-0.5 font-light leading-relaxed">
          {Math.abs(result.rSquared * 100).toFixed(1)}% of variance in {result.seriesB.name} explained by {result.seriesA.name}
        </p>
      </div>

      {/* Stats table */}
      <div className="px-0.5">
        {rows.map((row) => (
          <StatRowItem key={row.label} row={row} />
        ))}
      </div>
    </div>
  )
}
