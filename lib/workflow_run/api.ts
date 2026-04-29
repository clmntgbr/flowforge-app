import { Paginate } from "../paginate"
import { WorkflowRun } from "./types"

export const getWorkflowRuns = async (
  workflowId: string
): Promise<Paginate<WorkflowRun>> => {
  const response = await fetch(
    `/api/workflow/0cc345f76b884fd580c232f270c887da/${workflowId}/b4e0a17b033e45198a2494ee0f85bb27`,
    {
      method: "GET",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch workflow runs")
  }

  return response.json()
}
