'use client'

import { useState, useTransition } from 'react'
import { setProActive, type ProPartnerRow as Partner } from '@/features/admin/proApplications'

export function ProPartnerRow({ partner }: { partner: Partner }) {
  const [active, setActive] = useState(partner.active)
  const [pending, start] = useTransition()

  function toggle() {
    const next = !active
    setActive(next)
    start(() => setProActive(partner.userId, next))
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 p-4">
      <div className="min-w-0 text-sm">
        <p className="font-semibold text-neutral-900">{partner.company ?? partner.fullName ?? partner.email}</p>
        <p className="text-neutral-500">
          {partner.fullName && <span>{partner.fullName} · </span>}
          {partner.email}
          {partner.phone && (
            <>
              {' · '}
              <a href={`tel:${partner.phone}`} className="text-primary hover:underline">
                {partner.phone}
              </a>
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={active}
          onClick={toggle}
          disabled={pending}
          title={active ? 'Tarifs PRO actifs, cliquer pour désactiver' : 'PRO désactivé, cliquer pour réactiver'}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 ${
            active ? 'bg-green-500' : 'bg-neutral-300'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              active ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className={`w-14 text-xs font-semibold ${active ? 'text-green-600' : 'text-neutral-400'}`}>
          {active ? 'Actif' : 'Désactivé'}
        </span>
      </div>
    </li>
  )
}
