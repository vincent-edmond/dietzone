import { SiteChrome } from '@/components/shop/SiteChrome'

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>
}
