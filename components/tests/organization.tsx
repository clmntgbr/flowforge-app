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
import { useOrganization } from "@/lib/organization/context"

export default function OrganizationTest() {
  const {
    organizations,
    createOrganization,
    fetchOrganization,
    updateOrganization,
    activateOrganization,
  } = useOrganization()

  const handleCreateOrganization = () => {
    createOrganization({ name: crypto.randomUUID() })
  }

  const handleUpdateOrganization = () => {
    const id =
      organizations[Math.floor(Math.random() * organizations.length)]?.id
    if (!id) return
    updateOrganization(id, {
      name: crypto.randomUUID(),
      description: crypto.randomUUID(),
    }).then(() => {
      fetchOrganization(id)
    })
  }

  const handleActivateOrganization = (id: string) => {
    activateOrganization(id)
  }

  return (
    <>
      <Button onClick={handleCreateOrganization}>Create Organization</Button>
      <Button onClick={handleUpdateOrganization}>Update Organization</Button>
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
            <Button onClick={() => handleActivateOrganization(organization.id)}>
              Activate
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  )
}
