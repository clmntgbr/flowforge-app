"use client"

import { createContext, useContext } from "react"
import {
  CreateConnexionPayload,
  CreateWorkflowPayload,
  UpdateWorkflowPayload,
  UpdateWorkflowStepsPayload,
  Workflow,
  WorkflowConnexion,
  WorkflowState,
} from "./types"

export interface WorkflowContextType extends WorkflowState {
  fetchWorkflows: () => Promise<void>
  fetchWorkflow: (id: string) => Promise<Workflow>
  createWorkflow: (payload: CreateWorkflowPayload) => Promise<void>
  updateWorkflowSteps: (
    id: string,
    payload: UpdateWorkflowStepsPayload
  ) => Promise<void>
  updateWorkflow: (id: string, payload: UpdateWorkflowPayload) => Promise<void>
  removeConnexion: (id: string) => Promise<void>
  addConnexion: (payload: CreateConnexionPayload) => Promise<WorkflowConnexion>
}

export const WorkflowContext = createContext<WorkflowContextType | undefined>(
  undefined
)

export const useWorkflow = () => {
  const context = useContext(WorkflowContext)
  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider")
  }
  return context
}
