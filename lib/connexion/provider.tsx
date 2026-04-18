"use client"

import { useCallback, useReducer } from "react"
import { CreateConnexionPayload } from "../workflow/types"
import { deleteConnexion, postConnexion } from "./api"
import { ConnexionContext } from "./context"
import { ConnexionReducer } from "./reducer"
import { ConnexionState } from "./types"

const initialState: ConnexionState = {
  isLoading: false,
  error: null,
}

export function ConnexionProvider({ children }: { children: React.ReactNode }) {
  const [state] = useReducer(ConnexionReducer, initialState)
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

  return (
    <ConnexionContext.Provider
      value={{
        ...state,
        removeConnexion,
        addConnexion,
      }}
    >
      {children}
    </ConnexionContext.Provider>
  )
}
