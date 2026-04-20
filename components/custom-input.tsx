import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ChangeEvent, useId } from "react"
import { FieldDescription } from "./ui/field"

interface InputOverlappingLabelProps {
  id?: string
  isRequired?: boolean
  label: string
  description: string
  value: string
  maxLength?: number
  hasCharacterLimit?: boolean
  errorMessage?: string
  hasError?: boolean
  onChange: (value: string) => void
}

const CustomInput = ({
  id,
  isRequired = false,
  label,
  description,
  value,
  maxLength = 0,
  errorMessage,
  onChange,
  hasCharacterLimit = false,
  hasError = false,
}: InputOverlappingLabelProps) => {
  const generatedId = useId()
  const resolvedId = id ?? generatedId

  const characterCount = value.length

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxLength) {
      onChange(e.target.value)
    }
  }

  return (
    <>
      <div className="w-full space-y-2">
        <Label htmlFor={resolvedId} className="mb-1 font-semibold">
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id={resolvedId}
          value={value}
          maxLength={maxLength}
          onChange={handleChange}
          className={cn(
            "peer bg-white pr-14 dark:bg-background",
            hasError &&
              "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/30"
          )}
        />
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
          {hasCharacterLimit && (
            <FieldDescription className="min-w-0 flex-1 text-end text-xs text-muted-foreground">
              <span className="">{maxLength - characterCount}</span> characters
              left
            </FieldDescription>
          )}
        </div>
      </div>
    </>
  )
}

export default CustomInput
