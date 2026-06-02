import { HelloBar } from './HelloBar'
import { Header } from './Header'
import { Footer } from './Footer'
import { AssistantLauncher } from '@/components/assistant/AssistantLauncher'
import { getCurrentUser } from '@/features/account/auth'

/** Habillage global du site : hello bar + header + footer + assistant.
 *  Utilisé par toutes les zones publiques (boutique, compte, pro). */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  const navUser = user ? { role: user.role, email: user.email } : null
  return (
    <>
      <HelloBar />
      <Header user={navUser} />
      <div className="min-h-[60vh]">{children}</div>
      <Footer />
      <AssistantLauncher />
    </>
  )
}
