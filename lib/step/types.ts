import { Endpoint } from "../endpoint/types"

export interface QueryParam {
  id: string
  key: string
  value: string
}

export interface Step {
  id: string
  name: string
  description?: string
  timeout?: number
  endpointId: string
  endpoint: Endpoint
  query: QueryParam[]
  position: { x: number; y: number }
  index?: string
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
}

export interface StepState {
  isLoading: boolean
  error: string | null
}

export type StepAction = {
  type: "UPDATE_STEP"
}
