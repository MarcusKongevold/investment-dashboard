import React, { useState } from 'react'
import { Card, Button, NumberFormat, Table, Th, Tr, Td, Input, H3, Heading, Dropdown, ToggleButton, List, Dialog, Checkbox, P } from '@dnb/eufemia'
import {
  AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import ArrowLeft from '@dnb/eufemia/icons/dnb/arrow_left'
import Bell from '@dnb/eufemia/icons/dnb/bell'
import Share from '@dnb/eufemia/icons/dnb/share_ios'
import Bookmark from '@dnb/eufemia/icons/dnb/bookmark'

// --- Mock data generators ---
function generatePriceData(seed) {
  const years = [2020, 2021, 2022, 2023, 2024]
  let value = 180 + (seed % 100)
  const data = []
  years.forEach((year) => {
    for (let m = 0; m < 12; m++) {
      const fluctuation = (Math.random() - 0.42) * 18
      value = Math.max(80, value + fluctuation + 1.5)
      if (year === 2022 && m > 3 && m < 10) value -= 10
      data.push({ label: m === 0 ? String(year) : '', value: Math.round(value * 100) / 100, month: m, year })
    }
  })
  return data
}

const ANALYST_RATINGS = [
  { label: 'Sterkt kjøp', pct: 25, color: '#007272' },
  { label: 'Kjøp',        pct: 13, color: '#2cc184' },
  { label: 'Ikke selg',   pct: 25, color: '#9bd0c8' },
  { label: 'Selg',        pct: 0,  color: '#f5a623' },
  { label: 'Sterkt salg', pct: 38, color: '#dc2626' },
]

const KEY_FIGURES = [
  { label: 'P/E Ratio',      value: '8.81'      },
  { label: 'P/B Ratio',      value: '1.37'      },
  { label: 'P/S Ratio',      value: '4.46'      },
  { label: 'EPS',            value: '29.35'     },
  { label: 'Dividend yield', value: '7.05%'     },
  { label: 'Dividend/share', value: '338 505.9' },
  { label: 'Market cap (m)', value: '24.9304'   },
  { label: 'Owners in DNB',  value: '32 032'    },
  { label: 'Short sales',    value: '-'         },
  { label: 'Beta',           value: '0.13'      },
]

const EVENTS = [
  { type: 'ex',       color: '#007272', label: 'Ex dag',             date: '14 nov' },
  { type: 'dividend', color: '#007272', label: 'Utbytte',            date: '26 nov', sub: '→ 1,3 kr per aksje' },
  { type: 'earnings', color: '#004f9f', label: 'Inntjeningssamtale', date: '14 nov 2026' },
  { type: 'earnings', color: '#004f9f', label: 'Inntjeningssamtale', date: '14 nov 2026' },
  { type: 'earnings', color: '#004f9f', label: 'Inntjeningssamtale', date: '14 nov 2026' },
]

const ORDER_BOOK = [
  { buyQty: 231, buyPrice: 264.0, sellPrice: 264.2, sellQty: 3304, buyPct: 65, sellPct: 80 },
  { buyQty: 231, buyPrice: 264.0, sellPrice: 264.2, sellQty: 3304, buyPct: 50, sellPct: 90 },
  { buyQty: 233, buyPrice: 264.0, sellPrice: 264.2, sellQty: 3,    buyPct: 55, sellPct: 10 },
  { buyQty: 231, buyPrice: 264.0, sellPrice: 264.2, sellQty: 3304, buyPct: 65, sellPct: 80 },
]

const LAST_TRADES = [
  { time: '14:31:02', price: 264.0, qty: '-',   buyers: '-',   sellers: '-' },
  { time: '14:30:58', price: 264.0, qty: 264.0, buyers: '-',   sellers: '-' },
  { time: '14:30:47', price: 264.0, qty: 264.0, buyers: '-',   sellers: '-' },
  { time: '14:30:31', price: 264.0, qty: 264.0, buyers: 264.0, sellers: '-' },
  { time: '14:30:15', price: 264.0, qty: 264.0, buyers: 264.0, sellers: 264.0 },
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-black-8)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: 'var(--font-size-small)' }}>
        <NumberFormat.Currency value={payload[0].value} />
      </div>
    )
  }
  return null
}

function KeyFigureRow({ label, value }) {
  return (
    <List.Item.Basic title={label}>
      <List.Cell.End>
        <span style={{ color: 'var(--color-black-55)' }}>{value}</span>
      </List.Cell.End>
    </List.Item.Basic>
  )
}

const WATCHLISTS = ['Min liste', 'Favoritter', 'Tech-aksjer', 'Energi']
const PERIODS = ['1 dag', '7 dager', '30 dager', '3 måneder', '6 måneder', 'Hittil i år', '1 år', '3 år', '5 år', 'Siden start']
const PERIOD_DATA = PERIODS.reduce((acc, p) => ({ ...acc, [p]: p }), {})
const PERIOD_LABEL = {
  '1 dag':       'Avkastning i dag',
  '7 dager':     'Avkastning siste 7 dager',
  '30 dager':    'Avkastning siste 30 dager',
  '3 måneder':   'Avkastning siste 3 måneder',
  '6 måneder':   'Avkastning siste 6 måneder',
  'Hittil i år': 'Avkastning hittil i år',
  '1 år':        'Avkastning siste år',
  '3 år':        'Avkastning siste 3 år',
  '5 år':        'Avkastning siste 5 år',
  'Siden start': 'Avkastning siden start',
}

function filterByPeriod(data, period) {
  const months = {
    '1 dag': 1, '7 dager': 1, '30 dager': 1,
    '3 måneder': 3, '6 måneder': 6, 'Hittil i år': 12,
    '1 år': 12, '3 år': 36, '5 år': 60, 'Siden start': Infinity,
  }
  const n = months[period] ?? 60
  return n >= data.length ? data : data.slice(-n)
}

export default function StockDetail({ stock, onBack }) {
  const [orderSide, setOrderSide] = useState('buy')
  const [showFullAbout, setShowFullAbout] = useState(false)
  const [checkedLists, setCheckedLists] = useState({})
  const [watchlistOpen, setWatchlistOpen] = useState(false)
  const [pendingChecks, setPendingChecks] = useState({})
  const [selectedPeriod, setSelectedPeriod] = useState('5 år')

  const priceData = React.useMemo(() => generatePriceData(stock.ticker.charCodeAt(0)), [stock.ticker])
  const chartData = filterByPeriod(priceData, selectedPeriod)
  const lastPrice = priceData[priceData.length - 1].value
  const chartFirstPrice = chartData[0].value
  const chartLastPrice = chartData[chartData.length - 1].value
  const priceChange = chartLastPrice - chartFirstPrice
  const pctChange = (priceChange / chartFirstPrice * 100)
  const positive = pctChange >= 0

  const about = `${stock.name} ASA engages in the exploration, production, transport, refining, and marketing of petroleum and petroleum-derived products. It operates through the following segments: Exploration and Production Norway, Exploration and Production International, Exploration and Production USA, Marketing, Midstream, and Processing, Renewables, and Other. The Exploration and Production Norway segment includes the commercial development of oil and gas portfolios on the Norwegian continental shelf.`

  return (
    <div style={{ maxWidth: '1510px', margin: '0 auto', padding: 'var(--spacing-large)' }}>

      {/* Back button */}
      <div style={{ marginBottom: 'var(--spacing-medium)' }}>
        <Button variant="tertiary" size="small" icon={ArrowLeft} iconPosition="left" onClick={onBack} style={{ margin: 0 }}>
          Tilbake
        </Button>
      </div>

      {/* Stock name + actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-medium)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-medium)', margin: 0, lineHeight: '2.5rem', color: 'var(--color-black)' }}>
            {stock.name}
          </h1>
          <p style={{ margin: 0, fontSize: 'var(--font-size-small)', color: 'var(--color-black-55)', marginTop: '0.25rem' }}>
            {stock.ticker}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-x-small)', alignItems: 'center' }}>
          <Button
            variant="secondary"
            icon={Bookmark}
            aria-label="Legg til i watchlist"
            style={{ margin: 0, ...(Object.values(checkedLists).some(Boolean) ? { color: '#007b5e' } : {}) }}
            onClick={() => { setPendingChecks({ ...checkedLists }); setWatchlistOpen(true) }}
          />
          <Button variant="secondary" icon={Bell} aria-label="Varsler" style={{ margin: 0 }} />
          <Button variant="secondary" icon={Share} aria-label="Del" style={{ margin: 0 }} />
        </div>
      </div>

      <Dialog
        title={`Legg til ${stock.name}`}
        open={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        triggerAttributes={{ hidden: true }}
      >
        <P style={{ color: 'var(--color-black-55)', marginBottom: 'var(--spacing-small)' }}>
          Velg hvilke lister du vil legge aksjen til:
        </P>
        <List.Container>
          {WATCHLISTS.map(name => (
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
          <Button variant="tertiary" text="Avbryt" onClick={() => setWatchlistOpen(false)} />
          <Button text="Bekreft" onClick={() => { setCheckedLists({ ...pendingChecks }); setWatchlistOpen(false) }} />
        </Dialog.Action>
      </Dialog>

      {/* 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 422px', gap: 'var(--spacing-large)', alignItems: 'start' }}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-medium)' }}>

          {/* Price + Chart card */}
          <Card stack>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-medium)', lineHeight: '2.5rem' }}>
                  <NumberFormat.Currency value={lastPrice} decimals={2} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', background: positive ? '#ebf4f2' : '#fdecea', borderRadius: '8px', padding: '2px 8px' }}>
                    <span style={{ fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)', color: positive ? '#007b5e' : 'var(--color-fire-red)', whiteSpace: 'nowrap' }}>
                      {positive ? '+' : ''}{pctChange.toFixed(1)}% ({positive ? '+' : ''}{Math.abs(Math.round(priceChange * 300)).toLocaleString('nb-NO')} kr)
                    </span>
                  </div>
                  <span style={{ fontSize: 'var(--font-size-x-small)', color: 'var(--color-black-55)' }}>{PERIOD_LABEL[selectedPeriod]}</span>
                </div>
              </div>
              <Dropdown
                value={selectedPeriod}
                data={PERIOD_DATA}
                onChange={({ value }) => setSelectedPeriod(value)}
                independentWidth
              />
            </div>

            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"  stopColor="#ebf4f2" stopOpacity={1} />
                      <stop offset="95%" stopColor="#ebf4f2" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--color-black-8)" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--color-black-55)' }} axisLine={false} tickLine={false} interval={0} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#007272" strokeWidth={2} fill="url(#stockGradient)" dot={false} activeDot={{ r: 4, fill: '#007272' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Om selskapet */}
          <Card stack>
            <H3 size="medium">Om selskapet</H3>
            <p style={{ fontSize: 'var(--font-size-small)', lineHeight: '1.5', color: 'var(--color-black)', margin: 0 }}>
              {showFullAbout ? about : about.slice(0, 280) + '...'}
            </p>
            <Button variant="tertiary" size="small" onClick={() => setShowFullAbout(v => !v)} style={{ margin: 0 }}>
              {showFullAbout ? 'Vis mindre' : 'Vis mer'}
            </Button>
          </Card>

          {/* Analytikerrangering */}
          <Card stack>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <H3 size="medium">Analytikerrangering</H3>
              <span style={{ fontSize: 'var(--font-size-x-small)', color: 'var(--color-black-55)' }}>Basert på 5 vurderinger</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ANALYST_RATINGS.map(({ label, pct, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ width: '80px', fontSize: 'var(--font-size-small)', flexShrink: 0 }}>{label}</span>
                  <div style={{ flex: 1, height: '8px', background: 'var(--color-black-8)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px' }} />
                  </div>
                  <span style={{ width: '32px', fontSize: 'var(--font-size-small)', color: 'var(--color-black-55)', textAlign: 'right' }}>{pct}%</span>
                </div>
              ))}
            </div>
          </Card>


          {/* Key figures + Events side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-medium)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-x-small)' }}>
              <Heading size="medium">Nøkkeltall</Heading>
              <List.Container>
                {KEY_FIGURES.map(kf => <KeyFigureRow key={kf.label} {...kf} />)}
              </List.Container>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-x-small)' }}>
              <Heading size="medium">Selskapshendelser</Heading>
              <List.Card>
                <List.Container>
                  {EVENTS.map((ev, i) => (
                    <List.Item.Basic key={i}>
                      <List.Cell.Start>
                        <div style={{ width: '4px', borderRadius: '2px', background: ev.color, alignSelf: 'stretch', flexShrink: 0, minHeight: '32px' }} />
                      </List.Cell.Start>
                      <List.Cell.Title>
                        {ev.label}
                        <List.Cell.Title.Subline variant="description">{ev.date}{ev.sub ? ` ${ev.sub}` : ''}</List.Cell.Title.Subline>
                      </List.Cell.Title>
                    </List.Item.Basic>
                  ))}
              </List.Container>
            </List.Card>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-medium)' }}>

          {/* Ordreskjema */}
          <Card stack>
            <div style={{ display: 'flex', gap: 'var(--spacing-x-small)' }}>
              <Button variant="primary" style={{ flex: 1, margin: 0 }}>Kjøp</Button>
              <Button variant="primary" style={{ flex: 1, margin: 0, background: 'var(--color-fire-red)', borderColor: 'var(--color-fire-red)' }}>Selg</Button>
            </div>
          </Card>

          {/* Ordredybde */}
          <Card stack>
            <H3 size="medium">Ordredybde</H3>
            <Table.ScrollView>
            <Table size="small">
              <thead>
                <Tr>
                  <Th>Antall</Th>
                  <Th align="right" style={{ color: '#004f9f' }}>Kjøp</Th>
                  <Th align="right" style={{ color: 'var(--color-fire-red)' }}>Selg</Th>
                  <Th align="right">Antall</Th>
                </Tr>
              </thead>
              <tbody>
                {ORDER_BOOK.map((row, i) => (
                  <Tr key={i}>
                    <Td>
                      <div style={{ position: 'relative' }}>
                        <span>{row.buyQty}</span>
                        <div style={{ position: 'absolute', bottom: '-4px', left: 0, height: '3px', width: `${row.buyPct}%`, background: '#004f9f', opacity: 0.3, borderRadius: '2px' }} />
                      </div>
                    </Td>
                    <Td align="right" style={{ color: '#004f9f' }}>{row.buyPrice.toFixed(1)}</Td>
                    <Td align="right" style={{ color: 'var(--color-fire-red)' }}>{row.sellPrice.toFixed(1)}</Td>
                    <Td align="right">
                      <div style={{ position: 'relative' }}>
                        <span>{row.sellQty.toLocaleString()}</span>
                        <div style={{ position: 'absolute', bottom: '-4px', right: 0, height: '3px', width: `${row.sellPct}%`, background: 'var(--color-fire-red)', opacity: 0.3, borderRadius: '2px' }} />
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            </Table.ScrollView>
          </Card>

          {/* Siste handler */}
          <Card stack>
            <H3 size="medium">Siste handler</H3>
            <Table.ScrollView>
            <Table size="small" style={{ width: '100%', tableLayout: 'fixed', minWidth: '320px' }}>
              <thead>
                <Tr>
                  <Th style={{ width: '90px' }}>Tid</Th>
                  <Th align="right">Pris</Th>
                  <Th align="right">Antall</Th>
                  <Th align="right">Kjøpere</Th>
                  <Th align="right">Selgere</Th>
                </Tr>
              </thead>
              <tbody>
                {LAST_TRADES.map((row, i) => (
                  <Tr key={i}>
                    <Td style={{ color: 'var(--color-black-55)', fontSize: 'var(--font-size-x-small)' }}>{row.time}</Td>
                    <Td align="right">{row.price.toFixed(1)}</Td>
                    <Td align="right" style={{ color: 'var(--color-black-55)' }}>{row.qty}</Td>
                    <Td align="right" style={{ color: 'var(--color-black-55)' }}>{row.buyers}</Td>
                    <Td align="right" style={{ color: 'var(--color-black-55)' }}>{row.sellers}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            </Table.ScrollView>
          </Card>


        </div>
      </div>
    </div>
  )
}
