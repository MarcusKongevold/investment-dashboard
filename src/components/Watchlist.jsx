import React, { useState } from 'react'
import { Card, Table, Th, Tr, Td, Button, NumberFormat, Dialog, Dropdown, Input, P, Icon, ProgressIndicator } from '@dnb/eufemia'
import Newspaper from '@dnb/eufemia/icons/dnb/newspaper'
import Trash from '@dnb/eufemia/icons/dnb/trash'
import trash_medium from '@dnb/eufemia/icons/dnb/trash_medium'
import edit from '@dnb/eufemia/icons/dnb/edit'
import add from '@dnb/eufemia/icons/dnb/add'
import loupe from '@dnb/eufemia/icons/dnb/loupe'
import StockNewsDialog from './StockNewsDialog.jsx'
import StockSearchDialog from './StockSearchDialog.jsx'

const MAX_LISTS = 5

const INITIAL_WATCHLIST = [
  { name: 'Equinor',     ticker: 'EQNR', price: 284.60, change:  2.10 },
  { name: 'DNB Bank',    ticker: 'DNB',  price: 231.40, change:  1.63 },
  { name: 'SalMar',      ticker: 'SALM', price: 612.00, change: -0.84 },
  { name: 'Telenor',     ticker: 'TEL',  price: 128.20, change:  0.47 },
  { name: 'Norsk Hydro', ticker: 'NHY',  price:  67.38, change: -1.12 },
  { name: 'Orkla',       ticker: 'ORK',  price:  98.56, change:  0.92 },
]

const INITIAL_LISTS = [
  { value: 'Min liste',  content: 'Min liste' },
  { value: 'Favoritter', content: 'Favoritter' },
  { value: 'Teknologi',  content: 'Teknologi' },
]

const INITIAL_LIST_ITEMS = {
  'Min liste':  INITIAL_WATCHLIST,
  'Favoritter': [],
  'Teknologi':  [],
}

export default function Watchlist({ onStockClick }) {
  const [newsStock, setNewsStock] = useState(null)
  const [lists, setLists] = useState(INITIAL_LISTS)
  const [listItems, setListItems] = useState(INITIAL_LIST_ITEMS)
  const [selectedList, setSelectedList] = useState('Min liste')
  const [deleteStock, setDeleteStock] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [addListOpen, setAddListOpen] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameValue, setRenameValue] = useState('')
  const [deleteListOpen, setDeleteListOpen] = useState(false)
  const [isDeletingList, setIsDeletingList] = useState(false)

  const canAddList = lists.length < MAX_LISTS
  const items = listItems[selectedList] ?? []

  const dropdownData = [
    ...lists,
    ...(canAddList ? [{
      value: '__add__',
      selectedValue: selectedList,
      content: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-x-small)', color: 'var(--color-sea-green)', borderTop: '1px solid var(--color-black-8)', marginTop: 'var(--spacing-x-small)', paddingTop: 'var(--spacing-x-small)' }}>
          <Icon icon={add} size="small" /> Legg til ny liste
        </span>
      ),
    }] : []),
  ]

  function handleDropdownChange({ data }) {
    if (data.value === '__add__') {
      setNewListName('')
      setAddListOpen(true)
      return
    }
    setSelectedList(data.value)
  }

  function handleCreateList() {
    const name = newListName.trim()
    if (!name) return
    setLists(prev => [...prev, { value: name, content: name }])
    setListItems(prev => ({ ...prev, [name]: [] }))
    setSelectedList(name)
    setAddListOpen(false)
    setNewListName('')
  }

  function handleRenameList() {
    const name = renameValue.trim()
    if (!name || name === selectedList) { setRenameOpen(false); return }
    setLists(prev => prev.map(l => l.value === selectedList ? { value: name, content: name } : l))
    setListItems(prev => {
      const { [selectedList]: items, ...rest } = prev
      return { ...rest, [name]: items }
    })
    setSelectedList(name)
    setRenameOpen(false)
  }

  function confirmDeleteList({ close }) {
    close()
    setIsDeletingList(true)
    setTimeout(() => {
      setLists(prev => {
        const next = prev.filter(l => l.value !== selectedList)
        setSelectedList(next[0]?.value ?? '')
        return next
      })
      setListItems(prev => {
        const { [selectedList]: _, ...rest } = prev
        return rest
      })
      setIsDeletingList(false)
      setDeleteListOpen(false)
    }, 1200)
  }
  function confirmDelete({ close }) {
    close()
    setIsDeleting(true)
    setTimeout(() => {
      setListItems(prev => ({
        ...prev,
        [selectedList]: prev[selectedList].filter(s => s.ticker !== deleteStock.ticker),
      }))
      setIsDeleting(false)
      setDeleteStock(null)
    }, 1200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-x-small)' }}>
      <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: 0 }}>Watchlist</p>
      <Card stack>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-small)', marginBottom: 0 }}>
          <Button
            variant="secondary"
            size="medium"
            icon={loupe}
            iconPosition="left"
            text="Legg til aksje"
            onClick={() => setSearchOpen(true)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-medium)' }}>
            <Dropdown
              variant="tertiary"
              size="small"
              value={selectedList}
              data={dropdownData}
              onChange={handleDropdownChange}
              independentWidth
            />
            <Dropdown
              preventSelection
              size="small"
              title={null}
              aria-label="Listealternativer"
              align="left"
              independentWidth
              triggerElement={(props) => (
                <Button
                  {...props}
                  variant="tertiary"
                  size="small"
                  icon="more"
                  aria-label="Listealternativer"
                />
              )}
              data={() => ({
                rename: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-x-small)' }}>
                    <Icon icon={edit} size="small" /> Endre navn
                  </span>
                ),
                delete: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-x-small)', color: 'var(--color-fire-red)' }}>
                    <Icon icon={Trash} size="small" /> Slett liste
                  </span>
                ),
              })}
              onChange={({ value }) => {
                if (value === 'rename') { setRenameValue(selectedList); setRenameOpen(true) }
                if (value === 'delete') setDeleteListOpen(true)
              }}
            />
          </div>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: 'var(--spacing-large) var(--spacing-medium)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-small)' }}>
            <P style={{ color: 'var(--color-black-55)' }}>Ingen aksjer i denne listen ennå.</P>
            <P style={{ color: 'var(--color-black-55)', fontSize: 'var(--font-size-small)' }}>
              Søk etter en aksje og legg den til for å holde oversikt.
            </P>
          </div>
        ) : (
          <Table.ScrollView>
            <Table className="watchlist-table" style={{ tableLayout: 'fixed', width: '100%', minWidth: '720px' }}>
              <thead>
                <Tr noWrap>
                  <Th>Aksje</Th>
                  <Th style={{ width: '180px' }} />
                  <Th align="right" style={{ width: '130px' }}>Pris</Th>
                  <Th style={{ width: '150px' }}>Utvikling i dag</Th>
                  <Th style={{ width: '40px' }} />
                </Tr>
              </thead>
              <tbody>
                {items.map(({ name, ticker, price, change }) => {
                  const positive = change >= 0
                  return (
                    <Tr key={ticker}>
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
                      <Td align="right">
                        <NumberFormat.Currency value={price} />
                      </Td>
                      <Td>
                        <span className={`change-badge change-badge--${positive ? 'positive' : 'negative'}`}>
                          {positive ? '+' : ''}{change}%
                        </span>
                      </Td>
                      <Td align="right">
                        <Button variant="tertiary" size="small" icon={Trash} aria-label="Fjern" style={{ margin: 0 }} onClick={() => setDeleteStock({ name, ticker })} />
                      </Td>
                    </Tr>
                  )
                })}
              </tbody>
            </Table>
          </Table.ScrollView>
        )}
      </Card>

      {/* New list dialog */}
      <Dialog
        title="Opprett ny liste"
        open={addListOpen}
        onClose={() => setAddListOpen(false)}
        triggerAttributes={{ hidden: true }}
      >
        <Input
          label="Listenavn"
          labelDirection="vertical"
          stretch
          value={newListName}
          placeholder="F.eks. Teknologi"
          onChange={({ value }) => setNewListName(value)}
          onKeyDown={({ event }) => { if (event.key === 'Enter') handleCreateList() }}
        />
        <Dialog.Action>
          <Button variant="tertiary" text="Avbryt" onClick={() => setAddListOpen(false)} />
          <Button text="Opprett liste" disabled={!newListName.trim()} onClick={handleCreateList} />
        </Dialog.Action>
      </Dialog>

      {/* Rename list dialog */}
      <Dialog
        title="Endre navn på liste"
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        triggerAttributes={{ hidden: true }}
      >
        <Input
          label="Listenavn"
          labelDirection="vertical"
          stretch
          value={renameValue}
          onChange={({ value }) => setRenameValue(value)}
          onKeyDown={({ event }) => { if (event.key === 'Enter') handleRenameList() }}
        />
        <Dialog.Action>
          <Button variant="tertiary" text="Avbryt" onClick={() => setRenameOpen(false)} />
          <Button text="Lagre" disabled={!renameValue.trim()} onClick={handleRenameList} />
        </Dialog.Action>
      </Dialog>

      {/* Delete list confirmation dialog */}
      <Dialog
        variant="confirmation"
        confirmType="warning"
        icon={trash_medium}
        title={`Slett «${selectedList}»?`}
        description="Listen og alle aksjene i den vil bli slettet permanent."
        confirmText="Slett liste"
        declineText="Avbryt"
        open={deleteListOpen && !isDeletingList}
        onClose={() => setDeleteListOpen(false)}
        onConfirm={confirmDeleteList}
        triggerAttributes={{ hidden: true }}
      />

      {/* Loading dialog while list delete is in progress */}
      <Dialog
        spacing={false}
        fullscreen={false}
        alignContent="centered"
        hideCloseButton
        preventClose
        open={isDeletingList}
        triggerAttributes={{ hidden: true }}
        maxWidth="12rem"
      >
        <ProgressIndicator showDefaultLabel labelDirection="vertical" top="large" bottom="large" />
      </Dialog>

      {/* Delete stock confirmation dialog */}
      <Dialog
        variant="confirmation"
        confirmType="warning"
        icon={trash_medium}
        title={`Fjern ${deleteStock?.name ?? ''} fra watchlist?`}
        description="Aksjen vil bli fjernet fra watchlisten din."
        confirmText="Fjern"
        declineText="Avbryt"
        open={!!deleteStock && !isDeleting}
        onClose={() => setDeleteStock(null)}
        onConfirm={confirmDelete}
        triggerAttributes={{ hidden: true }}
      />

      {/* Loading dialog while delete is in progress */}
      <Dialog
        spacing={false}
        fullscreen={false}
        alignContent="centered"
        hideCloseButton
        preventClose
        open={isDeleting}
        triggerAttributes={{ hidden: true }}
        maxWidth="12rem"
      >
        <ProgressIndicator showDefaultLabel labelDirection="vertical" top="large" bottom="large" />
      </Dialog>

      <StockSearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        lists={lists}
        listItems={listItems}
        onSetListItems={setListItems}
      />

      <StockNewsDialog
        open={!!newsStock}
        onClose={() => setNewsStock(null)}
        stockName={newsStock?.name ?? ''}
        ticker={newsStock?.ticker ?? ''}
      />
    </div>
  )
}
