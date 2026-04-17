import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { MinusIcon, PlusIcon } from "lucide-react"
import { useId } from "react"
import { Button, Group, Input, NumberField } from "react-aria-components"
import { FieldDescription } from "./ui/field"

interface InputOverlappingLabelProps {
  id?: string
  isRequired?: boolean
  label: string
  description: string
  value: string
  onChange: (value: number) => void
  hasError?: boolean
}

const CustomInputNumber = ({
  id,
  isRequired = false,
  label,
  description,
  value,
  onChange,
  hasError = false,
}: InputOverlappingLabelProps) => {
  const generatedId = useId()
  const resolvedId = id ?? generatedId

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={resolvedId} className="mb-1 font-semibold">
        {label}
        {isRequired && <span className="text-destructive">*</span>}
      </Label>
      <NumberField
        value={Number(value)}
        onChange={onChange}
        minValue={0}
        className="block w-full"
      >
        <Group
          className={cn(
            "flex h-7 w-full min-w-0 items-stretch overflow-hidden rounded-md border border-input bg-white transition-colors outline-none dark:bg-background",
            "data-focus-within:border-ring data-focus-within:ring-2 data-focus-within:ring-ring/30",
            "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
            "data-focus-within:has-aria-invalid:border-destructive data-focus-within:has-aria-invalid:ring-2 data-focus-within:has-aria-invalid:ring-destructive/20",
            "dark:data-focus-within:has-aria-invalid:border-destructive/50 dark:data-focus-within:has-aria-invalid:ring-destructive/40",
            hasError &&
              "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/30"
          )}
        >
          <Input
            id={resolvedId}
            data-slot="input"
            className={cn(
              "h-full min-h-0 min-w-0 flex-1 border-0 bg-transparent px-2 py-0.5 text-sm outline-none md:text-xs/relaxed",
              "tabular-nums placeholder:text-muted-foreground",
              "selection:bg-primary selection:text-primary-foreground"
            )}
          />
          <Button
            slot="decrement"
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center border-l border-input",
              "text-muted-foreground hover:bg-accent hover:text-foreground",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <MinusIcon className="size-3" />
            <span className="sr-only">Decrement</span>
          </Button>
          <Button
            slot="increment"
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center border-l border-input",
              "text-muted-foreground hover:bg-accent hover:text-foreground",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <PlusIcon className="size-3" />
            <span className="sr-only">Increment</span>
          </Button>
        </Group>
      </NumberField>
      <div className="flex w-full flex-row items-start justify-between gap-2">
        <FieldDescription
          className={cn(
            "text-begin min-w-0 flex-1 text-xs text-muted-foreground",
            hasError &&
              "text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/30"
          )}
        >
          {description}
        </FieldDescription>
      </div>
    </div>
  )
}

export default CustomInputNumber
