"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { useWorkflow } from "@/lib/workflow/context"
import { Workflow } from "@/lib/workflow/types"
import Link from "next/link"

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
            <Button onClick={() => handleUpdateWorkflow(workflow.id)}>
              Update Workflow
            </Button>
            <Button asChild>
              <Link href={`/workflow/${workflow.id}`}>View Workflow</Link>
            </Button>
          </CardHeader>
        </Card>
      ))}
    </>
  )
}
