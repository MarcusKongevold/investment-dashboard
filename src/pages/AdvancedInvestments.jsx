import React, { useState } from 'react'
import { GlobalStatus, List } from '@dnb/eufemia'

const naeringsHoldings = [
  {
    name: 'Master DNB SPF IS',
    date: 'Oppdatert dd.mm.yyyy',
    value: '29 341 888 kr',
    stats: [
      { value: '292 340', label: 'Andeler' },
      { value: '29 878 008 kr', label: 'Markedsverdi' },
      { value: '10 000 000', label: 'Kostpris' },
      { value: '+19 878 008 kr', label: 'Urealisert Avkastning', positive: true },
      { value: '2 000 000 kr', label: 'Mottatt utbytte siden start' },
      { value: '300 000 kr', label: 'Mottatt utbytte i år (YTD)' },
    ],
  },
  {
    name: 'Master DNB SPF IS',
    date: 'Oppdatert dd.mm.yyyy',
    value: '29 341 888 kr',
    stats: [
      { value: '292 340', label: 'Andeler' },
      { value: '29 878 008 kr', label: 'Markedsverdi' },
      { value: '10 000 000', label: 'Kostpris' },
      { value: '+19 878 008 kr', label: 'Urealisert Avkastning', positive: true },
      { value: '2 000 000 kr', label: 'Mottatt utbytte siden start' },
      { value: '300 000 kr', label: 'Mottatt utbytte i år (YTD)' },
    ],
  },
  {
    name: 'Master DNB SPF IS',
    date: 'Oppdatert dd.mm.yyyy',
    value: '29 341 888 kr',
    stats: [
      { value: '292 340', label: 'Andeler' },
      { value: '29 878 008 kr', label: 'Markedsverdi' },
      { value: '10 000 000', label: 'Kostpris' },
      { value: '+19 878 008 kr', label: 'Urealisert Avkastning', positive: true },
      { value: '2 000 000 kr', label: 'Mottatt utbytte siden start' },
      { value: '300 000 kr', label: 'Mottatt utbytte i år (YTD)' },
    ],
  },
]

const privateEquityHoldings = [
  {
    name: 'DNB Private Equity IV IS',
    date: 'Oppdatert dd.mm.yyyy',
    value: '26 145 474 kr',
    stats: [
      { value: '10 000 000', label: 'Andeler' },
      { value: 'EUR', label: 'Valuta' },
      { value: '11.23 kr', label: 'Vekslingsrate' },
    ],
  },
  {
    name: 'DNB Private Equity IV IS',
    date: 'Oppdatert dd.mm.yyyy',
    value: '26 145 474 kr',
    stats: [
      { value: '10 000 000', label: 'Andeler' },
      { value: 'EUR', label: 'Valuta' },
      { value: '11.23 kr', label: 'Vekslingsrate' },
    ],
  },
]

function StatsRow({ stats }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, paddingBottom: 'var(--spacing-small)', width: '100%' }}>
      {stats.map((stat) => (
        <div key={stat.label}>
          <div style={{ fontSize: 'var(--font-size-x-small)', color: 'var(--color-black-55)' }}>
            {stat.label}
          </div>
          <div
            style={{
              fontSize: 'var(--font-size-small)',
              color: stat.positive ? 'var(--color-sea-green)' : 'var(--color-black)',
              fontWeight: stat.positive ? 'var(--font-weight-medium)' : 'inherit',
            }}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdvancedInvestments() {
  const [naeringsOpen, setNaeringsOpen] = useState(false)
  const [privateOpen, setPrivateOpen] = useState(false)

  return (
    <div
      style={{
        maxWidth: '1510px',
        margin: '0 auto',
        padding: 'var(--spacing-large)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-large)',
      }}
    >
      <GlobalStatus
        state="info"
        title={false}
        text={
          <>
            Ta kontakt med din private banking-rådgiver for kjøp, salg eller spørsmål.
            <br />
            Vi jobber med å vise flere produkter i fremtiden.
          </>
        }
        no_animation
        show
      />

      <div
        style={{
          border: '1px solid var(--color-black-8)',
          borderRadius: '1.5rem',
          overflow: 'hidden',
        }}
      >
        <List.Container>
          {/* Næringseiendomsfond */}
          <List.Item.Accordion
            open={naeringsOpen}
            onChange={({ expanded }) => setNaeringsOpen(expanded)}
            title={
              <>
                Næringseiendomsfond
                <List.Cell.Title.Subline>3 stk</List.Cell.Title.Subline>
              </>
            }
          >
            <List.Item.Accordion.Header>
              <List.Cell.End>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'var(--font-weight-medium)' }}>88 025 664 kr</div>
                  <div style={{ color: 'var(--color-sea-green)', fontSize: 'var(--font-size-small)' }}>
                    +59 634 024 kr (66,53%)
                  </div>
                </div>
              </List.Cell.End>
            </List.Item.Accordion.Header>

            <List.Item.Accordion.Content>
              <List.Container className="holdings-list">
                {naeringsHoldings.map((holding, i) => (
                  <List.Item.Basic
                    key={i}
                    title={
                      <>
                        {holding.name}
                        <List.Cell.Title.Subline>{holding.date}</List.Cell.Title.Subline>
                      </>
                    }
                  >
                    <List.Cell.End>
                      <strong>{holding.value}</strong>
                    </List.Cell.End>
                    <List.Cell.Footer style={{ width: '100%' }}>
                      <StatsRow stats={holding.stats} />
                    </List.Cell.Footer>
                  </List.Item.Basic>
                ))}
              </List.Container>
            </List.Item.Accordion.Content>
          </List.Item.Accordion>

          {/* Private Equity Fond */}
          <List.Item.Accordion
            open={privateOpen}
            onChange={({ expanded }) => setPrivateOpen(expanded)}
            title={
              <>
                Private Equity Fond
                <List.Cell.Title.Subline>2 stk</List.Cell.Title.Subline>
              </>
            }
          >
            <List.Item.Accordion.Header>
              <List.Cell.End>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'var(--font-weight-medium)' }}>52 290 948 kr</div>
                </div>
              </List.Cell.End>
            </List.Item.Accordion.Header>

            <List.Item.Accordion.Content>
              <List.Container className="holdings-list">
                {privateEquityHoldings.map((holding, i) => (
                  <List.Item.Basic
                    key={i}
                    title={
                      <>
                        {holding.name}
                        <List.Cell.Title.Subline>{holding.date}</List.Cell.Title.Subline>
                      </>
                    }
                  >
                    <List.Cell.End>
                      <strong>{holding.value}</strong>
                    </List.Cell.End>
                    <List.Cell.Footer style={{ width: '100%' }}>
                      <StatsRow stats={holding.stats} />
                    </List.Cell.Footer>
                  </List.Item.Basic>
                ))}
              </List.Container>
            </List.Item.Accordion.Content>
          </List.Item.Accordion>
        </List.Container>
      </div>
    </div>
  )
}
