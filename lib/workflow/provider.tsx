"use client"

import { useCallback, useEffect, useReducer } from "react"
import { initPaginate } from "../paginate"
import { getWorkflow, getWorkflows, postWorkflow } from "./api"
import { WorkflowContext } from "./context"
import { WorkflowReducer } from "./reducer"
import { CreateWorkflowPayload, Workflow, WorkflowState } from "./types"

const initialState: WorkflowState = {
  workflows: initPaginate<Workflow>(),
  isLoading: false,
  error: null,
}

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(WorkflowReducer, initialState)

  const fetchWorkflows = useCallback(async () => {
    try {
      dispatch({ type: "GET_WORKFLOWS_LOADING", payload: true })
      const workflows = await getWorkflows()
      dispatch({
        type: "GET_WORKFLOWS",
        payload: workflows,
      })
    } catch {
      dispatch({
        type: "GET_WORKFLOWS_ERROR",
        payload: "Failed to fetch workflows",
      })
    } finally {
      dispatch({ type: "GET_WORKFLOWS_LOADING", payload: false })
    }
  }, [])

  const fetchWorkflow = useCallback(async (id: string) => {
    try {
      const workflow = await getWorkflow(id)
      return workflow
    } catch {
      throw new Error("Failed to fetch workflow")
    }
  }, [])

  const createWorkflow = useCallback(
    async (payload: CreateWorkflowPayload) => {
      try {
        await postWorkflow(payload)
        fetchWorkflows()
      } catch {
        throw new Error("Failed to create workflow")
      }
    },
    [fetchWorkflows]
  )

  useEffect(() => {
    fetchWorkflows()
  }, [fetchWorkflows])

  return (
    <WorkflowContext.Provider
      value={{
        ...state,
        fetchWorkflows,
        fetchWorkflow,
        createWorkflow,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}
