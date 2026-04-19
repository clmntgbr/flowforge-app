import * as z from "zod"

export const stepConfigurationSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters"),
  description: z.string().optional(),
  endpointId: z.string().min(1, "Endpoint is required"),
  timeout: z.number().min(0, "Timeout is required"),
  retryOnFailure: z.boolean().default(false),
  retryCount: z.number().min(0, "Retry count is required"),
  retryDelay: z.number().min(0, "Retry delay is required"),
})

export const stepQuerySchema = z.object({
  query: z.array(
    z.object({
      id: z.string(),
      key: z.string().min(1, "Key is required"),
      value: z.string().min(1, "Value is required"),
    })
  ),
})

export const stepSchema = z.object({
  ...stepConfigurationSchema.shape,
  ...stepQuerySchema.shape,
})
