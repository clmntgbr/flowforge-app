"use client"

import { createContext, useContext } from "react"
import {
  CreateOrganizationPayload,
  Organization,
  OrganizationState,
  UpdateOrganizationPayload,
} from "./types"

export interface OrganizationContextType extends OrganizationState {
  fetchOrganizations: () => Promise<void>
  fetchOrganization: (id: string) => Promise<Organization>
  createOrganization: (payload: CreateOrganizationPayload) => Promise<void>
  updateOrganization: (
    id: string,
    payload: UpdateOrganizationPayload
  ) => Promise<void>
  activateOrganization: (id: string) => Promise<void>
}

export const OrganizationContext = createContext<
  OrganizationContextType | undefined
>(undefined)

export const useOrganization = () => {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error("useOrganization must be used within OrganizationProvider")
  }
  return context
}
