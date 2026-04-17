import { Paginate } from "../paginate"
import {
  CreateEndpointPayload,
  Endpoint,
  MinimalEndpoint,
  UpdateEndpointPayload,
} from "./types"

export const getEndpoints = async (): Promise<Paginate<MinimalEndpoint>> => {
  const response = await fetch(
    "/api/endpoint/b97d4315d1c44b188589ddb82de244a8",
    {
      method: "GET",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch endpoints")
  }

  return response.json()
}

export const getEndpoint = async (id: string): Promise<Endpoint> => {
  const response = await fetch(
    `/api/endpoint/b97d4315d1c44b188589ddb82de244a8/${id}`,
    {
      method: "GET",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch endpoint")
  }

  return response.json()
}

export const postEndpoint = async (
  payload: CreateEndpointPayload
): Promise<void> => {
  const response = await fetch(
    "/api/endpoint/b97d4315d1c44b188589ddb82de244a8",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to create endpoint")
  }

  return response.json()
}

export const putEndpoint = async (
  id: string,
  payload: UpdateEndpointPayload
): Promise<void> => {
  const response = await fetch(
    `/api/endpoint/b97d4315d1c44b188589ddb82de244a8/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to update endpoint")
  }

  return response.json()
}
