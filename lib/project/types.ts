export interface Project {
  id: string
  isActive: boolean
  name: string
  description?: string
}

export interface ProjectState {
  projects: Project[]
  activeProject: Project | null
  isLoading: boolean
  error: string | null
}

export interface CreateProjectPayload {
  name: string
}

export interface UpdateProjectPayload {
  name: string
  description?: string
}

export type ProjectAction =
  | {
      type: "GET_PROJECTS"
      payload: Project[]
      activeProject: Project | null
    }
  | { type: "GET_PROJECTS_ERROR"; payload: string }
  | { type: "GET_PROJECTS_LOADING"; payload: boolean }
