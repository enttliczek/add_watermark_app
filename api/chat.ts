import type { VercelRequest, VercelResponse } from '@vercel/node'

// Simple in-memory rate limiter (per-IP, max 30 req/min)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 30) return false
  entry.count++
  return true
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of rateLimitMap.entries()) {
    if (now > val.resetAt) rateLimitMap.delete(key)
  }
}, 300_000)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
    req.socket?.remoteAddress ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Za dużo zapytań. Poczekaj chwilę.' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Brak konfiguracji API' })
  }

  const { messages, profileContext } = req.body as {
    messages: { role: string; content: string }[]
    profileContext: string
  }

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Nieprawidłowe dane' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 512,
        system: profileContext,
        messages: messages.map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: String(m.content).slice(0, 2000),
        })),
      }),
    })

    if (!response.ok) {
      const errBody = await response.text()
      // Log status only, never log the API key or message contents
      console.error('Anthropic API error status:', response.status)
      return res.status(502).json({ error: 'Błąd API AI' })
    }

    const data = await response.json()
    const content = data.content?.[0]?.text ?? ''

    return res.status(200).json({ content })
  } catch (err) {
    console.error('Chat handler error:', (err as Error).message)
    return res.status(500).json({ error: 'Błąd serwera' })
  }
}
