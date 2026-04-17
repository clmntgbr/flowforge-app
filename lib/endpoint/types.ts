import { Paginate } from "@/lib/paginate"

export interface Endpoint {
  id: string
  name: string
  baseUri: string
  path: string
  method: string
  timeout: number
}

export interface CreateEndpointPayload {
  name: string
  baseUri: string
  path: string
  method: string
  timeout: number
}

export interface UpdateEndpointPayload {
  name: string
  baseUri: string
  path: string
  method: string
  timeout: number
}

export interface EndpointState {
  endpoints: Paginate<Endpoint>
  isLoading: boolean
  error: string | null
}

export const HttpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"]

export type EndpointAction =
  | { type: "GET_ENDPOINTS"; payload: Paginate<Endpoint> }
  | { type: "GET_ENDPOINTS_ERROR"; payload: string }
  | { type: "GET_ENDPOINTS_LOADING"; payload: boolean }
