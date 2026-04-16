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
import { useProject } from "@/lib/project/context"
import { useUser } from "@/lib/user/context"

export default function Page() {
  const { user } = useUser()
  const { projects, createProject, updateProject, activateProject } =
    useProject()

  const handleCreateProject = () => {
    createProject({ name: crypto.randomUUID() })
  }

  const handleUpdateProject = () => {
    const id = projects[Math.floor(Math.random() * projects.length)]?.id
    if (!id) return
    updateProject(id, {
      name: crypto.randomUUID(),
      description: crypto.randomUUID(),
    })
  }

  const handleActivateProject = (id: string) => {
    activateProject(id)
  }

  return (
    <>
      <Button onClick={handleCreateProject}>Create Project</Button>
      <Button onClick={handleUpdateProject}>Update Project</Button>
      <h1>User</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <h1>Projects</h1>
      {projects.map((project) => (
        <Card key={project.id} className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              title: {project.name}
            </CardTitle>
            <CardDescription>
              description: {project.description}
            </CardDescription>
            <CardContent>
              <Badge>{project.isActive ? "Active" : "Inactive"}</Badge>
            </CardContent>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => handleActivateProject(project.id)}>
              Activate
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  )
}
