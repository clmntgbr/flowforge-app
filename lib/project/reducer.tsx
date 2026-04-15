import { ProjectAction, ProjectState } from "./types"

export const ProjectReducer = (
  state: ProjectState,
  action: ProjectAction
): ProjectState => {
  switch (action.type) {
    case "GET_PROJECTS":
      return {
        ...state,
        projects: action.payload,
        activeProject: action.activeProject,
        isLoading: false,
        error: null,
      }
    case "GET_PROJECTS_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    case "GET_PROJECTS_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}
