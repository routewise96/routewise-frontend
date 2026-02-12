"use client"

import { useState, useCallback, useEffect, useRef } from "react"

interface SpeechRecognitionInstance {
  start: () => void
  stop: () => void
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: { resultIndex: number; results: { length: number; [i: number]: { isFinal: boolean; [0]: { transcript: string } } } }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
}

export interface UseAIVoiceInputResult {
  isListening: boolean
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  transcript: string
  error: string | null
}

export function useAIVoiceInput(onResult?: (text: string) => void): UseAIVoiceInputResult {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  const isSupported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        // ignore
      }
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("errorVoiceNotSupported")
      return
    }
    setError(null)
    setTranscript("")
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = document.documentElement.lang === "en" ? "en-US" : "ru-RU"
    recognition.onresult = (event: { resultIndex: number; results: { length: number; [i: number]: { isFinal: boolean; [0]: { transcript: string } } } }) => {
      let final = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i]
        if (r && r[0]) final += r[0].transcript
      }
      if (event.results[event.resultIndex]?.isFinal) {
        setTranscript((prev) => (prev + final).trim())
        onResult?.((transcript + final).trim())
      }
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [isSupported, onResult, transcript])

  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [stopListening])

  return {
    isListening,
    isSupported: !!isSupported,
    startListening,
    stopListening,
    transcript,
    error,
  }
}
