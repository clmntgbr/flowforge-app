"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import type { HeaderParam, QueryParam } from "@/lib/param"
import { useStep } from "@/lib/step/context"
import {
  stepConfigurationSchema,
  stepHeaderSchema,
  stepQuerySchema,
  stepSchema,
} from "@/lib/step/schema"
import type { Step } from "@/lib/step/types"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { LinkIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { v7 as uuidv7 } from "uuid"
import z from "zod"
import CustomInput from "./custom-input"
import CustomInputNumber from "./custom-input-number"
import CustomSwitch from "./custom-switch"
import CustomTextarea from "./custom-textarea"
import { Badge } from "./ui/badge"
import { Field } from "./ui/field"
import { Input } from "./ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

interface StepDrawerProps {
  stepId: string | undefined
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

function generateId() {
  return uuidv7().toString()
}

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

export function StepDrawer({
  stepId,
  isOpen,
  onOpenChange,
  onUpdate,
}: StepDrawerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { fetchStep, updateStep } = useStep()
  const [step, setStep] = useState<Step | undefined>(undefined)

  useEffect(() => {
    if (stepId && isOpen) {
      fetchStep(stepId).then((step) => {
        setStep(step)
      })
    }
  }, [stepId, isOpen, fetchStep])

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof stepSchema>>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      name: step?.name,
      description: step?.description,
      endpointId: step?.endpointId,
      timeout: step?.timeout,
      query: safeArray<QueryParam>(step?.query),
      header: safeArray<HeaderParam>(step?.header),
      retryOnFailure: step?.retryOnFailure ?? false,
      retryCount: step?.retryCount ?? 0,
      retryDelay: step?.retryDelay ?? 0,
    },
  })

  function addParam(
    currentParams: QueryParam[],
    onChange: (value: QueryParam[]) => void,
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault()
    const newParams = [
      ...safeArray<QueryParam>(currentParams),
      { id: generateId(), key: "", value: "" },
    ]
    onChange(newParams)
  }

  function removeParam(
    currentParams: QueryParam[],
    onChange: (value: QueryParam[]) => void,
    id: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault()
    const newParams = safeArray<QueryParam>(currentParams).filter(
      (p) => p.id !== id
    )
    onChange(newParams)
  }

  function updateParam(
    currentParams: QueryParam[],
    onChange: (value: QueryParam[]) => void,
    id: string,
    field: "key" | "value",
    val: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    e.preventDefault()
    const newParams = safeArray<QueryParam>(currentParams).map((p) =>
      p.id === id ? { ...p, [field]: val } : p
    )
    onChange(newParams)
  }

  const configurationFields: (keyof z.infer<typeof stepConfigurationSchema>)[] =
    ["name", "description", "endpointId", "timeout"]

  const queryFields: (keyof z.infer<typeof stepQuerySchema>)[] = ["query"]
  const headerFields: (keyof z.infer<typeof stepHeaderSchema>)[] = ["header"]

  const configurationErrorCount = configurationFields.filter(
    (field) => errors[field]
  ).length

  const queryErrorCount = queryFields.filter((field) => errors[field]).length
  const headerErrorCount = headerFields.filter((field) => errors[field]).length

  const onSubmit = async (data: z.infer<typeof stepSchema>) => {
    if (!step) return

    setIsLoading(true)
    await updateStep(step.id, {
      name: data.name,
      description: data.description,
      query: data.query,
      header: data.header,
      timeout: data.timeout,
      retryOnFailure: data.retryOnFailure,
      retryCount: data.retryCount,
      retryDelay: data.retryDelay,
    })
    setIsLoading(false)
    onUpdate()
    onClose()
  }

  const onClose = () => {
    reset()
    onOpenChange(false)
  }

  useEffect(() => {
    if (isOpen && step) {
      const safeQuery = safeArray<QueryParam>(step.query)
      const safeHeader = safeArray<HeaderParam>(step.header)
      reset({
        name: step.name,
        description: step.description,
        endpointId: step.endpointId,
        timeout: step.timeout,
        query: safeQuery,
        header: safeHeader,
        retryOnFailure: step.retryOnFailure,
        retryCount: step.retryCount,
        retryDelay: step.retryDelay,
      })
    }
  }, [isOpen, step, reset])

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full w-[30vw]! max-w-[30vw]! flex-col">
        <DrawerHeader className="shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <DrawerTitle className="flex items-center gap-3">
                <LinkIcon className="size-10 rounded-full bg-primary p-2 text-primary-foreground" />
                <div className="flex flex-col items-start">
                  <span className="text-lg font-semibold">{step?.name}</span>
                  <span className="truncate text-xs font-medium text-muted-foreground">
                    {step?.description}
                  </span>
                </div>
              </DrawerTitle>
            </div>
          </div>
        </DrawerHeader>
        <form
          id="step-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="w-full">
            <Tabs defaultValue="configuration" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger
                  value="configuration"
                  className="flex w-full items-center gap-1 px-2.5 sm:px-3"
                >
                  Configuration
                  {configurationErrorCount > 0 && (
                    <Badge
                      className="h-5 min-w-5 px-1 tabular-nums"
                      variant="destructive"
                    >
                      {configurationErrorCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="queries"
                  className="flex w-full items-center gap-1 px-2.5 sm:px-3"
                >
                  Query
                  {queryErrorCount > 0 && (
                    <Badge
                      className="h-5 min-w-5 px-1 tabular-nums"
                      variant="destructive"
                    >
                      {queryErrorCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="headers"
                  className="flex w-full items-center gap-1 px-2.5 sm:px-3"
                >
                  Header
                  {headerErrorCount > 0 && (
                    <Badge
                      className="h-5 min-w-5 px-1 tabular-nums"
                      variant="destructive"
                    >
                      {headerErrorCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="configuration" className="w-full px-4 pt-2">
                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-4">
                    <Field>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <CustomInput
                            id="input-field-name"
                            isRequired={true}
                            label="Name"
                            hasError={!!errors.name}
                            errorMessage={errors.name?.message}
                            description="The name of the step"
                            value={field.value ?? ""}
                            hasCharacterLimit={true}
                            maxLength={100}
                            onChange={(value) => field.onChange(value)}
                          />
                        )}
                      />
                    </Field>
                    <Field>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <CustomTextarea
                            id="input-field-description"
                            hasError={!!errors.description}
                            errorMessage={errors.description?.message}
                            isRequired={false}
                            label="Description"
                            description="The description of the step"
                            value={field.value ?? ""}
                            hasCharacterLimit={true}
                            maxLength={255}
                            onChange={(value) => field.onChange(value)}
                          />
                        )}
                      />
                    </Field>
                    <Field>
                      <Controller
                        name="timeout"
                        control={control}
                        render={({ field }) => (
                          <CustomInputNumber
                            id="input-field-timeout"
                            isRequired={true}
                            label="Timeout"
                            description="The timeout of the step in seconds"
                            value={field.value?.toString() ?? "0"}
                            hasError={!!errors.timeout}
                            errorMessage={errors.timeout?.message}
                            onChange={(value) => field.onChange(Number(value))}
                          />
                        )}
                      />
                    </Field>
                    <Field>
                      <Controller
                        name="retryOnFailure"
                        control={control}
                        render={({ field }) => (
                          <CustomSwitch
                            id="switch-field-retry-on-failure"
                            isRequired={true}
                            label="Retry On Failure"
                            description="The step will be retried if it fails"
                            value={field.value}
                            hasError={!!errors.retryOnFailure}
                            errorMessage={errors.retryOnFailure?.message}
                            onChange={(value) => field.onChange(value)}
                          />
                        )}
                      />
                    </Field>
                    <Field>
                      <Controller
                        name="retryCount"
                        control={control}
                        render={({ field }) => (
                          <CustomInputNumber
                            id="input-field-retry-count"
                            hasError={!!errors.retryCount}
                            errorMessage={errors.retryCount?.message}
                            isRequired={true}
                            label="Retry Count"
                            description="The number of times to retry the step if it fails"
                            value={field.value?.toString() ?? "0"}
                            onChange={(value) => field.onChange(Number(value))}
                          />
                        )}
                      />
                    </Field>
                    <Field>
                      <Controller
                        name="retryDelay"
                        control={control}
                        render={({ field }) => (
                          <CustomInputNumber
                            id="input-field-retry-delay"
                            hasError={!!errors.retryDelay}
                            errorMessage={errors.retryDelay?.message}
                            isRequired={true}
                            label="Retry Delay"
                            description="The delay between retries in seconds"
                            value={field.value?.toString() ?? "0"}
                            onChange={(value) => field.onChange(Number(value))}
                          />
                        )}
                      />
                    </Field>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="queries" className="w-full px-4 pt-2">
                <Controller
                  name="query"
                  control={control}
                  render={({ field }) => {
                    const currentParams = safeArray<QueryParam>(field.value)
                    return (
                      <div className="space-y-3">
                        {currentParams.length > 0 && (
                          <div className="space-y-2">
                            {currentParams.map((param) => (
                              <div
                                key={param.id}
                                className="group flex items-center gap-2"
                              >
                                <Input
                                  placeholder="key"
                                  value={param.key}
                                  onChange={(e) =>
                                    updateParam(
                                      currentParams,
                                      field.onChange,
                                      param.id,
                                      "key",
                                      e.target.value,
                                      e
                                    )
                                  }
                                  className={cn(
                                    "flex-1",
                                    param.key.trim() === "" &&
                                      "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/30"
                                  )}
                                />
                                <span className="text-sm text-gray-400 select-none">
                                  =
                                </span>
                                <Input
                                  placeholder="value"
                                  value={param.value}
                                  onChange={(e) =>
                                    updateParam(
                                      currentParams,
                                      field.onChange,
                                      param.id,
                                      "value",
                                      e.target.value,
                                      e
                                    )
                                  }
                                  className={cn(
                                    "flex-1",
                                    param.value.trim() === "" &&
                                      "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/30"
                                  )}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) =>
                                    removeParam(
                                      currentParams,
                                      field.onChange,
                                      param.id,
                                      e
                                    )
                                  }
                                  className="shrink-0 bg-red-50 text-red-500 transition-colors hover:bg-red-100 hover:text-red-500"
                                >
                                  <Trash2Icon className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex justify-center">
                          <Button
                            onClick={(e) =>
                              addParam(currentParams, field.onChange, e)
                            }
                            variant="outline"
                            className="w-full font-light"
                          >
                            <PlusIcon className="mr-1.5 h-4 w-4" />
                            Add a query
                          </Button>
                        </div>
                      </div>
                    )
                  }}
                />
              </TabsContent>
              <TabsContent
                value="headers"
                className="w-full px-4 pt-2"
              ></TabsContent>
            </Tabs>
          </div>

          <DrawerFooter className="mt-auto shrink-0 border-t">
            <Button
              className="w-full"
              variant="default"
              type="submit"
              disabled={isLoading}
            >
              Update
            </Button>
            <DrawerClose asChild onClick={onClose}>
              <Button className="w-full" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
