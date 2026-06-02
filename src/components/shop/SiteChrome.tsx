import { HelloBar } from './HelloBar'
import { Header } from './Header'
import { Footer } from './Footer'
import { AssistantLauncher } from '@/components/assistant/AssistantLauncher'

/** Habillage global du site : hello bar + header + footer + assistant.
 *  Utilisé par toutes les zones publiques (boutique, compte, pro). */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HelloBar />
      <Header />
      <div className="min-h-[60vh]">{children}</div>
      <Footer />
      <AssistantLauncher />
    </>
  )
}
