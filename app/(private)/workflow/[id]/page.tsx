"use client"

import { useWorkflow } from "@/lib/workflow/context"
import { Workflow } from "@/lib/workflow/types"
import { use, useEffect, useState } from "react"

export default function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { fetchWorkflow } = useWorkflow()
  const { id } = use(params)

  const [workflow, setWorkflow] = useState<Workflow | null>(null)

  useEffect(() => {
    fetchWorkflow(id).then((workflow: Workflow) => {
      setWorkflow(workflow)
    })
  }, [id, fetchWorkflow])

  return (
    <>
      <h1>name: {workflow?.name}</h1>
      <p>description: {workflow?.description}</p>
    </>
  )
}
