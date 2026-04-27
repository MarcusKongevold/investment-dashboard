import React from 'react'
import { Dropdown, Switch } from '@dnb/eufemia'

const ACCOUNT_DATA = [
  { value: 'Alle kontoer',   content: 'Alle kontoer' },
  { value: 'VPS-konto',      content: 'VPS-konto' },
  { value: 'Pensjonskonto',  content: 'Pensjonskonto' },
  { value: 'ASK Underkonto 1', selectedValue: 'ASK Underkonto 1', content: <><span>ASK Underkonto 1</span><span style={{ display: 'block', fontSize: 'var(--font-size-x-small)', color: 'var(--color-black-55)', fontWeight: 'normal' }}>Del av ASK Sparekonto A</span></> },
  { value: 'ASK Underkonto 2', selectedValue: 'ASK Underkonto 2', content: <><span>ASK Underkonto 2</span><span style={{ display: 'block', fontSize: 'var(--font-size-x-small)', color: 'var(--color-black-55)', fontWeight: 'normal' }}>Del av ASK Sparekonto A</span></> },
]

export default function AccountFilter({ selectedAccount, onAccountChange, includePensions, onIncludePensionsChange }) {
  return (
    <div style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-black-8)' }}>
      <div style={{ maxWidth: '1510px', margin: '0 auto', padding: 'var(--spacing-small) var(--spacing-large)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-medium)' }}>
        <Dropdown
          variant="tertiary"
          size="small"
          value={selectedAccount}
          data={ACCOUNT_DATA}
          onChange={({ data }) => onAccountChange(data.value)}
          independentWidth
        />

        {selectedAccount === 'Alle kontoer' && (
          <Switch
            label="Inkluder pensjonskontoer"
            label_position="right"
            checked={includePensions}
            size="medium"
            onChange={({ checked }) => onIncludePensionsChange(checked)}
          />
        )}
      </div>
    </div>
  )
}
