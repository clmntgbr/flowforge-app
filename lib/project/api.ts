import { Project } from "./types"

export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch("/api/eb55745b0b2340f4867daf0aed9d55a1", {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch projects")
  }

  return response.json()
}
