import { NextResponse, type NextRequest } from 'next/server'
import FileManager from '@/utils/FileManager'
import { ErrorType } from '@/constant/errors'
import { isUndefined } from 'lodash-es'

const geminiApiKey = process.env.GEMINI_API_KEY as string
const geminiApiBaseUrl = process.env.GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com'
const mode = process.env.NEXT_PUBLIC_BUILD_MODE

export const runtime = 'edge'
export const preferredRegion = ['cle1', 'iad1', 'pdx1', 'sfo1', 'sin1', 'syd1', 'hnd1', 'kix1']

export async function GET(req: NextRequest) {
  if (mode === 'export') return new NextResponse('Not available under static deployment')

  const id = req.url.split('/').pop()

  if (isUndefined(id)) {
    return NextResponse.json({ code: 40001, message: ErrorType.MissingParam }, { status: 400 })
  }

  const fileManager = new FileManager({
    apiKey: geminiApiKey,
    baseUrl: geminiApiBaseUrl,
  })
  const result = await fileManager.getFileMetadata(id)
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  req.nextUrl.searchParams.append('key', geminiApiKey)
  const blob = await req.blob()
  const response = await fetch(`${geminiApiBaseUrl}/upload/v1beta/files?${req.nextUrl.searchParams.toString()}`, {
    method: 'POST',
    body: blob,
  })
  return new NextResponse(response.body)
}

export async function PUT(req: NextRequest) {
  req.nextUrl.searchParams.append('key', geminiApiKey)
  const blob = await req.blob()
  const response = await fetch(`${geminiApiBaseUrl}/upload/v1beta/files?${req.nextUrl.searchParams.toString()}`, {
    method: 'PUT',
    body: blob,
  })
  return new NextResponse(response.body)
}
