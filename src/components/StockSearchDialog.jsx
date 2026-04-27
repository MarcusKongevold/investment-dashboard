import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Dialog, Button, Input, P, List, Checkbox } from '@dnb/eufemia'
import Loupe from '@dnb/eufemia/icons/dnb/loupe'

const STOCK_DATABASE = [
  { name: 'Equinor',              ticker: 'EQNR',  price: 284.60, change:  2.10 },
  { name: 'DNB Bank',             ticker: 'DNB',   price: 231.40, change:  1.63 },
  { name: 'SalMar',               ticker: 'SALM',  price: 612.00, change: -0.84 },
  { name: 'Telenor',              ticker: 'TEL',   price: 128.20, change:  0.47 },
  { name: 'Norsk Hydro',          ticker: 'NHY',   price:  67.38, change: -1.12 },
  { name: 'Orkla',                ticker: 'ORK',   price:  98.56, change:  0.92 },
  { name: 'Mowi',                 ticker: 'MOWI',  price: 185.40, change:  1.25 },
  { name: 'Yara International',   ticker: 'YAR',   price: 312.60, change: -0.55 },
  { name: 'Aker BP',              ticker: 'AKRBP', price: 298.80, change:  3.10 },
  { name: 'Kongsberg Gruppen',    ticker: 'KOG',   price: 892.00, change:  4.20 },
  { name: 'Schibsted',            ticker: 'SCHB',  price: 218.50, change: -1.30 },
  { name: 'Gjensidige Forsikring',ticker: 'GJF',   price: 184.20, change:  0.65 },
  { name: 'Storebrand',           ticker: 'STB',   price:  96.40, change:  0.30 },
  { name: 'Aker',                 ticker: 'AKER',  price: 512.00, change: -0.90 },
  { name: 'Tomra Systems',        ticker: 'TOM',   price: 124.80, change:  1.80 },
  { name: 'Apple',                ticker: 'AAPL',  price: 189.30, change:  0.95 },
  { name: 'Microsoft',            ticker: 'MSFT',  price: 415.20, change:  1.10 },
  { name: 'NVIDIA',               ticker: 'NVDA',  price: 875.40, change:  3.40 },
  { name: 'Amazon',               ticker: 'AMZN',  price: 182.60, change: -0.45 },
  { name: 'Alphabet',             ticker: 'GOOGL', price: 171.90, change:  0.75 },
]

const SUGGESTIONS = ['DNB', 'Telenor', 'Equinor']

export default function StockSearchDialog({ open, onClose, lists = [], listItems = {}, onSetListItems }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  function handleOpen() {
    let attempts = 0
    const interval = setInterval(() => {
      const el = inputRef.current?.querySelector('input')
      if (el && document.activeElement !== el) {
        el.focus()
      }
      if (++attempts >= 10) clearInterval(interval)
    }, 100)
  }
  const [selectedStock, setSelectedStock] = useState(null)
  const [pendingChecks, setPendingChecks] = useState({})

  const listNames = lists.map(l => l.value)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return STOCK_DATABASE.filter(
      s => s.name.toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q)
    )
  }, [query])

  function handleStockClick(stock) {
    const initial = {}
    listNames.forEach(name => {
      initial[name] = (listItems[name] ?? []).some(s => s.ticker === stock.ticker)
    })
    setSelectedStock(stock)
    setPendingChecks(initial)
  }

  function handleConfirm() {
    onSetListItems(prev => {
      const next = { ...prev }
      listNames.forEach(name => {
        const current = prev[name] ?? []
        const isChecked = !!pendingChecks[name]
        const inList = current.some(s => s.ticker === selectedStock.ticker)
        if (isChecked && !inList) {
          next[name] = [...current, selectedStock]
        } else if (!isChecked && inList) {
          next[name] = current.filter(s => s.ticker !== selectedStock.ticker)
        }
      })
      return next
    })
    setSelectedStock(null)
  }

  function handleClose() {
    onClose()
    setQuery('')
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        on_open={handleOpen}
        maxWidth="52rem"
        title="Søk etter aksjer"
        triggerAttributes={{ hidden: true }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-small)' }}>
          {/* Search input */}
          <Input
            ref={inputRef}
            stretch
            size="large"
            icon={Loupe}
            placeholder="Søk etter aksjer"
            value={query}
            onChange={({ value }) => setQuery(value)}
            clear={true}
          />

          {/* Results / empty state */}
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
              <List.Container>
                {results.map((stock) => {
                  const positive = stock.change >= 0
                  return (
                    <List.Item.Basic
                      key={stock.ticker}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleStockClick(stock)}
                    >
                      <List.Cell.Title>
                        {stock.name}
                        <List.Cell.Title.Subline variant="description">
                          {stock.ticker}
                        </List.Cell.Title.Subline>
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

      {/* List selection dialog */}
      <Dialog
        open={!!selectedStock}
        onClose={() => setSelectedStock(null)}
        title={selectedStock ? `Legg til ${selectedStock.name}` : ''}
        triggerAttributes={{ hidden: true }}
      >
        <P style={{ color: 'var(--color-black-55)', marginBottom: 'var(--spacing-small)' }}>
          Velg hvilke lister du vil legge aksjen til:
        </P>
        <List.Container>
          {listNames.map(name => (
            <List.Item.Basic key={name} onClick={() => setPendingChecks(prev => ({ ...prev, [name]: !prev[name] }))} style={{ cursor: 'pointer' }}>
              <List.Cell.Title>{name}</List.Cell.Title>
              <List.Cell.End>
                <Checkbox
                  checked={!!pendingChecks[name]}
                  onChange={({ checked }) => setPendingChecks(prev => ({ ...prev, [name]: checked }))}
                  label={name}
                  label_sr_only
                />
              </List.Cell.End>
            </List.Item.Basic>
          ))}
        </List.Container>
        <Dialog.Action>
          <Button variant="tertiary" text="Avbryt" onClick={() => setSelectedStock(null)} />
          <Button text="Bekreft" onClick={handleConfirm} />
        </Dialog.Action>
      </Dialog>
    </>
  )
}
