import { Paginate } from "@/lib/paginate"
import { BodyParam, HeaderParam, QueryParam } from "../param"

export interface Endpoint extends MinimalEndpoint {
  baseUri: string
  timeout: number
  query: QueryParam[]
  header: HeaderParam[]
  body: BodyParam
  retryOnFailure: boolean
  retryCount: number
  retryDelay: number
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
  header: HeaderParam[]
  body: BodyParam
  retryOnFailure: boolean
  retryCount: number
  retryDelay: number
}

export interface UpdateEndpointPayload {
  name: string
  baseUri: string
  path: string
  method: string
  timeout: number
  query: QueryParam[]
  header: HeaderParam[]
  body: BodyParam
  retryOnFailure: boolean
  retryCount: number
  retryDelay: number
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
