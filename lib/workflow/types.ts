import { Paginate } from "@/lib/paginate"
import { Step } from "../step/types"

export interface WorkflowConnexion {
  id: string
  from: string
  to: string
}

export interface Workflow {
  id: string
  name: string
  description?: string
  steps?: Step[]
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
  steps: Step[]
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
