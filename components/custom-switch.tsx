import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useId } from "react"
import { FieldDescription } from "./ui/field"
import { Switch } from "./ui/switch"

interface InputOverlappingLabelProps {
  id?: string
  isRequired?: boolean
  label: string
  description: string
  value: boolean
  errorMessage?: string
  hasError?: boolean
  onChange: (value: boolean) => void
}

const CustomSwitch = ({
  id,
  isRequired = false,
  label,
  description,
  value,
  errorMessage,
  onChange,
  hasError = false,
}: InputOverlappingLabelProps) => {
  const generatedId = useId()
  const resolvedId = id ?? generatedId

  return (
    <>
      <div className="w-full space-y-2">
        <Label htmlFor={resolvedId} className="mb-1 font-semibold">
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </Label>
        <Switch id={resolvedId} checked={value} onCheckedChange={onChange} />
        <div className="flex w-full flex-row items-start justify-between gap-2">
          <FieldDescription
            className={cn(
              "text-begin min-w-0 flex-1 text-xs text-muted-foreground",
              hasError &&
                "text-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/30"
            )}
          >
            {hasError ? errorMessage : description}
          </FieldDescription>
        </div>
      </div>
    </>
  )
}

export default CustomSwitch
