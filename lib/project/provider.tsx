"use client"

import { useCallback, useEffect, useReducer } from "react"
import { getProject, getProjects, postProject, putProject } from "./api"
import { ProjectContext } from "./context"
import { ProjectReducer } from "./reducer"
import {
  CreateProjectPayload,
  ProjectState,
  UpdateProjectPayload,
} from "./types"

const initialState: ProjectState = {
  projects: [],
  activeProject: null,
  isLoading: false,
  error: null,
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(ProjectReducer, initialState)

  const fetchProjects = useCallback(async () => {
    try {
      dispatch({ type: "GET_PROJECTS_LOADING", payload: true })
      const projects = await getProjects()
      dispatch({
        type: "GET_PROJECTS",
        payload: projects,
        activeProject: projects.find((project) => project.isActive) ?? null,
      })
    } catch {
      dispatch({
        type: "GET_PROJECTS_ERROR",
        payload: "Failed to fetch projects",
      })
    } finally {
      dispatch({ type: "GET_PROJECTS_LOADING", payload: false })
    }
  }, [])

  const fetchProject = useCallback(async (id: string) => {
    try {
      const project = await getProject(id)
      return project
    } catch {
      throw new Error("Failed to fetch project")
    }
  }, [])

  const createProject = useCallback(
    async (payload: CreateProjectPayload) => {
      try {
        await postProject(payload)
        fetchProjects()
      } catch {
        throw new Error("Failed to create project")
      }
    },
    [fetchProjects]
  )

  const updateProject = useCallback(
    async (id: string, payload: UpdateProjectPayload) => {
      try {
        await putProject(id, payload)
        fetchProjects()
      } catch {
        throw new Error("Failed to update project")
      }
    },
    [fetchProjects]
  )

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return (
    <ProjectContext.Provider
      value={{
        ...state,
        fetchProjects,
        fetchProject,
        createProject,
        updateProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}
