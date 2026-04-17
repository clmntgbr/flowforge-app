import { EndpointProvider } from "@/lib/endpoint/provider"
import { OrganizationProvider } from "@/lib/organization/provider"
import { ThemeProvider } from "@/lib/theme/theme-provider"
import { UserProvider } from "@/lib/user/provider"

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
            <div className="mx-auto px-0">{children}</div>
          </EndpointProvider>
        </OrganizationProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
