import React, { useState, useEffect, useRef } from 'react'
import { Card, Anchor, NumberFormat, Dialog, Button, List, P, TermDefinition } from '@dnb/eufemia'
import { information_circled_medium } from '@dnb/eufemia/icons'

const ACCOUNT_VALUES = {
  'Alle kontoer':    { egenkapital: 1250000, markedsverdi: 1500000, tilgjengelig: 17589, change: 34.6,  changeAmount: 77339 },
  'Alle kontoer (uten pensjon)': { egenkapital: 860000, markedsverdi: 1050000, tilgjengelig: 17589, change: 4.9, changeAmount: 48599 },
  'VPS-konto':       { egenkapital:  520000, markedsverdi:  610000, tilgjengelig:  8200, change:  8.7,  changeAmount: 12480 },
  'Pensjonskonto':   { egenkapital:  390000, markedsverdi:  450000, tilgjengelig:     0, change: 21.3,  changeAmount: 28740 },
  'ASK Underkonto 1':{ egenkapital:  210000, markedsverdi:  270000, tilgjengelig:  6100, change: 12.4,  changeAmount: 14820 },
  'ASK Underkonto 2':{ egenkapital:  130000, markedsverdi:  170000, tilgjengelig:  3289, change: -2.4,  changeAmount: -4299 },
}

const ASK_ACCOUNTS = [
  { name: 'ASK Underkonto 1', tilgjengelig: 6100 },
  { name: 'ASK Underkonto 2', tilgjengelig: 3289 },
]

function IkkeInvertertHelpDialog() {
  return (
    <Dialog
      title="Ikke investert"
      trigger={(props) => (
        <Button
          {...props}
          variant="tertiary"
          icon={information_circled_medium}
          aria-label="Vis kontoer med ikke-investerte midler"
          style={{ position: 'absolute', top: 'var(--spacing-x-small)', right: 'var(--spacing-x-small)', padding: 0 }}
        />
      )}
    >
      <P bottom="small">Uinvesterte midler fordelt på ASK-kontoer:</P>
      <List.Container>
        {ASK_ACCOUNTS.map((acc) => (
          <List.Item.Basic key={acc.name} title={acc.name}>
            <List.Cell.End>
              <NumberFormat.Currency value={acc.tilgjengelig} />
            </List.Cell.End>
          </List.Item.Basic>
        ))}
      </List.Container>
    </Dialog>
  )
}

function ChangeBadge({ change, amount, label }) {
  const positive = change >= 0
  return (
    <span className={`change-badge change-badge--${positive ? 'positive' : 'negative'}`} style={{ fontSize: 'var(--font-size-x-small)', padding: '1px 6px' }}>
      {positive ? '+' : ''}{change}% ({positive ? '+' : ''}<NumberFormat.Currency value={amount} />) {label}
    </span>
  )
}

export default function SummaryCards({ selectedAccount = 'Alle kontoer', includePensions = true }) {
  const key = selectedAccount === 'Alle kontoer' && !includePensions ? 'Alle kontoer (uten pensjon)' : selectedAccount
  const vals = ACCOUNT_VALUES[key] ?? ACCOUNT_VALUES['Alle kontoer']

  const [liveMarkedsverdi, setLiveMarkedsverdi] = useState(vals.markedsverdi)
  const [liveChange, setLiveChange] = useState(vals.change)
  const [liveChangeAmount, setLiveChangeAmount] = useState(vals.changeAmount)

  const baseRef = useRef(vals)

  useEffect(() => {
    baseRef.current = vals
    setLiveMarkedsverdi(vals.markedsverdi)
    setLiveChange(vals.change)
    setLiveChangeAmount(vals.changeAmount)
  }, [key])

  useEffect(() => {
    const id = setInterval(() => {
      const base = baseRef.current
      const delta = (Math.random() - 0.48) * base.markedsverdi * 0.002
      const newMv = Math.round(base.markedsverdi + delta)
      const newChangeAmount = Math.round(base.changeAmount + delta)
      const newChange = parseFloat(((newChangeAmount / base.egenkapital) * 100).toFixed(1))
      setLiveMarkedsverdi(newMv)
      setLiveChangeAmount(newChangeAmount)
      setLiveChange(newChange)
    }, 3000)
    return () => clearInterval(id)
  }, [key])

  const askAccount = ASK_ACCOUNTS.find(acc => acc.name === selectedAccount)
  const isAllAccounts = selectedAccount === 'Alle kontoer'
  const ikkeInvertert = isAllAccounts
    ? ASK_ACCOUNTS.reduce((sum, acc) => sum + acc.tilgjengelig, 0)
    : askAccount ? askAccount.tilgjengelig : 0

  const cards = [
    { id: 'Egenkapital', label: <TermDefinition content="Verdien av dine investeringer fratrukket gjeld – det du faktisk eier.">Egenkapital</TermDefinition>, value: ACCOUNT_VALUES['Alle kontoer'].egenkapital },
    { id: 'Markedsverdi', label: <TermDefinition content="Den totale verdien av dine verdipapirer basert på gjeldende markedskurs.">Markedsverdi</TermDefinition>, value: liveMarkedsverdi, change: liveChange, changeAmount: liveChangeAmount, changeLabel: 'i dag' },
    { id: 'Ikke investert', label: 'Ikke investert', value: ikkeInvertert, action: ikkeInvertert > 0 ? { label: 'Overfør', href: '#' } : undefined },
  ]

  return (
    <div className="summary-cards">
      {cards.map(({ id, label, value, change, changeAmount, changeLabel, action }) => (
        <Card key={id} stack style={{ position: 'relative', padding: '0.375rem var(--spacing-medium) var(--spacing-small)', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 'var(--spacing-medium)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {id === 'Ikke investert' && <IkkeInvertertHelpDialog />}
            <p className="summary-card__label" style={{ marginBottom: 0, fontSize: 'var(--font-size-basis)' }}>{label}</p>
            <p className="summary-card__value" style={{ fontSize: '1.375rem', marginBottom: 0, lineHeight: 1.3 }}>
              <NumberFormat.Currency value={value} />
            </p>
            {change !== undefined && (
              <ChangeBadge change={change} amount={changeAmount} label={changeLabel} />
            )}
          </div>
          {action && (
            <Anchor href={action.href} style={{ fontSize: 'var(--font-size-small)' }}>
              {String.fromCharCode(8594)} {action.label}
            </Anchor>
          )}
        </Card>
      ))}
    </div>
  )
}
