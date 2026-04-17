import { Paginate } from "../paginate"
import { CreateWorkflowPayload, Workflow } from "./types"

export const getWorkflows = async (): Promise<Paginate<Workflow>> => {
  const response = await fetch("/api/0cc345f76b884fd580c232f270c887da", {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch workflows")
  }

  return response.json()
}

export const getWorkflow = async (id: string): Promise<Workflow> => {
  const response = await fetch(`/api/0cc345f76b884fd580c232f270c887da/${id}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch workflow")
  }

  return response.json()
}

export const postWorkflow = async (
  payload: CreateWorkflowPayload
): Promise<void> => {
  const response = await fetch("/api/0cc345f76b884fd580c232f270c887da", {
    method: "POST",
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error("Failed to create workflow")
  }

  return response.json()
}
