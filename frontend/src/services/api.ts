export interface SlideCode {
  html: string
  css: string
}

const API_BASE = 'http://localhost:4000'

/**
 * Sends the current slide code + a natural-language prompt to the backend.
 * Returns the updated { html, css } from OpenAI.
 */
export async function transformSlide(
  prompt: string,
  html: string,
  css: string,
): Promise<SlideCode> {
  const res = await fetch(`${API_BASE}/api/transform-slide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, css, prompt }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error || `Server error (${res.status})`)
  }

  return res.json() as Promise<SlideCode>
}
