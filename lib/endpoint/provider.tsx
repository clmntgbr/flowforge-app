"use client"

import { useCallback, useEffect, useReducer } from "react"
import { initPaginate } from "../paginate"
import { getEndpoint, getEndpoints, postEndpoint, putEndpoint } from "./api"
import { EndpointContext } from "./context"
import { EndpointReducer } from "./reducer"
import {
  CreateEndpointPayload,
  EndpointState,
  MinimalEndpoint,
  UpdateEndpointPayload,
} from "./types"

const initialState: EndpointState = {
  endpoints: initPaginate<MinimalEndpoint>(),
  isLoading: false,
  error: null,
}

export function EndpointProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(EndpointReducer, initialState)

  const fetchEndpoints = useCallback(async () => {
    try {
      dispatch({ type: "GET_ENDPOINTS_LOADING", payload: true })
      const endpoints = await getEndpoints()
      dispatch({
        type: "GET_ENDPOINTS",
        payload: endpoints,
      })
    } catch {
      dispatch({
        type: "GET_ENDPOINTS_ERROR",
        payload: "Failed to fetch endpoints",
      })
    } finally {
      dispatch({ type: "GET_ENDPOINTS_LOADING", payload: false })
    }
  }, [])

  const fetchEndpoint = useCallback(async (id: string) => {
    try {
      const endpoint = await getEndpoint(id)
      return endpoint
    } catch {
      throw new Error("Failed to fetch endpoint")
    }
  }, [])

  const createEndpoint = useCallback(
    async (payload: CreateEndpointPayload) => {
      try {
        await postEndpoint(payload)
        fetchEndpoints()
      } catch {
        throw new Error("Failed to create endpoint")
      }
    },
    [fetchEndpoints]
  )

  const updateEndpoint = useCallback(
    async (id: string, payload: UpdateEndpointPayload) => {
      try {
        await putEndpoint(id, payload)
        fetchEndpoints()
      } catch {
        throw new Error("Failed to update endpoint")
      }
    },
    [fetchEndpoints]
  )

  useEffect(() => {
    fetchEndpoints()
  }, [fetchEndpoints])

  return (
    <EndpointContext.Provider
      value={{
        ...state,
        fetchEndpoints,
        fetchEndpoint,
        createEndpoint,
        updateEndpoint,
      }}
    >
      {children}
    </EndpointContext.Provider>
  )
}
