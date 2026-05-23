import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useActiveProfile } from '../store/profileStore'
import { db } from '../db/database'
import { useSpeech, useSpeechRecognition } from '../hooks/useSpeech'
import { Button } from '../components/ui/Button'
import type { ChatMessage } from '../types'

export function ChatPage() {
  const profile = useActiveProfile()
  const { speak } = useSpeech()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isChild = profile?.type === 'child'

  useEffect(() => {
    if (!profile) return
    db.chatMessages
      .where('profileId').equals(profile.id)
      .reverse()
      .limit(20)
      .toArray()
      .then((msgs) => setMessages(msgs.reverse()))
  }, [profile?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const { start: startRec, stop: stopRec, isSupported } = useSpeechRecognition(
    (text) => {
      setInput(text)
      setListening(false)
    },
    () => setListening(false)
  )

  const send = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || !profile) return
    setInput('')

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      profileId: profile.id,
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages((m) => [...m, userMsg])
    await db.chatMessages.add(userMsg)

    setLoading(true)
    try {
      const history = [...messages.slice(-8), userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const profileContext = isChild
        ? `To jest Amelka, 6-letnia dziewczynka ucząca się hiszpańskiego. Jesteś Lolą - przyjazną lamą.
           Odpowiadaj BARDZO krótko (1-2 zdania), po polsku z pojedynczymi słówkami hiszpańskimi.
           Baw się i zachęcaj. Używaj dużo emoji.`
        : `To jest ${profile.name}, dorosły (poziom ${profile.level}) uczący się hiszpańskiego.
           Jesteś asystentem językowym. Rozmawiaj po polsku i hiszpańsku mieszając języki.
           Poprawiaj błędy delikatnie. Podawaj przykłady.`

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, profileContext }),
      })

      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      const aiContent = data.content

      const aiMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        profileId: profile.id,
        role: 'assistant',
        content: aiContent,
        timestamp: Date.now(),
      }
      setMessages((m) => [...m, aiMsg])
      await db.chatMessages.add(aiMsg)

      if (isChild || profile.speechRate > 0) {
        speak(aiContent, 'pl-PL')
      }
    } catch {
      const errMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        profileId: profile.id,
        role: 'assistant',
        content: isChild ? '🦙 Lola chwilowo śpi... spróbuj za chwilę!' : 'Przepraszam, wystąpił błąd. Sprawdź połączenie.',
        timestamp: Date.now(),
      }
      setMessages((m) => [...m, errMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleMic = () => {
    if (listening) {
      stopRec()
      setListening(false)
    } else {
      const ok = startRec('es-ES')
      if (ok) setListening(true)
    }
  }

  if (!profile) return null

  const kidPrompts = [
    '¡Hola, Lola! 👋',
    'Como se dice "pies"? 🐾',
    '¿Qué come el perro? 🐶',
    'Dime un animal 🦒',
  ]

  return (
    <div className="flex flex-col min-h-screen pb-24 pt-16">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-lg mx-auto w-full">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <div className="text-6xl mb-3">{isChild ? '🦙' : '💬'}</div>
            <p className="text-gray-500">
              {isChild ? 'Lola czeka na Ciebie! Powiedz coś po hiszpańsku 🌟' : 'Rozpocznij rozmowę po hiszpańsku!'}
            </p>
            {isChild && (
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {kidPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="bg-pink-100 text-pink-700 rounded-full px-4 py-2 text-sm font-medium hover:bg-pink-200 transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <span className="text-2xl mr-2 self-end">{isChild ? '🦙' : '🤖'}</span>
              )}
              <div
                className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow'
                } ${isChild ? 'text-base' : ''}`}
                style={msg.role === 'user' ? { backgroundColor: profile.color } : {}}
              >
                {msg.content}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => speak(msg.content)}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition"
                  >
                    🔊
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <span className="text-2xl mr-2">{isChild ? '🦙' : '🤖'}</span>
            <div className="bg-white dark:bg-gray-800 rounded-3xl px-4 py-3 shadow flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex gap-2 max-w-lg mx-auto">
          {!isChild && (
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Napisz po hiszpańsku..."
              className="flex-1 rounded-2xl border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-gray-800 dark:text-white"
            />
          )}
          {isSupported && (
            <Button
              onClick={handleMic}
              variant="kid"
              color={listening ? '#EF4444' : profile.color}
              size={isChild ? 'xl' : 'md'}
              className={isChild ? 'flex-1' : ''}
            >
              {listening ? '⏹ Stop' : isChild ? '🎤 Mów!' : '🎤'}
            </Button>
          )}
          {!isChild && (
            <Button onClick={() => send()} variant="primary" size="md" disabled={!input.trim() || loading}>
              ➤
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
