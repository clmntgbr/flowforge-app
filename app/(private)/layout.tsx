import { SidebarProvider } from "@/components/ui/sidebar"
import { ConnexionProvider } from "@/lib/connexion/provider"
import { EndpointProvider } from "@/lib/endpoint/provider"
import { OrganizationProvider } from "@/lib/organization/provider"
import { StepProvider } from "@/lib/step/provider"
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
              <StepProvider>
                <ConnexionProvider>
                  <SidebarProvider defaultOpen={false}>
                    <div className="mx-auto px-0">{children}</div>
                  </SidebarProvider>
                </ConnexionProvider>
              </StepProvider>
            </WorkflowProvider>
          </EndpointProvider>
        </OrganizationProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
