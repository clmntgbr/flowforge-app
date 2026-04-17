"use client"

import { createContext, useContext } from "react"
import { CreateConnexionPayload, WorkflowConnexion } from "../workflow/types"
import { ConnexionState } from "./types"

export interface ConnexionContextType extends ConnexionState {
  removeConnexion: (id: string) => Promise<void>
  addConnexion: (payload: CreateConnexionPayload) => Promise<WorkflowConnexion>
}

export const ConnexionContext = createContext<ConnexionContextType | undefined>(
  undefined
)

export const useConnexion = () => {
  const context = useContext(ConnexionContext)
  if (!context) {
    throw new Error("useConnexion must be used within ConnexionProvider")
  }
  return context
}
