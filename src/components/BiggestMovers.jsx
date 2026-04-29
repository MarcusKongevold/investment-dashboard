import React, { useState } from 'react'
import { Card, Table, Th, Tr, Td, Button, Tabs, NumberFormat, Tooltip } from '@dnb/eufemia'
import Newspaper from '@dnb/eufemia/icons/dnb/newspaper'
import StockNewsDialog from './StockNewsDialog.jsx'

const STOCKS = [
  { name: 'Equinor',   ticker: 'EQNR',  change:  2.10, changeNok:  5820 },
  { name: 'DNB Bank',  ticker: 'DNB',   change:  1.63, changeNok:  3720 },
  { name: 'Nel ASA',   ticker: 'NEL',   change:  4.20, changeNok:  1890 },
  { name: 'Yara',      ticker: 'YAR',   change: -5.20, changeNok: -16240 },
  { name: 'Aker BP',   ticker: 'AKRBP', change:  1.90, changeNok:  5540 },
  { name: 'Mowi',      ticker: 'MOWI',  change: -2.40, changeNok:  -4320 },
]

const FUNDS = [
  { name: 'DNB Global Indeks',        ticker: 'DNBGI',  change:  1.42, changeNok:  3110 },
  { name: 'Storebrand Vekst',         ticker: 'STVK',   change:  2.10, changeNok:  4830 },
  { name: 'Alfred Berg Gambak',       ticker: 'ABGAM',  change: -1.85, changeNok: -2960 },
  { name: 'Holberg Norden',           ticker: 'HLBNOR', change:  0.73, changeNok:  1420 },
  { name: 'KLP AksjeNorge Indeks',    ticker: 'KLPNO',  change: -3.10, changeNok: -6200 },
  { name: 'Handelsbanken Global',     ticker: 'HBGL',   change:  1.95, changeNok:  3740 },
]

const TABS = [
  { title: 'Aksjer', key: 'aksjer' },
  { title: 'Fond',   key: 'fond' },
]

export default function BiggestMovers({ onStockClick }) {
  const [newsStock, setNewsStock] = useState(null)
  const [activeTab, setActiveTab] = useState('aksjer')

  const movers = (activeTab === 'aksjer' ? STOCKS : FUNDS)
    .slice()
    .sort((a, b) => b.change - a.change)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-x-small)' }}>
      <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: 0 }}>
        Største bevegelser
      </p>
      <Card stack style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-small)' }}>
          <Tabs
            noBorder
            selectedKey={activeTab}
            data={TABS}
            
            onChange={({ selectedKey }) => setActiveTab(selectedKey)}
          />
        </div>
        <Table.ScrollView>
          <Table style={{ tableLayout: 'fixed', width: '100%', minWidth: '560px' }}>
            <thead>
              <Tr noWrap>
                <Th>{activeTab === 'aksjer' ? 'Aksje' : 'Fond'}</Th>
                <Th style={{ width: '180px' }} />
                <Th style={{ width: '150px' }}>Utvikling i dag</Th>
                <Th style={{ width: '40px' }} />
              </Tr>
            </thead>
            <tbody>
              {movers.map(({ name, ticker, change, changeNok }) => {
                const positive = change >= 0
                return (
                  <Tr key={ticker} style={{ verticalAlign: 'middle' }}>
                    <Td>
                      <span
                        style={{ cursor: 'pointer', color: 'var(--color-sea-green)', fontWeight: 'var(--font-weight-medium)', textDecoration: 'underline', fontSize: 'var(--font-size-basis)' }}
                        onClick={() => onStockClick?.({ name, ticker })}
                      >
                        {name}
                      </span>
                    </Td>
                    <Td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-x-small)' }}>
                        <Button variant="tertiary" size="small" icon={Newspaper} aria-label="Nyheter" style={{ margin: 0 }} onClick={() => setNewsStock({ name, ticker })} />
                        <Button variant="secondary" size="small" style={{ margin: 0 }}>Kjøp</Button>
                        <Button variant="secondary" size="small" style={{ margin: 0, color: 'var(--color-fire-red)' }}>Selg</Button>
                      </span>
                    </Td>
                    <Td style={{ paddingRight: 'var(--spacing-large)' }}>
                      <Tooltip targetElement={
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                          <span className={`change-badge change-badge--${positive ? 'positive' : 'negative'}`}>
                            {positive ? '+' : ''}{change}%
                          </span>
                          <span style={{ fontSize: 'var(--font-size-small)', color: positive ? '#007b5e' : 'var(--color-fire-red)' }}>
                            {positive ? '+' : ''}<NumberFormat.Currency value={changeNok} />
                          </span>
                        </span>
                      }>
                        {activeTab === 'fond'
                          ? `Sist oppdatert: ${new Date().toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${new Date().toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}`
                          : `Sist oppdatert: ${new Date().toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}`
                        }
                      </Tooltip>
                    </Td>
                    <Td />
                  </Tr>
                )
              })}
            </tbody>
          </Table>
        </Table.ScrollView>
      </Card>
      <StockNewsDialog
        open={!!newsStock}
        onClose={() => setNewsStock(null)}
        stockName={newsStock?.name ?? ''}
        ticker={newsStock?.ticker ?? ''}
      />
    </div>
  )
}
