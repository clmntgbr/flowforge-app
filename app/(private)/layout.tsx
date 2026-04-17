import { SidebarProvider } from "@/components/ui/sidebar"
import { EndpointProvider } from "@/lib/endpoint/provider"
import { OrganizationProvider } from "@/lib/organization/provider"
import { ThemeProvider } from "@/lib/theme/theme-provider"
import { UserProvider } from "@/lib/user/provider"
import { WorkflowProvider } from "@/lib/workflow/provider"

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider>
        <OrganizationProvider>
          <EndpointProvider>
            <WorkflowProvider>
              <SidebarProvider defaultOpen={false}>
                <div className="mx-auto px-0">{children}</div>
              </SidebarProvider>
            </WorkflowProvider>
          </EndpointProvider>
        </OrganizationProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
