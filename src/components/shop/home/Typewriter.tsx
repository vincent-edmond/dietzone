'use client'

import { useState, useEffect } from 'react'

/** Effet machine à écrire : tape un mot, marque une pause, l'efface, passe au suivant. */
export function Typewriter({
  words,
  wordClassName,
}: {
  words: string[]
  wordClassName?: string
}) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(words[0] ?? '')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (words.length < 2) return
    const current = words[index % words.length]

    let delay = deleting ? 45 : 95
    if (!deleting && text === current) delay = 1700 // pause sur le mot complet
    else if (deleting && text === '') delay = 350 // courte pause avant le suivant

    const t = setTimeout(() => {
      if (!deleting && text === current) {
        setDeleting(true)
      } else if (deleting && text === '') {
        setDeleting(false)
        setIndex((i) => (i + 1) % words.length)
      } else {
        setText(
          deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1),
        )
      }
    }, delay)
    return () => clearTimeout(t)
  }, [text, deleting, index, words])

  return (
    <span className="inline-flex items-baseline">
      <span className={wordClassName}>{text}</span>
      <span
        aria-hidden
        className="dz-caret ml-1.5 inline-block h-[0.82em] w-[0.07em] min-w-[3px] translate-y-[0.06em] rounded-sm bg-primary"
      />
    </span>
  )
}
