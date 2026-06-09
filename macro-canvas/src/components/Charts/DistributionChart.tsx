import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

interface Props {
  data: number[]
  color: string
  label: string
}

function buildHistogram(data: number[], bins = 20) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min
  if (range === 0) return [{ bin: min.toFixed(2), count: data.length }]
  const width = range / bins
  const result = Array.from({ length: bins }, (_, i) => {
    const lo = min + i * width
    const hi = lo + width
    return {
      bin: lo.toFixed(2),
      count: data.filter((v) => v >= lo && (i === bins - 1 ? v <= hi : v < hi)).length,
    }
  })
  return result.filter((d) => d.count > 0)
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-obs-panel border border-obs-border rounded-lg px-2 py-1.5 text-xs shadow-lg">
      <p className="text-obs-muted">{label}</p>
      <p className="text-obs-text">Count: <span className="font-mono font-semibold">{payload[0]?.value}</span></p>
    </div>
  )
}

export default function DistributionChart({ data, color, label }: Props) {
  const histData = buildHistogram(data)

  return (
    <div>
      <p className="text-[10px] text-obs-muted mb-1 px-1">{label} — Distribution</p>
      <ResponsiveContainer width="100%" height={90}>
        <BarChart data={histData} margin={{ top: 2, right: 4, bottom: 2, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
          <XAxis dataKey="bin" tick={{ fontSize: 8, fill: '#8b949e' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={false} axisLine={false} tickLine={false} width={0} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill={color} fillOpacity={0.75} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
