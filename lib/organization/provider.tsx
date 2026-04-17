"use client"

import { useCallback, useEffect, useReducer } from "react"
import {
  getOrganization,
  getOrganizations,
  postOrganization,
  putActivateOrganization,
  putOrganization,
} from "./api"
import { OrganizationContext } from "./context"
import { OrganizationReducer } from "./reducer"
import {
  CreateOrganizationPayload,
  OrganizationState,
  UpdateOrganizationPayload,
} from "./types"

const initialState: OrganizationState = {
  organizations: [],
  activeOrganization: null,
  isLoading: false,
  error: null,
}

export function OrganizationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, dispatch] = useReducer(OrganizationReducer, initialState)

  const fetchOrganizations = useCallback(async () => {
    try {
      dispatch({ type: "GET_PROJECTS_LOADING", payload: true })
      const organizations = await getOrganizations()
      dispatch({
        type: "GET_PROJECTS",
        payload: organizations,
        activeOrganization:
          organizations.find((organization) => organization.isActive) ?? null,
      })
    } catch {
      dispatch({
        type: "GET_PROJECTS_ERROR",
        payload: "Failed to fetch organizations",
      })
    } finally {
      dispatch({ type: "GET_PROJECTS_LOADING", payload: false })
    }
  }, [])

  const fetchOrganization = useCallback(async (id: string) => {
    try {
      const organization = await getOrganization(id)
      return organization
    } catch {
      throw new Error("Failed to fetch organization")
    }
  }, [])

  const createOrganization = useCallback(
    async (payload: CreateOrganizationPayload) => {
      try {
        await postOrganization(payload)
        fetchOrganizations()
      } catch {
        throw new Error("Failed to create organization")
      }
    },
    [fetchOrganizations]
  )

  const updateOrganization = useCallback(
    async (id: string, payload: UpdateOrganizationPayload) => {
      try {
        await putOrganization(id, payload)
        fetchOrganizations()
      } catch {
        throw new Error("Failed to update organization")
      }
    },
    [fetchOrganizations]
  )

  const activateOrganization = useCallback(
    async (id: string) => {
      try {
        await putActivateOrganization(id)
        fetchOrganizations()
      } catch {
        throw new Error("Failed to activate organization")
      }
    },
    [fetchOrganizations]
  )

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  return (
    <OrganizationContext.Provider
      value={{
        ...state,
        fetchOrganizations,
        fetchOrganization,
        createOrganization,
        updateOrganization,
        activateOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}
