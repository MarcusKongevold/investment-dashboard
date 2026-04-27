import React from 'react'
import { Dropdown, Button, Checkbox } from '@dnb/eufemia'
import Bookmark from '@dnb/eufemia/icons/dnb/bookmark'

export default function WatchlistDropdown({ lists, checkedLists, onToggle, triggerElement }) {
  const data = lists.reduce((acc, name) => ({
    ...acc,
    [name]: (
      <span
        onClick={e => { e.stopPropagation(); e.preventDefault() }}
        onTouchStart={e => { e.stopPropagation(); e.preventDefault() }}
        style={{ display: 'flex', alignItems: 'center', padding: '0.25rem 0' }}
      >
        <Checkbox label={name} checked={!!checkedLists[name]} onChange={() => onToggle(name)} />
      </span>
    ),
  }), {})

  const isBookmarked = Object.values(checkedLists).some(Boolean)

  return (
    <Dropdown
      action_menu
      preventSelection
      independentWidth
      align="right"
      trigger_element={triggerElement ?? ((props) => (
        <Button
          {...props}
          variant="secondary"
          icon={Bookmark}
          aria-label="Legg til i watchlist"
          style={{ margin: 0, ...(isBookmarked ? { color: '#007b5e' } : {}) }}
          className={isBookmarked ? 'bookmark-filled' : ''}
        />
      ))}
      data={data}
    />
  )
}
