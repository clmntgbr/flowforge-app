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

export interface WorkflowConnection {
  id: string
  from: string
  to: string
}

export interface Workflow {
  id?: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateWorkflowPayload {
  name: string
  description?: string
}

export interface UpdateWorkflowPayload {
  id?: string
  name?: string
  description?: string
}

export interface CreateConnectionPayload {
  workflowId: string
  from: string
  to: string
}

export interface WorkflowState {
  workflows: Paginate<Workflow>
  isLoading: boolean
  error: string | null
}

export type WorkflowAction =
  | { type: "GET_WORKFLOWS"; payload: Paginate<Workflow> }
  | { type: "GET_WORKFLOWS_ERROR"; payload: string }
  | { type: "GET_WORKFLOWS_LOADING"; payload: boolean }
