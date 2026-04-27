import { Paginate } from "../paginate"
import {
  CreateWorkflowPayload,
  MinimalWorkflow,
  UpdateWorkflowPayload,
  UpdateWorkflowStepsPayload,
  Workflow,
} from "./types"

export const getWorkflows = async (): Promise<Paginate<MinimalWorkflow>> => {
  const response = await fetch(
    "/api/workflow/0cc345f76b884fd580c232f270c887da",
    {
      method: "GET",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch workflows")
  }

  return response.json()
}

export const getWorkflow = async (id: string): Promise<Workflow> => {
  const response = await fetch(
    `/api/workflow/0cc345f76b884fd580c232f270c887da/${id}`,
    {
      method: "GET",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch workflow")
  }

  return response.json()
}

export const postWorkflow = async (
  payload: CreateWorkflowPayload
): Promise<void> => {
  const response = await fetch(
    "/api/workflow/0cc345f76b884fd580c232f270c887da",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to create workflow")
  }

  return response.json()
}

export const putWorkflowSteps = async (
  id: string,
  payload: UpdateWorkflowStepsPayload
): Promise<void> => {
  const response = await fetch(
    `/api/workflow/0cc345f76b884fd580c232f270c887da/${id}/649bbd1e40004ac48d847e9ce8bcb162`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to update workflow steps")
  }

  return response.json()
}

export const putWorkflowActivate = async (id: string): Promise<void> => {
  const response = await fetch(
    `/api/workflow/0cc345f76b884fd580c232f270c887da/${id}/2c3d02e7e5b24f728daa8a64eeb4cd3d`,
    {
      method: "PUT",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to update workflow steps")
  }

  return response.json()
}

export const putWorkflowDeactivate = async (id: string): Promise<void> => {
  const response = await fetch(
    `/api/workflow/0cc345f76b884fd580c232f270c887da/${id}/4efe247189b54936b2012a82e11b3bc7`,
    {
      method: "PUT",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to update workflow steps")
  }

  return response.json()
}

export const putWorkflow = async (
  id: string,
  payload: UpdateWorkflowPayload
): Promise<void> => {
  const response = await fetch(
    `/api/workflow/0cc345f76b884fd580c232f270c887da/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to update workflow")
  }

  return response.json()
}
