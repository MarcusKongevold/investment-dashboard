import React, { useState, useMemo } from 'react'
import { Dialog, Button, Input, P, List } from '@dnb/eufemia'
import Loupe from '@dnb/eufemia/icons/dnb/loupe'

const STOCK_DATABASE = [
  { name: 'Equinor',               ticker: 'EQNR',  price: 284.60, change:  2.10 },
  { name: 'DNB Bank',              ticker: 'DNB',   price: 231.40, change:  1.63 },
  { name: 'SalMar',                ticker: 'SALM',  price: 612.00, change: -0.84 },
  { name: 'Telenor',               ticker: 'TEL',   price: 128.20, change:  0.47 },
  { name: 'Norsk Hydro',           ticker: 'NHY',   price:  67.38, change: -1.12 },
  { name: 'Orkla',                 ticker: 'ORK',   price:  98.56, change:  0.92 },
  { name: 'Mowi',                  ticker: 'MOWI',  price: 185.40, change:  1.25 },
  { name: 'Yara International',    ticker: 'YAR',   price: 312.60, change: -0.55 },
  { name: 'Aker BP',               ticker: 'AKRBP', price: 298.80, change:  3.10 },
  { name: 'Kongsberg Gruppen',     ticker: 'KOG',   price: 892.00, change:  4.20 },
  { name: 'Schibsted',             ticker: 'SCHB',  price: 218.50, change: -1.30 },
  { name: 'Gjensidige Forsikring', ticker: 'GJF',   price: 184.20, change:  0.65 },
  { name: 'Storebrand',            ticker: 'STB',   price:  96.40, change:  0.30 },
  { name: 'Aker',                  ticker: 'AKER',  price: 512.00, change: -0.90 },
  { name: 'Tomra Systems',         ticker: 'TOM',   price: 124.80, change:  1.80 },
  { name: 'Apple',                 ticker: 'AAPL',  price: 189.30, change:  0.95 },
  { name: 'Microsoft',             ticker: 'MSFT',  price: 415.20, change:  1.10 },
  { name: 'NVIDIA',                ticker: 'NVDA',  price: 875.40, change:  3.40 },
  { name: 'Amazon',                ticker: 'AMZN',  price: 182.60, change: -0.45 },
  { name: 'Alphabet',              ticker: 'GOOGL', price: 171.90, change:  0.75 },
]

const SUGGESTIONS = ['DNB', 'Telenor', 'Equinor']

export default function HeaderSearch({ onStockClick }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  React.useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return STOCK_DATABASE.filter(
      s => s.name.toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q)
    )
  }, [query])

  function handleClose() {
    setOpen(false)
    setQuery('')
  }

  return (
    <>
      <button
        aria-label="Søk"
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'var(--color-black-3)', border: '1px solid var(--color-black-8)',
          borderRadius: '9999px', padding: '6px 16px 6px 12px',
          cursor: 'pointer', color: 'var(--color-black-55)',
          fontSize: 'var(--font-size-small)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Søk etter aksjer…
        <span style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--color-black-35)', background: 'var(--color-black-8)', borderRadius: '4px', padding: '1px 5px', letterSpacing: '0.02em' }}>⌘K</span>
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="52rem"
        title="Søk etter aksjer"
        triggerAttributes={{ hidden: true }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-small)' }}>
          <Input
            autoFocus
            stretch
            size="large"
            icon={Loupe}
            placeholder="Søk etter aksjer"
            value={query}
            onChange={({ value }) => setQuery(value)}
            clear={true}
          />

          <div style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {query === '' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-small)', padding: 'var(--spacing-large)', flex: 1 }}>
                <P style={{ color: 'var(--color-black-55)' }}>Prøv å søke etter disse forslagene:</P>
                <div style={{ display: 'flex', gap: 'var(--spacing-small)', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {SUGGESTIONS.map(s => (
                    <Button key={s} variant="secondary" size="default" onClick={() => setQuery(s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            ) : results.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-large)', flex: 1 }}>
                <P style={{ color: 'var(--color-black-55)' }}>Ingen resultater for «{query}»</P>
              </div>
            ) : (
              <List.Container style={{ width: '100%' }}>
                {results.map(stock => {
                  const positive = stock.change >= 0
                  return (
                    <List.Item.Basic key={stock.ticker} style={{ cursor: 'pointer' }} onClick={() => { onStockClick?.(stock); handleClose() }}>
                      <List.Cell.Title>
                        {stock.name}
                        <List.Cell.Title.Subline variant="description">{stock.ticker}</List.Cell.Title.Subline>
                      </List.Cell.Title>
                      <List.Cell.End>
                        <span className={`change-badge change-badge--${positive ? 'positive' : 'negative'}`}>
                          {positive ? '+' : ''}{stock.change}%
                        </span>
                      </List.Cell.End>
                    </List.Item.Basic>
                  )
                })}
              </List.Container>
            )}
          </div>
        </div>
      </Dialog>
    </>
  )
}
