"use client"

import { createContext, useContext } from "react"
import { Step, StepState, UpdateStepPayload } from "./types"

export interface StepContextType extends StepState {
  fetchStep: (id: string) => Promise<Step>
  updateStep: (id: string, payload: UpdateStepPayload) => Promise<void>
}

export const StepContext = createContext<StepContextType | undefined>(undefined)

export const useStep = () => {
  const context = useContext(StepContext)
  if (!context) {
    throw new Error("useStep must be used within StepProvider")
  }
  return context
}
