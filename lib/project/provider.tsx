"use client"

import { useCallback, useEffect, useReducer } from "react"
import { getProjects } from "./api"
import { ProjectContext } from "./context"
import { ProjectReducer } from "./reducer"
import { ProjectState } from "./types"

const initialState: ProjectState = {
  projects: [],
  project: null,
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
        project: projects.find((project) => project.isActive) ?? null,
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

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return (
    <ProjectContext.Provider
      value={{
        ...state,
        fetchProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}
