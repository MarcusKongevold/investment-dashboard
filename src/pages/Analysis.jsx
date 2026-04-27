import React from 'react'
import { Avatar, List, Icon, ProgressIndicator, Lead, P, Grid, Tooltip } from '@dnb/eufemia'
import { chip as chipIcon, factory as factoryIcon, heart_rate as heartRateIcon, globe as globeIcon } from '@dnb/eufemia/icons'

const GEO_URL = '/worldmap.svg'

// [longitude, latitude] → CSS % position
// SVG covers lon -180→+180 and lat +85→-60
function coordToPercent(lon, lat) {
  return {
    left: `${((lon + 180) / 360) * 100}%`,
    top:  `${((85 - lat) / 145) * 100}%`,
  }
}

// [longitude, latitude]
const REGION_COORDS = {
  'USA':            [-100,  40],
  'Europa':         [  10,  51],
  'United Kingdom': [  -2,  53],
  'Australia':      [ 134, -25],
  'Afrika':         [  20,   5],
}

function randomDistribution(n) {
  const cuts = Array.from({ length: n - 1 }, () => Math.random()).sort((a, b) => a - b)
  const points = [0, ...cuts, 1]
  return points.slice(1).map((v, i) => Math.round((v - points[i]) * 1000) / 10)
}

function randomInvestmentPercents(n) {
  const raw = Array.from({ length: n }, () => Math.random())
  const sum = raw.reduce((a, b) => a + b, 0)
  const percents = raw.map(v => Math.round((v / sum) * 1000) / 10)
  const diff = Math.round((100 - percents.reduce((a, b) => a + b, 0)) * 10) / 10
  percents[0] = Math.round((percents[0] + diff) * 10) / 10
  return percents.sort((a, b) => b - a)
}

const assetPercents = randomDistribution(4)
const ASSET_CLASSES = [
  { label: 'Aksjer',       percent: assetPercents[0], color: '#a5e1d2' },
  { label: 'Obligasjoner', percent: assetPercents[1], color: '#14555a' },
  { label: 'Kontanter',    percent: assetPercents[2], color: '#00343e' },
  { label: 'Annet',        percent: assetPercents[3], color: '#80ba77' },
]

const regionPercents = randomDistribution(5)
const REGIONS = [
  { label: 'USA',            percent: regionPercents[0] },
  { label: 'Europa',         percent: regionPercents[1] },
  { label: 'United Kingdom', percent: regionPercents[2] },
  { label: 'Australia',      percent: regionPercents[3] },
  { label: 'Afrika',         percent: regionPercents[4] },
]

const sectorPercents = randomDistribution(4)
const SECTORS = [
  { label: 'Teknologi', icon: chipIcon,       percent: sectorPercents[0] },
  { label: 'Finans',    icon: globeIcon,       percent: sectorPercents[1] },
  { label: 'Industri',  icon: factoryIcon,     percent: sectorPercents[2] },
  { label: 'Helse',     icon: heartRateIcon,   percent: sectorPercents[3] },
]

const KEY_METRICS = [
  { label: 'Price/Earnings Ratio',  value: (Math.random() * 30 + 10).toFixed(2) },
  { label: 'Price/Cashflow Ratio',  value: (Math.random() * 20 + 5).toFixed(2) },
  { label: 'Price/Book Ratio',      value: (Math.random() * 5 + 1).toFixed(2) },
]

const topPercents = randomInvestmentPercents(10)
const TOP_INVESTMENTS = [
  { name: 'Nordea',      percent: topPercents[0] },
  { name: 'Sparebank 1', percent: topPercents[1] },
  { name: 'Adobe',       percent: topPercents[2] },
  { name: 'Google',      percent: topPercents[3] },
  { name: 'Microsoft',   percent: topPercents[4] },
  { name: 'Equinor',     percent: topPercents[5] },
  { name: 'Tesla',       percent: topPercents[6] },
  { name: 'DNB',         percent: topPercents[7] },
  { name: 'Amazon',      percent: topPercents[8] },
  { name: 'Apple',       percent: topPercents[9] },
]

const underlyingPercents = randomInvestmentPercents(10)
const UNDERLYING_INVESTMENTS = [
  { name: 'Nvidia',               percent: underlyingPercents[0] },
  { name: 'Rheinmetall',          percent: underlyingPercents[1] },
  { name: 'Rivian Automotive A',  percent: underlyingPercents[2] },
  { name: 'BMW',                  percent: underlyingPercents[3] },
  { name: 'Volvo',                percent: underlyingPercents[4] },
  { name: 'Polestar',             percent: underlyingPercents[5] },
  { name: 'Orkla',                percent: underlyingPercents[6] },
  { name: 'Telia',                percent: underlyingPercents[7] },
  { name: 'Gigante Salmon AS',    percent: underlyingPercents[8] },
  { name: 'Icelandic Salmon',     percent: underlyingPercents[9] },
]

function RegionMarker({ label, percent }) {
  const coords = REGION_COORDS[label]
  if (!coords) return null
  const pos = coordToPercent(coords[0], coords[1])
  const dot = (
    <div
      aria-label={`${label}: ${percent}%`}
      style={{
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        background: '#14555a',
        border: '3px solid white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        cursor: 'pointer',
      }}
    />
  )
  return (
    <div style={{ position: 'absolute', left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)', zIndex: 10 }}>
      <Tooltip title={`${label}: ${percent}%`} targetElement={dot} />
    </div>
  )
}

function ProgressBar({ percent }) {
  return (
    <ProgressIndicator
      type="linear"
      size="default"
      progress={percent}
      noAnimation
      customColors={{ line: '#14555a', shaft: '#ebebeb' }}
      style={{ marginTop: '8px' }}
    />
  )
}

function SectionTitle({ children }) {
  return (
    <p style={{ fontFamily: 'var(--font-family-heading, inherit)', fontSize: '26px', fontWeight: 500, lineHeight: '32px', color: '#333', margin: '0 0 8px 0' }}>
      {children}
    </p>
  )
}

function InvestmentList({ items }) {
  return (
    <List.Container>
      {items.map(({ name, percent }, i) => (
        <List.Item.Basic key={`${name}-${i}`}>
          <List.Cell.Start>
            <Avatar size="medium" backgroundColor="#14555a" color="white" hasLabel>
              {name[0].toUpperCase()}
            </Avatar>
          </List.Cell.Start>
          <List.Cell.Title>{name}</List.Cell.Title>
          <List.Cell.End>
            <span style={{ color: '#333', fontWeight: 400 }}>{percent} %</span>
          </List.Cell.End>
        </List.Item.Basic>
      ))}
    </List.Container>
  )
}

export default function Analysis() {
  return (
    <div style={{ background: 'var(--color-black-3)', minHeight: '100%' }}>

      {/* World map banner */}
      <div style={{ padding: 'var(--spacing-x-large) var(--spacing-large) 0', maxWidth: '1510px', margin: '0 auto' }}>
        <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', marginBottom: '40px' }}>
          <img src="/worldmap.svg" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0 }}>
            {REGIONS.map(({ label, percent }) => (
              <RegionMarker key={label} label={label} percent={percent} />
            ))}
          </div>
        </div>
      </div>

      <Grid.Container columnGap="large" rowGap="large" style={{ padding: 'var(--spacing-large)', maxWidth: '1510px', margin: '0 auto' }}>

        {/* LEFT COLUMN */}
        <Grid.Item span={{ small: 'full', medium: 'full', large: [1, 6] }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <div>
              <SectionTitle>Fordeling</SectionTitle>
              <List.Card>
                <Lead top={false} bottom={false}>Aktivaklasser</Lead>

                {/* Stacked bar */}
                <div style={{ display: 'flex', height: '16px', borderRadius: '24px', overflow: 'hidden', border: '1px solid #ebebeb', marginTop: '16px' }}>
                  {ASSET_CLASSES.map(({ label, percent, color }) => (
                    <div key={label} style={{ width: `${percent}%`, background: color }} />
                  ))}
                </div>

                <List.Container top="small">
                  {ASSET_CLASSES.map(({ label, percent, color }) => (
                    <List.Item.Basic key={label}>
                      <List.Cell.Start>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color }} />
                      </List.Cell.Start>
                      <List.Cell.Title>{label}</List.Cell.Title>
                      <List.Cell.End>
                        <span style={{ fontWeight: 500 }}>{percent} %</span>
                      </List.Cell.End>
                    </List.Item.Basic>
                  ))}
                </List.Container>
              </List.Card>
            </div>

            <List.Card>
              <Lead top={false} bottom={false}>Regioner</Lead>
              <List.Container top="small">
                {REGIONS.map(({ label, percent }) => (
                  <List.Item.Basic key={label}>
                    <List.Cell.Title>{label}</List.Cell.Title>
                    <List.Cell.End>
                      <span style={{ color: '#737373' }}>{percent} %</span>
                    </List.Cell.End>
                    <List.Cell.Footer>
                      <ProgressBar percent={percent} />
                    </List.Cell.Footer>
                  </List.Item.Basic>
                ))}
              </List.Container>
            </List.Card>

            <List.Card>
              <Lead top={false} bottom={false}>Sektorer</Lead>
              <List.Container top="small">
                {SECTORS.map(({ label, icon, percent }) => (
                  <List.Item.Basic key={label}>
                    <List.Cell.Start>
                      <Icon icon={icon} size="medium" color="#333" />
                    </List.Cell.Start>
                    <List.Cell.Title>{label}</List.Cell.Title>
                    <List.Cell.End>
                      <span style={{ color: '#737373' }}>{percent} %</span>
                    </List.Cell.End>
                    <List.Cell.Footer>
                      <ProgressBar percent={percent} />
                    </List.Cell.Footer>
                  </List.Item.Basic>
                ))}
              </List.Container>
            </List.Card>

            <div>
              <SectionTitle>Andre nøkkeltall</SectionTitle>
              <List.Card>
                <Lead top={false} bottom={false}>Nøkkeltall for aksjer</Lead>
                <List.Container>
                  {KEY_METRICS.map(({ label, value }) => (
                    <List.Item.Basic key={label}>
                      <List.Cell.Title>{label}</List.Cell.Title>
                      <List.Cell.End>{value}</List.Cell.End>
                    </List.Item.Basic>
                  ))}
                </List.Container>
              </List.Card>
            </div>

          </div>
        </Grid.Item>

        {/* RIGHT COLUMN */}
        <Grid.Item span={{ small: 'full', medium: 'full', large: [7, 12] }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <div>
              <SectionTitle>Største investeringer</SectionTitle>
              <List.Card>
                <Lead top={false} bottom={false}>Dine største investeringer</Lead>
                <P size="small" style={{ color: '#737373' }}>Viser de 10 største investeringene</P>
                <InvestmentList items={TOP_INVESTMENTS} />
              </List.Card>
            </div>

            <List.Card>
              <Lead top={false} bottom="x-small">Største underliggende investeringer</Lead>
              <InvestmentList items={UNDERLYING_INVESTMENTS} />
            </List.Card>

          </div>
        </Grid.Item>

      </Grid.Container>

      <p style={{ textAlign: 'center', fontSize: '14px', color: '#737373', padding: '40px var(--spacing-large) var(--spacing-large)', maxWidth: '652px', margin: '0 auto' }}>
        Denne analysen er basert på fond- og aksjeinvesteringene du har gjort i DNB, og er levert av Morningstar. Dine data vil ikke bli lagret.
      </p>

    </div>
  )
}
