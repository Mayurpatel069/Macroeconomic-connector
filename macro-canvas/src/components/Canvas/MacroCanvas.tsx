import { useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react'
import { useAppStore } from '../../store/appStore'
import VariableNode from './nodes/VariableNode'
import NodePalette from './NodePalette'
import type { VariableNodeData, MacroSeries } from '../../types'
import { computeAnalysis, correlationColor } from '../../utils/statistics'

type VNode = Node<VariableNodeData, 'variableNode'>

const nodeTypes = { variableNode: VariableNode }

const NODES_KEY = 'mc_canvas_nodes'
const EDGES_KEY = 'mc_canvas_edges'

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key)
    return s ? (JSON.parse(s) as T) : fallback
  } catch {
    return fallback
  }
}

const _initNodes: VNode[] = loadFromStorage(NODES_KEY, [])
const _initEdges: Edge[] = loadFromStorage(EDGES_KEY, [])

function toMacroSeries(data: VariableNodeData): MacroSeries {
  return {
    id: data.id,
    name: data.name,
    fredId: data.fredId,
    category: data.category,
    unit: data.unit,
    frequency: data.frequency,
    description: data.description,
    color: data.color,
  }
}

export default function MacroCanvas() {
  const { setActiveAnalysis, cacheAnalysis, analysisCache, clearAnalysisCache } = useAppStore()

  const [nodes, setNodes, onNodesChange] = useNodesState<VNode>(_initNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(_initEdges)

  // Persist canvas state to localStorage on every change
  useEffect(() => {
    localStorage.setItem(NODES_KEY, JSON.stringify(nodes))
  }, [nodes])

  useEffect(() => {
    localStorage.setItem(EDGES_KEY, JSON.stringify(edges))
  }, [edges])

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source!,
        target: connection.target!,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        animated: true,
        style: { stroke: '#0a84ff', strokeWidth: 1.5 },
      }

      setEdges((eds) => addEdge(newEdge, eds))

      const nodeA = nodes.find((n) => n.id === connection.source)
      const nodeB = nodes.find((n) => n.id === connection.target)

      if (
        nodeA && nodeB &&
        nodeA.data.seriesData?.length &&
        nodeB.data.seriesData?.length
      ) {
        const result = computeAnalysis(
          newEdge.id,
          nodeA.id,
          nodeB.id,
          toMacroSeries(nodeA.data),
          toMacroSeries(nodeB.data),
          nodeA.data.seriesData,
          nodeB.data.seriesData
        )
        cacheAnalysis(result)
        setActiveAnalysis(result)

        // Color edge by correlation strength and add label
        const corrColor = correlationColor(result.correlation)
        const corrSign = result.correlation >= 0 ? '+' : ''
        setEdges((eds) =>
          eds.map((e) =>
            e.id === newEdge.id
              ? {
                  ...e,
                  animated: Math.abs(result.correlation) >= 0.5,
                  style: { stroke: corrColor, strokeWidth: 1.5 },
                  label: `r = ${corrSign}${result.correlation.toFixed(2)}`,
                  labelStyle: {
                    fontSize: 9,
                    fill: corrColor,
                    fontWeight: 700,
                    fontFamily: 'monospace',
                  },
                  labelBgStyle: { fill: '#1c1c1e', fillOpacity: 0.95 },
                  labelBgPadding: [4, 2] as [number, number],
                  labelBgBorderRadius: 4,
                }
              : e
          )
        )
      }
    },
    [nodes, setEdges, cacheAnalysis, setActiveAnalysis]
  )

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const cached = analysisCache[edge.id]
      if (cached) {
        setActiveAnalysis(cached)
        return
      }
      const nodeA = nodes.find((n) => n.id === edge.source)
      const nodeB = nodes.find((n) => n.id === edge.target)
      if (
        nodeA && nodeB &&
        nodeA.data.seriesData?.length &&
        nodeB.data.seriesData?.length
      ) {
        const result = computeAnalysis(
          edge.id,
          nodeA.id,
          nodeB.id,
          toMacroSeries(nodeA.data),
          toMacroSeries(nodeB.data),
          nodeA.data.seriesData,
          nodeB.data.seriesData
        )
        cacheAnalysis(result)
        setActiveAnalysis(result)
      }
    },
    [nodes, analysisCache, setActiveAnalysis, cacheAnalysis]
  )

  const handleClearCanvas = useCallback(() => {
    setNodes([])
    setEdges([])
    setActiveAnalysis(null)
    clearAnalysisCache()
    localStorage.removeItem(NODES_KEY)
    localStorage.removeItem(EDGES_KEY)
  }, [setNodes, setEdges, setActiveAnalysis, clearAnalysisCache])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.15}
        maxZoom={3}
        deleteKeyCode={['Backspace', 'Delete']}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1}
          color="#2c2c2e"
        />
        <Controls showInteractive={false} position="bottom-right" />
        <MiniMap
          nodeColor={(n) => {
            const d = n.data as VariableNodeData
            return d?.color ?? '#0a84ff'
          }}
          maskColor="rgba(0,0,0,0.7)"
          position="top-right"
          style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, background: 'rgba(28,28,30,0.9)' }}
        />

        {/* NodePalette rendered INSIDE ReactFlow so useReactFlow() context is available */}
        <NodePalette onClearCanvas={handleClearCanvas} nodeCount={nodes.length} />
      </ReactFlow>

      {/* Empty state overlay */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="text-center select-none">
            <div className="text-4xl mb-4 opacity-10">◈</div>
            <p className="text-sm text-obs-subtle font-light opacity-60">
              Use the palette to add macroeconomic variables.
            </p>
            <p className="text-xs text-obs-subtle mt-1 opacity-40">
              Connect two nodes to reveal statistical analysis.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
