import {
  GetMethodCardColor,
  GetMethodCodeColor,
  GetMethodColor,
} from "@/lib/method-color"
import { cn } from "@/lib/utils"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { SquarePenIcon } from "lucide-react"
import { memo } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { WorkflowStep } from "./workflow-canvas"

function StepNode({ data, selected }: NodeProps) {
  const step = data.step as WorkflowStep
  const onEditClick = data.onEditClick as (() => void) | undefined

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEditClick?.()
  }

  return (
    <div className="group">
      <Card
        size="sm"
        className={cn(
          "w-auto transition-all",
          GetMethodCardColor(step.endpoint?.method),
          selected && "py-3 shadow-lg ring-1 ring-primary"
        )}
      >
        <div className="flex flex-row items-center px-3">
          <div className="flex flex-row items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {step.index}
            </Badge>
          </div>
          <Badge
            variant="outline"
            className={cn(GetMethodColor(step.endpoint?.method))}
          >
            {step.endpoint?.method}
          </Badge>
          <div className="flex min-w-0 flex-1 flex-col gap-0 pl-3">
            <p className="truncate text-base font-semibold">{step.name}</p>
            <code
              className={cn(
                "inline-block w-fit truncate rounded px-1.5 py-0.5 font-mono text-xs",
                GetMethodCodeColor(step.endpoint?.method)
              )}
            >
              {step.endpoint?.path}
            </code>
          </div>
          <div className="flex items-center justify-center pl-9">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditClick}
              className="bg-transparent"
            >
              <SquarePenIcon />
            </Button>
          </div>
        </div>
      </Card>

      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="-top-1!"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="-bottom-1!"
        isConnectable={true}
      />
    </div>
  )
}

export default memo(StepNode)
