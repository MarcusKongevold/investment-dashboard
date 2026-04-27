import React from 'react'
import SummaryCards from '../components/SummaryCards.jsx'
import PortfolioChart from '../components/PortfolioChart.jsx'
import AllocationBar from '../components/AllocationBar.jsx'
import BiggestMovers from '../components/BiggestMovers.jsx'
import AnalystUpdates from '../components/AnalystUpdates.jsx'
import Watchlist from '../components/Watchlist.jsx'
import NewsPanel from '../components/NewsPanel.jsx'
import CorporateEvents from '../components/CorporateEvents.jsx'
import PromoCards from '../components/PromoCards.jsx'

export default function Overview({ onStockClick, selectedAccount, includePensions, onNavigate }) {
  return (
    <div style={{ maxWidth: '1510px', margin: '0 auto', padding: 'var(--spacing-large)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-large)' }}>
      <SummaryCards selectedAccount={selectedAccount} includePensions={includePensions} />

      <div className="overview-grid">
        {/* Left main column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-large)', minWidth: 0 }}>
          <PortfolioChart />
          <AllocationBar />
          <BiggestMovers onStockClick={onStockClick} />
          <AnalystUpdates />
          <Watchlist onStockClick={onStockClick} />
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-large)', minWidth: 0 }}>
          <NewsPanel />
          <CorporateEvents />
          <PromoCards onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  )
}
