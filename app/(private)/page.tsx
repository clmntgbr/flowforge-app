"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEndpoint } from "@/lib/endpoint/context"
import { useOrganization } from "@/lib/organization/context"
import { useUser } from "@/lib/user/context"

export default function Page() {
  const { user } = useUser()
  const {
    organizations,
    createOrganization,
    updateOrganization,
    activateOrganization,
  } = useOrganization()

  const { endpoints, createEndpoint } = useEndpoint()

  const handleCreateOrganization = () => {
    createOrganization({ name: crypto.randomUUID() })
  }

  const handleCreateEndpoint = () => {
    createEndpoint({
      name: crypto.randomUUID(),
      baseUri: "https://api.example.com",
      path: "/api/v1",
      method: ["GET", "POST", "PUT", "DELETE"][Math.floor(Math.random() * 4)],
      timeout: 1000,
    })
  }

  const handleUpdateOrganization = () => {
    const id =
      organizations[Math.floor(Math.random() * organizations.length)]?.id
    if (!id) return
    updateOrganization(id, {
      name: crypto.randomUUID(),
      description: crypto.randomUUID(),
    })
  }

  const handleActivateOrganization = (id: string) => {
    activateOrganization(id)
  }

  return (
    <>
      <h1>User</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <Tabs defaultValue="organizations" className="w-full">
        <TabsList>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
        </TabsList>
        <TabsContent value="organizations">
          <Button onClick={handleCreateOrganization}>
            Create Organization
          </Button>
          <Button onClick={handleUpdateOrganization}>
            Update Organization
          </Button>
          <h1>Organizations</h1>
          {organizations.map((organization) => (
            <Card key={organization.id} className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  title: {organization.name}
                </CardTitle>
                <CardDescription>
                  description: {organization.description}
                </CardDescription>
                <CardContent>
                  <Badge>{organization.isActive ? "Active" : "Inactive"}</Badge>
                </CardContent>
              </CardHeader>
              <CardFooter>
                <Button
                  onClick={() => handleActivateOrganization(organization.id)}
                >
                  Activate
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="endpoints">
          <Button onClick={handleCreateEndpoint}>Create Endpoint</Button>
          <h1>Endpoints</h1>
          {endpoints.members.map((endpoint) => (
            <Card key={endpoint.id} className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  name: {endpoint.name}
                </CardTitle>
                <CardDescription>baseUri: {endpoint.baseUri}</CardDescription>
                <CardDescription>path: {endpoint.path}</CardDescription>
                <CardDescription>method: {endpoint.method}</CardDescription>
                <CardContent>
                  <Badge>{endpoint.method}</Badge>
                </CardContent>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </>
  )
}
