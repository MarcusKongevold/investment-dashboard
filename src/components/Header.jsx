import React from 'react'
import { Logo } from '@dnb/eufemia'
import HeaderSearch from './HeaderSearch.jsx'

export default function Header({ onStockClick }) {
  return (
    <header className="page-header" style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-black-8)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1510px', margin: '0 auto', padding: '0 var(--spacing-large)', height: '4.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo height="3rem" />
          <div style={{ width: '1px', height: '3rem', background: 'var(--color-black-20)' }} />
          <span style={{
            fontFamily: "var(--font-family-heading, 'DNB', sans-serif)",
            fontSize: '2.125rem',
            fontWeight: '300',
            color: 'var(--color-black)',
            lineHeight: '2.5rem',
            whiteSpace: 'nowrap',
            paddingLeft: '4px',
          }}>
            Investor
          </span>
        </div>

        {/* Search + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-medium)' }}>
          <HeaderSearch onStockClick={onStockClick} />
          <button className="avatar-btn" aria-label="Brukermeny">
            <div className="avatar">
              MH
              <span className="avatar__badge">1</span>
            </div>
            <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-black-55)' }}>Meg</span>
          </button>
        </div>
      </div>
    </header>
  )
}
