"use client"

import { useProject } from "@/lib/project/context"
import { useUser } from "@/lib/user/context"

export default function Page() {
  const { user } = useUser()
  const { projects, project } = useProject()

  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(projects, null, 2)}</pre>
      <pre>{JSON.stringify(project, null, 2)}</pre>
    </>
  )
}
