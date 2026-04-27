import React, { useState } from 'react'
import { Card, NumberFormat } from '@dnb/eufemia'
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const PERIOD_LABELS_LIST = ['1 dag', '7 dager', '30 dager', '3 måneder', '6 måneder', 'Hittil i år', '1 år', '3 år', '5 år', 'Siden start']

function calcPeriodChange(period) {
  const data = filterByPeriod(null, period)
  const first = data[0]?.value ?? 1
  const last = data[data.length - 1]?.value ?? first
  return ((last - first) / first) * 100
}

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

const generateChartData = () => {
  const years = [2020, 2021, 2022, 2023, 2024]
  const data = []
  let value = 900000
  years.forEach((year) => {
    for (let m = 0; m < 12; m++) {
      const fluctuation = (Math.random() - 0.42) * 30000
      value = Math.max(700000, value + fluctuation + 3000)
      if (year === 2022 && m > 3 && m < 10) value -= 15000
      data.push({ label: m === 0 ? String(year) : '', value: Math.round(value), month: m, year })
    }
  })
  return data
}

const allChartData = generateChartData()

const generateDailyData = () => {
  const lastMonthValue = allChartData[allChartData.length - 1].value
  const data = []
  let value = lastMonthValue - 3200
  for (let d = 30; d >= 0; d--) {
    const date = new Date(2025, 3, 16 - d)
    const fluctuation = (Math.random() - 0.45) * 800
    value = Math.max(value * 0.97, value + fluctuation + 80)
    const day = date.getDate()
    const month = date.toLocaleString('nb-NO', { month: 'short' })
    data.push({ label: day === 1 ? month : day % 5 === 0 ? String(day) : '', value: Math.round(value), day: d })
  }
  return data
}

const allDailyData = generateDailyData()

function filterByPeriod(_, period) {
  if (period === '1 dag')    return allDailyData.slice(-2)
  if (period === '7 dager')  return allDailyData.slice(-7)
  if (period === '30 dager') return allDailyData
  const months = {
    '3 måneder': 3, '6 måneder': 6, 'Hittil i år': 12,
    '1 år': 12, '3 år': 36, '5 år': 60, 'Siden start': Infinity,
  }
  const n = months[period] ?? allChartData.length
  return n >= allChartData.length ? allChartData : allChartData.slice(-n)
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

export default function PortfolioChart() {
  const [selectedPeriod, setSelectedPeriod] = useState('1 år')
  const chartData = filterByPeriod(null, selectedPeriod)
  const firstValue = chartData[0]?.value ?? allChartData[0].value
  const lastValue = chartData[chartData.length - 1]?.value ?? firstValue
  const change = lastValue - firstValue
  const pctChange = (change / firstValue) * 100
  const positive = pctChange >= 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-x-small)' }}>
      <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: 0 }}>Utvikling</p>
      <Card stack>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: 'var(--font-size-basis)', color: 'var(--color-black-55)' }}>
            {PERIOD_LABEL[selectedPeriod]}
          </span>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: positive ? '#ebf4f2' : '#fdecea', borderRadius: '8px', padding: '2px 8px', alignSelf: 'flex-start' }}>
            <span style={{ fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)', color: positive ? '#007b5e' : 'var(--color-fire-red)', whiteSpace: 'nowrap' }}>
              {positive ? '+' : ''}{pctChange.toFixed(1)}% ({positive ? '+' : ''}{Math.abs(Math.round(change)).toLocaleString('nb-NO')} kr)
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: '241px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor={positive ? '#ebf4f2' : '#fdecea'} stopOpacity={1} />
                  <stop offset="95%" stopColor={positive ? '#ebf4f2' : '#fdecea'} stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="" vertical={false} stroke="var(--color-black-8)" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--color-black-55)' }} axisLine={false} tickLine={false} interval={0} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={positive ? '#007272' : 'var(--color-fire-red)'}
                strokeWidth={2}
                fill="url(#chartGradient)"
                dot={false}
                activeDot={{ r: 4, fill: positive ? '#007272' : 'var(--color-fire-red)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ overflowX: 'auto', margin: '0 calc(-1 * var(--spacing-medium)) calc(-1 * var(--spacing-medium))' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(100px, 1fr))', borderTop: '1px solid var(--color-black-8)' }}>
            {PERIOD_LABELS_LIST.map((label, i) => {
              const statChange = calcPeriodChange(label)
              const isPositive = statChange >= 0
              const isActive = label === selectedPeriod
              const isLastInRow = (i + 1) % 5 === 0
              const isBottomRow = i >= 5
              return (
                <button
                  key={label}
                  onClick={() => setSelectedPeriod(label)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: 'var(--spacing-small) var(--spacing-medium)',
                    borderRight: !isLastInRow ? '1px solid var(--color-black-8)' : 'none',
                    borderBottom: !isBottomRow ? '1px solid var(--color-black-8)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.25rem',
                    background: isActive ? 'var(--color-black-3)' : 'transparent',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--color-black-3)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ fontSize: 'var(--font-size-x-small)', color: isActive ? 'var(--color-black-80)' : 'var(--color-black-55)', fontWeight: isActive ? 'var(--font-weight-medium)' : 'normal' }}>
                    {label}
                  </div>
                  <span style={{ fontSize: 'var(--font-size-x-small)', fontWeight: 'var(--font-weight-medium)', color: isPositive ? '#007b5e' : 'var(--color-fire-red)' }}>
                    {isPositive ? '+' : ''}{statChange.toFixed(1)}%
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
