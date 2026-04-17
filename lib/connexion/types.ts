export interface ConnexionState {
  isLoading: boolean
  error: string | null
}

export type ConnexionAction = {
  type: "REMOVE_CONEXION" | { type: "ADD_CONEXION" }
}
