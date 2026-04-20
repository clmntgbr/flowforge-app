import { Endpoint, HeaderParam, QueryParam } from "../endpoint/types"

export interface Step {
  id: string
  name: string
  description?: string
  timeout?: number
  endpointId: string
  endpoint: Endpoint
  query: QueryParam[]
  header: HeaderParam[]
  position: { x: number; y: number }
  index?: string
  retryOnFailure: boolean
  retryCount: number
  retryDelay: number
}

export interface UpdateWorkflowStepPayload {
  id: string
  endpointId: string
  endpoint: Endpoint
  position: { x: number; y: number }
  index?: string
}

export interface UpdateStepPayload {
  name?: string
  description?: string
  timeout?: number
  query?: QueryParam[]
  header?: HeaderParam[]
  retryOnFailure: boolean
  retryCount: number
  retryDelay: number
}

export interface StepState {
  isLoading: boolean
  error: string | null
}

export type StepAction = {
  type: "UPDATE_STEP"
}
