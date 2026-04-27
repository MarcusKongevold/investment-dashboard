import React from 'react'
import { List, Tabs, NumberFormat } from '@dnb/eufemia'

const MARKETS = {
  indices: [
    { country: 'Norway', name: 'Oslo Børs', change: 0.54 },
    { country: 'USA', name: 'S&P 500', change: 0.31 },
    { country: 'USA', name: 'Nasdaq 100', change: 0.67 },
    { country: 'Germany', name: 'DAX', change: -0.22 },
    { country: 'UK', name: 'FTSE 100', change: -0.14 },
  ],
  currencies: [
    { country: 'Europe', name: 'EUR/NOK', price: 11.74, change: 0.12 },
    { country: 'USA', name: 'USD/NOK', price: 10.52, change: -0.08 },
    { country: 'UK', name: 'GBP/NOK', price: 13.21, change: 0.05 },
    { country: 'Japan', name: 'JPY/NOK', price: 0.071, change: -0.31 },
  ],
  commodities: [
    { country: 'Energy', name: 'Brent Crude', price: 74.18, change: -0.43 },
    { country: 'Metals', name: 'Gold', price: 2341.50, change: 0.21 },
    { country: 'Metals', name: 'Silver', price: 27.83, change: -0.15 },
    { country: 'Energy', name: 'Natural Gas', price: 1.94, change: 1.04 },
  ],
}

function makeMarketList(key) {
  return function MarketList() {
    return (
      <List.Container>
        {MARKETS[key].map(({ country, name, price, change }) => {
          const positive = change >= 0
          return (
            <List.Item.Basic key={name}>
              <List.Cell.Title>
                <List.Cell.Title.Overline>{country}</List.Cell.Title.Overline>
                {name}
              </List.Cell.Title>
              <List.Cell.End>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.125rem' }}>
                  {price != null && (
                    <span style={{ fontSize: 'var(--font-size-small)' }}>
                      <NumberFormat.Number value={price} decimals={price < 1 ? 3 : 2} />
                    </span>
                  )}
                  <span className={`change-badge change-badge--${positive ? 'positive' : 'negative'}`}>
                    {positive ? '+' : ''}{change.toFixed(2)}%
                  </span>
                </div>
              </List.Cell.End>
            </List.Item.Basic>
          )
        })}
      </List.Container>
    )
  }
}

export default function MarketData() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-x-small)' }}>
      <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: 0 }}>Marked</p>
      <List.Card style={{ overflow: 'hidden' }}>
        <Tabs
          noBorder
          
          data={[
            { title: 'Indekser', key: 'indices' },
            { title: 'Valuta', key: 'currencies' },
            { title: 'Råvarer', key: 'commodities' },
          ]}
          content={{
            indices: makeMarketList('indices'),
            currencies: makeMarketList('currencies'),
            commodities: makeMarketList('commodities'),
          }}
        />
      </List.Card>
    </div>
  )
}
