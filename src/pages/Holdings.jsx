import React, { useState } from 'react'
import { NumberFormat, P, Grid, Card, Dialog } from '@dnb/eufemia'
import HoldingsBreakdown from '../components/HoldingsBreakdown.jsx'

// Each holding has an `account` field matching AccountFilter values
const ALL_HOLDINGS = [
  // VPS-konto — stocks
  { account: 'VPS-konto', type: 'stocks', ticker: 'EQNR',  name: 'Equinor ASA',        qty: 150, avgCost: 245.50, price: 267.80 },
  { account: 'VPS-konto', type: 'stocks', ticker: 'DNB',   name: 'DNB Bank ASA',        qty: 200, avgCost: 185.20, price: 192.45 },
  { account: 'VPS-konto', type: 'stocks', ticker: 'MOWI',  name: 'Mowi ASA',            qty: 100, avgCost: 168.90, price: 156.20 },
  { account: 'VPS-konto', type: 'stocks', ticker: 'YAR',   name: 'Yara International',  qty: 75,  avgCost: 342.00, price: 358.50 },
  { account: 'VPS-konto', type: 'stocks', ticker: 'NEL',   name: 'Nel ASA',             qty: 500, avgCost: 12.40,  price: 8.65   },
  { account: 'VPS-konto', type: 'stocks', ticker: 'ORK',   name: 'Orkla ASA',           qty: 120, avgCost: 78.50,  price: 82.30  },
  // VPS-konto — ETFs
  { account: 'VPS-konto', type: 'etfs',   ticker: 'EUNL',  name: 'iShares Core MSCI World',   qty: 250, avgCost: 82.40,  price: 96.10  },
  { account: 'VPS-konto', type: 'etfs',   ticker: 'IS3N',  name: 'iShares Core EM IMI',       qty: 400, avgCost: 25.60,  price: 22.85  },
  { account: 'VPS-konto', type: 'etfs',   ticker: 'XACT',  name: 'Xact Norden',               qty: 320, avgCost: 178.50, price: 195.30 },
  // VPS-konto — ETNs
  { account: 'VPS-konto', type: 'etns',   ticker: 'OILNOK', name: 'Brent Oil ETN NOK',        qty: 200, avgCost: 48.50,  price: 52.80  },
  { account: 'VPS-konto', type: 'etns',   ticker: 'GOLDNK', name: 'Gold Tracker ETN NOK',     qty: 150, avgCost: 132.00, price: 148.60 },
  { account: 'VPS-konto', type: 'etns',   ticker: 'NGASNK', name: 'Natural Gas ETN NOK',      qty: 500, avgCost: 14.20,  price: 11.40  },
  // VPS-konto — Options
  { account: 'VPS-konto', type: 'afp1',   ticker: 'EQNR C280', name: 'Equinor Call 280 Jun-26', qty: 50, avgCost: 8.50,  price: 12.40 },
  { account: 'VPS-konto', type: 'afp1',   ticker: 'DNB P190',  name: 'DNB Put 190 Sep-26',      qty: 30, avgCost: 5.20,  price: 3.80  },
  { account: 'VPS-konto', type: 'afp1',   ticker: 'AKER C700', name: 'Aker Call 700 Dec-26',    qty: 20, avgCost: 15.00, price: 22.50 },

  // Pensjonskonto — funds
  { account: 'Pensjonskonto', type: 'funds', ticker: 'DNBGLO', name: 'DNB Global Indeks',        qty: 420, avgCost: 198.40, price: 231.60 },
  { account: 'Pensjonskonto', type: 'funds', ticker: 'SKAGEN', name: 'SKAGEN Kon-Tiki',           qty: 180, avgCost: 112.50, price: 98.30  },
  { account: 'Pensjonskonto', type: 'funds', ticker: 'NORIND', name: 'Nordnet Indeksfond Norge',  qty: 650, avgCost: 145.80, price: 172.40 },

  // ASK Underkonto 1 — funds + ETF
  { account: 'ASK Underkonto 1', type: 'funds', ticker: 'SBANKE', name: 'Sbanken Framtid',         qty: 300, avgCost: 88.20,  price: 104.70 },
  { account: 'ASK Underkonto 1', type: 'funds', ticker: 'ALFRED', name: 'Alfred Berg Gambak',       qty: 90,  avgCost: 560.00, price: 612.50 },
  { account: 'ASK Underkonto 1', type: 'etfs',  ticker: 'IUSN',   name: 'iShares MSCI World SRI',  qty: 150, avgCost: 51.20,  price: 58.90  },

  // ASK Underkonto 2 — ETF + certificates
  { account: 'ASK Underkonto 2', type: 'etfs',  ticker: 'QDVE',    name: 'iShares S&P 500 IT Sector', qty: 80, avgCost: 38.70, price: 45.20 },
  { account: 'ASK Underkonto 2', type: 'afp3',  ticker: 'CERT-A1', name: 'Autocall Certificate A1',   qty: 5,  avgCost: 10000, price: 11200 },
  { account: 'ASK Underkonto 2', type: 'afp3',  ticker: 'CERT-B2', name: 'Capital Protection B2',     qty: 3,  avgCost: 10000, price: 9650  },
  { account: 'ASK Underkonto 2', type: 'afp3',  ticker: 'CERT-C3', name: 'Bonus Certificate C3',      qty: 8,  avgCost: 5000,  price: 5480  },
]

const TYPE_LABELS = {
  funds:  'Fond',
  stocks: 'Aksjer',
  etfs:   'ETFer',
  etns:   'ETNer',
  afp1:   'Opsjoner',
  afp2:   'Gearede produkter',
  afp3:   'Sertifikater',
  afp4:   'Swapper / CFDer',
}

function marketValue(h) { return h.qty * h.price }
function unrealized(h) { return h.qty * (h.price - h.avgCost) }

const EXCLUDED_TYPES = new Set(['afp1', 'afp2', 'afp3', 'afp4'])

export default function Holdings({ selectedAccount, includePensions, onStockClick }) {
  const filtered = ALL_HOLDINGS.filter(h => {
    if (EXCLUDED_TYPES.has(h.type)) return false
    if (selectedAccount !== 'Alle kontoer') return h.account === selectedAccount
    if (!includePensions && h.account === 'Pensjonskonto') return false
    return true
  })

  const totalValue = filtered.reduce((s, h) => s + marketValue(h), 0)
  const totalEquity = filtered.reduce((s, h) => s + h.qty * h.avgCost, 0)
  const totalUnrealized = filtered.reduce((s, h) => s + unrealized(h), 0)
  const unrealizedPct = totalEquity > 0 ? (totalUnrealized / totalEquity * 100) : 0
  const isUnrealizedPos = totalUnrealized >= 0

  // Group by type for breakdown
  const byType = {}
  filtered.forEach(h => {
    if (!byType[h.type]) byType[h.type] = []
    byType[h.type].push(h)
  })

  const categories = Object.entries(byType).map(([type, holdings]) => {
    const tv = holdings.reduce((s, h) => s + marketValue(h), 0)
    const gain = holdings.reduce((s, h) => s + unrealized(h), 0)
    return { id: type, label: TYPE_LABELS[type] ?? type, holdings, totalValue: tv, gain }
  })

  return (
    <div style={{ background: 'var(--color-black-3)', minHeight: '100%' }}>
      <div style={{ padding: 'var(--spacing-large)', paddingTop: 'var(--spacing-x-large)', maxWidth: '1510px', margin: '0 auto' }}>

        <Grid.Container columns={{ small: 1, medium: 3, large: 3 }} columnGap="small" rowGap="small" bottom="large">
          <Card stack>
            <P top={false} bottom={false}>Markedsverdi</P>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
              <NumberFormat.Currency value={totalValue} />
            </div>
          </Card>
          <Card stack>
            <P top={false} bottom={false}>Innskudd</P>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
              <NumberFormat.Currency value={totalEquity} />
            </div>
          </Card>
          <Card stack>
            <P top={false} bottom={false}>Urealisert avkastning</P>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: isUnrealizedPos ? 'var(--color-success-green)' : 'var(--color-fire-red)' }}>
              {isUnrealizedPos ? '+' : ''}<NumberFormat.Currency value={totalUnrealized} />
              <span style={{ fontWeight: 400 }}> ({isUnrealizedPos ? '+' : ''}{unrealizedPct.toFixed(2)}%)</span>
            </div>
          </Card>
        </Grid.Container>

        <HoldingsBreakdown categories={categories} onStockClick={onStockClick} />
      </div>
      <div style={{ paddingBottom: 'calc(var(--spacing-xx-large) * 3)' }} />
    </div>
  )
}
