import { WorkflowAction, WorkflowState } from "./types"

export const WorkflowReducer = (
  state: WorkflowState,
  action: WorkflowAction
): WorkflowState => {
  switch (action.type) {
    case "GET_WORKFLOWS":
      return {
        ...state,
        workflows: action.payload,
        isLoading: false,
        error: null,
      }
    case "GET_WORKFLOWS_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    case "GET_WORKFLOWS_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}
