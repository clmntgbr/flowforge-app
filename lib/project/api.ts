import { CreateProjectPayload, Project, UpdateProjectPayload } from "./types"

export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch("/api/eb55745b0b2340f4867daf0aed9d55a1", {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch projects")
  }

  return response.json()
}

export const getProject = async (id: string): Promise<Project> => {
  const response = await fetch(`/api/eb55745b0b2340f4867daf0aed9d55a1/${id}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch project")
  }

  return response.json()
}

export const postProject = async (
  payload: CreateProjectPayload
): Promise<void> => {
  const response = await fetch("/api/eb55745b0b2340f4867daf0aed9d55a1", {
    method: "POST",
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error("Failed to create project")
  }

  return response.json()
}

export const putProject = async (
  id: string,
  payload: UpdateProjectPayload
): Promise<void> => {
  const response = await fetch(`/api/eb55745b0b2340f4867daf0aed9d55a1/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error("Failed to update project")
  }

  return response.json()
}

export const putActivateProject = async (id: string): Promise<Project> => {
  const response = await fetch(
    `/api/eb55745b0b2340f4867daf0aed9d55a1/${id}/activate`,
    {
      method: "PUT",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to activate project")
  }

  return response.json()
}
