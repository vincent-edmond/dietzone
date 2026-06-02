'use client'

/** Ouvre l'assistant IA flottant (écouté par AssistantLauncher via un évènement global). */
export function OpenAssistantButton({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('dz:assistant-open'))}
      className={className}
    >
      {children}
    </button>
  )
}
