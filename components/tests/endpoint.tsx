"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEndpoint } from "@/lib/endpoint/context"

export default function EndpointTest() {
  const { endpoints, createEndpoint, updateEndpoint, fetchEndpoint } =
    useEndpoint()

  const handleCreateEndpoint = () => {
    createEndpoint({
      name: crypto.randomUUID(),
      baseUri: "https://api.example.com",
      path: "/api/v1",
      method: ["GET", "POST", "PUT", "DELETE"][Math.floor(Math.random() * 4)],
      timeout: 1000,
    })
  }

  const handleUpdateEndpoint = () => {
    const endpoint =
      endpoints.members[Math.floor(Math.random() * endpoints.members.length)]

    if (!endpoint) return
    updateEndpoint(endpoint.id, {
      name: crypto.randomUUID(),
      baseUri: endpoint.baseUri,
      path: endpoint.path,
      method: endpoint.method,
      timeout: endpoint.timeout,
    }).then(() => {
      fetchEndpoint(endpoint.id)
    })
  }

  return (
    <>
      <Button onClick={handleCreateEndpoint}>Create Endpoint</Button>
      <Button onClick={handleUpdateEndpoint}>Update Endpoint</Button>
      {endpoints.members.map((endpoint) => (
        <Card key={endpoint.id} className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              id: {endpoint.id}
              <br />
              name: {endpoint.name}
              <br />
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
    </>
  )
}
