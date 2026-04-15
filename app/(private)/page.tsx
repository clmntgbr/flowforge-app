"use client"

import { Button } from "@/components/ui/button"
import { useProject } from "@/lib/project/context"
import { Project } from "@/lib/project/types"
import { useUser } from "@/lib/user/context"
import { useEffect, useState } from "react"

export default function Page() {
  const { user } = useUser()
  const { projects, activeProject, fetchProject, createProject } = useProject()

  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    if (activeProject) {
      fetchProject(activeProject.id).then((project) => {
        setProject(project)
      })
    }
  }, [fetchProject, activeProject])

  const handleCreateProject = () => {
    createProject({ name: crypto.randomUUID() })
  }

  return (
    <>
      <Button onClick={handleCreateProject}>Create Project</Button>
      <h1>User</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <h1>Projects</h1>
      <pre>{JSON.stringify(projects, null, 2)}</pre>
      <h1>Active Project</h1>
      <pre>{JSON.stringify(activeProject, null, 2)}</pre>
      <h1>Get Project by ID</h1>
      <pre>{JSON.stringify(project, null, 2)}</pre>
    </>
  )
}
