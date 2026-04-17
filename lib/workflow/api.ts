import { Paginate } from "../paginate"
import {
  CreateConnexionPayload,
  CreateWorkflowPayload,
  MinimalWorkflow,
  UpdateWorkflowPayload,
  UpdateWorkflowStepsPayload,
  Workflow,
  WorkflowConnexion,
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

export const deleteConnexion = async (id: string): Promise<void> => {
  const response = await fetch(
    `/api/connexion/72d5b22ecb8c44bea9bb8f707228d51b/${id}`,
    {
      method: "DELETE",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to delete connexion")
  }

  return response.json()
}

export const postConnexion = async (
  payload: CreateConnexionPayload
): Promise<WorkflowConnexion> => {
  const response = await fetch(
    "/api/connexion/72d5b22ecb8c44bea9bb8f707228d51b",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to create connexion")
  }

  const data = await response.json()

  console.log("********************************************************")
  console.log(data)
  console.log("********************************************************")

  return connectionFromResponse(data, {
    from: payload.from,
    to: payload.to,
  })
}

function connectionFromResponse(
  data: unknown,
  fallback: { from: string; to: string }
): WorkflowConnexion {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid connexion response")
  }
  const o = data as Record<string, unknown>
  const id = extractId(o.id ?? o["@id"])
  if (!id) {
    throw new Error("Connexion response missing id")
  }
  const from =
    extractId(o.from) ??
    extractId((o as { source?: string }).source) ??
    fallback.from
  const to =
    extractId(o.to) ??
    extractId((o as { target?: string }).target) ??
    fallback.to
  return { id, from, to }
}

function extractId(value: unknown): string | undefined {
  if (typeof value === "string" && value) {
    return value.includes("/") ? (value.split("/").pop() ?? value) : value
  }
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>
    if (typeof o["@id"] === "string") return extractId(o["@id"])
    if (o.id !== undefined) return extractId(o.id)
  }
  return undefined
}
