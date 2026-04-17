export interface Organization {
  id: string
  isActive: boolean
  name: string
  description?: string
}

export interface OrganizationState {
  organizations: Organization[]
  activeOrganization: Organization | null
  isLoading: boolean
  error: string | null
}

export interface CreateOrganizationPayload {
  name: string
}

export interface UpdateOrganizationPayload {
  name: string
  description?: string
}

export type OrganizationAction =
  | {
      type: "GET_PROJECTS"
      payload: Organization[]
      activeOrganization: Organization | null
    }
  | { type: "GET_PROJECTS_ERROR"; payload: string }
  | { type: "GET_PROJECTS_LOADING"; payload: boolean }
