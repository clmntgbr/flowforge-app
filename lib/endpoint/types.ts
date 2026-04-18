import { Paginate } from "@/lib/paginate"

export interface QueryParam {
  id: string
  key: string
  value: string
}

export interface Endpoint extends MinimalEndpoint {
  baseUri: string
  timeout: number
  query: QueryParam[]
}

export interface MinimalEndpoint {
  id: string
  name: string
  method: string
  path: string
  createdAt: string
  updatedAt: string
}

export interface CreateEndpointPayload {
  name: string
  baseUri: string
  path: string
  method: string
  timeout: number
  query: QueryParam[]
}

export interface UpdateEndpointPayload {
  name: string
  baseUri: string
  path: string
  method: string
  timeout: number
  query: QueryParam[]
}

export interface EndpointState {
  endpoints: Paginate<MinimalEndpoint>
  isLoading: boolean
  error: string | null
}

export const HttpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"]

export type EndpointAction =
  | { type: "GET_ENDPOINTS"; payload: Paginate<MinimalEndpoint> }
  | { type: "GET_ENDPOINTS_ERROR"; payload: string }
  | { type: "GET_ENDPOINTS_LOADING"; payload: boolean }
