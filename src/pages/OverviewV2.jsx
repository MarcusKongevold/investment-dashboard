import React, { useState, useMemo } from 'react'
import { Card, Button, Tabs, NumberFormat, Switch, Dropdown, List, Anchor } from '@dnb/eufemia'
import { information_circled_medium } from '@dnb/eufemia/icons'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import Watchlist from '../components/Watchlist.jsx'
import NewsPanel from '../components/NewsPanel.jsx'

// ─── Account data (mirrors SummaryCards) ─────────────────────

const ACCOUNT_VALUES = {
  'Alle kontoer':                { egenkapital: 1250000, markedsverdi: 1500000, tilgjengelig: 17589, change: 34.6,  changeAmount: 77339 },
  'Alle kontoer (uten pensjon)': { egenkapital:  860000, markedsverdi: 1050000, tilgjengelig: 17589, change:  4.9,  changeAmount: 48599 },
  'VPS-konto':                   { egenkapital:  520000, markedsverdi:  610000, tilgjengelig:  8200, change:  8.7,  changeAmount: 12480 },
  'Pensjonskonto':               { egenkapital:  390000, markedsverdi:  450000, tilgjengelig:     0, change: 21.3,  changeAmount: 28740 },
  'ASK Underkonto 1':            { egenkapital:  210000, markedsverdi:  270000, tilgjengelig:  6100, change: 12.4,  changeAmount: 14820 },
  'ASK Underkonto 2':            { egenkapital:  130000, markedsverdi:  170000, tilgjengelig:  3289, change: -2.4,  changeAmount: -4299 },
}

function getAccountData(selectedAccount, includePensions) {
  const key = selectedAccount === 'Alle kontoer' && !includePensions
    ? 'Alle kontoer (uten pensjon)'
    : selectedAccount
  return ACCOUNT_VALUES[key] ?? ACCOUNT_VALUES['Alle kontoer']
}

// ─── Chart data ───────────────────────────────────────────────

const BASE_MARKEDSVERDI = 1500000

const generateMonthlyData = () => {
  const years = [2020, 2021, 2022, 2023, 2024]
  const data = []
  let value = 900000
  years.forEach((year) => {
    for (let m = 0; m < 12; m++) {
      const fluctuation = (Math.random() - 0.42) * 30000
      value = Math.max(700000, value + fluctuation + 3000)
      if (year === 2022 && m > 3 && m < 10) value -= 15000
      data.push({ label: m === 0 ? String(year) : '', value: Math.round(value) })
    }
  })
  return data
}

const generateDailyData = (baseValue) => {
  const data = []
  let value = baseValue - 50000
  for (let d = 30; d >= 0; d--) {
    const date = new Date(2025, 3, 22 - d)
    const fluctuation = (Math.random() - 0.45) * 800
    value = Math.max(value * 0.97, value + fluctuation + 80)
    const day = date.getDate()
    const month = date.toLocaleString('nb-NO', { month: 'short' })
    data.push({ label: day === 1 ? month : day % 5 === 0 ? String(day) : '', value: Math.round(value) })
  }
  return data
}

const MONTHLY_DATA = generateMonthlyData()
const DAILY_DATA = generateDailyData(MONTHLY_DATA[MONTHLY_DATA.length - 1].value)

const PERIODS = [
  { key: '1W',  label: '1 W' },
  { key: '1M',  label: '1 M' },
  { key: '3M',  label: '3 M' },
  { key: '6M',  label: '6 M' },
  { key: 'YTD', label: 'YTD' },
  { key: '1Y',  label: '1 Y' },
  { key: '3Y',  label: '3 Y' },
  { key: '5Y',  label: '5 Y' },
  { key: 'ALL', label: 'All' },
]

function getRawChartData(period) {
  if (period === '1W')  return DAILY_DATA.slice(-7)
  if (period === '1M')  return DAILY_DATA
  if (period === '3M')  return MONTHLY_DATA.slice(-3)
  if (period === '6M')  return MONTHLY_DATA.slice(-6)
  if (period === 'YTD') return MONTHLY_DATA.slice(-4)
  if (period === '1Y')  return MONTHLY_DATA.slice(-12)
  if (period === '3Y')  return MONTHLY_DATA.slice(-36)
  if (period === '5Y')  return MONTHLY_DATA.slice(-60)
  return MONTHLY_DATA
}

function scaleChartData(data, scaleFactor) {
  return data.map(d => ({ ...d, value: Math.round(d.value * scaleFactor) }))
}

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

function formatYAxis(value) {
  if (value >= 1000000) return `${(value / 1000000).toLocaleString('nb-NO', { maximumFractionDigits: 1 })} M`
  if (value >= 1000) return `${Math.round(value / 1000)}k`
  return String(value)
}

// ─── Live stats row ───────────────────────────────────────────

function LiveStatsRow({ accountData }) {
  const scaleFactor = accountData.markedsverdi / BASE_MARKEDSVERDI
  const todayAmount = Math.round(accountData.changeAmount * 0.04 * scaleFactor)
  const todayPct = (accountData.change * 0.05).toFixed(2)
  const positive = todayAmount >= 0

  const cards = [
    {
      label: 'Egenkapital (Live)',
      content: <NumberFormat.Currency value={accountData.egenkapital} />,
    },
    {
      label: 'Markedsverdi (Live)',
      content: <NumberFormat.Currency value={accountData.markedsverdi} />,
    },
    {
      label: 'Utvikling i dag (Live)',
      content: (
        <span className={`change-badge change-badge--${positive ? 'positive' : 'negative'}`}>
          {positive ? '+ ' : '- '}<NumberFormat.Currency value={Math.abs(todayAmount)} />
          <span style={{ fontWeight: 'normal', marginLeft: '0.25rem' }}>({positive ? '+' : ''}{todayPct}%)</span>
        </span>
      ),
    },
  ]

  return (
    <div className="summary-cards">
      {cards.map(({ label, content }) => (
        <Card key={label} stack style={{ position: 'relative', padding: '0.375rem var(--spacing-medium) var(--spacing-small)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            <p className="summary-card__label" style={{ marginBottom: 0, fontSize: 'var(--font-size-basis)' }}>{label}</p>
            <p className="summary-card__value" style={{ fontSize: '1.375rem', marginBottom: 0, lineHeight: 1.3 }}>{content}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Chart card ───────────────────────────────────────────────

function ChartCard({ accountData }) {
  const [chartTab, setChartTab] = useState('avkastning')
  const [period, setPeriod] = useState('ALL')

  const scaleFactor = accountData.markedsverdi / BASE_MARKEDSVERDI
  const chartData = useMemo(
    () => scaleChartData(getRawChartData(period), scaleFactor),
    [period, scaleFactor]
  )

  const firstValue = chartData[0]?.value ?? 1
  const lastValue = chartData[chartData.length - 1]?.value ?? firstValue
  const chartChange = lastValue - firstValue
  const chartPct = (chartChange / firstValue) * 100

  // For the ALL period, use account-level totals for accuracy
  const isAll = period === 'ALL'
  const displayPct = isAll ? accountData.change : chartPct
  const displayAmount = isAll ? accountData.changeAmount : chartChange
  const positive = displayPct >= 0

  const isMarked = chartTab === 'markedsverdi'
  const periodLabel = period === 'ALL' ? (isMarked ? 'All time' : 'Siden start')
    : period === 'YTD' ? 'Hittil i år'
    : `Siste ${PERIODS.find(p => p.key === period)?.label ?? ''}`

  return (
    <Card stack style={{ overflow: 'hidden' }}>
      {/* Inner tabs */}
      <div style={{ paddingTop: 'var(--spacing-x-small)', borderBottom: '1px solid var(--color-black-8)' }}>
        <Tabs
          noBorder
          selectedKey={chartTab}
          data={[
            { title: 'Avkastning', key: 'avkastning' },
            { title: 'Markedsverdi', key: 'markedsverdi' },
          ]}
          
          onChange={({ selectedKey }) => setChartTab(selectedKey)}
        />
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 'var(--spacing-small)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-black-55)' }}>{periodLabel}</span>

          {isMarked ? (
            <>
              <span style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-black)', lineHeight: 1.2 }}>
                <NumberFormat.Currency value={isAll ? accountData.markedsverdi : lastValue} />
              </span>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: positive ? '#ebf4f2' : '#fdecea', borderRadius: '8px', padding: '2px 10px', alignSelf: 'flex-start' }}>
                <span style={{ fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)', color: positive ? '#007b5e' : 'var(--color-fire-red)' }}>
                  {positive ? '+' : ''}{displayPct.toFixed(2)} %
                </span>
              </div>
            </>
          ) : (
            <>
              <span style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-medium)', color: positive ? '#007272' : 'var(--color-fire-red)', lineHeight: 1.2 }}>
                {positive ? '+' : ''}{displayPct.toFixed(2)} %
              </span>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: positive ? '#ebf4f2' : '#fdecea', borderRadius: '8px', padding: '2px 10px', alignSelf: 'flex-start' }}>
                <span style={{ fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)', color: positive ? '#007b5e' : 'var(--color-fire-red)' }}>
                  {positive ? '+ ' : '- '}{Math.abs(Math.round(displayAmount)).toLocaleString('nb-NO')} kr
                </span>
              </div>
            </>
          )}
        </div>

        <Dropdown
          variant="tertiary"
          size="small"
          preventSelection
          title="Sammenlign"
          data={[
            { value: 'oslobors', content: 'Oslo Børs' },
            { value: 'sp500', content: 'S&P 500' },
            { value: 'benchmark', content: 'Referanseindeks' },
          ]}
          independentWidth
        />
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 48, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="v2ChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={positive ? '#ebf4f2' : '#fdecea'} stopOpacity={1} />
                <stop offset="95%" stopColor={positive ? '#ebf4f2' : '#fdecea'} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--color-black-8)" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--color-black-55)' }} axisLine={false} tickLine={false} interval={0} />
            {isMarked ? (
              <YAxis
                orientation="right"
                tickFormatter={formatYAxis}
                tick={{ fontSize: 12, fill: 'var(--color-black-55)' }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
            ) : (
              <YAxis
                orientation="right"
                tickFormatter={v => `${((v - firstValue) / firstValue * 100).toFixed(0)} %`}
                tick={{ fontSize: 12, fill: 'var(--color-black-55)' }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={positive ? '#007272' : 'var(--color-fire-red)'}
              strokeWidth={2}
              fill="url(#v2ChartGradient)"
              dot={false}
              activeDot={{ r: 4, fill: positive ? '#007272' : 'var(--color-fire-red)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Period selector */}
      <div style={{ display: 'flex', margin: '0 calc(-1 * var(--spacing-medium)) calc(-1 * var(--spacing-medium))', borderTop: '1px solid var(--color-black-8)' }}>
        {PERIODS.map(({ key, label }) => {
          const isActive = key === period
          return (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              style={{
                all: 'unset',
                flex: 1,
                cursor: 'pointer',
                padding: 'var(--spacing-small) 0',
                textAlign: 'center',
                fontSize: 'var(--font-size-small)',
                fontWeight: isActive ? 'var(--font-weight-medium)' : 'normal',
                color: isActive ? 'var(--color-white)' : isMarked ? '#007272' : 'var(--color-black-55)',
                background: isActive ? 'var(--color-sea-green)' : 'transparent',
                borderRadius: '4px',
                margin: isActive ? '4px 2px' : '4px 0',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--color-black-3)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

// ─── Stat cards row ───────────────────────────────────────────

function StatCardsRow({ accountData }) {
  const scaleFactor = accountData.markedsverdi / BASE_MARKEDSVERDI

  function computeStat(period) {
    const data = scaleChartData(getRawChartData(period), scaleFactor)
    const firstValue = data[0]?.value ?? 1
    const lastValue = data[data.length - 1]?.value ?? firstValue
    const amount = Math.round(lastValue - firstValue)
    const pct = ((amount / firstValue) * 100).toFixed(2)
    return { amount, pct }
  }

  function computeToday() {
    const data = scaleChartData(DAILY_DATA, scaleFactor)
    const prev = data[data.length - 2]?.value ?? data[data.length - 1]?.value ?? 1
    const last = data[data.length - 1]?.value ?? prev
    const amount = Math.round(last - prev)
    const pct = ((amount / prev) * 100).toFixed(2)
    return { amount, pct }
  }

  const stats = [
    { label: 'Avkastning i dag',     ...computeToday() },
    { label: 'Avkastning siste uke', ...computeStat('1W') },
    { label: 'Avkastning i år',      ...computeStat('YTD') },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-small)' }}>
      {stats.map(({ label, pct, amount }) => {
        const positive = amount >= 0
        return (
          <Card key={label} stack>
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-black-55)', marginBottom: 'var(--spacing-x-small)' }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-x-small)', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 'var(--font-weight-medium)', color: positive ? '#007272' : 'var(--color-fire-red)' }}>
                {positive ? '+ ' : '- '}<NumberFormat.Currency value={Math.abs(amount)} />
              </span>
              <span className={`change-badge change-badge--${positive ? 'positive' : 'negative'}`}>
                ({positive ? '+' : ''}{pct}%)
              </span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// ─── Oversikt sidebar card ────────────────────────────────────

function OversiktCard({ accountData }) {
  const items = [
    { label: 'Ikke investert',      value: accountData.tilgjengelig },
    { label: 'Kreditt',             value: 17589 },
  ]

  return (
    <Card stack>
      <List.Container>
          {items.map(({ label, value }) => (
            <List.Item.Basic key={label} title={label}>
              <List.Cell.End>
                <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  <NumberFormat.Currency value={value} />
                </span>
              </List.Cell.End>
            </List.Item.Basic>
          ))}
          <List.Item.Basic title="Pågående fondsordre">
            <List.Cell.End>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                <NumberFormat.Currency value={500} />
              </span>
            </List.Cell.End>
            <List.Cell.Footer>
              <Anchor href="#" style={{ fontSize: 'var(--font-size-small)' }}>
                → Overfør
              </Anchor>
            </List.Cell.Footer>
          </List.Item.Basic>
        </List.Container>
    </Card>
  )
}

// ─── Account filter with Live price ──────────────────────────

const ACCOUNT_DATA = [
  { value: 'Alle kontoer', content: 'Alle kontoer' },
  { value: 'VPS-konto', content: 'VPS-konto' },
  { value: 'Pensjonskonto', content: 'Pensjonskonto' },
  { value: 'ASK Underkonto 1', selectedValue: 'ASK Underkonto 1', content: 'ASK Underkonto 1' },
  { value: 'ASK Underkonto 2', selectedValue: 'ASK Underkonto 2', content: 'ASK Underkonto 2' },
]

function FilterBar({ selectedAccount, onAccountChange, includePensions, onIncludePensionsChange }) {
  const [livePrice, setLivePrice] = useState(false)

  return (
    <div style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-black-8)' }}>
      <div style={{ maxWidth: '1510px', margin: '0 auto', padding: 'var(--spacing-small) var(--spacing-large)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-medium)' }}>
        <Dropdown
          variant="tertiary"
          size="small"
          value={selectedAccount}
          data={ACCOUNT_DATA}
          onChange={({ data }) => onAccountChange(data.value)}
          independentWidth
        />
        {selectedAccount === 'Alle kontoer' && (
          <Switch
            label="Inkluder pensjonskontoer"
            label_position="right"
            checked={includePensions}
            size="medium"
            onChange={({ checked }) => onIncludePensionsChange(checked)}
          />
        )}
        <div style={{ marginLeft: 'auto' }}>
          <Switch
            label="Live price"
            label_position="right"
            checked={livePrice}
            size="medium"
            onChange={({ checked }) => setLivePrice(checked)}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export default function OverviewV2({ onStockClick, selectedAccount, onAccountChange, includePensions, onIncludePensionsChange }) {
  const accountData = getAccountData(selectedAccount, includePensions)

  return (
    <div>
      <FilterBar
        selectedAccount={selectedAccount}
        onAccountChange={onAccountChange}
        includePensions={includePensions}
        onIncludePensionsChange={onIncludePensionsChange}
      />
      <div style={{ maxWidth: '1510px', margin: '0 auto', padding: 'var(--spacing-large)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-large)' }}>
        <LiveStatsRow accountData={accountData} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: 'var(--spacing-large)', alignItems: 'start' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-large)', minWidth: 0 }}>
            <ChartCard accountData={accountData} />
            <StatCardsRow accountData={accountData} />
            <Watchlist onStockClick={onStockClick} />
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-large)', minWidth: 0 }}>
            <OversiktCard accountData={accountData} />
            <NewsPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
