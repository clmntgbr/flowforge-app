import { WorkflowRunAction, WorkflowRunState } from "./types"

export const WorkflowRunReducer = (
  state: WorkflowRunState,
  action: WorkflowRunAction
): WorkflowRunState => {
  switch (action.type) {
    case "SET_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}
