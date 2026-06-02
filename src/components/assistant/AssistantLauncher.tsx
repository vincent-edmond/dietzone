'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

const GREETING: Msg = {
  role: 'assistant',
  content:
    "Bonjour ! Je suis l'assistant DietZone. Dites-moi votre objectif (prise de masse, sèche, énergie, santé) et je vous conseille un produit disponible en stock.",
}

export function AssistantLauncher() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, open])

  // Ouverture depuis d'autres endroits du site (ex. CTA « Besoin d'un conseil ? »).
  useEffect(() => {
    const openHandler = () => setOpen(true)
    window.addEventListener('dz:assistant-open', openHandler)
    return () => window.removeEventListener('dz:assistant-open', openHandler)
  }, [])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    const next = [...messages, { role: 'user' as const, content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const firstUser = next.findIndex((m) => m.role === 'user')
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(firstUser) }),
      })
      const data = (await res.json()) as { reply: string }
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'Erreur de connexion. Réessayez.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant DietZone"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:opacity-90"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl">
          <div className="bg-[#0A2540] px-4 py-3 text-white">
            <p className="text-sm font-semibold">Assistant DietZone</p>
            <p className="text-xs text-white/70">Conseils produits &amp; disponibilités</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  m.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-neutral-100 text-neutral-800'
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-lg bg-neutral-100 px-3 py-2 text-sm text-neutral-400">
                …
              </div>
            )}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-neutral-200 p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre question…"
              aria-label="Votre message"
              className="min-h-11 flex-1 rounded-md border border-neutral-300 px-3 text-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Envoyer"
              className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-40"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
