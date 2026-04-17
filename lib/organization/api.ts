import {
  CreateOrganizationPayload,
  Organization,
  UpdateOrganizationPayload,
} from "./types"

export const getOrganizations = async (): Promise<Organization[]> => {
  const response = await fetch(
    "/api/organization/eb55745b0b2340f4867daf0aed9d55a1",
    {
      method: "GET",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch organizations")
  }

  return response.json()
}

export const getOrganization = async (id: string): Promise<Organization> => {
  const response = await fetch(
    `/api/organization/eb55745b0b2340f4867daf0aed9d55a1/${id}`,
    {
      method: "GET",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch organization")
  }

  return response.json()
}

export const postOrganization = async (
  payload: CreateOrganizationPayload
): Promise<void> => {
  const response = await fetch(
    "/api/organization/eb55745b0b2340f4867daf0aed9d55a1",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to create organization")
  }

  return response.json()
}

export const putOrganization = async (
  id: string,
  payload: UpdateOrganizationPayload
): Promise<void> => {
  const response = await fetch(
    `/api/organization/eb55745b0b2340f4867daf0aed9d55a1/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to update organization")
  }

  return response.json()
}

export const putActivateOrganization = async (
  id: string
): Promise<Organization> => {
  const response = await fetch(
    `/api/organization/eb55745b0b2340f4867daf0aed9d55a1/${id}/activate`,
    {
      method: "PUT",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to activate organization")
  }

  return response.json()
}
