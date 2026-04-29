"use client"

import { useCallback, useReducer } from "react"
import { Paginate } from "../paginate"
import { getWorkflowRuns } from "./api"
import { WorkflowRunContext } from "./context"
import { WorkflowRunReducer } from "./reducer"
import { WorkflowRun, WorkflowRunState } from "./types"

const initialState: WorkflowRunState = {
  isLoading: false,
  error: null,
}

export function WorkflowRunProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, dispatch] = useReducer(WorkflowRunReducer, initialState)

  const fetchWorkflowRuns = useCallback(
    async (workflowId: string): Promise<Paginate<WorkflowRun>> => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })
        const workflowRuns = await getWorkflowRuns(workflowId)
        return workflowRuns
      } catch {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to fetch workflow runs",
        })
        throw new Error("Failed to fetch workflow runs")
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    []
  )

  return (
    <WorkflowRunContext.Provider
      value={{
        ...state,
        fetchWorkflowRuns,
      }}
    >
      {children}
    </WorkflowRunContext.Provider>
  )
}
