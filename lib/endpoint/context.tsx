"use client"

import { createContext, useContext } from "react"
import {
  CreateEndpointPayload,
  Endpoint,
  EndpointState,
  UpdateEndpointPayload,
} from "./types"

export interface EndpointContextType extends EndpointState {
  fetchEndpoints: () => Promise<void>
  fetchEndpoint: (id: string) => Promise<Endpoint>
  createEndpoint: (payload: CreateEndpointPayload) => Promise<void>
  updateEndpoint: (id: string, payload: UpdateEndpointPayload) => Promise<void>
}

export const EndpointContext = createContext<EndpointContextType | undefined>(
  undefined
)

export const useEndpoint = () => {
  const context = useContext(EndpointContext)
  if (!context) {
    throw new Error("useEndpoint must be used within EndpointProvider")
  }
  return context
}
