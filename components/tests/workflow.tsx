"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useWorkflow } from "@/lib/workflow/context"

export default function WorkflowTest() {
  const { workflows, createWorkflow, fetchWorkflow } = useWorkflow()

  const handleCreateWorkflow = () => {
    createWorkflow({
      name: crypto.randomUUID(),
      description: crypto.randomUUID(),
    })
  }

  return (
    <>
      <Button onClick={handleCreateWorkflow}>Create Workflow</Button>
      {workflows.members.map((workflow) => (
        <Card key={workflow.id} className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              title: {workflow.name}
            </CardTitle>
            <CardDescription>
              description: {workflow.description}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </>
  )
}
