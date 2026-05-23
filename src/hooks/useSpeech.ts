import { useCallback, useRef } from 'react'
import { useActiveProfile } from '../store/profileStore'

export function useSpeech() {
  const profile = useActiveProfile()
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback(
    (text: string, lang = 'es-ES') => {
      if (!('speechSynthesis' in window)) return
      window.speechSynthesis.cancel()

      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = lang
      utter.rate = profile?.speechRate ?? 0.85

      const voices = window.speechSynthesis.getVoices()
      const spanishVoice =
        voices.find((v) => v.lang.startsWith('es') && v.name.includes('Google')) ||
        voices.find((v) => v.lang === 'es-ES') ||
        voices.find((v) => v.lang.startsWith('es'))
      if (spanishVoice) utter.voice = spanishVoice

      utteranceRef.current = utter
      window.speechSynthesis.speak(utter)
    },
    [profile?.speechRate]
  )

  const speakPl = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'pl-PL'
      utter.rate = 0.9
      window.speechSynthesis.speak(utter)
    },
    []
  )

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
  }, [])

  return { speak, speakPl, stop }
}

export function useSpeechRecognition(onResult: (text: string) => void, onEnd?: () => void) {
  const recognitionRef = useRef<any>(null)

  const start = useCallback(
    (lang = 'es-ES') => {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SR) return false

      const rec = new SR()
      rec.lang = lang
      rec.continuous = false
      rec.interimResults = false

      rec.onresult = (e: any) => {
        const text = e.results[0]?.[0]?.transcript ?? ''
        onResult(text)
      }
      rec.onend = () => onEnd?.()

      recognitionRef.current = rec
      rec.start()
      return true
    },
    [onResult, onEnd]
  )

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const isSupported =
    typeof window !== 'undefined' &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)

  return { start, stop, isSupported }
}
