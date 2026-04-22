import * as z from "zod"

export const stepConfigurationSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters"),
  description: z.string().optional(),
  endpointId: z.string().min(1, "Endpoint is required"),
  timeout: z
    .number()
    .min(0, "Timeout is required")
    .max(60, "Timeout must be less than 60 seconds"),
  retryOnFailure: z.boolean(),
  retryCount: z
    .number()
    .min(0, "Retry count is required")
    .max(10, "Retry count must be less than 10"),
  retryDelay: z
    .number()
    .min(0, "Retry delay is required")
    .max(600, "Retry delay must be less than 10 minutes (600 seconds)"),
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

export const stepHeaderSchema = z.object({
  header: z.array(
    z.object({
      id: z.string(),
      key: z.string().min(1, "Key is required"),
      value: z.string().min(1, "Value is required"),
    })
  ),
})

export const stepBodySchema = z.object({
  body: z.string().transform((val, ctx) => {
    try {
      return JSON.parse(val)
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid JSON" })
      return z.NEVER
    }
  }),
})

export const stepSchema = z.object({
  ...stepConfigurationSchema.shape,
  ...stepQuerySchema.shape,
  ...stepHeaderSchema.shape,
  ...stepBodySchema.shape,
})
