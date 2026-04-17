"use client"

import EndpointTest from "@/components/tests/endpoint"
import OrganizationTest from "@/components/tests/organization"
import WorkflowTest from "@/components/tests/workflow"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/lib/user/context"

export default function Page() {
  const { user } = useUser()

  return (
    <>
      <h1>User</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <Tabs defaultValue="organizations" className="w-full">
        <TabsList>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
        </TabsList>
        <TabsContent value="organizations">
          <OrganizationTest />
        </TabsContent>
        <TabsContent value="endpoints">
          <EndpointTest />
        </TabsContent>
        <TabsContent value="workflows">
          <WorkflowTest />
        </TabsContent>
      </Tabs>
    </>
  )
}
