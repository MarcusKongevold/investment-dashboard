import React from 'react'
import { List, Tabs } from '@dnb/eufemia'

const ALL_EVENTS = [
  { date: '10. apr 2026', ticker: 'EQNR', company: 'Equinor ASA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '10. apr 2026', ticker: 'DNB', company: 'DNB Bank ASA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '11. apr 2026', ticker: 'SALM', company: 'SalMar ASA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '12. apr 2026', ticker: 'MOWI', company: 'Mowi ASA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '14. apr 2026', ticker: 'TEL', company: 'Telenor ASA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '15. apr 2026', ticker: 'DNB', company: 'DNB Bank ASA', title: 'Dividend payment Q1 2026', type: 'dividends' },
  { date: '15. apr 2026', ticker: 'EQNR', company: 'Equinor ASA', title: 'Dividend payment Q1 2026', type: 'dividends' },
  { date: '16. apr 2026', ticker: 'ORK', company: 'Orkla ASA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '16. apr 2026', ticker: 'YAR', company: 'Yara International ASA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '17. apr 2026', ticker: 'AKRBP', company: 'Aker BP ASA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '17. apr 2026', ticker: 'MOWI', company: 'Mowi ASA', title: 'Dividend payment Q1 2026', type: 'dividends' },
  { date: '22. apr 2026', ticker: 'EQNR', company: 'Equinor ASA', title: 'Annual General Meeting 2026', type: 'agm' },
  { date: '22. apr 2026', ticker: 'NEL', company: 'Nel ASA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '23. apr 2026', ticker: 'SCATC', company: 'Scatec ASA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '23. apr 2026', ticker: 'TEL', company: 'Telenor ASA', title: 'Dividend payment Q1 2026', type: 'dividends' },
  { date: '24. apr 2026', ticker: 'SUBC', company: 'Subsea 7 SA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '24. apr 2026', ticker: 'ORK', company: 'Orkla ASA', title: 'Dividend payment Q1 2026', type: 'dividends' },
  { date: '25. apr 2026', ticker: 'BWLPG', company: 'BW LPG Limited', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '28. apr 2026', ticker: 'SALM', company: 'SalMar ASA', title: 'Annual General Meeting 2026', type: 'agm' },
  { date: '28. apr 2026', ticker: 'YAR', company: 'Yara International ASA', title: 'Dividend payment Q1 2026', type: 'dividends' },
  { date: '29. apr 2026', ticker: 'DNB', company: 'DNB Bank ASA', title: 'Annual General Meeting 2026', type: 'agm' },
  { date: '29. apr 2026', ticker: 'AKRBP', company: 'Aker BP ASA', title: 'Dividend payment Q1 2026', type: 'dividends' },
  { date: '30. apr 2026', ticker: 'NHY', company: 'Norsk Hydro ASA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '30. apr 2026', ticker: 'HYON', company: 'Hydrogen Pro AS', title: 'Annual General Meeting 2026', type: 'agm' },
  { date: '5. mai 2026', ticker: 'RECSI', company: 'REC Silicon ASA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '5. mai 2026', ticker: 'NHY', company: 'Norsk Hydro ASA', title: 'Dividend payment Q1 2026', type: 'dividends' },
  { date: '6. mai 2026', ticker: 'KAHOT', company: 'Kahoot! AS', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '6. mai 2026', ticker: 'SUBC', company: 'Subsea 7 SA', title: 'Annual General Meeting 2026', type: 'agm' },
  { date: '7. mai 2026', ticker: 'SVEG', company: 'Sparebanken Vest', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '7. mai 2026', ticker: 'KAHOT', company: 'Kahoot! AS', title: 'Dividend payment Q1 2026', type: 'dividends' },
  { date: '8. mai 2026', ticker: 'AKER', company: 'Aker ASA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '12. mai 2026', ticker: 'WWASA', company: 'Wallenius Wilhelmsen ASA', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '12. mai 2026', ticker: 'AKER', company: 'Aker ASA', title: 'Annual General Meeting 2026', type: 'agm' },
  { date: '13. mai 2026', ticker: 'FLNG', company: 'Flex LNG Ltd.', title: 'Earnings Q1 2026 results', type: 'earnings' },
  { date: '14. mai 2026', ticker: 'FLNG', company: 'Flex LNG Ltd.', title: 'Dividend payment Q1 2026', type: 'dividends' },
]

const EVENTS_BY_TAB = {
  all: ALL_EVENTS,
  earnings: ALL_EVENTS.filter(e => e.type === 'earnings'),
  dividends: ALL_EVENTS.filter(e => e.type === 'dividends'),
  agm: ALL_EVENTS.filter(e => e.type === 'agm'),
}

function makeEventList(key) {
  return function EventList() {
    const events = EVENTS_BY_TAB[key] || []
    if (events.length === 0) {
      return <p style={{ color: 'var(--color-black-55)', fontSize: 'var(--font-size-small)', padding: 'var(--spacing-small) 0' }}>Ingen hendelser</p>
    }
    return (
      <List.ScrollView maxVisibleListItems={3}>
        <List.Container>
          {events.map(({ date, ticker, company, title }, i) => (
            <List.Item.Action key={i} onClick={() => {}}>
              <List.Cell.Title>
                <List.Cell.Title.Overline>{date} · {ticker}</List.Cell.Title.Overline>
                {company}
                <List.Cell.Title.Subline variant="description">{title}</List.Cell.Title.Subline>
              </List.Cell.Title>
            </List.Item.Action>
          ))}
        </List.Container>
      </List.ScrollView>
    )
  }
}

export default function CorporateEvents() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-x-small)' }}>
      <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: 0 }}>Selskapshendelser</p>
      <List.Card style={{ overflow: 'hidden' }}>
        <Tabs
          noBorder
          
          data={[
            { title: 'Alle', key: 'all' },
            { title: 'Resultater', key: 'earnings' },
            { title: 'Utbytte', key: 'dividends' },
            { title: 'Generalforsamling', key: 'agm' },
          ]}
          content={{
            all: makeEventList('all'),
            earnings: makeEventList('earnings'),
            dividends: makeEventList('dividends'),
            agm: makeEventList('agm'),
          }}
        />
      </List.Card>
    </div>
  )
}
