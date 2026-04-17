import type { Endpoint } from "@/lib/endpoint/types"
import { Step } from "@/lib/step/types"
import { useWorkflow } from "@/lib/workflow/context"
import type { Workflow, WorkflowConnexion } from "@/lib/workflow/types"
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Connection,
  ConnectionLineType,
  ConnectionMode,
  Controls,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type EdgeChange,
  type EdgeProps,
  type Node,
  type NodeChange,
  type ReactFlowInstance,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { v4 as uuidv4 } from "uuid"
import DeleteEdgeButton from "./delete-edge-button"
import StepNode from "./step-node"

const nodeTypes = { stepNode: StepNode }

export type { Step, Workflow }

export type WorkflowCanvasRef = object

interface WorkflowCanvasProps {
  workflow?: Workflow
  onWorkflowChange?: (workflow: Workflow) => void
  onStepSelect?: (step: Step | null) => void
  onSave?: (workflow: Workflow) => void | Promise<void>
}

function workflowToReactFlow(workflow?: Workflow): {
  nodes: Node[]
  edges: Edge[]
} {
  if (!workflow || !workflow.steps || !workflow.connexions) {
    return { nodes: [], edges: [] }
  }

  const nodes: Node[] = workflow.steps.map((workflowStep) => ({
    id: workflowStep.id,
    type: "stepNode",
    position: workflowStep.position,
    data: {
      step: {
        id: workflowStep.id,
        name: workflowStep.name,
        description: workflowStep.description,
        timeout: workflowStep.timeout,
        endpointId: workflowStep.endpointId,
        endpoint: workflowStep.endpoint,
        index: workflowStep.index,
      },
      index: workflowStep.index,
      onEditClick: undefined,
    },
  }))

  const edges: Edge[] = workflow.connexions.map((connexion) => ({
    id: connexion.id,
    source: connexion.from,
    target: connexion.to,
    type: "default",
    markerEnd: { type: MarkerType.ArrowClosed },
  }))

  return { nodes, edges }
}

function calculateStepIndexes(
  nodes: Node[],
  edges: Edge[]
): Map<string, string> {
  const indexMap = new Map<string, string>()
  const nodeById = new Map(nodes.map((node) => [node.id, node]))
  const incomingEdges = new Map<string, Edge[]>()
  const outgoingEdges = new Map<string, Edge[]>()
  const connectedNodeIds = new Set<string>()
  const proposals = new Map<string, string[]>()
  const usedIndexes = new Set<string>()

  for (const edge of edges) {
    if (!incomingEdges.has(edge.target)) incomingEdges.set(edge.target, [])
    incomingEdges.get(edge.target)!.push(edge)

    if (!outgoingEdges.has(edge.source)) outgoingEdges.set(edge.source, [])
    outgoingEdges.get(edge.source)!.push(edge)

    connectedNodeIds.add(edge.source)
    connectedNodeIds.add(edge.target)
  }

  const sortByLayout = (aId: string, bId: string) => {
    const a = nodeById.get(aId)
    const b = nodeById.get(bId)
    if (!a || !b) return aId.localeCompare(bId)
    if (a.position.y !== b.position.y) return a.position.y - b.position.y
    if (a.position.x !== b.position.x) return a.position.x - b.position.x
    return a.id.localeCompare(b.id)
  }

  for (const [sourceId, sourceOutgoingEdges] of outgoingEdges.entries()) {
    sourceOutgoingEdges.sort((a, b) => sortByLayout(a.target, b.target))
    outgoingEdges.set(sourceId, sourceOutgoingEdges)
  }

  const getMajor = (index: string): number => {
    const value = Number.parseInt(index.split(".")[0] || "0", 10)
    return Number.isNaN(value) ? 0 : value
  }

  const ensureUniqueIndex = (baseIndex: string): string => {
    if (!usedIndexes.has(baseIndex)) {
      usedIndexes.add(baseIndex)
      return baseIndex
    }

    if (/^\d+$/.test(baseIndex)) {
      let numeric = Number.parseInt(baseIndex, 10)
      while (usedIndexes.has(String(numeric))) {
        numeric += 1
      }
      const next = String(numeric)
      usedIndexes.add(next)
      return next
    }

    let suffix = 1
    let candidate = `${baseIndex}.${suffix}`
    while (usedIndexes.has(candidate)) {
      suffix += 1
      candidate = `${baseIndex}.${suffix}`
    }
    usedIndexes.add(candidate)
    return candidate
  }

  const incomingCount = new Map<string, number>()
  for (const node of nodes) {
    incomingCount.set(node.id, incomingEdges.get(node.id)?.length ?? 0)
  }

  const rootNodeIds = nodes
    .filter(
      (node) =>
        connectedNodeIds.has(node.id) &&
        (incomingEdges.get(node.id)?.length ?? 0) === 0
    )
    .map((node) => node.id)
    .sort(sortByLayout)

  const queue: string[] = [...rootNodeIds]
  const assigned = new Map<string, string>()

  rootNodeIds.forEach((nodeId, index) => {
    assigned.set(nodeId, ensureUniqueIndex(String(index + 1)))
  })

  while (queue.length > 0) {
    const nodeId = queue.shift()!
    const current = assigned.get(nodeId)
    if (!current) continue

    indexMap.set(nodeId, current)

    const nodeOutgoingEdges = outgoingEdges.get(nodeId) ?? []

    nodeOutgoingEdges.forEach((edge, branchIndex) => {
      const targetId = edge.target
      const parentIsSimple = /^\d+$/.test(current)
      let candidate = ""

      if (parentIsSimple) {
        const baseLevel = Number.parseInt(current, 10) + 1
        candidate =
          nodeOutgoingEdges.length > 1
            ? `${baseLevel}.${branchIndex + 1}`
            : String(baseLevel)
      } else {
        // Keep branch prefix depth for branch descendants.
        candidate = `${current}.${branchIndex + 1}`
      }

      if (!proposals.has(targetId)) {
        proposals.set(targetId, [])
      }
      proposals.get(targetId)!.push(candidate)

      const nextIncomingCount = (incomingCount.get(targetId) ?? 0) - 1
      incomingCount.set(targetId, nextIncomingCount)
      if (nextIncomingCount === 0) {
        if (!assigned.has(targetId)) {
          const targetProposals = proposals.get(targetId) ?? []

          if (targetProposals.length === 1) {
            assigned.set(targetId, ensureUniqueIndex(targetProposals[0]))
          } else if (targetProposals.length > 1) {
            // Convergence returns to a simple integer at next level.
            const convergenceLevel =
              Math.max(...targetProposals.map((value) => getMajor(value))) + 1
            assigned.set(targetId, ensureUniqueIndex(String(convergenceLevel)))
          }
        }
        queue.push(targetId)
      }
    })
  }

  // Safety fallback (e.g. malformed/cyclic graph): connected nodes must still get a unique index.
  const missingConnectedNodeIds = nodes
    .map((node) => node.id)
    .filter((nodeId) => connectedNodeIds.has(nodeId) && !indexMap.has(nodeId))
    .sort(sortByLayout)

  if (missingConnectedNodeIds.length > 0) {
    const maxMajorInUse = [...usedIndexes].reduce(
      (max, value) => Math.max(max, getMajor(value)),
      0
    )
    let nextMajor = maxMajorInUse
    for (const nodeId of missingConnectedNodeIds) {
      nextMajor += 1
      const fallback = ensureUniqueIndex(String(nextMajor))
      indexMap.set(nodeId, fallback)
    }
  }

  return indexMap
}

function reactFlowToWorkflow(
  nodes: Node[],
  edges: Edge[],
  currentWorkflow?: Workflow,
  options?: { recalculateIndexes?: boolean }
): Workflow {
  const shouldRecalculateIndexes = options?.recalculateIndexes ?? true
  const indexMap = shouldRecalculateIndexes
    ? calculateStepIndexes(nodes, edges)
    : new Map(
        nodes.map((node) => {
          const step = node.data.step as Step | undefined
          const existingIndex =
            step?.index || (node.data.index as string | undefined) || "0"
          return [node.id, existingIndex]
        })
      )

  const steps: Step[] = nodes.map((node) => {
    const step = node.data.step as Step
    return {
      id: node.id,
      name: step.name,
      description: step.description,
      timeout: step.timeout,
      endpointId: step.endpoint?.id,
      endpoint: step.endpoint,
      position: node.position,
      index: indexMap.get(node.id) || "0",
    }
  })

  const connexions: WorkflowConnexion[] = edges.map((edge) => ({
    id: edge.id,
    from: edge.source,
    to: edge.target,
  }))

  return {
    id: currentWorkflow?.id ?? uuidv4(),
    name: currentWorkflow?.name || "Untitled Workflow",
    description: currentWorkflow?.description,
    steps: steps ?? [],
    connexions: connexions ?? [],
  }
}

const WorkflowCanvas = forwardRef<WorkflowCanvasRef, WorkflowCanvasProps>(
  function WorkflowCanvas(
    { workflow, onWorkflowChange, onStepSelect, onSave },
    ref
  ) {
    const { addConnexion, removeConnexion } = useWorkflow()
    const initialState = workflowToReactFlow(workflow)
    const [nodes, setNodes, onNodesChange] = useNodesState(initialState.nodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialState.edges)
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)
    const onWorkflowChangeRef = useRef(onWorkflowChange)
    const workflowRef = useRef(workflow)
    const onSaveRef = useRef(onSave)
    const prevStepsRef = useRef<string>("")
    const [shouldRecalculateIndexes, setShouldRecalculateIndexes] =
      useState(false)

    useEffect(() => {
      onWorkflowChangeRef.current = onWorkflowChange
      workflowRef.current = workflow
      onSaveRef.current = onSave
    })

    useEffect(() => {
      if (!workflow?.steps) return

      const stepsDataJson = JSON.stringify(
        workflow.steps.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          timeout: s.timeout,
          endpoint: s.endpoint,
        }))
      )

      if (stepsDataJson === prevStepsRef.current) return
      prevStepsRef.current = stepsDataJson

      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          const workflowStep = workflow.steps?.find((s) => s.id === node.id)
          if (workflowStep && node.data.step) {
            return {
              ...node,
              data: {
                ...node.data,
                step: {
                  ...(node.data.step as Step),
                  name: workflowStep.name,
                  description: workflowStep.description,
                  timeout: workflowStep.timeout,
                  endpoint: workflowStep.endpoint,
                  endpointId: workflowStep.endpointId,
                },
              },
            }
          }
          return node
        })
      )
    }, [workflow?.steps, setNodes])

    useEffect(() => {
      if (onWorkflowChangeRef.current) {
        const updatedWorkflow = reactFlowToWorkflow(
          nodes,
          edges,
          workflowRef.current,
          { recalculateIndexes: shouldRecalculateIndexes }
        )

        onWorkflowChangeRef.current(updatedWorkflow)
      }
    }, [nodes, edges, shouldRecalculateIndexes])

    useEffect(() => {
      if (!shouldRecalculateIndexes) return
      const indexMap = calculateStepIndexes(nodes, edges)
      setNodes((currentNodes) => {
        let hasAnyChange = false
        const nextNodes = currentNodes.map((node) => {
          const nextIndex = indexMap.get(node.id) || "0"
          const currentStep = node.data.step as Step | undefined
          const currentIndex = currentStep?.index || "0"
          const currentDataIndex =
            (node.data.index as string | undefined) || "0"

          if (currentIndex === nextIndex && currentDataIndex === nextIndex) {
            return node
          }

          hasAnyChange = true
          return {
            ...node,
            data: {
              ...node.data,
              step: {
                ...(currentStep || {}),
                index: nextIndex,
              },
              index: nextIndex,
            },
          }
        })

        return hasAnyChange ? nextNodes : currentNodes
      })
    }, [nodes, edges, setNodes, shouldRecalculateIndexes])

    const handleEditClick = useCallback(
      (node: Node) => {
        if (onStepSelect) {
          const step = node.data.step as Step
          const indexMap = shouldRecalculateIndexes
            ? calculateStepIndexes(nodes, edges)
            : new Map(
                nodes.map((n) => [
                  n.id,
                  ((n.data.step as Step | undefined)?.index ||
                    (n.data.index as string | undefined) ||
                    "") as string,
                ])
              )
          const workflowStep: Step = {
            id: node.id,
            name: step.name,
            description: step.description,
            timeout: step.timeout,
            endpointId: step.endpoint?.id,
            endpoint: step.endpoint,
            position: node.position,
            index: indexMap.get(node.id) || "0",
          }
          onStepSelect(workflowStep)
        }
      },
      [onStepSelect, nodes, edges, shouldRecalculateIndexes]
    )

    const indexMap = useMemo(
      () =>
        shouldRecalculateIndexes
          ? calculateStepIndexes(nodes, edges)
          : new Map(
              nodes.map((node) => {
                const step = node.data.step as Step | undefined
                const existingIndex =
                  step?.index || (node.data.index as string | undefined) || "0"
                return [node.id, existingIndex]
              })
            ),
      [nodes, edges, shouldRecalculateIndexes]
    )

    const nodesWithIndexes = nodes.map((node) => {
      const nodeIndex = indexMap.get(node.id) || "0"
      return {
        ...node,
        data: {
          ...node.data,
          step: {
            ...((node.data.step as Step) || {}),
            index: nodeIndex,
          },
          index: nodeIndex,
          onEditClick: () => handleEditClick(node),
        },
      }
    })

    useImperativeHandle(ref, () => ({}))

    const saveGraphSnapshot = useCallback(
      (nextNodes: Node[], nextEdges: Edge[]) => {
        const wf = reactFlowToWorkflow(
          nextNodes,
          nextEdges,
          workflowRef.current
        )
        const save = onSaveRef.current
        if (!save || !wf.id) return
        void Promise.resolve(save(wf)).catch((err) =>
          console.error("[workflow canvas] failed to save workflow", err)
        )
      },
      []
    )

    const edgeTypes = useMemo(
      () => ({
        default: (props: EdgeProps) => (
          <DeleteEdgeButton {...props} onPersistGraph={saveGraphSnapshot} />
        ),
      }),
      [saveGraphSnapshot]
    )

    const isValidConnexion = useCallback((connexion: Connection | Edge) => {
      const source = "source" in connexion ? connexion.source : null
      const target = "target" in connexion ? connexion.target : null
      return source !== target
    }, [])

    const handleEdgesChange = useCallback(
      (changes: EdgeChange[]) => {
        const nextEdges = applyEdgeChanges(changes, edges)
        saveGraphSnapshot(nodes, nextEdges)

        const hasStructuralChange = changes.some(
          (change) => change.type === "remove" || change.type === "add"
        )
        if (hasStructuralChange) {
          setShouldRecalculateIndexes(true)
        }
        onEdgesChange(changes)
        for (const change of changes) {
          if (change.type === "remove") {
            void removeConnexion(change.id).catch((err) =>
              console.error("[workflow canvas] failed to delete connexion", err)
            )
          }
        }
      },
      [onEdgesChange, removeConnexion, edges, nodes, saveGraphSnapshot]
    )

    const onConnect = useCallback(
      (params: Connection) => {
        const wfId = workflowRef.current?.id
        if (!wfId) return
        setShouldRecalculateIndexes(true)
        void addConnexion({
          workflowId: wfId,
          from: params.source!,
          to: params.target!,
        })
          .then((connexion) => {
            setEdges((eds) => {
              const updatedEdges = addEdge(
                {
                  ...params,
                  id: connexion.id,
                  source: params.source!,
                  target: params.target!,
                  type: "default",
                  markerEnd: { type: MarkerType.ArrowClosed },
                },
                eds
              )
              saveGraphSnapshot(nodes, updatedEdges)
              return updatedEdges
            })
          })
          .catch((err) =>
            console.error("[workflow canvas] failed to create connexion", err)
          )
      },
      [addConnexion, setEdges, nodes, saveGraphSnapshot]
    )

    const onDragOver = useCallback((event: React.DragEvent) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = "move"
    }, [])

    const onDrop = useCallback(
      (event: React.DragEvent) => {
        event.preventDefault()
        const raw = event.dataTransfer.getData("application/workflow-endpoint")
        if (!raw || !rfInstance) return

        const endpoint: Endpoint = JSON.parse(raw)
        const position = rfInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })

        const step: Step = {
          id: endpoint.id,
          name: endpoint.name,
          timeout: endpoint.timeout,
          description: `${endpoint.path}`,
          endpoint,
          endpointId: endpoint.id,
          position,
        }

        const newNode: Node = {
          id: uuidv4(),
          type: "stepNode",
          position,
          data: {
            step,
          },
        }

        setNodes((nds) => {
          setShouldRecalculateIndexes(true)
          const updated = [...nds, newNode]
          saveGraphSnapshot(updated, edges)
          return updated
        })
      },
      [rfInstance, setNodes, edges, saveGraphSnapshot]
    )

    const handlePaneClick = useCallback(() => {
      if (onStepSelect) {
        onStepSelect(null)
      }
    }, [onStepSelect])

    const handleNodesChange = useCallback(
      (changes: NodeChange[]) => {
        let shouldSave = false
        for (const change of changes) {
          if (change.type === "position" && change.dragging === false) {
            shouldSave = true
            setShouldRecalculateIndexes(true)
          } else if (change.type === "remove") {
            shouldSave = true
            setShouldRecalculateIndexes(true)
          }
        }
        if (shouldSave) {
          const nextNodes = applyNodeChanges(changes, nodes)
          saveGraphSnapshot(nextNodes, edges)
        }
        onNodesChange(changes)
      },
      [onNodesChange, nodes, edges, saveGraphSnapshot]
    )

    return (
      <div ref={reactFlowWrapper} className="h-full flex-1">
        <ReactFlow
          nodes={nodesWithIndexes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          isValidConnection={isValidConnexion}
          onInit={setRfInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ maxZoom: 0.9, padding: 0.2 }}
          snapToGrid
          snapGrid={[5, 5]}
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
          elementsSelectable={true}
          nodesConnectable={true}
          nodesDraggable={true}
          edgesFocusable={true}
          edgesReconnectable={false}
          defaultEdgeOptions={{
            type: "default",
            markerEnd: { type: MarkerType.ArrowClosed },
          }}
          connectionLineType={ConnectionLineType.SmoothStep}
          proOptions={{ hideAttribution: true }}
          connectionMode={ConnectionMode.Loose}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="hsl(var(--canvas-dot))"
          />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    )
  }
)

export default WorkflowCanvas
