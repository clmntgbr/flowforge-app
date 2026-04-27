import { Paginate } from "@/lib/paginate"
import { Step, UpdateWorkflowStepPayload } from "../step/types"

export interface WorkflowConnexion {
  id: string
  from: string
  to: string
}

export interface Workflow extends MinimalWorkflow {
  description?: string
  steps?: Step[]
  connexions?: WorkflowConnexion[]
  createdAt?: string
  updatedAt?: string
}

export interface MinimalWorkflow {
  id: string
  name: string
  isActive: boolean
  status: string
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
  steps: UpdateWorkflowStepPayload[]
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
