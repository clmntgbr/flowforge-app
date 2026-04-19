import { createAuthHeaders } from "@/lib/create-auth-headers"
import { requireAuth } from "@/lib/require-auth"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth()
    if ("error" in auth) return auth.error

    const { id } = await params
    const payload = await request.json()

    const response = await fetch(
      `${BACKEND_API_URL}/api/workflows/${id}/steps`,
      {
        method: "PUT",
        headers: createAuthHeaders(auth.token),
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { success: false, data: await response.json() },
        { status: response.status }
      )
    }

    return NextResponse.json(await response.json())
  } catch {
    return NextResponse.json({ success: false, data: null }, { status: 500 })
  }
}
