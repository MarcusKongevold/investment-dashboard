import React, { useState } from 'react'
import { Tabs, Space } from '@dnb/eufemia'
import Header from './components/Header.jsx'
import AccountFilter from './components/AccountFilter.jsx'
import Overview from './pages/Overview.jsx'
import StockDetail from './pages/StockDetail.jsx'
import AdvancedInvestments from './pages/AdvancedInvestments.jsx'
import Analysis from './pages/Analysis.jsx'
import Holdings from './pages/Holdings.jsx'
import Dividends from './pages/Dividends.jsx'
import PopularFunds from './pages/PopularFunds.jsx'
import Marked from './pages/Marked.jsx'
import OverviewV2 from './pages/OverviewV2.jsx'

const TABS = [
  { title: 'Oversikt', key: 'oversikt' },
  { title: 'Overview V.2', key: 'oversikt-v2' },
  { title: 'Marked', key: 'marked' },
  { title: 'Porteføljeanalyse', key: 'analyse' },
  { title: 'Beholdning', key: 'beholdning' },
  { title: 'Utbytte', key: 'utbytte' },
  { title: 'Avanserte Investeringsprodukter', key: 'avansert' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('oversikt')
  const [currentStock, setCurrentStock] = useState(null)
  const [currentView, setCurrentView] = useState(null)
  const [selectedAccount, setSelectedAccount] = useState('Alle kontoer')
  const [includePensions, setIncludePensions] = useState(true)

  function handleStockClick(stock) {
    setCurrentStock(stock)
  }

  function handleBack() {
    setCurrentStock(null)
  }

  function handleNavigate(view) {
    setCurrentView(view)
    setCurrentStock(null)
  }

  function handleViewBack() {
    setCurrentView(null)
  }

  return (
    <div>
      <Header onStockClick={handleStockClick} />
      {currentView === 'popular-funds' && <PopularFunds onBack={handleViewBack} />}
      {!currentView && (<>
        <div style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-black-8)' }}>
          <div style={{ maxWidth: '1510px', margin: '0 auto', padding: '0 var(--spacing-large)' }}>
            <Tabs
              noBorder
              selectedKey={activeTab}
              data={TABS}
              
              onChange={({ selectedKey }) => { setActiveTab(selectedKey); setCurrentStock(null) }}
            />
          </div>
        </div>
        {!currentStock && activeTab !== 'avansert' && activeTab !== 'oversikt-v2' && <AccountFilter selectedAccount={selectedAccount} onAccountChange={setSelectedAccount} includePensions={includePensions} onIncludePensionsChange={setIncludePensions} />}
        {currentStock && <StockDetail stock={currentStock} onBack={handleBack} />}
        {!currentStock && activeTab === 'oversikt-v2' && <OverviewV2 onStockClick={handleStockClick} selectedAccount={selectedAccount} onAccountChange={setSelectedAccount} includePensions={includePensions} onIncludePensionsChange={setIncludePensions} />}
        {!currentStock && activeTab === 'oversikt' && <Overview onStockClick={handleStockClick} selectedAccount={selectedAccount} includePensions={includePensions} onNavigate={handleNavigate} />}
        {!currentStock && activeTab === 'marked' && <Marked onStockClick={handleStockClick} />}
        {!currentStock && activeTab === 'avansert' && <AdvancedInvestments />}
        {!currentStock && activeTab === 'analyse' && <Analysis />}
        {!currentStock && activeTab === 'beholdning' && <Holdings selectedAccount={selectedAccount} includePensions={includePensions} onStockClick={handleStockClick} />}
        {!currentStock && activeTab === 'utbytte' && <Dividends selectedAccount={selectedAccount} />}
        {!currentStock && activeTab !== 'oversikt' && activeTab !== 'avansert' && activeTab !== 'analyse' && activeTab !== 'beholdning' && activeTab !== 'utbytte' && (
          <div style={{ maxWidth: '1510px', margin: '0 auto', padding: 'var(--spacing-xx-large) var(--spacing-large)' }}>
            <p style={{ color: 'var(--color-black-55)', textAlign: 'center' }}>Innhold for denne siden er ikke tilgjengelig i prototypen.</p>
          </div>
        )}
      </>)}
    </div>
  )
}
