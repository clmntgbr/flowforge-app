"use client"

import { createContext, useContext } from "react"
import { ProjectState } from "./types"

export interface ProjectContextType extends ProjectState {
  fetchProjects: () => Promise<void>
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
