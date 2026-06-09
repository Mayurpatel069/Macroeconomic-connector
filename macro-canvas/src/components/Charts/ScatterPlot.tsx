import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import type { AnalysisResult } from '../../types'

interface Props {
  result: AnalysisResult
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div className="bg-obs-panel border border-obs-border rounded-lg px-2.5 py-2 text-xs shadow-lg">
      <p className="text-obs-muted">{d?.date}</p>
      <p style={{ color: '#58a6ff' }}>
        X: <span className="font-mono font-semibold">{Number(d?.x).toFixed(3)}</span>
      </p>
      <p style={{ color: '#bc8cff' }}>
        Y: <span className="font-mono font-semibold">{Number(d?.y).toFixed(3)}</span>
      </p>
    </div>
  )
}

function linearRegression(xs: number[], ys: number[]) {
  const n = xs.length
  const sumX = xs.reduce((a, b) => a + b, 0)
  const sumY = ys.reduce((a, b) => a + b, 0)
  const sumXY = xs.reduce((s, x, i) => s + x * ys[i], 0)
  const sumX2 = xs.reduce((s, x) => s + x * x, 0)
  const denom = n * sumX2 - sumX * sumX
  if (denom === 0) return { slope: 0, intercept: sumY / n }
  const slope = (n * sumXY - sumX * sumY) / denom
  const intercept = (sumY - slope * sumX) / n
  return { slope, intercept }
}

export default function ScatterPlot({ result }: Props) {
  const scatterData = result.aligned.slice(-120).map((d) => ({
    x: d.valueA,
    y: d.valueB,
    date: d.date,
  }))

  if (scatterData.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-obs-muted text-xs">
        No overlapping data
      </div>
    )
  }

  const xs = scatterData.map((d) => d.x)
  const ys = scatterData.map((d) => d.y)
  const { slope, intercept } = linearRegression(xs, ys)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const trendData = [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ]

  return (
    <ResponsiveContainer width="100%" height={200}>
      <ScatterChart margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
        <XAxis
          dataKey="x"
          type="number"
          name={result.seriesA.name}
          tick={{ fontSize: 9, fill: '#8b949e' }}
          tickLine={false}
          axisLine={false}
          label={{ value: result.seriesA.fredId, position: 'insideBottom', offset: -2, fontSize: 9, fill: '#8b949e' }}
          domain={['auto', 'auto']}
        />
        <YAxis
          dataKey="y"
          type="number"
          name={result.seriesB.name}
          tick={{ fontSize: 9, fill: '#8b949e' }}
          tickLine={false}
          axisLine={false}
          width={42}
          label={{ value: result.seriesB.fredId, angle: -90, position: 'insideLeft', fontSize: 9, fill: '#8b949e' }}
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Scatter data={scatterData} fill={result.seriesA.color} fillOpacity={0.7} />
        {/* Trend line */}
        <Scatter
          data={trendData}
          line={{ stroke: '#f85149', strokeWidth: 1.5, strokeDasharray: '4 2' }}
          shape={() => null as any}
          fill="transparent"
        />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
