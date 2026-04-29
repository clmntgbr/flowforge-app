import { Workflow } from "../workflow/types"

export interface WorkflowRun {
  id: string
  status: string
  workflow: Workflow
}

export interface WorkflowRunState {
  isLoading: boolean
  error: string | null
}

export type WorkflowRunAction =
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
