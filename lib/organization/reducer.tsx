import { OrganizationAction, OrganizationState } from "./types"

export const OrganizationReducer = (
  state: OrganizationState,
  action: OrganizationAction
): OrganizationState => {
  switch (action.type) {
    case "GET_PROJECTS":
      return {
        ...state,
        organizations: action.payload,
        activeOrganization: action.activeOrganization,
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
