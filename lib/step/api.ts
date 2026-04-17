import { Step, UpdateStepPayload } from "./types"

export const getStep = async (id: string): Promise<Step> => {
  const response = await fetch(
    `/api/step/af60e0fa9b0f4443bbb7fb384b46abe9/${id}`,
    {
      method: "GET",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch step")
  }

  return response.json()
}

export const putStep = async (
  id: string,
  payload: UpdateStepPayload
): Promise<void> => {
  const response = await fetch(
    `/api/step/af60e0fa9b0f4443bbb7fb384b46abe9/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to update step")
  }

  return response.json()
}
