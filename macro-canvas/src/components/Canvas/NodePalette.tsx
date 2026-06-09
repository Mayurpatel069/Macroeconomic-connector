import { useState } from 'react'
import { Plus, Search, ChevronDown, ChevronRight, Trash2, Code2 } from 'lucide-react'
import { useReactFlow } from '@xyflow/react'
import { MACRO_SERIES, CATEGORY_COLORS, CATEGORY_LABELS } from '../../data/fredSeries'
import { INDIA_SERIES } from '../../data/mospiSeries'
import type { MacroSeries, SeriesCategory, VariableNodeData } from '../../types'
import { useAppStore } from '../../store/appStore'

const CATEGORIES: SeriesCategory[] = ['monetary', 'prices', 'labor', 'output', 'market', 'trade', 'fiscal']

interface Props {
  onClearCanvas: () => void
  nodeCount: number
}

export default function NodePalette({ onClearCanvas, nodeCount }: Props) {
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [customFredId, setCustomFredId] = useState('')

  const { screenToFlowPosition, addNodes, getNodes } = useReactFlow()
  const paletteOpen = useAppStore((s) => s.paletteOpen)
  const togglePalette = useAppStore((s) => s.togglePalette)

  const usedFredIds = new Set(
    getNodes().map((n) => (n.data as VariableNodeData).fredId)
  )

  const addToCanvas = (series: MacroSeries) => {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const pos = screenToFlowPosition({
      x: cx + (Math.random() - 0.5) * 320,
      y: cy + (Math.random() - 0.5) * 220,
    })
    addNodes([
      {
        id: `${series.id}-${Date.now()}`,
        type: 'variableNode',
        position: pos,
        data: { ...series, seriesData: [], loading: false } as VariableNodeData,
      },
    ])
  }

  const handleAddCustom = () => {
    const id = customFredId.trim().toUpperCase()
    if (!id) return
    const series: MacroSeries = {
      id: `custom-${id.toLowerCase()}-${Date.now()}`,
      name: id,
      fredId: id,
      category: 'output',
      unit: '',
      frequency: 'Unknown',
      description: `Custom FRED series: ${id}`,
      color: '#bf5af2',
    }
    addToCanvas(series)
    setCustomFredId('')
  }

  if (!paletteOpen) {
    return (
      <button
        onClick={togglePalette}
        className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.08] glass text-obs-text text-xs hover:border-obs-accent/30 transition-all duration-200 shadow-lg nodrag nopan nowheel"
      >
        <Plus size={13} strokeWidth={1.75} /> Add Variable
      </button>
    )
  }

  const filtered = MACRO_SERIES.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.fredId.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  )

  const byCategory = CATEGORIES.reduce<Record<string, MacroSeries[]>>((acc, cat) => {
    acc[cat] = filtered.filter((s) => s.category === cat)
    return acc
  }, {})

  return (
    <div className="absolute bottom-4 left-4 z-10 w-60 rounded-2xl border border-white/[0.08] glass shadow-2xl flex flex-col max-h-[70vh] overflow-hidden nodrag nopan nowheel">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
        <Plus size={12} className="text-obs-accent shrink-0" strokeWidth={2} />
        <span className="text-xs font-semibold text-obs-text tracking-[-0.01em]">Add Variable</span>
        {nodeCount > 0 && (
          <span className="text-[10px] text-obs-muted bg-white/[0.06] px-1.5 py-0.5 rounded-full">
            {nodeCount}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          {nodeCount > 0 && (
            <button
              onClick={onClearCanvas}
              className="p-0.5 rounded-md hover:bg-obs-red/[0.12] text-obs-subtle hover:text-obs-red transition-colors"
              title="Clear all nodes"
            >
              <Trash2 size={11} />
            </button>
          )}
          <button
            onClick={togglePalette}
            className="p-0.5 rounded-md hover:bg-white/[0.06] text-obs-subtle hover:text-obs-text transition-colors"
            title="Collapse palette"
          >
            <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-2 py-1.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5 bg-white/[0.04] rounded-lg px-2 py-1">
          <Search size={10} className="text-obs-subtle shrink-0" />
          <input
            type="text"
            placeholder="Search series..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-xs text-obs-text placeholder-obs-subtle outline-none"
          />
        </div>
      </div>

      {/* Category list */}
      <div className="overflow-y-auto flex-1">
        {CATEGORIES.map((cat) => {
          const items = byCategory[cat]
          if (!items || items.length === 0) return null
          const isCollapsed = collapsed[cat]
          const color = CATEGORY_COLORS[cat]

          return (
            <div key={cat}>
              <button
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-white/[0.04] transition-colors"
                onClick={() => setCollapsed((s) => ({ ...s, [cat]: !s[cat] }))}
              >
                {isCollapsed
                  ? <ChevronRight size={9} className="text-obs-subtle" />
                  : <ChevronDown size={9} className="text-obs-subtle" />}
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color }}>
                  {CATEGORY_LABELS[cat]}
                </span>
                <span className="ml-auto text-[10px] text-obs-subtle">{items.length}</span>
              </button>

              {!isCollapsed && (
                <div className="pb-1">
                  {items.map((series) => {
                    const alreadyOnCanvas = usedFredIds.has(series.fredId)
                    return (
                      <button
                        key={series.id}
                        onClick={() => !alreadyOnCanvas && addToCanvas(series)}
                        disabled={alreadyOnCanvas}
                        title={series.description}
                        className={`w-full text-left px-4 py-1.5 flex items-center gap-2 transition-colors ${
                          alreadyOnCanvas
                            ? 'opacity-30 cursor-not-allowed'
                            : 'hover:bg-white/[0.04] cursor-pointer'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                        <span className="text-[11px] text-obs-text truncate font-light">{series.name}</span>
                        <span className="ml-auto text-[10px] text-obs-subtle font-mono shrink-0">
                          {series.fredId}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* India (MoSPI) section */}
        {(() => {
          const indiaItems = INDIA_SERIES.filter(
            (s) =>
              s.name.toLowerCase().includes(search.toLowerCase()) ||
              s.fredId.toLowerCase().includes(search.toLowerCase()) ||
              'india'.includes(search.toLowerCase()) ||
              'mospi'.includes(search.toLowerCase())
          )
          if (indiaItems.length === 0) return null
          const isCollapsed = collapsed['india']
          const indiaColor = '#ffd60a'
          return (
            <div>
              <button
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-white/[0.04] transition-colors"
                onClick={() => setCollapsed((s) => ({ ...s, india: !s['india'] }))}
              >
                {isCollapsed
                  ? <ChevronRight size={9} className="text-obs-subtle" />
                  : <ChevronDown size={9} className="text-obs-subtle" />}
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: indiaColor }}>
                  India (MoSPI)
                </span>
                <span className="ml-auto text-[10px] text-obs-subtle">{indiaItems.length}</span>
              </button>
              {!isCollapsed && (
                <div className="pb-1">
                  {indiaItems.map((series) => {
                    const alreadyOnCanvas = usedFredIds.has(series.fredId)
                    return (
                      <button
                        key={series.id}
                        onClick={() => !alreadyOnCanvas && addToCanvas(series)}
                        disabled={alreadyOnCanvas}
                        title={series.description}
                        className={`w-full text-left px-4 py-1.5 flex items-center gap-2 transition-colors ${
                          alreadyOnCanvas
                            ? 'opacity-30 cursor-not-allowed'
                            : 'hover:bg-white/[0.04] cursor-pointer'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: series.color }} />
                        <span className="text-[11px] text-obs-text truncate font-light">{series.name}</span>
                        <span className="ml-auto text-[10px] font-mono shrink-0" style={{ color: indiaColor }}>
                          {series.frequency}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })()}
      </div>

      {/* Custom FRED series input */}
      <div className="border-t border-white/[0.06] p-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 flex-1 bg-white/[0.04] rounded-lg px-2 py-1 border border-white/[0.06] focus-within:border-obs-accent/40 transition-colors">
            <Code2 size={10} className="text-obs-subtle shrink-0" />
            <input
              type="text"
              placeholder="Custom FRED ID…"
              value={customFredId}
              onChange={(e) => setCustomFredId(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              className="flex-1 bg-transparent text-xs text-obs-text placeholder-obs-subtle outline-none font-mono"
            />
          </div>
          <button
            onClick={handleAddCustom}
            disabled={!customFredId.trim()}
            className="p-1.5 rounded-lg bg-obs-accent/[0.12] text-obs-accent hover:bg-obs-accent/[0.2] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            title="Add custom series"
          >
            <Plus size={11} strokeWidth={2} />
          </button>
        </div>
        <p className="text-[9px] text-obs-subtle mt-1.5 px-0.5">
          Any valid FRED series ID (e.g. VIXCLS, T10Y3M)
        </p>
      </div>
    </div>
  )
}
