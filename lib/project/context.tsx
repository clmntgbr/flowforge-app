"use client"

import { createContext, useContext } from "react"
import {
  CreateProjectPayload,
  Project,
  ProjectState,
  UpdateProjectPayload,
} from "./types"

export interface ProjectContextType extends ProjectState {
  fetchProjects: () => Promise<void>
  fetchProject: (id: string) => Promise<Project>
  createProject: (payload: CreateProjectPayload) => Promise<void>
  updateProject: (id: string, payload: UpdateProjectPayload) => Promise<void>
}

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
)

export const useProject = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error("useProject must be used within ProjectProvider")
  }
  return context
}
