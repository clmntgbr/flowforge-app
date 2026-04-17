import { CreateConnexionPayload, WorkflowConnexion } from "../workflow/types"

export const deleteConnexion = async (id: string): Promise<void> => {
  const response = await fetch(
    `/api/connexion/72d5b22ecb8c44bea9bb8f707228d51b/${id}`,
    {
      method: "DELETE",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to delete connexion")
  }

  return response.json()
}

export const postConnexion = async (
  payload: CreateConnexionPayload
): Promise<WorkflowConnexion> => {
  const response = await fetch(
    "/api/connexion/72d5b22ecb8c44bea9bb8f707228d51b",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to create connexion")
  }

  const data = await response.json()

  return connectionFromResponse(data, {
    from: payload.from,
    to: payload.to,
  })
}

function connectionFromResponse(
  data: unknown,
  fallback: { from: string; to: string }
): WorkflowConnexion {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid connexion response")
  }
  const o = data as Record<string, unknown>
  const id = extractId(o.id ?? o["@id"])
  if (!id) {
    throw new Error("Connexion response missing id")
  }
  const from =
    extractId(o.from) ??
    extractId((o as { source?: string }).source) ??
    fallback.from
  const to =
    extractId(o.to) ??
    extractId((o as { target?: string }).target) ??
    fallback.to
  return { id, from, to }
}

function extractId(value: unknown): string | undefined {
  if (typeof value === "string" && value) {
    return value.includes("/") ? (value.split("/").pop() ?? value) : value
  }
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>
    if (typeof o["@id"] === "string") return extractId(o["@id"])
    if (o.id !== undefined) return extractId(o.id)
  }
  return undefined
}
