"use client"

import { useCallback, useEffect, useReducer } from "react"
import { initPaginate } from "../paginate"
import {
  deleteConnexion,
  getWorkflow,
  getWorkflows,
  postConnexion,
  postWorkflow,
  putWorkflow,
  putWorkflowSteps,
} from "./api"
import { WorkflowContext } from "./context"
import { WorkflowReducer } from "./reducer"
import {
  CreateConnexionPayload,
  CreateWorkflowPayload,
  MinimalWorkflow,
  UpdateWorkflowPayload,
  UpdateWorkflowStepsPayload,
  WorkflowState,
} from "./types"

const initialState: WorkflowState = {
  workflows: initPaginate<MinimalWorkflow>(),
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

  const updateWorkflowSteps = useCallback(
    async (id: string, payload: UpdateWorkflowStepsPayload) => {
      try {
        await putWorkflowSteps(id, payload)
        fetchWorkflows()
      } catch {
        throw new Error("Failed to update workflow")
      }
    },
    [fetchWorkflows]
  )

  const updateWorkflow = useCallback(
    async (id: string, payload: UpdateWorkflowPayload) => {
      try {
        await putWorkflow(id, payload)
        fetchWorkflows()
      } catch {
        throw new Error("Failed to update workflow")
      }
    },
    [fetchWorkflows]
  )

  const removeConnexion = useCallback(async (id: string) => {
    try {
      await deleteConnexion(id)
    } catch {
      throw new Error("Failed to delete connexion")
    }
  }, [])

  const addConnexion = useCallback(async (payload: CreateConnexionPayload) => {
    try {
      return await postConnexion(payload)
    } catch {
      throw new Error("Failed to add connexion")
    }
  }, [])

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
        updateWorkflowSteps,
        updateWorkflow,
        removeConnexion,
        addConnexion,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}
