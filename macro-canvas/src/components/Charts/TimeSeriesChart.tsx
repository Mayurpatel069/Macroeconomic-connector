import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { AnalysisResult } from '../../types'
import { format, parseISO } from 'date-fns'

interface Props {
  result: AnalysisResult
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-obs-panel border border-obs-border rounded-lg px-2.5 py-2 text-xs shadow-lg">
      <p className="text-obs-muted mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-mono font-semibold">{Number(p.value).toFixed(3)}</span>
        </p>
      ))}
    </div>
  )
}

export default function TimeSeriesChart({ result }: Props) {
  const data = result.aligned.slice(-60).map((d) => ({
    date: format(parseISO(d.date), 'MMM yy'),
    [result.seriesA.fredId]: d.valueA,
    [result.seriesB.fredId]: d.valueB,
  }))

  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-obs-muted text-xs">
        No overlapping data
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9, fill: '#8b949e' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="a"
          orientation="left"
          tick={{ fontSize: 9, fill: '#8b949e' }}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <YAxis
          yAxisId="b"
          orientation="right"
          tick={{ fontSize: 9, fill: '#8b949e' }}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconSize={8}
          wrapperStyle={{ fontSize: 10, color: '#8b949e', paddingTop: 4 }}
        />
        <Line
          yAxisId="a"
          type="monotone"
          dataKey={result.seriesA.fredId}
          stroke={result.seriesA.color}
          strokeWidth={1.5}
          dot={false}
          name={result.seriesA.name}
        />
        <Line
          yAxisId="b"
          type="monotone"
          dataKey={result.seriesB.fredId}
          stroke={result.seriesB.color}
          strokeWidth={1.5}
          dot={false}
          name={result.seriesB.name}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
