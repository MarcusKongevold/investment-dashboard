import React, { useState } from 'react'
import { Button, Input, Dropdown, Table, Th, Tr, Td, Icon } from '@dnb/eufemia'
import arrow_left from '@dnb/eufemia/icons/arrow_left'
import filter_medium from '@dnb/eufemia/icons/filter_medium'
import table_medium from '@dnb/eufemia/icons/table_medium'
import arrow_right from '@dnb/eufemia/icons/arrow_right'

const FUNDS = [
  { name: 'BlackRock World Technology', return1y: 3.33, return3y: 11.30, return5y: 110.30, cost: 0.35, risk: 5, sustainable: true, morningstar: 4 },
  { name: 'DNB Teknologi A',            return1y: 3.33, return3y: 11.30, return5y: 110.30, cost: 0.35, risk: 4, sustainable: true, morningstar: 4 },
  { name: 'Storebrand Global',          return1y: 2.10, return3y:  9.80, return5y:  87.40, cost: 0.20, risk: 4, sustainable: true, morningstar: 5 },
  { name: 'KLP AksjeGlobal Indeks',     return1y: 2.05, return3y:  9.50, return5y:  85.10, cost: 0.15, risk: 4, sustainable: true, morningstar: 5 },
  { name: 'Alfred Berg Norge',          return1y:-1.20, return3y:  5.60, return5y:  42.30, cost: 0.75, risk: 5, sustainable: false, morningstar: 3 },
  { name: 'Holberg Norden',             return1y: 1.80, return3y:  7.90, return5y:  64.20, cost: 0.60, risk: 5, sustainable: false, morningstar: 4 },
  { name: 'Handelsbanken Global',       return1y: 2.40, return3y: 10.10, return5y:  91.60, cost: 0.25, risk: 4, sustainable: true, morningstar: 4 },
  { name: 'DNB Norge Selektiv',         return1y:-0.50, return3y:  4.20, return5y:  37.80, cost: 0.80, risk: 5, sustainable: true, morningstar: 3 },
  { name: 'ODIN Norge',                 return1y: 0.90, return3y:  6.10, return5y:  51.40, cost: 0.90, risk: 5, sustainable: false, morningstar: 3 },
  { name: 'Nordea Global',              return1y: 1.95, return3y:  8.70, return5y:  76.50, cost: 0.30, risk: 4, sustainable: true, morningstar: 4 },
  { name: 'Pareto Nordic Equity',       return1y: 1.20, return3y:  6.80, return5y:  58.90, cost: 0.85, risk: 5, sustainable: false, morningstar: 3 },
  { name: 'DNB Global Indeks',          return1y: 2.20, return3y:  9.90, return5y:  88.20, cost: 0.20, risk: 4, sustainable: true, morningstar: 5 },
]

const SORT_OPTIONS = {
  default:   'Standard',
  return1y:  '1 år avkastning',
  return3y:  '3 år avkastning',
  return5y:  '5 år avkastning',
  cost:      'Kostnad',
  morningstar: 'Morningstar',
}

const BOTTOM_CARDS = [
  { label: 'Andre som deg investerer i', gradient: 'linear-gradient(135deg, #0f3d35 0%, #007272 100%)' },
  { label: 'Populære investeringer',     gradient: 'linear-gradient(135deg, #1a3a5c 0%, #007272 100%)' },
  { label: 'Våre fondsanbefalinger',     gradient: 'linear-gradient(135deg, #007272 0%, #00b0b9 100%)' },
]

function RiskBars({ level }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '18px' }}>
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <div
          key={i}
          style={{
            width: '4px',
            height: `${4 + i * 2}px`,
            borderRadius: '1px',
            background: i <= level ? '#007272' : 'var(--color-black-20)',
          }}
        />
      ))}
    </div>
  )
}

function Stars({ count }) {
  return (
    <span style={{ color: '#f5a623', fontSize: '14px', letterSpacing: '1px' }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  )
}

function ReturnCell({ value }) {
  const positive = value >= 0
  return (
    <span style={{ color: positive ? '#007b5e' : 'var(--color-fire-red)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-small)' }}>
      {positive ? '+' : ''}{value.toFixed(2).replace('.', ',')}%
    </span>
  )
}

export default function PopularFunds({ onBack }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('default')

  const filtered = FUNDS
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    .slice()
    .sort((a, b) => {
      if (sortKey === 'default') return 0
      if (sortKey === 'cost') return a.cost - b.cost
      return b[sortKey] - a[sortKey]
    })

  return (
    <div style={{ background: 'var(--color-black-3)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0a2e28 0%, #007272 60%, #00b0b9 100%)',
        padding: 'var(--spacing-large)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-small)' }}>
          <Button
            variant="tertiary"
            size="small"
            icon={arrow_left}
            iconPosition="left"
            text="Tilbake"
            onClick={onBack}
            style={{ color: 'var(--color-white)', alignSelf: 'flex-start' }}
          />
          <h1 style={{ color: 'var(--color-white)', fontSize: 'var(--font-size-xx-large)', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
            Populære fond
          </h1>
        </div>
        {/* Decorative gem shape */}
        <div style={{
          position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)',
          width: '160px', height: '160px', opacity: 0.25,
          background: 'linear-gradient(135deg, #ffffff 0%, #00b0b9 100%)',
          clipPath: 'polygon(50% 0%, 100% 35%, 85% 100%, 15% 100%, 0% 35%)',
        }} />
      </div>

      {/* Filter bar */}
      <div style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-black-8)', padding: 'var(--spacing-small) var(--spacing-large)' }}>
        <div style={{ maxWidth: '1510px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: 'var(--spacing-small)' }}>
          <Input
            placeholder="Søk..."
            icon="loupe"
            size="medium"
            value={search}
            onChange={({ value }) => setSearch(value)}
            style={{ minWidth: '200px' }}
          />
          <Button variant="secondary" size="medium" icon={filter_medium} iconPosition="left" text="Filter" />
          <Dropdown
            variant="secondary"
            size="medium"
            value={sortKey}
            data={SORT_OPTIONS}
            onChange={({ value }) => setSortKey(value)}
            title="Sortering"
            independentWidth
          />
          <div style={{ marginLeft: 'auto' }}>
            <Button variant="secondary" size="medium" icon={table_medium} iconPosition="left" text="Tabell" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ maxWidth: '1510px', margin: '0 auto', padding: 'var(--spacing-large)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-large)' }}>
        <div style={{ background: 'var(--color-white)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-black-8)' }}>
          <Table.ScrollView>
            <Table style={{ width: '100%', minWidth: '900px' }}>
              <thead>
                <Tr noWrap>
                  <Th>Fond</Th>
                  <Th align="right">1 år</Th>
                  <Th align="right">3 år</Th>
                  <Th align="right">5 år</Th>
                  <Th align="right">Kostnad</Th>
                  <Th>Risiko</Th>
                  <Th>Bærekraft</Th>
                  <Th>Morningstar</Th>
                  <Th />
                  <Th align="right">Belåning</Th>
                </Tr>
              </thead>
              <tbody>
                {filtered.map(({ name, return1y, return3y, return5y, cost, risk, sustainable, morningstar }) => (
                  <Tr key={name}>
                    <Td>
                      <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-basis)' }}>{name}</span>
                    </Td>
                    <Td align="right"><ReturnCell value={return1y} /></Td>
                    <Td align="right"><ReturnCell value={return3y} /></Td>
                    <Td align="right"><ReturnCell value={return5y} /></Td>
                    <Td align="right">
                      <span style={{ fontSize: 'var(--font-size-small)' }}>{cost.toFixed(2).replace('.', ',')}%</span>
                    </Td>
                    <Td><RiskBars level={risk} /></Td>
                    <Td>
                      {sustainable ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-small)' }}>
                          Ja
                          <span style={{ background: '#007272', color: 'var(--color-white)', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>J</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-black-55)' }}>–</span>
                      )}
                    </Td>
                    <Td><Stars count={morningstar} /></Td>
                    <Td>
                      <Button variant="secondary" size="small" style={{ margin: 0 }}>ASK</Button>
                    </Td>
                    <Td align="right">
                      <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-black-55)' }}>–</span>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </Table.ScrollView>
        </div>

        {/* Andre investeringsmuligheter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-small)' }}>
          <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: 0 }}>
            Andre investeringsmuligheter
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-medium)' }}>
            {BOTTOM_CARDS.map(({ label, gradient }) => (
              <div
                key={label}
                className="promo-card"
                style={{ background: gradient, cursor: 'pointer', borderRadius: '16px', minHeight: '120px' }}
                role="button"
                tabIndex={0}
              >
                <div className="promo-card__overlay">
                  <span className="promo-card__label">{label}</span>
                  <Icon icon={arrow_right} style={{ color: 'var(--color-white)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
