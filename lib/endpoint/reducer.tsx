import { EndpointAction, EndpointState } from "./types"

export const EndpointReducer = (
  state: EndpointState,
  action: EndpointAction
): EndpointState => {
  switch (action.type) {
    case "GET_ENDPOINTS":
      return {
        ...state,
        endpoints: action.payload,
        isLoading: false,
        error: null,
      }
    case "GET_ENDPOINTS_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    case "GET_ENDPOINTS_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}
