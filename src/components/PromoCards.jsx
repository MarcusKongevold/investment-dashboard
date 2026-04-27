import React from 'react'
import ArrowRight from '@dnb/eufemia/icons/dnb/arrow_right'

const CARDS = [
  {
    label: 'Oppdag populære aksjer',
    gradient: 'linear-gradient(135deg, #007272 0%, #00b0b9 100%)',
    view: 'popular-stocks',
  },
  {
    label: 'Oppdag populære fond',
    gradient: 'linear-gradient(135deg, #1a3a5c 0%, #007272 100%)',
    view: 'popular-funds',
  },
]

export default function PromoCards({ onNavigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-small)' }}>
      {CARDS.map(({ label, gradient, view }) => (
        <div
          key={label}
          className="promo-card"
          style={{ background: gradient, cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onClick={() => onNavigate?.(view)}
          onKeyDown={e => e.key === 'Enter' && onNavigate?.(view)}
        >
          <div className="promo-card__overlay">
            <span className="promo-card__label">{label}</span>
            <ArrowRight size="default" style={{ color: 'var(--color-white)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
