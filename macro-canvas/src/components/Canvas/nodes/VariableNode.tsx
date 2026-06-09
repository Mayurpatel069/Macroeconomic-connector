import { useEffect, useCallback } from 'react'
import { type Node, Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react'
import { Loader2, AlertCircle, TrendingUp, TrendingDown, Minus, X, RefreshCw } from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip as ReTooltip,
} from 'recharts'
import type { VariableNodeData } from '../../../types'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../../../data/fredSeries'
import { fetchSeriesData } from '../../../services/fredApi'
import { MOSPI_DATA } from '../../../data/mospiData'
import { useAppStore } from '../../../store/appStore'

type VariableNodeType = Node<VariableNodeData, 'variableNode'>

export default function VariableNode({ data, id, selected }: NodeProps<VariableNodeType>) {
  const { setNodes } = useReactFlow()
  const apiKey = useAppStore((s) => s.apiKey)
  const setShowApiKeyModal = useAppStore((s) => s.setShowApiKeyModal)
  const dataMonths = useAppStore((s) => s.dataMonths)

  const updateNodeData = useCallback(
    (patch: Partial<VariableNodeData>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...patch } } : n
        )
      )
    },
    [id, setNodes]
  )

  useEffect(() => {
    if (data.source === 'mospi') {
      if (data.seriesData && data.seriesData.length > 0) return
      const staticData = MOSPI_DATA[data.fredId] ?? []
      updateNodeData({ seriesData: staticData, loading: false, error: staticData.length === 0 ? 'No MoSPI data' : undefined })
      return
    }

    if (!apiKey) {
      updateNodeData({ loading: false, error: 'NO_API_KEY' })
      return
    }
    if (data.seriesData && data.seriesData.length > 0) return
    if (data.loading) return

    updateNodeData({ loading: true, error: undefined })

    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - dataMonths)

    fetchSeriesData(data.fredId, { startDate: startDate.toISOString().split('T')[0] })
      .then((pts) => updateNodeData({ seriesData: pts, loading: false }))
      .catch((e: Error) => updateNodeData({ loading: false, error: e.message }))
  }, [apiKey, data.fredId, data.source, data.seriesData, data.loading, dataMonths, updateNodeData])

  const catColor = CATEGORY_COLORS[data.category] ?? '#8e8e93'
  const catLabel = CATEGORY_LABELS[data.category] ?? data.category
  const recent = data.seriesData?.slice(-60) ?? []
  const latest = recent[recent.length - 1]
  const prev = recent[recent.length - 2]
  const change = latest && prev ? latest.value - prev.value : null
  const pctChange = change !== null && prev ? (change / Math.abs(prev.value)) * 100 : null
  const chartData = recent.map((d) => ({ v: d.value }))

  const removeNode = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id))
  }

  return (
    <div
      className={`w-52 rounded-2xl overflow-hidden transition-all duration-200 bg-obs-panel ${
        selected
          ? 'shadow-[0_0_0_1.5px_#0a84ff,0_8px_40px_rgba(10,132,255,0.12)]'
          : 'border border-white/[0.07] shadow-[0_2px_16px_rgba(0,0,0,0.5)] hover:border-white/[0.14]'
      }`}
    >
      {/* Category accent top bar */}
      <div className="h-[2px] w-full" style={{ background: catColor }} />

      {/* Header */}
      <div className="px-3 pt-2.5 pb-2 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full tracking-wide uppercase"
              style={{ background: catColor + '18', color: catColor }}
            >
              {catLabel}
            </span>
          </div>
          <h3 className="text-[11px] font-semibold text-obs-text leading-tight truncate tracking-[-0.01em]">{data.name}</h3>
          <p className="text-[10px] text-obs-subtle font-mono mt-0.5">{data.fredId}</p>
        </div>
        <button
          onClick={removeNode}
          className="p-0.5 rounded-md hover:bg-white/[0.08] text-obs-subtle hover:text-obs-muted transition-colors ml-1 mt-0.5 shrink-0 nodrag"
        >
          <X size={11} />
        </button>
      </div>

      {/* Sparkline */}
      <div className="px-2 pb-1" style={{ height: 48 }}>
        {data.loading && (
          <div className="h-full flex items-center justify-center">
            <Loader2 size={13} className="animate-spin text-obs-subtle" />
          </div>
        )}
        {data.error === 'NO_API_KEY' && (
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="h-full w-full flex items-center justify-center gap-1 text-obs-orange text-[10px] hover:underline nodrag"
          >
            <AlertCircle size={10} /> Add FRED key
          </button>
        )}
        {data.error && data.error !== 'NO_API_KEY' && (
          <button
            onClick={() => updateNodeData({ seriesData: [], loading: false, error: undefined })}
            className="h-full w-full flex flex-col items-center justify-center gap-1 text-obs-red text-[10px] hover:text-obs-orange transition-colors nodrag"
            title={`Error: ${data.error} — click to retry`}
          >
            <div className="flex items-center gap-1">
              <AlertCircle size={10} />
              <span className="truncate max-w-[130px]">
                {data.error.startsWith('FRED API error')
                  ? data.error
                  : data.error === 'INVALID_API_KEY'
                  ? 'Invalid API key'
                  : 'Fetch failed'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-obs-subtle hover:text-obs-muted">
              <RefreshCw size={9} /> retry
            </div>
          </button>
        )}
        {!data.loading && !data.error && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <defs>
                <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={catColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={catColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={catColor}
                strokeWidth={1.25}
                fill={`url(#grad-${id})`}
                dot={false}
                activeDot={false}
              />
              <ReTooltip contentStyle={{ display: 'none' }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
        {!data.loading && !data.error && chartData.length === 0 && apiKey && (
          <div className="h-full flex items-center justify-center text-obs-subtle text-[10px]">
            No data
          </div>
        )}
      </div>

      {/* Latest value */}
      <div className="px-3 pb-2.5 flex items-center justify-between">
        <div>
          {latest ? (
            <span className="text-sm font-semibold text-obs-text tracking-[-0.02em]">
              {latest.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              <span className="text-[10px] text-obs-subtle ml-1 font-normal">{data.unit}</span>
            </span>
          ) : (
            <span className="text-xs text-obs-subtle">—</span>
          )}
        </div>
        {pctChange !== null && (
          <span
            className={`text-[10px] flex items-center gap-0.5 font-medium ${
              pctChange > 0 ? 'text-obs-green' : pctChange < 0 ? 'text-obs-red' : 'text-obs-subtle'
            }`}
          >
            {pctChange > 0 ? (
              <TrendingUp size={9} />
            ) : pctChange < 0 ? (
              <TrendingDown size={9} />
            ) : (
              <Minus size={9} />
            )}
            {Math.abs(pctChange).toFixed(2)}%
          </span>
        )}
      </div>

      {/* Connection handles */}
      <Handle type="target" position={Position.Left} className="!w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3" />
    </div>
  )
}
