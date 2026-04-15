export interface Project {
  id: string
  isActive: boolean
  name: string
}

export interface ProjectState {
  projects: Project[]
  project: Project | null
  isLoading: boolean
  error: string | null
}

export interface CreateProjectPayload {
  name: string
}

export interface UpdateProjectPayload {
  id: string
  name: string
  description: string
}

export type ProjectAction =
  | {
      type: "GET_PROJECTS"
      payload: Project[]
      project: Project | null
    }
  | { type: "GET_PROJECTS_ERROR"; payload: string }
  | { type: "GET_PROJECTS_LOADING"; payload: boolean }
