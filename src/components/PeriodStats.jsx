import React from 'react'
import { Card } from '@dnb/eufemia'

export const PERIOD_STATS = [
  { label: '1 dag',       change:  0.8, amount:   640 },
  { label: '7 dager',     change:  1.5, amount:  1200 },
  { label: '30 dager',    change:  3.2, amount:  2560 },
  { label: '3 måneder',   change:  5.1, amount:  4080 },
  { label: '6 måneder',   change: -2.4, amount: -1920 },
  { label: 'Hittil i år', change:  6.3, amount:  5040 },
  { label: '1 år',        change:  8.7, amount:  6960 },
  { label: '3 år',        change: 21.3, amount: 17040 },
  { label: '5 år',        change: 34.6, amount: 27680 },
  { label: 'Siden start', change: 42.1, amount: 33680 },
]

export default function PeriodStats() {
  return (
    <Card stack>
      <div style={{ overflowX: 'auto', margin: 'calc(-1 * var(--spacing-medium))' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(120px, 1fr))' }}>
        {PERIOD_STATS.map(({ label, change, amount }, i) => {
          const positive = change >= 0
          const isLastInRow = (i + 1) % 5 === 0
          const isBottomRow = i >= 5
          return (
            <div
              key={label}
              style={{
                padding: 'var(--spacing-medium)',
                borderRight: !isLastInRow ? '1px solid var(--color-black-8)' : 'none',
                borderBottom: !isBottomRow ? '1px solid var(--color-black-8)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ fontSize: 'var(--font-size-x-small)', color: 'var(--color-black-55)', marginBottom: '0.25rem' }}>{label}</div>
              <div className={`change-badge change-badge--${positive ? 'positive' : 'negative'}`} style={{ fontSize: 'var(--font-size-x-small)', padding: '1px 6px' }}>
                {positive ? '+' : ''}{change}%
              </div>
            </div>
          )
        })}
      </div>
      </div>
    </Card>
  )
}
