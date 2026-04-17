import { createAuthHeaders } from "@/lib/create-auth-headers"
import { requireAuth } from "@/lib/require-auth"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export async function GET() {
  try {
    const auth = await requireAuth()
    if ("error" in auth) return auth.error

    const response = await fetch(`${BACKEND_API_URL}/api/endpoints`, {
      method: "GET",
      headers: createAuthHeaders(auth.token),
    })

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status })
    }

    return NextResponse.json(await response.json())
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth()
    if ("error" in auth) return auth.error

    const payload = await request.json()

    const response = await fetch(`${BACKEND_API_URL}/api/endpoints`, {
      method: "POST",
      headers: createAuthHeaders(auth.token),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status })
    }

    await response.json()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
