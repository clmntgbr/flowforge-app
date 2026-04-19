import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useEndpoint } from "@/lib/endpoint/context"
import { MinimalEndpoint } from "@/lib/endpoint/types"
import {
  GetMethodCardColor,
  GetMethodCodeColor,
  GetMethodColor,
} from "@/lib/method-color"
import { cn } from "@/lib/utils"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"

export function EndpointsSidebar() {
  const { endpoints } = useEndpoint()

  const onDragStart = (event: React.DragEvent, endpoint: MinimalEndpoint) => {
    event.dataTransfer.setData(
      "application/workflow-endpoint",
      JSON.stringify(endpoint)
    )
    event.dataTransfer.effectAllowed = "move"
  }
  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
      <SidebarContent className="bg-background">
        <SidebarGroupContent>
          <div className="flex flex-col gap-1.5 px-2">
            {endpoints.members.map((endpoint) => (
              <div
                key={endpoint.id}
                draggable
                onDragStart={(e) => onDragStart(e, endpoint)}
                className="group flex cursor-grab items-center gap-2 select-none active:cursor-grabbing"
              >
                <Card
                  size="default"
                  className={cn(
                    "min-w-0 flex-1 border! border-border py-2 transition-all",
                    GetMethodCardColor(endpoint.method)
                  )}
                >
                  <div className="flex flex-row items-center px-3">
                    <Badge
                      variant="outline"
                      className={cn(GetMethodColor(endpoint.method))}
                    >
                      {endpoint.method}
                    </Badge>
                    <div className="flex min-w-0 flex-1 flex-col gap-0 pl-3">
                      <p className="truncate text-xs font-semibold">
                        {endpoint.name}
                      </p>
                      <code
                        className={cn(
                          "inline-block w-fit truncate rounded px-1.5 py-0.5 font-mono text-xs",
                          GetMethodCodeColor(endpoint.method)
                        )}
                      >
                        {endpoint.path}
                      </code>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
