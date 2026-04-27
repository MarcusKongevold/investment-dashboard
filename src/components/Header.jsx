import React from 'react'
import HeaderSearch from './HeaderSearch.jsx'

export default function Header({ onStockClick }) {
  return (
    <header className="page-header" style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-black-8)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1510px', margin: '0 auto', padding: '0 var(--spacing-large)', height: '4.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-small)' }}>
          <svg width="70" height="48" viewBox="0 0 70 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="70" height="48" rx="4" fill="#007272" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">DNB</text>
          </svg>
          <div style={{ width: '1px', height: '3rem', background: 'var(--color-black-20)' }} />
          <span style={{ fontSize: 'var(--font-size-medium)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-black)', paddingLeft: 'var(--spacing-x-small)' }}>
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
