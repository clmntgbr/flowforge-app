export type Param = {
  id: string
  key: string
  value: string
}

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export type BodyParam = JsonValue
export type QueryParam = Param
export type HeaderParam = Param
