"use client"

import { createContext, useContext } from "react"
import { Paginate } from "../paginate"
import { WorkflowRun, WorkflowRunState } from "./types"

export interface WorkflowRunContextType extends WorkflowRunState {
  fetchWorkflowRuns: (workflowId: string) => Promise<Paginate<WorkflowRun>>
}

export const WorkflowRunContext = createContext<
  WorkflowRunContextType | undefined
>(undefined)

export const useWorkflowRun = () => {
  const context = useContext(WorkflowRunContext)
  if (!context) {
    throw new Error("useWorkflowRun must be used within WorkflowRunProvider")
  }
  return context
}
