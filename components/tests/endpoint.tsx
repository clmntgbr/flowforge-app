"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { useEndpoint } from "@/lib/endpoint/context"
import { Endpoint } from "@/lib/endpoint/types"

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

  const handleUpdateEndpoint = (endpointId: string) => {
    fetchEndpoint(endpointId).then((endpoint: Endpoint) => {
      console.log(endpoint)
      console.log({
        name: crypto.randomUUID(),
        baseUri: endpoint.baseUri,
        path: endpoint.path,
        method: endpoint.method,
        timeout: endpoint.timeout,
      })
      updateEndpoint(endpointId, {
        name: crypto.randomUUID(),
        baseUri: endpoint.baseUri,
        path: endpoint.path,
        method: endpoint.method,
        timeout: endpoint.timeout,
      })
    })
  }

  return (
    <>
      <Button onClick={handleCreateEndpoint}>Create Endpoint</Button>
      {endpoints.members.map((endpoint) => (
        <Card key={endpoint.id} className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              id: {endpoint.id}
              <br />
              name: {endpoint.name}
              <br />
            </CardTitle>
            <Button onClick={() => handleUpdateEndpoint(endpoint.id)}>
              Update Endpoint
            </Button>
          </CardHeader>
        </Card>
      ))}
    </>
  )
}
