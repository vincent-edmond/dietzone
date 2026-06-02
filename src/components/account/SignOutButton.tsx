'use client'

import { signOut } from '@/features/account/actions'
import { Button } from '@/components/ui/button'

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="outline" size="sm">
        Se déconnecter
      </Button>
    </form>
  )
}
