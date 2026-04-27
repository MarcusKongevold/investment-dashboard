import React, { useState, useRef } from 'react'
import { Card, NumberFormat, P, Table, Tr, Th, Td, Button, ToggleButton, Icon } from '@dnb/eufemia'
import chevron_right from '@dnb/eufemia/icons/dnb/chevron_right'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']

// Yearly aggregated data
const SAMLET_CHART_DATA = [
  { year: '2022', utbetalt: 412,  kommende: 0   },
  { year: '2023', utbetalt: 736,  kommende: 0   },
  { year: '2024', utbetalt: 504,  kommende: 0   },
  { year: '2025', utbetalt: 1460, kommende: 0   },
  { year: '2026', utbetalt: 525,  kommende: 892 },
]

// Monthly breakdown per year: { month (1-12), utbetalt, kommende, stocks[] }
const MONTHLY_DATA = {
  '2022': [
    { month: 2,  utbetalt: 180, kommende: 0,   stocks: [{ ticker: 'EQNR', amount: 180, status: 'utbetalt' }] },
    { month: 5,  utbetalt: 62,  kommende: 0,   stocks: [{ ticker: 'ORK',  amount: 62,  status: 'utbetalt' }] },
    { month: 8,  utbetalt: 130, kommende: 0,   stocks: [{ ticker: 'DNB',  amount: 130, status: 'utbetalt' }] },
    { month: 12, utbetalt: 40,  kommende: 0,   stocks: [{ ticker: 'MOWI', amount: 40,  status: 'utbetalt' }] },
  ],
  '2023': [
    { month: 2,  utbetalt: 120, kommende: 0,   stocks: [{ ticker: 'EQNR', amount: 120, status: 'utbetalt' }] },
    { month: 4,  utbetalt: 290, kommende: 0,   stocks: [{ ticker: 'DNB',  amount: 290, status: 'utbetalt' }] },
    { month: 5,  utbetalt: 55,  kommende: 0,   stocks: [{ ticker: 'ORK',  amount: 55,  status: 'utbetalt' }] },
    { month: 6,  utbetalt: 96,  kommende: 0,   stocks: [{ ticker: 'MOWI', amount: 68,  status: 'utbetalt' }, { ticker: 'YAR', amount: 28, status: 'utbetalt' }] },
    { month: 9,  utbetalt: 125, kommende: 0,   stocks: [{ ticker: 'EQNR', amount: 125, status: 'utbetalt' }] },
    { month: 11, utbetalt: 50,  kommende: 0,   stocks: [{ ticker: 'ORK',  amount: 50,  status: 'utbetalt' }] },
  ],
  '2024': [
    { month: 2,  utbetalt: 160, kommende: 0,   stocks: [{ ticker: 'EQNR', amount: 160, status: 'utbetalt' }] },
    { month: 5,  utbetalt: 100, kommende: 0,   stocks: [{ ticker: 'ORK',  amount: 100, status: 'utbetalt' }] },
    { month: 6,  utbetalt: 94,  kommende: 0,   stocks: [{ ticker: 'MOWI', amount: 94,  status: 'utbetalt' }] },
    { month: 9,  utbetalt: 150, kommende: 0,   stocks: [{ ticker: 'EQNR', amount: 150, status: 'utbetalt' }] },
  ],
  '2025': [
    { month: 2,  utbetalt: 473,  kommende: 0,   stocks: [{ ticker: 'EQNR', amount: 473,  status: 'utbetalt' }] },
    { month: 4,  utbetalt: 1050, kommende: 0,   stocks: [{ ticker: 'DNB',  amount: 1050, status: 'utbetalt' }] },
    { month: 5,  utbetalt: 765,  kommende: 0,   stocks: [{ ticker: 'ORK',  amount: 390,  status: 'utbetalt' }, { ticker: 'YAR', amount: 375, status: 'utbetalt' }] },
    { month: 7,  utbetalt: 138,  kommende: 0,   stocks: [{ ticker: 'IUSN', amount: 138,  status: 'utbetalt' }] },
    { month: 9,  utbetalt: 250,  kommende: 0,   stocks: [{ ticker: 'MOWI', amount: 250,  status: 'utbetalt' }] },
    { month: 11, utbetalt: 158,  kommende: 0,   stocks: [{ ticker: 'EQNR', amount: 158,  status: 'utbetalt' }] },
  ],
  '2026': [
    { month: 2,  utbetalt: 525,  kommende: 0,   stocks: [{ ticker: 'EQNR', amount: 525,  status: 'utbetalt' }] },
    { month: 4,  utbetalt: 0,    kommende: 420, stocks: [{ ticker: 'DNB',  amount: 420,  status: 'kommende' }] },
    { month: 5,  utbetalt: 0,    kommende: 408, stocks: [{ ticker: 'ORK',  amount: 408,  status: 'kommende' }, { ticker: 'YAR', amount: 0, status: 'kommende' }] },
    { month: 6,  utbetalt: 0,    kommende: 64,  stocks: [{ ticker: 'YAR',  amount: 64,   status: 'kommende' }] },
    { month: 7,  utbetalt: 0,    kommende: 145, stocks: [{ ticker: 'IUSN', amount: 145,  status: 'kommende' }] },
    { month: 9,  utbetalt: 0,    kommende: 275, stocks: [{ ticker: 'MOWI', amount: 275,  status: 'kommende' }] },
  ],
}

// Per-stock chart data (Per aksje view)
const PER_STOCK_CHART_DATA = [
  { year: '2022', EQNR: 180, DNB: 130,  ORK: 62,  MOWI: 40,  YAR: 0,   IUSN: 0   },
  { year: '2023', EQNR: 245, DNB: 290,  ORK: 105, MOWI: 68,  YAR: 28,  IUSN: 0   },
  { year: '2024', EQNR: 310, DNB: 0,    ORK: 100, MOWI: 94,  YAR: 0,   IUSN: 0   },
  { year: '2025', EQNR: 631, DNB: 1050, ORK: 390, MOWI: 250, YAR: 375, IUSN: 138 },
  { year: '2026', EQNR: 525, DNB: 420,  ORK: 408, MOWI: 275, YAR: 64,  IUSN: 145 },
]

const STOCK_COLORS = {
  EQNR: '#14555a',
  DNB:  '#28b482',
  ORK:  '#a5e1d2',
  MOWI: '#00343e',
  YAR:  '#80ba77',
  IUSN: '#2b7b6f',
}

const DIVIDEND_STOCKS = [
  { name: 'Equinor ASA',        ticker: 'EQNR', qty: 150, dps: 3.50, eps: 8.42,  yield: 4.21, exDate: '14.02.2026', payDate: '28.02.2026', utbetalt: 525.00, kommende: 0,     frekvens: 'Kvartalsvis',
    history: [{ year: '2022', utbetalt: 180 }, { year: '2023', utbetalt: 245 }, { year: '2024', utbetalt: 310 }, { year: '2025', utbetalt: 631 }, { year: '2026', utbetalt: 525, kommende: 0 }] },
  { name: 'DNB Bank ASA',        ticker: 'DNB',  qty: 200, dps: 2.10, eps: 22.10, yield: 2.74, exDate: '01.04.2026', payDate: '15.04.2026', utbetalt: 0,      kommende: 420,   frekvens: 'Halvårlig',
    history: [{ year: '2022', utbetalt: 130 }, { year: '2023', utbetalt: 290 }, { year: '2024', utbetalt: 0 },   { year: '2025', utbetalt: 1050 }, { year: '2026', kommende: 420 }] },
  { name: 'Orkla ASA',           ticker: 'ORK',  qty: 120, dps: 3.40, eps: 5.80,  yield: 3.95, exDate: '07.05.2026', payDate: '21.05.2026', utbetalt: 0,      kommende: 408,   frekvens: 'Halvårlig',
    history: [{ year: '2022', utbetalt: 62 },  { year: '2023', utbetalt: 105 }, { year: '2024', utbetalt: 100 }, { year: '2025', utbetalt: 390 }, { year: '2026', kommende: 408 }] },
  { name: 'Mowi ASA',            ticker: 'MOWI', qty: 100, dps: 2.75, eps: 9.20,  yield: 1.32, exDate: '20.03.2026', payDate: '03.04.2026', utbetalt: 0,      kommende: 275,   frekvens: 'Kvartalsvis',
    history: [{ year: '2022', utbetalt: 40 },  { year: '2023', utbetalt: 68 },  { year: '2024', utbetalt: 94 },  { year: '2025', utbetalt: 250 }, { year: '2026', kommende: 275 }] },
  { name: 'Yara International',  ticker: 'YAR',  qty: 75,  dps: 0.85, eps: 18.60, yield: 1.68, exDate: '08.06.2026', payDate: '22.06.2026', utbetalt: 0,      kommende: 64,    frekvens: 'Halvårlig',
    history: [{ year: '2022', utbetalt: 0 },   { year: '2023', utbetalt: 28 },  { year: '2024', utbetalt: 0 },   { year: '2025', utbetalt: 375 }, { year: '2026', kommende: 64 }] },
  { name: 'iShares MSCI World',  ticker: 'IUSN', qty: 150, dps: 0.97, eps: 4.10,  yield: 1.56, exDate: '25.06.2026', payDate: '09.07.2026', utbetalt: 0,      kommende: 145,   frekvens: 'Halvårlig',
    history: [{ year: '2022', utbetalt: 0 },   { year: '2023', utbetalt: 0 },   { year: '2024', utbetalt: 0 },   { year: '2025', utbetalt: 138 }, { year: '2026', kommende: 145 }] },
]

const TOTAL_PAID     = DIVIDEND_STOCKS.reduce((s, d) => s + d.utbetalt, 0)
const TOTAL_UPCOMING = DIVIDEND_STOCKS.reduce((s, d) => s + d.kommende, 0)
const AVG_YIELD      = DIVIDEND_STOCKS.reduce((s, d) => s + d.yield, 0) / DIVIDEND_STOCKS.length

// Build full 12-month chart data for a given year
function buildMonthlyChartData(year) {
  const payments = MONTHLY_DATA[year] ?? []
  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const entry = payments.find(p => p.month === month)
    return {
      month: MONTH_NAMES[i],
      utbetalt: entry?.utbetalt ?? 0,
      kommende: entry?.kommende ?? 0,
      stocks: entry?.stocks ?? [],
    }
  })
}

// Build per-stock monthly data for a given year
function buildMonthlyPerStockData(year) {
  const payments = MONTHLY_DATA[year] ?? []
  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const entry = payments.find(p => p.month === month)
    const row = { month: MONTH_NAMES[i] }
    Object.keys(STOCK_COLORS).forEach(ticker => {
      const s = entry?.stocks?.find(s => s.ticker === ticker)
      row[ticker] = s?.amount ?? 0
    })
    return row
  })
}

const SAMLET_BARS = [
  { dataKey: 'utbetalt', color: '#14555a', name: 'Utbetalt' },
  { dataKey: 'kommende', color: '#28b482', name: 'Kommende' },
]

const PER_STOCK_BARS = Object.entries(STOCK_COLORS).map(([ticker, color]) => ({ dataKey: ticker, color, name: ticker }))

function CustomBarChart({ data, bars, xKey, barWidth = 48, maxBarHeight = 200, onClick }) {
  const [hovered, setHovered] = useState(null)
  const ref = useRef(null)
  const totals = data.map(d => bars.reduce((s, b) => s + (d[b.dataKey] ?? 0), 0))
  const maxTotal = Math.max(1, ...totals)
  const hoveredEntry = hovered != null && hovered < data.length ? data[hovered] : null

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div ref={ref} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', width: '100%' }}>
        {data.map((entry, i) => {
          const total = totals[i]
          const barH = total > 0 ? Math.max(4, (total / maxTotal) * maxBarHeight) : 0
          return (
            <div
              key={i}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, cursor: onClick ? 'pointer' : 'default' }}
              onClick={() => onClick?.(entry)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span style={{ fontSize: 13, color: '#737373', minHeight: 20, lineHeight: '20px', textAlign: 'center' }}>
                {total > 0 ? `${total.toLocaleString('nb-NO')} kr` : '0'}
              </span>
              {total > 0 ? (
                <div style={{ width: barWidth, height: barH, display: 'flex', flexDirection: 'column-reverse' }}>
                  {bars.map((bar, bi) => {
                    const val = entry[bar.dataKey] ?? 0
                    if (val <= 0) return null
                    const segH = Math.max(1, (val / total) * barH)
                    const hasBelow = bars.slice(0, bi).some(b => (entry[b.dataKey] ?? 0) > 0)
                    const hasAbove = bars.slice(bi + 1).some(b => (entry[b.dataKey] ?? 0) > 0)
                    const br = !hasBelow && !hasAbove ? '4px' : !hasBelow ? '0 0 4px 4px' : !hasAbove ? '4px 4px 0 0' : '0'
                    return <div key={bar.dataKey} style={{ height: segH, flexShrink: 0, background: bar.color, borderRadius: br }} />
                  })}
                </div>
              ) : (
                <div style={{ width: barWidth, height: 2, background: '#ccc', borderRadius: '2px 2px 0 0' }} />
              )}
              <span style={{ fontSize: 13, color: '#737373', textAlign: 'center' }}>{entry[xKey]}</span>
            </div>
          )
        })}
      </div>

      {hoveredEntry && totals[hovered] > 0 && (
        <div style={{
          position: 'absolute',
          left: `${((hovered + 0.5) / data.length) * 100}%`,
          top: 24,
          transform: 'translateX(-50%)',
          background: 'white',
          border: '1px solid #ebebeb',
          borderRadius: 8,
          padding: '10px 14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          pointerEvents: 'none',
          zIndex: 10,
          minWidth: 130,
          fontSize: 13,
          whiteSpace: 'nowrap',
        }}>
          <p style={{ margin: '0 0 6px', fontWeight: 600 }}>{hoveredEntry[xKey]}</p>
          {(hoveredEntry.stocks?.length > 0)
            ? hoveredEntry.stocks.map(s => (
                <p key={s.ticker} style={{ margin: '2px 0', color: s.status === 'kommende' ? '#28b482' : '#14555a' }}>
                  {s.ticker}: {s.amount.toLocaleString('nb-NO')} kr
                  {s.status === 'kommende' && <span style={{ fontSize: 11, marginLeft: 4, opacity: 0.8 }}>(kommende)</span>}
                </p>
              ))
            : bars.filter(b => (hoveredEntry[b.dataKey] ?? 0) > 0).map(b => (
                <p key={b.dataKey} style={{ margin: '2px 0', color: b.color }}>
                  {b.name}: {(hoveredEntry[b.dataKey] ?? 0).toLocaleString('nb-NO')} kr
                </p>
              ))
          }
        </div>
      )}
    </div>
  )
}

function StockDividendDetail({ stock, onBack }) {
  return (
    <div style={{ background: 'var(--color-black-3)', minHeight: '100%' }}>
      <div style={{ padding: 'var(--spacing-large)', paddingTop: 'var(--spacing-x-large)', maxWidth: '1510px', margin: '0 auto' }}>

        <Button variant="tertiary" icon="chevron_left" iconPosition="left" text="Tilbake" onClick={onBack} bottom="medium" />

        <div style={{ marginBottom: 'var(--spacing-large)' }}>
          <p style={{ margin: '0 0 4px', color: 'var(--color-black-55)', fontSize: 'var(--font-size-small)' }}>{stock.ticker}</p>
          <p style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 700 }}>{stock.name}</p>
        </div>

        <Grid.Container columns={{ small: 1, medium: 4, large: 4 }} columnGap="small" rowGap="small" bottom="large">
          <Card stack>
            <P top={false} bottom={false} style={{ color: 'var(--color-black-55)' }}>Antall aksjer</P>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stock.qty}</div>
          </Card>
          <Card stack>
            <P top={false} bottom={false} style={{ color: 'var(--color-black-55)' }}>DPS</P>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}><NumberFormat.Currency value={stock.dps} decimals={2} /></div>
          </Card>
          <Card stack>
            <P top={false} bottom={false} style={{ color: 'var(--color-black-55)' }}>Yield</P>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stock.yield.toFixed(2)} %</div>
          </Card>
          <Card stack>
            <P top={false} bottom={false} style={{ color: 'var(--color-black-55)' }}>Frekvens</P>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{stock.frekvens}</div>
          </Card>
        </Grid.Container>

        <Card stack bottom="large">
          <P top={false} bottom="small" style={{ fontWeight: 600 }}>Utbyttehistorikk</P>
          <CustomBarChart data={stock.history} bars={SAMLET_BARS} xKey="year" barWidth={48} maxBarHeight={180} />
        </Card>

        <Card stack>
          <P top={false} bottom="small" style={{ fontWeight: 600 }}>Detaljer</P>
          <Table size="medium">
            <tbody>
              <Tr>
                <Th scope="row">Ex-dato</Th>
                <Td>{stock.exDate}</Td>
              </Tr>
              <Tr>
                <Th scope="row">Dato utbetalt</Th>
                <Td>{stock.payDate}</Td>
              </Tr>
              <Tr>
                <Th scope="row">Utbetalt</Th>
                <Td><span style={{ color: 'var(--color-success-green)', fontWeight: 500 }}><NumberFormat.Currency value={stock.utbetalt} decimals={2} /></span></Td>
              </Tr>
              {stock.kommende > 0 && (
                <Tr>
                  <Th scope="row">Kommende</Th>
                  <Td><span style={{ color: '#14555a', fontWeight: 500 }}><NumberFormat.Currency value={stock.kommende} decimals={2} /></span></Td>
                </Tr>
              )}
              <Tr>
                <Th scope="row">EPS</Th>
                <Td><NumberFormat.Currency value={stock.eps} decimals={2} /></Td>
              </Tr>
            </tbody>
          </Table>
        </Card>
      </div>
      <div style={{ paddingBottom: 'calc(var(--spacing-xx-large) * 2)' }} />
    </div>
  )
}

export default function Dividends() {
  const [chartView, setChartView] = useState('samlet')
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedStock, setSelectedStock] = useState(null)

  if (selectedStock) {
    return <StockDividendDetail stock={selectedStock} onBack={() => setSelectedStock(null)} />
  }

  const isMonthly = selectedYear !== null
  const chartData = isMonthly
    ? (chartView === 'per_aksje' ? buildMonthlyPerStockData(selectedYear) : buildMonthlyChartData(selectedYear))
    : (chartView === 'samlet' ? SAMLET_CHART_DATA : PER_STOCK_CHART_DATA)

  return (
    <div style={{ background: 'var(--color-black-3)', minHeight: '100%' }}>
      <div style={{ padding: 'var(--spacing-large)', paddingTop: 'var(--spacing-x-large)', maxWidth: '1510px', margin: '0 auto' }}>

        {/* Key metrics */}
        <div className="summary-cards" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--spacing-large)' }}>
          <Card stack style={{ position: 'relative', padding: '0.375rem var(--spacing-medium) var(--spacing-small)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p className="summary-card__label" style={{ marginBottom: 0, fontSize: 'var(--font-size-basis)' }}>Totalt utbetalt</p>
              <p className="summary-card__value" style={{ fontSize: '1.375rem', marginBottom: 0, lineHeight: 1.3, color: '#14555a' }}><NumberFormat.Currency value={TOTAL_PAID} /></p>
            </div>
          </Card>
          <Card stack style={{ position: 'relative', padding: '0.375rem var(--spacing-medium) var(--spacing-small)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p className="summary-card__label" style={{ marginBottom: 0, fontSize: 'var(--font-size-basis)' }}>Utbytteavkastning</p>
              <p className="summary-card__value" style={{ fontSize: '1.375rem', marginBottom: 0, lineHeight: 1.3 }}>{AVG_YIELD.toFixed(2)} %</p>
            </div>
          </Card>
          <Card stack style={{ position: 'relative', padding: '0.375rem var(--spacing-medium) var(--spacing-small)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p className="summary-card__label" style={{ marginBottom: 0, fontSize: 'var(--font-size-basis)' }}>Utbetalt i år</p>
              <p className="summary-card__value" style={{ fontSize: '1.375rem', marginBottom: 0, lineHeight: 1.3 }}><NumberFormat.Currency value={TOTAL_PAID} /></p>
            </div>
          </Card>
          <Card stack style={{ position: 'relative', padding: '0.375rem var(--spacing-medium) var(--spacing-small)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p className="summary-card__label" style={{ marginBottom: 0, fontSize: 'var(--font-size-basis)' }}>Kommende utbytte</p>
              <p className="summary-card__value" style={{ fontSize: '1.375rem', marginBottom: 0, lineHeight: 1.3, color: '#14555a' }}><NumberFormat.Currency value={TOTAL_UPCOMING} /></p>
            </div>
          </Card>
        </div>

        {/* Bar chart */}
        <Card stack bottom="large">
          {isMonthly && (
            <Button
              variant="tertiary"
              icon="chevron_left"
              iconPosition="left"
              size="small"
              text="Alle år"
              onClick={() => setSelectedYear(null)}
              bottom="x-small"
            />
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-small)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-small)' }}>
              <P top={false} bottom={false} style={{ fontWeight: 600 }}>
                {isMonthly ? `Utbytte ${selectedYear}` : 'Utbyttehistorikk'}
              </P>
            </div>
            {(
              <div style={{ flexShrink: 0 }}>
                <ToggleButton.Group
                  value={chartView}
                  onChange={({ value }) => setChartView(value)}
                >
                  <ToggleButton text="Samlet" value="samlet" />
                  <ToggleButton text="Per aksje" value="per_aksje" />
                </ToggleButton.Group>
              </div>
            )}
          </div>

          <CustomBarChart
            key={`${chartView}-${selectedYear ?? 'all'}`}
            data={chartData}
            bars={chartView === 'samlet' ? SAMLET_BARS : PER_STOCK_BARS}
            xKey={isMonthly ? 'month' : 'year'}
            barWidth={isMonthly ? 24 : 52}
            maxBarHeight={200}
            onClick={!isMonthly ? (entry) => setSelectedYear(entry.year) : undefined}
          />

          {chartView === 'samlet' && (
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 16, borderTop: '1px solid #ebebeb', paddingTop: 16 }}>
              {SAMLET_BARS.filter(b => chartData.some(d => (d[b.dataKey] ?? 0) > 0)).map(b => (
                <div key={b.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: b.color }} />
                  <span style={{ fontSize: 14, color: '#333' }}>{b.name}</span>
                </div>
              ))}
            </div>
          )}
          {chartView === 'per_aksje' && (
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16, borderTop: '1px solid #ebebeb', paddingTop: 16 }}>
              {PER_STOCK_BARS.filter(b => chartData.some(d => (d[b.dataKey] ?? 0) > 0)).map(b => (
                <div key={b.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: b.color }} />
                  <span style={{ fontSize: 14, color: '#333' }}>{b.name}</span>
                </div>
              ))}
            </div>
          )}

          {!isMonthly && (
            <p style={{ textAlign: 'center', margin: '4px 0 0', fontSize: '12px', color: 'var(--color-black-55)' }}>
              Klikk på et år for månedlig visning
            </p>
          )}
        </Card>

        {/* Dividend table */}
        <Card stack>
          <P top={false} bottom="small" style={{ fontWeight: 600 }}>Beholdning utbytteaksjer</P>
          <div style={{ overflowX: 'auto' }}>
            <Table size="medium" style={{ width: '100%', minWidth: '900px' }}>
              <caption className="dnb-sr-only">Utbytteaksjer</caption>
              <thead>
                <Tr noWrap>
                  <Th>Navn</Th>
                  <Th align="right">Antall</Th>
                  <Th align="right">DPS</Th>
                  <Th align="right">EPS</Th>
                  <Th align="right">Yield</Th>
                  <Th align="right">Total utbytte</Th>
                  <Th align="right">Ex-dato</Th>
                  <Th align="right">Dato utbetalt</Th>
                  <Th align="right">Frekvens</Th>
                </Tr>
              </thead>
              <tbody>
                {DIVIDEND_STOCKS.map((d, i) => (
                  <Tr key={d.ticker} variant={i % 2 === 0 ? 'odd' : undefined}>
                    <Td>
                      <span
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--color-sea-green)', fontWeight: 500, textDecoration: 'underline' }}
                        onClick={() => setSelectedStock(d)}
                      >
                        {d.name}
                        <Icon icon={chevron_right} size="small" />
                      </span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--color-black-55)' }}>{d.ticker}</span>
                    </Td>
                    <Td align="right">{d.qty}</Td>
                    <Td align="right"><NumberFormat.Currency value={d.dps} decimals={2} /></Td>
                    <Td align="right"><NumberFormat.Currency value={d.eps} decimals={2} /></Td>
                    <Td align="right">{d.yield.toFixed(2)} %</Td>
                    <Td align="right"><NumberFormat.Currency value={d.utbetalt + d.kommende} decimals={2} /></Td>
                    <Td align="right">{d.exDate}</Td>
                    <Td align="right">{d.payDate}</Td>
                    <Td align="right">{d.frekvens}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>

      </div>
      <div style={{ paddingBottom: 'calc(var(--spacing-xx-large) * 2)' }} />
    </div>
  )
}
