export const GetMethodColor = (method: string) => {
  const colors: Record<string, string> = {
    GET: "bg-blue-100 text-blue-700 border-blue-700/20 border",
    POST: "bg-green-100 text-green-700 border-green-700/20 border",
    PUT: "bg-amber-100 text-amber-700 border-amber-700/20 border",
    DELETE: "bg-red-100 text-red-700 border-red-700/20 border",
    PATCH: "bg-purple-100 text-purple-700 border-purple-700/20 border",
    HEAD: "bg-blue-100 text-blue-700 border-blue-700/20 border",
    OPTIONS: "bg-purple-100 text-purple-700 border-purple-700/20 border",
  }
  return colors[method] || "bg-gray-200 text-gray-800 border-gray-800/20 border"
}

export const GetMethodCardColor = (method: string) => {
  const colors: Record<string, string> = {
    GET: "bg-blue-100 border-blue-700/20 border-2 ring-blue-700/20 ring-1",
    POST: "bg-green-50 border-green-700/20 border-2 ring-green-700/20 ring-1",
    PUT: "bg-amber-50 border-amber-700/20 border-2 ring-amber-700/20 ring-1",
    DELETE: "bg-red-50 border-red-700/20 border-2 ring-red-700/20 ring-1",
    PATCH:
      "bg-purple-50 border-purple-700/20 border-2 ring-purple-700/20 ring-1",
    HEAD: "bg-blue-50 border-blue-700/20 border-2 ring-blue-700/20 ring-1",
    OPTIONS:
      "bg-purple-50 border-purple-700/20 border-2 ring-purple-700/20 ring-1",
  }
  return (
    colors[method] ||
    "bg-gray-200/20 border-gray-800/10 border-2 ring-gray-800/10 ring-1"
  )
}

export const GetMethodCodeColor = (method: string) => {
  const colors: Record<string, string> = {
    GET: "bg-blue-100 text-blue-700",
    POST: "bg-green-100 text-green-700",
    PUT: "bg-amber-100 text-amber-700",
    DELETE: "bg-red-100 text-red-700",
    PATCH: "bg-purple-100 text-purple-700",
    HEAD: "bg-blue-100 text-blue-700",
    OPTIONS: "bg-purple-100 text-purple-700",
  }
  return colors[method] || "bg-gray-100 text-gray-800"
}
