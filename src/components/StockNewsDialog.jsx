import React, { useState } from 'react'
import { Dialog, List, Button } from '@dnb/eufemia'
import ChevronRight from '@dnb/eufemia/icons/dnb/chevron_right'
import ArrowLeft from '@dnb/eufemia/icons/dnb/arrow_left'
import { NEWS } from '../data/newsData.js'

function TickerTag({ name, change }) {
  const positive = change >= 0
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: 'var(--color-black-3)', border: '1px solid var(--color-black-8)',
      borderRadius: '9999px', padding: '3px 10px 3px 6px',
      fontSize: 'var(--font-size-x-small)', cursor: 'pointer',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '20px', height: '20px', borderRadius: '50%',
        background: 'var(--color-ocean-green)', color: 'white',
        fontSize: '10px', fontWeight: 'var(--font-weight-medium)', flexShrink: 0,
      }}>
        {name[0]}
      </span>
      <span style={{ color: 'var(--color-black)' }}>{name} </span>
      <span style={{ color: positive ? '#007b5e' : 'var(--color-fire-red)', fontWeight: 'var(--font-weight-medium)' }}>
        {positive ? '+' : ''}{change.toFixed(1)}%
      </span>
    </div>
  )
}

export default function StockNewsDialog({ open, onClose, stockName, ticker }) {
  const [article, setArticle] = useState(null)

  const filteredNews = ticker
    ? NEWS.filter(item => item.tickers.split(',').map(t => t.trim()).includes(ticker))
    : NEWS

  function handleClose() {
    setArticle(null)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="784px"
      trigger={() => null}
      title={article
        ? <span className="dnb-sr-only">Nyhetsartikkel</span>
        : `Nyheter · ${stockName}`
      }
    >
      {!article ? (
        filteredNews.length === 0 ? (
          <p style={{ color: 'var(--color-black-55)', fontSize: 'var(--font-size-small)', margin: 0 }}>
            Ingen nyheter funnet for {stockName}.
          </p>
        ) : (
        <List.ScrollView maxVisibleListItems={6}>
          <List.Container>
            {filteredNews.map((item, i) => (
              <List.Item.Action key={i} onClick={() => setArticle(item)}>
                <List.Cell.Title>
                  <List.Cell.Title.Overline>{item.source} · {item.date}</List.Cell.Title.Overline>
                  {item.title}
                  <List.Cell.Title.Subline variant="description">{item.tickers}</List.Cell.Title.Subline>
                </List.Cell.Title>
              </List.Item.Action>
            ))}
          </List.Container>
        </List.ScrollView>
        )
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <Button variant="tertiary" size="small" icon={ArrowLeft} iconPosition="left" style={{ margin: 0, alignSelf: 'flex-start' }} onClick={() => setArticle(null)}>
            Tilbake til nyheter
          </Button>

          <div>
            <p style={{ margin: 0, fontSize: 'var(--font-size-x-small)', color: 'var(--color-black-55)' }}>
              {article.exchange}
            </p>
            <h2 style={{ margin: '0.25rem 0', fontSize: '2.125rem', fontWeight: 'var(--font-weight-medium)', lineHeight: '2.5rem', color: 'var(--color-black)' }}>
              {article.title}
            </h2>
            <p style={{ margin: 0, fontSize: 'var(--font-size-x-small)', color: 'var(--color-black-55)' }}>
              {article.date}
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-x-small)' }}>
            {article.tickerTags.map(tag => (
              <TickerTag key={tag.name} {...tag} />
            ))}
          </div>

          <div style={{
            background: 'var(--color-black-3)', border: '1px solid var(--color-black-8)',
            borderRadius: '1.5rem', padding: '1rem 1rem 0.75rem',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-small)' }}>
                AI summary / Short version
              </p>
              <span style={{ fontSize: 'var(--font-size-x-small)', color: 'var(--color-black-55)' }}>
                ✦ Summary is made with AI
              </span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: 'var(--font-size-small)', lineHeight: '1.4' }}>
              {article.aiSummary.map((point, i) => (
                <li key={i} style={{ marginBottom: '0.375rem' }}>{point}</li>
              ))}
            </ul>
          </div>

          <div style={{ fontSize: '1.125rem', lineHeight: '1.5rem', color: 'var(--color-black)' }}>
            {article.body.split('\n\n').map((para, i) => (
              <p key={i} style={{ margin: '0 0 1rem 0' }}>{para}</p>
            ))}
          </div>

          <div>
            <Button variant="tertiary" icon={ChevronRight} iconPosition="right">
              Link to news source
            </Button>
          </div>

        </div>
      )}
    </Dialog>
  )
}
