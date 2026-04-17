import { Paginate } from "@/lib/paginate"
import { Endpoint } from "../endpoint/types"

export interface WorkflowStep {
  id: string
  name: string
  description?: string
  timeout?: number
  endpointId: string
  endpoint: Endpoint
  position: { x: number; y: number }
  index?: string
}

export interface WorkflowConnexion {
  id: string
  from: string
  to: string
}

export interface Workflow {
  id: string
  name: string
  description?: string
  steps?: WorkflowStep[]
  connexions?: WorkflowConnexion[]
  createdAt?: string
  updatedAt?: string
}

export interface MinimalWorkflow {
  id: string
  name: string
}

export interface CreateWorkflowPayload {
  name: string
  description?: string
}

export interface UpdateWorkflowPayload {
  name?: string
  description?: string
}

export interface UpdateWorkflowStepsPayload {
  steps: WorkflowStep[]
}

export interface CreateConnexionPayload {
  workflowId: string
  from: string
  to: string
}

export interface WorkflowState {
  workflows: Paginate<MinimalWorkflow>
  isLoading: boolean
  error: string | null
}

export type WorkflowAction =
  | { type: "GET_WORKFLOWS"; payload: Paginate<MinimalWorkflow> }
  | { type: "GET_WORKFLOWS_ERROR"; payload: string }
  | { type: "GET_WORKFLOWS_LOADING"; payload: boolean }
