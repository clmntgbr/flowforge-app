"use client"

import { useCallback, useReducer } from "react"
import { getStep, putStep } from "./api"
import { StepContext } from "./context"
import { stepReducer } from "./reducer"
import { StepState, UpdateStepPayload } from "./types"

const initialState: StepState = {
  isLoading: false,
  error: null,
}

export function StepProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(stepReducer, initialState)

  const fetchStep = useCallback(async (id: string) => {
    try {
      const step = await getStep(id)
      return step
    } catch {
      throw new Error("Failed to fetch step")
    }
  }, [])

  const updateStep = useCallback(
    async (id: string, payload: UpdateStepPayload) => {
      try {
        await putStep(id, payload)
      } catch {
        throw new Error("Failed to update step")
      }
    },
    []
  )
  return (
    <StepContext.Provider
      value={{
        ...state,
        fetchStep,
        updateStep,
      }}
    >
      {children}
    </StepContext.Provider>
  )
}
