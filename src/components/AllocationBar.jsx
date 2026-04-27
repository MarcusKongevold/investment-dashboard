import React from 'react'
import { Card } from '@dnb/eufemia'

const SEGMENTS = [
  { label: 'Aksjer',    pct: 35, color: 'var(--color-ocean-green)' },
  { label: 'Fond',      pct: 30, color: 'var(--color-sea-green)' },
  { label: 'Aksje',     pct: 20, color: 'var(--color-summer-green)' },
  { label: 'Kontanter', pct: 15, color: 'var(--color-mint-green)' },
]

export default function AllocationBar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-x-small)' }}>
      <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: 0 }}>Fordeling</p>
      <Card stack>

      <div className="allocation-legend">
        {SEGMENTS.map(({ label, pct, color }) => (
          <div key={label} className="allocation-legend__item">
            <span className="allocation-legend__dot" style={{ background: color }} />
            {label} {pct}%
          </div>
        ))}
      </div>

      <div className="allocation-bar">
        {SEGMENTS.map(({ label, pct, color }) => (
          <div
            key={label}
            className="allocation-bar__segment"
            style={{ width: `${pct}%`, background: color }}
            title={`${label}: ${pct}%`}
          />
        ))}
      </div>
      </Card>
    </div>
  )
}
