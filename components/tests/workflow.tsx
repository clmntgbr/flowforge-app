"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useWorkflow } from "@/lib/workflow/context"
import { Workflow } from "@/lib/workflow/types"

export default function WorkflowTest() {
  const { workflows, createWorkflow, fetchWorkflow, updateWorkflow } =
    useWorkflow()

  const handleCreateWorkflow = () => {
    createWorkflow({
      name: crypto.randomUUID(),
      description: crypto.randomUUID(),
    })
  }

  const handleUpdateWorkflow = (workflowId: string) => {
    fetchWorkflow(workflowId).then((workflow: Workflow) => {
      updateWorkflow(workflowId, {
        name: crypto.randomUUID(),
        description: workflow.description,
      })
    })
  }

  return (
    <>
      <Button onClick={handleCreateWorkflow}>Create Workflow</Button>
      {workflows.members.map((workflow) => (
        <Card key={workflow.id} className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              id: {workflow.id}
              <br />
              name: {workflow.name}
              <br />
            </CardTitle>
            <CardDescription>
              description: {workflow.description}
            </CardDescription>
            <Button onClick={() => handleUpdateWorkflow(workflow.id)}>
              Update Workflow
            </Button>
          </CardHeader>
        </Card>
      ))}
    </>
  )
}
