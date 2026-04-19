"use client"

import { EndpointsSidebar } from "@/components/endpoints-sidebar"
import { StepDrawer } from "@/components/step-drawer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorkflowCanvas, { WorkflowCanvasRef } from "@/components/workflow-canvas"
import { WorkflowDrawer } from "@/components/workflow-drawer"
import { Step, UpdateWorkflowStepPayload } from "@/lib/step/types"
import { useWorkflow } from "@/lib/workflow/context"
import { Workflow } from "@/lib/workflow/types"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

export default function WorkflowIdPage() {
  const canvasRef = useRef<WorkflowCanvasRef>(null)

  const { id } = useParams()

  const { updateWorkflowSteps, fetchWorkflow } = useWorkflow()
  const [selectedStep, setSelectedStep] = useState<Step | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isWorkflowDrawerOpen, setIsWorkflowDrawerOpen] = useState(false)

  const [workflow, setWorkflow] = useState<Workflow | null>(null)

  useEffect(() => {
    fetchWorkflow(id as string).then((workflow) => {
      setWorkflow(workflow)
    })
  }, [fetchWorkflow, id])

  const handleWorkflowChange = useCallback(
    (updatedWorkflow: Workflow) => {
      fetchWorkflow(updatedWorkflow.id).then((workflow) => {
        setWorkflow(workflow)
      })
    },
    [fetchWorkflow]
  )

  const handleStepSelect = useCallback((step: Step | null) => {
    setSelectedStep(step)
    if (step) {
      setIsDrawerOpen(true)
    }
  }, [])

  const handleSave = useCallback(
    async (workflowPayload?: Workflow) => {
      const workflowData = workflowPayload ?? workflow
      if (!workflowData?.id) return
      await updateWorkflowSteps(workflowData.id, {
        steps:
          workflowData.steps?.map(
            (step): UpdateWorkflowStepPayload => ({
              id: step.id,
              endpointId: step.endpointId,
              endpoint: step.endpoint,
              position: step.position,
              index: step.index ?? "0",
            })
          ) ?? [],
      }).then(() => {
        fetchWorkflow(id as string).then((workflow) => {
          setWorkflow(workflow)
        })
      })
    },
    [workflow, updateWorkflowSteps, fetchWorkflow, id]
  )

  const handleStepUpdate = useCallback(async () => {
    const updatedWorkflow = await fetchWorkflow(id as string)
    setWorkflow((prev) => {
      if (!prev) return updatedWorkflow
      return {
        ...prev,
        steps: updatedWorkflow.steps?.map((newStep) => {
          const oldStep = prev.steps?.find((s) => s.id === newStep.id)
          return {
            ...newStep,
            position: oldStep?.position || newStep.position,
          }
        }),
        connexions: prev.connexions,
      }
    })
  }, [fetchWorkflow, id])

  if (!workflow) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <EndpointsSidebar />
      <Tabs
        defaultValue="overview"
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <header className="flex shrink-0 items-center gap-3 border-b border-border bg-background px-4 py-3">
          <div className="flex min-w-0 flex-1 justify-start">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold">
                {workflow.name}
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                {workflow.description}
              </p>
            </div>
          </div>
          <TabsList className="shrink-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <div className="flex min-w-0 flex-1 justify-end">
            <Button type="button" onClick={() => setIsWorkflowDrawerOpen(true)}>
              Settings
            </Button>
          </div>
        </header>
        <TabsContent
          value="overview"
          className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <WorkflowCanvas
              ref={canvasRef}
              workflow={workflow}
              onWorkflowChange={handleWorkflowChange}
              onStepSelect={handleStepSelect}
              onSave={handleSave}
            />
          </div>
          <StepDrawer
            onUpdate={handleStepUpdate}
            stepId={selectedStep?.id ?? undefined}
            isOpen={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
          />
          <WorkflowDrawer
            workflow={workflow}
            isOpen={isWorkflowDrawerOpen}
            onOpenChange={setIsWorkflowDrawerOpen}
            onUpdate={handleWorkflowChange}
          />
        </TabsContent>
        <TabsContent
          value="analytics"
          className="mt-0 flex min-h-0 flex-1 flex-col overflow-auto p-4 text-sm text-muted-foreground"
        >
          The quick brown fox jumps over the lazy dog — placeholder content for
          this tab.
        </TabsContent>
      </Tabs>
    </div>
  )
}
