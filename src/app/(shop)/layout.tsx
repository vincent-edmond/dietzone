import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { AssistantLauncher } from '@/components/assistant/AssistantLauncher'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <AssistantLauncher />
    </>
  )
}
