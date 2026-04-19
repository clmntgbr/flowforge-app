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
import { useWorkflow } from "@/lib/workflow/context"
import { workflowSchema } from "@/lib/workflow/schema"
import { Workflow } from "@/lib/workflow/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { LinkIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import CustomInput from "./custom-input"
import { Field } from "./ui/field"

interface WorkflowDrawerProps {
  workflow: Workflow
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (workflow: Workflow) => void
}

export function WorkflowDrawer({
  workflow,
  isOpen,
  onOpenChange,
  onUpdate,
}: WorkflowDrawerProps) {
  const { updateWorkflow } = useWorkflow()

  const [isLoading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof workflowSchema>>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: workflow?.name,
      description: workflow?.description,
    },
  })

  const onSubmit = async (data: z.infer<typeof workflowSchema>) => {
    if (!workflow) return

    setIsLoading(true)
    await updateWorkflow(workflow.id, {
      name: data.name,
      description: data.description,
    })
    setIsLoading(false)
    onUpdate(workflow)
    onClose()
  }

  const onClose = () => {
    reset()
    onOpenChange(false)
  }

  useEffect(() => {
    if (isOpen && workflow) {
      reset({
        name: workflow.name,
        description: workflow.description,
      })
    }
  }, [isOpen, workflow, reset])

  if (!workflow) return null

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full w-[30vw]! max-w-[30vw]! flex-col">
        <DrawerHeader className="shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <DrawerTitle className="flex items-center gap-3">
                <LinkIcon className="size-10 rounded-full bg-primary p-2 text-primary-foreground" />
                <div className="flex flex-col items-start">
                  <span className="text-lg font-semibold">
                    {workflow?.name}
                  </span>
                  <span className="line-clamp-1 text-xs font-medium text-muted-foreground">
                    {workflow?.description}
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
          <div className="w-full px-4">
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
                    description="The name of the workflow"
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
                  <CustomInput
                    id="input-field-description"
                    isRequired={true}
                    label="Description"
                    hasError={!!errors.description}
                    description="The description of the workflow"
                    value={field.value ?? ""}
                    hasCharacterLimit={true}
                    maxLength={100}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </Field>
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
