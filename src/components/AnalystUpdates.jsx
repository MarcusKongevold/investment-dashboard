import React, { useState } from 'react'
import { Avatar, Card, List, Button } from '@dnb/eufemia'
import launch_medium from '@dnb/eufemia/icons/launch_medium'
import chevron_left from '@dnb/eufemia/icons/chevron_left'
import chevron_right from '@dnb/eufemia/icons/chevron_right'

const UPDATES = [
  {
    author: 'Knut A. Magnussen',
    initials: 'KM',
    time: '11:31',
    body: 'Det er dag tre av den to uker lange våpenvilen mellom USA, Israel og Iran. Fortsatt er det viktige Hormuzstredet i praksis stengt. Bare noen få skip passerte i går. Iran sendte i går ut en melding om at kun 15 fartøyer vil kunne passere per dag. Dette er vesentlig færre enn normalen på rundt 135 skip.',
    stock: { ticker: 'OSBX', change: 2.3, positive: true },
    report: { title: 'Morgenrapport 10. april' },
  },
  {
    author: 'Ingrid Sørensen',
    initials: 'IS',
    time: '08:45',
    body: 'Lakseprisene steg markant i forrige uke, noe som bidro til bred oppgang blant oppdrettsaksjer. Mowi og SalMar ledet an med henholdsvis 3,2 % og 2,8 % oppgang. Analytikere peker på økt etterspørsel fra Asia og redusert tilbud fra Chile som de viktigste driverne bak prisoppgangen.',
    stock: { ticker: 'MOWI', change: 3.2, positive: true },
    report: { title: 'Ukesrapport uke 15' },
  },
  {
    author: 'Lars Erik Blom',
    initials: 'LB',
    time: '07:55',
    body: 'Equinor melder om høyere enn ventet produksjon fra Johan Sverdrup-feltet i første kvartal. Oljeprisen holder seg stabilt over 74 dollar fatet, støttet av lavere enn forventet lagervekst i USA. Analytikere opprettholder kjøpsanbefaling med kursmål 340 kroner.',
    stock: { ticker: 'EQNR', change: -0.8, positive: false },
    report: { title: 'Energirapport Q1 2026' },
  },
  {
    author: 'Knut A. Magnussen',
    initials: 'KM',
    time: 'I går 16:20',
    body: 'DNB Bank leverte sterke tall for første kvartal med en egenkapitalavkastning på 14,2 %. Netto renteinntekter økte med 6 % sammenlignet med samme periode i fjor. Styret varsler økt utbytte og et nytt tilbakekjøpsprogram på 3 milliarder kroner.',
    stock: { ticker: 'DNB', change: 1.6, positive: true },
    report: { title: 'DNB Q1-rapport 2026' },
  },
  {
    author: 'Ingrid Sørensen',
    initials: 'IS',
    time: 'I går 14:10',
    body: 'Yara International varslet i dag kutt i nitrogenkapasiteten i Europa som følge av vedvarende høye gasspriser. Aksjen falt 5,2 % på nyhetene. Markedet er bekymret for marginskvisen som rammer gjødselprodusenter i det europeiske markedet gjennom hele 2026.',
    stock: { ticker: 'YAR', change: -5.2, positive: false },
    report: { title: 'Kjemisektorrapporten' },
  },
  {
    author: 'Lars Erik Blom',
    initials: 'LB',
    time: 'I går 09:30',
    body: 'Nel ASA sikret seg en ny kontrakt for leveranse av elektrolysører til et hydrogenprosjekt i Tyskland verdt 480 millioner kroner. Dette er selskapets største enkeltkontrakt så langt i år og styrker ordreboken betydelig inn i andre halvår.',
    stock: { ticker: 'NEL', change: 4.2, positive: true },
    report: { title: 'Grønn energi – ukesoppsummering' },
  },
]

const PAGE_SIZE = 2

export default function AnalystUpdates() {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(UPDATES.length / PAGE_SIZE)
  const visible = UPDATES.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-x-small)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: 0 }}>
          Siste oppdateringer
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-x-small)' }}>
          <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-black-55)' }}>
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="tertiary"
            size="small"
            icon={chevron_left}
            aria-label="Forrige"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          />
          <Button
            variant="tertiary"
            size="small"
            icon={chevron_right}
            aria-label="Neste"
            disabled={page === totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-medium)' }}>
        {visible.map(({ author, initials, time, body, stock, report }) => (
          <Card stack key={author + time}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                border: '0.5px solid var(--color-black-8)',
                borderRadius: '12px',
                padding: '4px',
                alignSelf: 'flex-start',
              }}>
                <Avatar size="small" hasLabel>{initials}</Avatar>
                <span style={{ fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-black-55)', whiteSpace: 'nowrap' }}>
                  {author}
                </span>
              </div>
              <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-black-55)' }}>
                {time}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-small)' }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-basis)', lineHeight: 'var(--line-height-basis)', color: 'var(--color-black-80)' }}>
                {body}
              </p>
              <div style={{ border: '1px solid var(--color-black-8)', borderRadius: '24px', overflow: 'hidden' }}>
                <List.Container>
                  <List.Item.Action onClick={() => {}}>
                    <List.Cell.Title>{stock.ticker}</List.Cell.Title>
                    <List.Cell.End>
                      <span className={`change-badge change-badge--${stock.positive ? 'positive' : 'negative'}`}>
                        {stock.positive ? '+' : ''}{stock.change.toFixed(1)} %
                      </span>
                    </List.Cell.End>
                  </List.Item.Action>
                  <List.Item.Action icon={launch_medium} onClick={() => {}}>
                    <List.Cell.Title>{report.title}</List.Cell.Title>
                  </List.Item.Action>
                </List.Container>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
