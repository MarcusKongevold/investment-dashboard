import React from 'react'
import { List, NumberFormat, Table, Tr, Th, Td, Lead } from '@dnb/eufemia'

function StocksTable({ holdings, onStockClick }) {
  return (
    <div style={{ borderRadius: '1.5rem', overflow: 'hidden', background: 'var(--color-white)', margin: '0 var(--spacing-x-small) var(--spacing-x-small)' }}>
      <Table size="medium" style={{ width: '100%' }}>
        <caption className="dnb-sr-only">Beholdning</caption>
        <thead>
          <Tr noWrap>
            <Th>Navn / Ticker</Th>
            <Th align="right">Antall</Th>
            <Th align="right">Kjøpspris</Th>
            <Th align="right">Nåverdi</Th>
            <Th align="right">Total verdi</Th>
            <Th align="right">Gevinst/Tap</Th>
          </Tr>
        </thead>
        <tbody>
          {holdings.map((h, i) => {
            const totalValue = h.qty * h.price
            const gain = h.qty * (h.price - h.avgCost)
            const gainPct = ((h.price - h.avgCost) / h.avgCost * 100)
            const isPos = gain >= 0
            return (
              <Tr key={h.ticker} variant={i % 2 === 0 ? 'odd' : undefined}>
                <Td>
                  <span
                    style={{ display: 'block', fontWeight: 500, cursor: 'pointer', color: 'var(--color-sea-green)', textDecoration: 'underline' }}
                    onClick={() => onStockClick?.({ name: h.name, ticker: h.ticker })}
                  >{h.ticker}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-black-55)' }}>{h.name}</span>
                </Td>
                <Td align="right">{h.qty.toLocaleString('nb-NO')}</Td>
                <Td align="right"><NumberFormat.Currency value={h.avgCost} decimals={2} /></Td>
                <Td align="right"><NumberFormat.Currency value={h.price} decimals={2} /></Td>
                <Td align="right"><NumberFormat.Currency value={totalValue} decimals={2} /></Td>
                <Td align="right" style={{ color: isPos ? 'var(--color-success-green)' : 'var(--color-fire-red)' }}>
                  <div>{isPos ? '+' : ''}<NumberFormat.Currency value={gain} decimals={2} /></div>
                  <div style={{ fontSize: '0.875rem' }}>({isPos ? '+' : ''}{gainPct.toFixed(2)}%)</div>
                </Td>
              </Tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default function HoldingsBreakdown({ categories, onStockClick }) {
  if (!categories || categories.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-xx-large)', color: 'var(--color-black-55)' }}>
        Ingen beholdning for valgt konto.
      </div>
    )
  }

  return (
    <div style={{ marginTop: 'var(--spacing-large)' }}>
      <Lead top={false} bottom="small">Etter aktivatype</Lead>
      <List.Container>
        {categories.map((cat) => {
          const isPos = cat.gain >= 0
          return (
            <List.Item.Accordion key={cat.id} title={cat.label}>
              <List.Item.Accordion.Header>
                <List.Cell.End>
                  <div style={{ textAlign: 'right' }}>
                    <div><NumberFormat.Currency value={cat.totalValue} /></div>
                    <div style={{ fontSize: '0.875rem', color: isPos ? 'var(--color-success-green)' : 'var(--color-fire-red)' }}>
                      {isPos ? '+' : ''}<NumberFormat.Currency value={cat.gain} />
                    </div>
                  </div>
                </List.Cell.End>
              </List.Item.Accordion.Header>
              {cat.holdings && (
                <List.Item.Accordion.Content>
                  <StocksTable holdings={cat.holdings} onStockClick={onStockClick} />
                </List.Item.Accordion.Content>
              )}
            </List.Item.Accordion>
          )
        })}
      </List.Container>
    </div>
  )
}
