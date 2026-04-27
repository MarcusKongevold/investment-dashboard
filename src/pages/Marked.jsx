import React, { useState } from 'react'
import { Card, NumberFormat, List, Button, Table } from '@dnb/eufemia'
import NewsPanel from '../components/NewsPanel.jsx'

const GEO_URL = '/worldmap.svg'

function coordToPercent(lon, lat) {
  return {
    left: `${((lon + 180) / 360) * 100}%`,
    top:  `${((85 - lat) / 145) * 100}%`,
  }
}

// [lon, lat, labelLeft%, labelTop%] — label offsets chosen to avoid overlap
const TOP5_INDICES = [
  { name: 'Oslo Børs',  lon:  10,   lat: 60,  lx: 64,  ly:  4,  change:  0.54 },
  { name: 'S&P 500',    lon: -98,   lat: 38,  lx:  4,  ly: 20,  change:  0.31 },
  { name: 'Nasdaq 100', lon: -122,  lat: 37,  lx:  2,  ly: 36,  change:  0.67 },
  { name: 'DAX',        lon:  10,   lat: 51,  lx: 66,  ly: 22,  change: -0.22 },
  { name: 'FTSE 100',   lon:  -2,   lat: 53,  lx: 36,  ly:  6,  change: -0.14 },
]

function IndexWorldMap() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-x-small)' }}>
      <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: 0 }}>Globale indekser</p>
      <Card stack>
        <div style={{ position: 'relative', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <img src={GEO_URL} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />

          {/* SVG overlay for dots and lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
            {TOP5_INDICES.map(({ name, lon, lat, lx, ly, change }) => {
              const dot = coordToPercent(lon, lat)
              const dx = parseFloat(dot.left)
              const dy = parseFloat(dot.top)
              const positive = change >= 0
              const color = positive ? '#007b5e' : '#dc2626'
              return (
                <g key={name}>
                  <line
                    x1={`${dx}%`} y1={`${dy}%`}
                    x2={`${lx}%`} y2={`${ly + 2.5}%`}
                    stroke={color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7"
                  />
                  <circle cx={`${dx}%`} cy={`${dy}%`} r="5" fill={color} stroke="white" strokeWidth="2" />
                </g>
              )
            })}
          </svg>

          {/* HTML labels at offset positions */}
          {TOP5_INDICES.map(({ name, lx, ly, change }) => {
            const positive = change >= 0
            const color = positive ? '#007b5e' : '#dc2626'
            return (
              <div key={name} style={{ position: 'absolute', left: `${lx}%`, top: `${ly}%`, transform: 'translate(-50%, 0)', zIndex: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span style={{
                    background: 'rgba(255,255,255,0.95)', color: 'var(--color-black)',
                    fontSize: '13px', fontWeight: 700, padding: '2px 7px',
                    borderRadius: '4px', whiteSpace: 'nowrap',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.18)',
                  }}>
                    {name}
                  </span>
                  <span style={{
                    background: color, color: 'white',
                    fontSize: '12px', fontWeight: 600, padding: '1px 6px',
                    borderRadius: '9999px', whiteSpace: 'nowrap',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }}>
                    {positive ? '+' : ''}{change.toFixed(2)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

const INDICES = [
  { region: 'Norge',      name: 'Oslo Børs (OSEBX)',  value: 1482.34, change:  0.54 },
  { region: 'USA',        name: 'S&P 500',             value: 5248.49, change:  0.31 },
  { region: 'USA',        name: 'Nasdaq 100',          value: 18312.10, change:  0.67 },
  { region: 'Europa',     name: 'DAX',                 value: 18421.97, change: -0.22 },
  { region: 'Europa',     name: 'FTSE 100',            value: 8312.56, change: -0.14 },
  { region: 'Japan',      name: 'Nikkei 225',          value: 38460.08, change:  0.43 },
  { region: 'Kina',       name: 'Hang Seng',           value: 18204.61, change: -0.89 },
]

const CURRENCIES = [
  { pair: 'EUR/NOK', price: 11.74, change:  0.12 },
  { pair: 'USD/NOK', price: 10.52, change: -0.08 },
  { pair: 'GBP/NOK', price: 13.21, change:  0.05 },
  { pair: 'SEK/NOK', price:  0.998, change: -0.03 },
  { pair: 'DKK/NOK', price:  1.574, change:  0.01 },
  { pair: 'JPY/NOK', price:  0.071, change: -0.31 },
]

const COMMODITIES = [
  { sector: 'Energi',  name: 'Brent Crude',  price:  74.18, change: -0.43, unit: 'USD/fat' },
  { sector: 'Energi',  name: 'Naturgass',    price:   1.94, change:  1.04, unit: 'USD/MMBtu' },
  { sector: 'Metaller',name: 'Gull',         price: 2341.50, change:  0.21, unit: 'USD/oz' },
  { sector: 'Metaller',name: 'Sølv',         price:   27.83, change: -0.15, unit: 'USD/oz' },
  { sector: 'Metaller',name: 'Kobber',       price:    4.52, change:  0.38, unit: 'USD/lbs' },
  { sector: 'Korn',    name: 'Hvete',        price:  548.25, change: -0.72, unit: 'USd/bu' },
]

const MOST_TRADED = [
  { name: 'Equinor',           ticker: 'EQNR',  price: 284.60, change:  2.10, volume: '48.2M' },
  { name: 'DNB Bank',          ticker: 'DNB',   price: 231.40, change:  1.63, volume: '31.7M' },
  { name: 'Aker BP',           ticker: 'AKRBP', price: 298.80, change:  3.10, volume: '28.4M' },
  { name: 'Kongsberg Gruppen', ticker: 'KOG',   price: 892.00, change:  4.20, volume: '22.1M' },
  { name: 'Nel ASA',           ticker: 'NEL',   price:  10.84, change:  4.50, volume: '19.8M' },
  { name: 'Yara International',ticker: 'YAR',   price: 312.60, change: -0.55, volume: '17.3M' },
  { name: 'Norsk Hydro',       ticker: 'NHY',   price:  67.38, change: -1.12, volume: '15.6M' },
  { name: 'Mowi',              ticker: 'MOWI',  price: 185.40, change:  1.25, volume: '12.9M' },
]

const EXCHANGES = [
  { key: 'alle',   label: 'Alle' },
  { key: 'oslo',   label: 'Oslo Børs' },
  { key: 'sp500',  label: 'S&P 500' },
  { key: 'nasdaq', label: 'Nasdaq' },
  { key: 'dax',    label: 'DAX' },
]

const PERIODS = ['Dag', 'Uke', 'Måned', 'År']

const MARKET_DATA = {
  oslo: {
    winners: {
      Dag:   [{ name: 'Nel ASA', ticker: 'NEL', price: 10.84, change: 4.50 }, { name: 'Kongsberg Gruppen', ticker: 'KOG', price: 892.00, change: 4.20 }, { name: 'Aker BP', ticker: 'AKRBP', price: 298.80, change: 3.10 }, { name: 'Equinor', ticker: 'EQNR', price: 284.60, change: 2.10 }, { name: 'DNB Bank', ticker: 'DNB', price: 231.40, change: 1.63 }],
      Uke:   [{ name: 'Kongsberg Gruppen', ticker: 'KOG', price: 892.00, change: 9.80 }, { name: 'Aker BP', ticker: 'AKRBP', price: 298.80, change: 7.40 }, { name: 'Nel ASA', ticker: 'NEL', price: 10.84, change: 6.20 }, { name: 'Mowi', ticker: 'MOWI', price: 185.40, change: 4.30 }, { name: 'Equinor', ticker: 'EQNR', price: 284.60, change: 3.90 }],
      Måned: [{ name: 'Kongsberg Gruppen', ticker: 'KOG', price: 892.00, change: 18.50 }, { name: 'Nel ASA', ticker: 'NEL', price: 10.84, change: 14.20 }, { name: 'DNB Bank', ticker: 'DNB', price: 231.40, change: 11.80 }, { name: 'Aker BP', ticker: 'AKRBP', price: 298.80, change: 9.60 }, { name: 'Storebrand', ticker: 'STB', price: 96.40, change: 7.30 }],
      År:    [{ name: 'Kongsberg Gruppen', ticker: 'KOG', price: 892.00, change: 62.10 }, { name: 'Nel ASA', ticker: 'NEL', price: 10.84, change: 44.80 }, { name: 'Aker BP', ticker: 'AKRBP', price: 298.80, change: 38.20 }, { name: 'DNB Bank', ticker: 'DNB', price: 231.40, change: 29.50 }, { name: 'Mowi', ticker: 'MOWI', price: 185.40, change: 22.40 }],
    },
    losers: {
      Dag:   [{ name: 'Schibsted', ticker: 'SCHB', price: 218.50, change: -3.40 }, { name: 'Yara International', ticker: 'YAR', price: 312.60, change: -2.80 }, { name: 'Norsk Hydro', ticker: 'NHY', price: 67.38, change: -1.12 }, { name: 'Orkla', ticker: 'ORK', price: 98.56, change: -0.95 }, { name: 'Telenor', ticker: 'TEL', price: 128.20, change: -0.74 }],
      Uke:   [{ name: 'Yara International', ticker: 'YAR', price: 312.60, change: -8.10 }, { name: 'Schibsted', ticker: 'SCHB', price: 218.50, change: -6.40 }, { name: 'Norsk Hydro', ticker: 'NHY', price: 67.38, change: -5.20 }, { name: 'Orkla', ticker: 'ORK', price: 98.56, change: -3.80 }, { name: 'Telenor', ticker: 'TEL', price: 128.20, change: -2.60 }],
      Måned: [{ name: 'Yara International', ticker: 'YAR', price: 312.60, change: -14.30 }, { name: 'Schibsted', ticker: 'SCHB', price: 218.50, change: -11.60 }, { name: 'Norsk Hydro', ticker: 'NHY', price: 67.38, change: -9.40 }, { name: 'Telenor', ticker: 'TEL', price: 128.20, change: -6.80 }, { name: 'Orkla', ticker: 'ORK', price: 98.56, change: -4.20 }],
      År:    [{ name: 'Yara International', ticker: 'YAR', price: 312.60, change: -32.50 }, { name: 'Schibsted', ticker: 'SCHB', price: 218.50, change: -24.10 }, { name: 'Norsk Hydro', ticker: 'NHY', price: 67.38, change: -18.70 }, { name: 'Telenor', ticker: 'TEL', price: 128.20, change: -12.40 }, { name: 'Orkla', ticker: 'ORK', price: 98.56, change: -8.30 }],
    },
    mostTraded: {
      Dag:   [{ name: 'Equinor', ticker: 'EQNR', price: 284.60, change: 2.10 }, { name: 'DNB Bank', ticker: 'DNB', price: 231.40, change: 1.63 }, { name: 'Aker BP', ticker: 'AKRBP', price: 298.80, change: 3.10 }, { name: 'Kongsberg Gruppen', ticker: 'KOG', price: 892.00, change: 4.20 }, { name: 'Nel ASA', ticker: 'NEL', price: 10.84, change: 4.50 }],
      Uke:   [{ name: 'Equinor', ticker: 'EQNR', price: 284.60, change: 2.10 }, { name: 'Kongsberg Gruppen', ticker: 'KOG', price: 892.00, change: 4.20 }, { name: 'DNB Bank', ticker: 'DNB', price: 231.40, change: 1.63 }, { name: 'Norsk Hydro', ticker: 'NHY', price: 67.38, change: -1.12 }, { name: 'Aker BP', ticker: 'AKRBP', price: 298.80, change: 3.10 }],
      Måned: [{ name: 'Equinor', ticker: 'EQNR', price: 284.60, change: 2.10 }, { name: 'DNB Bank', ticker: 'DNB', price: 231.40, change: 1.63 }, { name: 'Kongsberg Gruppen', ticker: 'KOG', price: 892.00, change: 4.20 }, { name: 'Yara International', ticker: 'YAR', price: 312.60, change: -0.55 }, { name: 'Mowi', ticker: 'MOWI', price: 185.40, change: 1.25 }],
      År:    [{ name: 'Equinor', ticker: 'EQNR', price: 284.60, change: 2.10 }, { name: 'Kongsberg Gruppen', ticker: 'KOG', price: 892.00, change: 4.20 }, { name: 'DNB Bank', ticker: 'DNB', price: 231.40, change: 1.63 }, { name: 'Aker BP', ticker: 'AKRBP', price: 298.80, change: 3.10 }, { name: 'Nel ASA', ticker: 'NEL', price: 10.84, change: 4.50 }],
    },
  },
  sp500: {
    winners: {
      Dag:   [{ name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 5.20 }, { name: 'Meta', ticker: 'META', price: 512.30, change: 3.80 }, { name: 'Amazon', ticker: 'AMZN', price: 182.60, change: 2.90 }, { name: 'Alphabet', ticker: 'GOOGL', price: 171.90, change: 2.10 }, { name: 'Microsoft', ticker: 'MSFT', price: 415.20, change: 1.80 }],
      Uke:   [{ name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 11.40 }, { name: 'Meta', ticker: 'META', price: 512.30, change: 8.60 }, { name: 'Tesla', ticker: 'TSLA', price: 248.50, change: 6.30 }, { name: 'Amazon', ticker: 'AMZN', price: 182.60, change: 5.10 }, { name: 'Alphabet', ticker: 'GOOGL', price: 171.90, change: 4.20 }],
      Måned: [{ name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 22.80 }, { name: 'Tesla', ticker: 'TSLA', price: 248.50, change: 18.40 }, { name: 'Meta', ticker: 'META', price: 512.30, change: 14.60 }, { name: 'Amazon', ticker: 'AMZN', price: 182.60, change: 10.20 }, { name: 'Apple', ticker: 'AAPL', price: 189.30, change: 7.80 }],
      År:    [{ name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 68.40 }, { name: 'Meta', ticker: 'META', price: 512.30, change: 42.10 }, { name: 'Tesla', ticker: 'TSLA', price: 248.50, change: 38.60 }, { name: 'Amazon', ticker: 'AMZN', price: 182.60, change: 28.40 }, { name: 'Apple', ticker: 'AAPL', price: 189.30, change: 22.10 }],
    },
    losers: {
      Dag:   [{ name: 'Boeing', ticker: 'BA', price: 182.40, change: -4.20 }, { name: 'Walgreens', ticker: 'WBA', price: 18.60, change: -3.10 }, { name: 'Intel', ticker: 'INTC', price: 31.20, change: -2.40 }, { name: 'Pfizer', ticker: 'PFE', price: 28.10, change: -1.80 }, { name: 'CVS Health', ticker: 'CVS', price: 54.30, change: -1.20 }],
      Uke:   [{ name: 'Boeing', ticker: 'BA', price: 182.40, change: -9.80 }, { name: 'Intel', ticker: 'INTC', price: 31.20, change: -7.60 }, { name: 'Walgreens', ticker: 'WBA', price: 18.60, change: -6.30 }, { name: 'Pfizer', ticker: 'PFE', price: 28.10, change: -4.20 }, { name: 'CVS Health', ticker: 'CVS', price: 54.30, change: -3.10 }],
      Måned: [{ name: 'Boeing', ticker: 'BA', price: 182.40, change: -18.40 }, { name: 'Intel', ticker: 'INTC', price: 31.20, change: -14.80 }, { name: 'Walgreens', ticker: 'WBA', price: 18.60, change: -11.20 }, { name: 'Pfizer', ticker: 'PFE', price: 28.10, change: -8.60 }, { name: 'CVS Health', ticker: 'CVS', price: 54.30, change: -5.40 }],
      År:    [{ name: 'Boeing', ticker: 'BA', price: 182.40, change: -38.20 }, { name: 'Intel', ticker: 'INTC', price: 31.20, change: -28.60 }, { name: 'Walgreens', ticker: 'WBA', price: 18.60, change: -22.40 }, { name: 'Pfizer', ticker: 'PFE', price: 28.10, change: -16.80 }, { name: 'CVS Health', ticker: 'CVS', price: 54.30, change: -12.40 }],
    },
    mostTraded: {
      Dag:   [{ name: 'Apple', ticker: 'AAPL', price: 189.30, change: 0.95 }, { name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 5.20 }, { name: 'Microsoft', ticker: 'MSFT', price: 415.20, change: 1.80 }, { name: 'Tesla', ticker: 'TSLA', price: 248.50, change: -0.60 }, { name: 'Amazon', ticker: 'AMZN', price: 182.60, change: 2.90 }],
      Uke:   [{ name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 11.40 }, { name: 'Apple', ticker: 'AAPL', price: 189.30, change: 3.20 }, { name: 'Tesla', ticker: 'TSLA', price: 248.50, change: 6.30 }, { name: 'Microsoft', ticker: 'MSFT', price: 415.20, change: 2.80 }, { name: 'Amazon', ticker: 'AMZN', price: 182.60, change: 5.10 }],
      Måned: [{ name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 22.80 }, { name: 'Apple', ticker: 'AAPL', price: 189.30, change: 7.80 }, { name: 'Microsoft', ticker: 'MSFT', price: 415.20, change: 5.40 }, { name: 'Amazon', ticker: 'AMZN', price: 182.60, change: 10.20 }, { name: 'Meta', ticker: 'META', price: 512.30, change: 14.60 }],
      År:    [{ name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 68.40 }, { name: 'Apple', ticker: 'AAPL', price: 189.30, change: 22.10 }, { name: 'Microsoft', ticker: 'MSFT', price: 415.20, change: 18.60 }, { name: 'Amazon', ticker: 'AMZN', price: 182.60, change: 28.40 }, { name: 'Meta', ticker: 'META', price: 512.30, change: 42.10 }],
    },
  },
  nasdaq: {
    winners: {
      Dag:   [{ name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 5.20 }, { name: 'Broadcom', ticker: 'AVGO', price: 1420.00, change: 4.10 }, { name: 'Meta', ticker: 'META', price: 512.30, change: 3.80 }, { name: 'Netflix', ticker: 'NFLX', price: 628.40, change: 2.90 }, { name: 'Amazon', ticker: 'AMZN', price: 182.60, change: 2.90 }],
      Uke:   [{ name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 11.40 }, { name: 'Broadcom', ticker: 'AVGO', price: 1420.00, change: 9.20 }, { name: 'Meta', ticker: 'META', price: 512.30, change: 8.60 }, { name: 'Netflix', ticker: 'NFLX', price: 628.40, change: 6.80 }, { name: 'Tesla', ticker: 'TSLA', price: 248.50, change: 6.30 }],
      Måned: [{ name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 22.80 }, { name: 'Broadcom', ticker: 'AVGO', price: 1420.00, change: 18.60 }, { name: 'Tesla', ticker: 'TSLA', price: 248.50, change: 18.40 }, { name: 'Meta', ticker: 'META', price: 512.30, change: 14.60 }, { name: 'Netflix', ticker: 'NFLX', price: 628.40, change: 12.30 }],
      År:    [{ name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 68.40 }, { name: 'Broadcom', ticker: 'AVGO', price: 1420.00, change: 52.30 }, { name: 'Meta', ticker: 'META', price: 512.30, change: 42.10 }, { name: 'Netflix', ticker: 'NFLX', price: 628.40, change: 36.80 }, { name: 'Tesla', ticker: 'TSLA', price: 248.50, change: 38.60 }],
    },
    losers: {
      Dag:   [{ name: 'Intel', ticker: 'INTC', price: 31.20, change: -2.40 }, { name: 'Qualcomm', ticker: 'QCOM', price: 162.40, change: -1.90 }, { name: 'Micron', ticker: 'MU', price: 112.80, change: -1.60 }, { name: 'Zoom', ticker: 'ZM', price: 62.40, change: -1.30 }, { name: 'PayPal', ticker: 'PYPL', price: 68.20, change: -1.10 }],
      Uke:   [{ name: 'Intel', ticker: 'INTC', price: 31.20, change: -7.60 }, { name: 'Qualcomm', ticker: 'QCOM', price: 162.40, change: -5.80 }, { name: 'Micron', ticker: 'MU', price: 112.80, change: -4.20 }, { name: 'Zoom', ticker: 'ZM', price: 62.40, change: -3.80 }, { name: 'PayPal', ticker: 'PYPL', price: 68.20, change: -3.10 }],
      Måned: [{ name: 'Intel', ticker: 'INTC', price: 31.20, change: -14.80 }, { name: 'Qualcomm', ticker: 'QCOM', price: 162.40, change: -10.60 }, { name: 'Zoom', ticker: 'ZM', price: 62.40, change: -8.40 }, { name: 'PayPal', ticker: 'PYPL', price: 68.20, change: -6.80 }, { name: 'Micron', ticker: 'MU', price: 112.80, change: -5.20 }],
      År:    [{ name: 'Intel', ticker: 'INTC', price: 31.20, change: -28.60 }, { name: 'Zoom', ticker: 'ZM', price: 62.40, change: -22.40 }, { name: 'PayPal', ticker: 'PYPL', price: 68.20, change: -18.60 }, { name: 'Qualcomm', ticker: 'QCOM', price: 162.40, change: -14.20 }, { name: 'Micron', ticker: 'MU', price: 112.80, change: -10.40 }],
    },
    mostTraded: {
      Dag:   [{ name: 'Apple', ticker: 'AAPL', price: 189.30, change: 0.95 }, { name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 5.20 }, { name: 'Microsoft', ticker: 'MSFT', price: 415.20, change: 1.80 }, { name: 'Amazon', ticker: 'AMZN', price: 182.60, change: 2.90 }, { name: 'Netflix', ticker: 'NFLX', price: 628.40, change: 2.90 }],
      Uke:   [{ name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 11.40 }, { name: 'Apple', ticker: 'AAPL', price: 189.30, change: 3.20 }, { name: 'Amazon', ticker: 'AMZN', price: 182.60, change: 5.10 }, { name: 'Tesla', ticker: 'TSLA', price: 248.50, change: 6.30 }, { name: 'Netflix', ticker: 'NFLX', price: 628.40, change: 6.80 }],
      Måned: [{ name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 22.80 }, { name: 'Apple', ticker: 'AAPL', price: 189.30, change: 7.80 }, { name: 'Amazon', ticker: 'AMZN', price: 182.60, change: 10.20 }, { name: 'Meta', ticker: 'META', price: 512.30, change: 14.60 }, { name: 'Netflix', ticker: 'NFLX', price: 628.40, change: 12.30 }],
      År:    [{ name: 'Nvidia', ticker: 'NVDA', price: 875.40, change: 68.40 }, { name: 'Apple', ticker: 'AAPL', price: 189.30, change: 22.10 }, { name: 'Amazon', ticker: 'AMZN', price: 182.60, change: 28.40 }, { name: 'Meta', ticker: 'META', price: 512.30, change: 42.10 }, { name: 'Netflix', ticker: 'NFLX', price: 628.40, change: 36.80 }],
    },
  },
  dax: {
    winners: {
      Dag:   [{ name: 'Rheinmetall', ticker: 'RHM', price: 682.40, change: 4.80 }, { name: 'Siemens', ticker: 'SIE', price: 178.60, change: 3.20 }, { name: 'SAP', ticker: 'SAP', price: 186.40, change: 2.60 }, { name: 'Allianz', ticker: 'ALV', price: 282.10, change: 1.90 }, { name: 'BASF', ticker: 'BAS', price: 44.82, change: 1.40 }],
      Uke:   [{ name: 'Rheinmetall', ticker: 'RHM', price: 682.40, change: 10.20 }, { name: 'Siemens', ticker: 'SIE', price: 178.60, change: 7.40 }, { name: 'SAP', ticker: 'SAP', price: 186.40, change: 5.80 }, { name: 'BASF', ticker: 'BAS', price: 44.82, change: 4.20 }, { name: 'BMW', ticker: 'BMW', price: 72.40, change: 3.60 }],
      Måned: [{ name: 'Rheinmetall', ticker: 'RHM', price: 682.40, change: 24.60 }, { name: 'Siemens', ticker: 'SIE', price: 178.60, change: 16.80 }, { name: 'SAP', ticker: 'SAP', price: 186.40, change: 12.40 }, { name: 'Allianz', ticker: 'ALV', price: 282.10, change: 9.20 }, { name: 'BMW', ticker: 'BMW', price: 72.40, change: 7.80 }],
      År:    [{ name: 'Rheinmetall', ticker: 'RHM', price: 682.40, change: 72.40 }, { name: 'SAP', ticker: 'SAP', price: 186.40, change: 38.60 }, { name: 'Siemens', ticker: 'SIE', price: 178.60, change: 28.40 }, { name: 'Allianz', ticker: 'ALV', price: 282.10, change: 22.80 }, { name: 'BMW', ticker: 'BMW', price: 72.40, change: 14.60 }],
    },
    losers: {
      Dag:   [{ name: 'Volkswagen', ticker: 'VOW3', price: 92.40, change: -3.80 }, { name: 'Bayer', ticker: 'BAYN', price: 24.60, change: -2.90 }, { name: 'Mercedes-Benz', ticker: 'MBG', price: 56.20, change: -2.10 }, { name: 'BASF', ticker: 'BAS', price: 44.82, change: -1.60 }, { name: 'Fresenius', ticker: 'FRE', price: 34.80, change: -1.20 }],
      Uke:   [{ name: 'Volkswagen', ticker: 'VOW3', price: 92.40, change: -8.60 }, { name: 'Bayer', ticker: 'BAYN', price: 24.60, change: -6.40 }, { name: 'Mercedes-Benz', ticker: 'MBG', price: 56.20, change: -5.20 }, { name: 'BASF', ticker: 'BAS', price: 44.82, change: -4.10 }, { name: 'Fresenius', ticker: 'FRE', price: 34.80, change: -3.20 }],
      Måned: [{ name: 'Volkswagen', ticker: 'VOW3', price: 92.40, change: -16.40 }, { name: 'Bayer', ticker: 'BAYN', price: 24.60, change: -12.80 }, { name: 'Mercedes-Benz', ticker: 'MBG', price: 56.20, change: -10.40 }, { name: 'BASF', ticker: 'BAS', price: 44.82, change: -8.20 }, { name: 'Fresenius', ticker: 'FRE', price: 34.80, change: -6.40 }],
      År:    [{ name: 'Volkswagen', ticker: 'VOW3', price: 92.40, change: -34.60 }, { name: 'Bayer', ticker: 'BAYN', price: 24.60, change: -28.40 }, { name: 'Mercedes-Benz', ticker: 'MBG', price: 56.20, change: -22.60 }, { name: 'BASF', ticker: 'BAS', price: 44.82, change: -18.40 }, { name: 'Fresenius', ticker: 'FRE', price: 34.80, change: -12.80 }],
    },
    mostTraded: {
      Dag:   [{ name: 'SAP', ticker: 'SAP', price: 186.40, change: 2.60 }, { name: 'Siemens', ticker: 'SIE', price: 178.60, change: 3.20 }, { name: 'Allianz', ticker: 'ALV', price: 282.10, change: 1.90 }, { name: 'Volkswagen', ticker: 'VOW3', price: 92.40, change: -3.80 }, { name: 'Rheinmetall', ticker: 'RHM', price: 682.40, change: 4.80 }],
      Uke:   [{ name: 'SAP', ticker: 'SAP', price: 186.40, change: 5.80 }, { name: 'Rheinmetall', ticker: 'RHM', price: 682.40, change: 10.20 }, { name: 'Siemens', ticker: 'SIE', price: 178.60, change: 7.40 }, { name: 'Volkswagen', ticker: 'VOW3', price: 92.40, change: -8.60 }, { name: 'BMW', ticker: 'BMW', price: 72.40, change: 3.60 }],
      Måned: [{ name: 'SAP', ticker: 'SAP', price: 186.40, change: 12.40 }, { name: 'Rheinmetall', ticker: 'RHM', price: 682.40, change: 24.60 }, { name: 'Siemens', ticker: 'SIE', price: 178.60, change: 16.80 }, { name: 'Volkswagen', ticker: 'VOW3', price: 92.40, change: -16.40 }, { name: 'Allianz', ticker: 'ALV', price: 282.10, change: 9.20 }],
      År:    [{ name: 'SAP', ticker: 'SAP', price: 186.40, change: 38.60 }, { name: 'Rheinmetall', ticker: 'RHM', price: 682.40, change: 72.40 }, { name: 'Siemens', ticker: 'SIE', price: 178.60, change: 28.40 }, { name: 'Volkswagen', ticker: 'VOW3', price: 92.40, change: -34.60 }, { name: 'Allianz', ticker: 'ALV', price: 282.10, change: 22.80 }],
    },
  },
}

function getAllMarket(period) {
  const exchanges = ['oslo', 'sp500', 'nasdaq', 'dax']
  const allWinners = exchanges.flatMap(ex => MARKET_DATA[ex].winners[period])
  const allLosers = exchanges.flatMap(ex => MARKET_DATA[ex].losers[period])
  const allMostTraded = exchanges.flatMap(ex => MARKET_DATA[ex].mostTraded[period])
  const unique = (arr) => arr.filter((s, i, self) => self.findIndex(x => x.ticker === s.ticker) === i)
  return {
    winners:    unique(allWinners).sort((a, b) => b.change - a.change).slice(0, 5),
    losers:     unique(allLosers).sort((a, b) => a.change - b.change).slice(0, 5),
    mostTraded: unique(allMostTraded).slice(0, 5),
  }
}

function ChangeBadge({ change }) {
  const positive = change >= 0
  return (
    <span className={`change-badge change-badge--${positive ? 'positive' : 'negative'}`}>
      {positive ? '+' : ''}{change.toFixed(2)}%
    </span>
  )
}

function StockTable({ stocks, onStockClick }) {
  return (
    <List.Container>
      {stocks.map(({ name, ticker, price, change }) => (
        <List.Item.Basic key={ticker}>
          <List.Cell.Title>
            <span
              style={{ cursor: 'pointer', color: 'var(--color-sea-green)', textDecoration: 'underline' }}
              onClick={() => onStockClick?.({ name, ticker })}
            >
              {name}
            </span>
            <List.Cell.Title.Subline variant="description">{ticker}</List.Cell.Title.Subline>
          </List.Cell.Title>
          <List.Cell.End>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              <span style={{ fontSize: 'var(--font-size-small)' }}>
                <NumberFormat.Number value={price} decimals={2} />
              </span>
              <ChangeBadge change={change} />
            </div>
          </List.Cell.End>
        </List.Item.Basic>
      ))}
    </List.Container>
  )
}


function StockTableEufemia({ stocks, onStockClick }) {
  return (
    <Table border size="small" style={{ fontSize: '12px' }}>
      <thead>
        <tr>
          <th scope="col" style={{ padding: '4px 8px' }}>Aksje</th>
          <th scope="col" style={{ textAlign: 'right', padding: '4px 8px' }}>Kurs</th>
          <th scope="col" style={{ textAlign: 'right', padding: '4px 8px' }}>Endring</th>
        </tr>
      </thead>
      <tbody>
        {(stocks ?? []).map(({ name, ticker, price, change }) => {
          const positive = change >= 0
          return (
            <tr key={ticker}>
              <td style={{ padding: '3px 8px' }}>
                <span
                  style={{ cursor: 'pointer', color: 'var(--color-sea-green)', textDecoration: 'underline' }}
                  onClick={() => onStockClick?.({ name, ticker })}
                >
                  {name}
                </span>
                {' '}
                <span style={{ color: 'var(--color-black-55)' }}>{ticker}</span>
              </td>
              <td style={{ textAlign: 'right', padding: '3px 8px' }}>
                <NumberFormat.Number value={price} decimals={2} />
              </td>
              <td style={{ textAlign: 'right', padding: '3px 8px' }}>
                <ChangeBadge change={change} />
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

function IndicesTable() {  return (
    <List.Container>
      {INDICES.map(({ region, name, value, change }) => (
        <List.Item.Basic key={name}>
          <List.Cell.Title>
            <List.Cell.Title.Overline>{region}</List.Cell.Title.Overline>
            {name}
          </List.Cell.Title>
          <List.Cell.End>
              <ChangeBadge change={change} />
          </List.Cell.End>
        </List.Item.Basic>
      ))}
    </List.Container>
  )
}

function CurrenciesTable() {
  return (
    <List.Container>
      {CURRENCIES.map(({ pair, price, change }) => (
        <List.Item.Basic key={pair}>
          <List.Cell.Title>{pair}</List.Cell.Title>
          <List.Cell.End>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              <span style={{ fontSize: 'var(--font-size-small)' }}>
                <NumberFormat.Number value={price} decimals={price < 1 ? 3 : 2} />
              </span>
              <ChangeBadge change={change} />
            </div>
          </List.Cell.End>
        </List.Item.Basic>
      ))}
    </List.Container>
  )
}

function CommoditiesTable() {
  return (
    <List.Container>
      {COMMODITIES.map(({ sector, name, price, change, unit }) => (
        <List.Item.Basic key={name}>
          <List.Cell.Title>
            <List.Cell.Title.Overline>{sector}</List.Cell.Title.Overline>
            {name}
          </List.Cell.Title>
          <List.Cell.End>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              <span style={{ fontSize: 'var(--font-size-small)' }}>
                <NumberFormat.Number value={price} decimals={2} /> <span style={{ color: 'var(--color-black-55)', fontSize: 'var(--font-size-x-small)' }}>{unit}</span>
              </span>
              <ChangeBadge change={change} />
            </div>
          </List.Cell.End>
        </List.Item.Basic>
      ))}
    </List.Container>
  )
}



const cellStyle = { padding: '3px 8px' }
const cellRight = { ...cellStyle, textAlign: 'right' }
const thRight = { textAlign: 'right', padding: '4px 8px' }
const thLeft = { padding: '4px 8px' }

function IndicesTableEufemia() {
  return (
    <Table border size="small" style={{ fontSize: '12px' }}>
      <thead>
        <tr>
          <th scope="col" style={thLeft}>Indeks</th>
          <th scope="col" style={thRight}>Endring</th>
        </tr>
      </thead>
      <tbody>
        {INDICES.map(({ region, name, change }) => (
          <tr key={name}>
            <td style={cellStyle}>
              {name}{' '}
              <span style={{ color: 'var(--color-black-55)' }}>{region}</span>
            </td>
            <td style={cellRight}><ChangeBadge change={change} /></td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

function CurrenciesTableEufemia() {
  return (
    <Table border size="small" style={{ fontSize: '12px' }}>
      <thead>
        <tr>
          <th scope="col" style={thLeft}>Par</th>
          <th scope="col" style={thRight}>Kurs</th>
          <th scope="col" style={thRight}>Endring</th>
        </tr>
      </thead>
      <tbody>
        {CURRENCIES.map(({ pair, price, change }) => (
          <tr key={pair}>
            <td style={cellStyle}>{pair}</td>
            <td style={cellRight}><NumberFormat.Number value={price} decimals={price < 1 ? 3 : 2} /></td>
            <td style={cellRight}><ChangeBadge change={change} /></td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

function CommoditiesTableEufemia() {
  return (
    <Table border size="small" style={{ fontSize: '12px' }}>
      <thead>
        <tr>
          <th scope="col" style={thLeft}>Råvare</th>
          <th scope="col" style={thRight}>Kurs</th>
          <th scope="col" style={thRight}>Endring</th>
        </tr>
      </thead>
      <tbody>
        {COMMODITIES.map(({ sector, name, price, change, unit }) => (
          <tr key={name}>
            <td style={cellStyle}>
              {name}{' '}
              <span style={{ color: 'var(--color-black-55)' }}>{unit}</span>
            </td>
            <td style={cellRight}><NumberFormat.Number value={price} decimals={2} /></td>
            <td style={cellRight}><ChangeBadge change={change} /></td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default function Marked({ onStockClick }) {
  const [period, setPeriod] = useState('Dag')
  const [exchange, setExchange] = useState('alle')
  const currentData = exchange === 'alle'
    ? getAllMarket(period)
    : { winners: MARKET_DATA[exchange].winners[period], losers: MARKET_DATA[exchange].losers[period], mostTraded: MARKET_DATA[exchange].mostTraded[period] }

  return (
    <div style={{ maxWidth: '1510px', margin: '0 auto', padding: 'var(--spacing-large)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-large)' }}>
      <IndexWorldMap />
      <Card stack>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-small)' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {EXCHANGES.map(ex => (
              <Button
                key={ex.key}
                variant={exchange === ex.key ? 'primary' : 'secondary'}
                size="medium"
                onClick={() => setExchange(ex.key)}
              >
                {ex.label}
              </Button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {PERIODS.map(p => (
              <Button
                key={p}
                variant={period === p ? 'primary' : 'secondary'}
                size="medium"
                onClick={() => setPeriod(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr', gap: 'var(--spacing-large)' }}>
          <div>
            <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: '0 0 var(--spacing-x-small) 0' }}>Vinnere</p>
            <StockTable stocks={currentData.winners} onStockClick={onStockClick} />
          </div>
          <div style={{ background: 'var(--color-black-8)' }} />
          <div>
            <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: '0 0 var(--spacing-x-small) 0' }}>Tapere</p>
            <StockTable stocks={currentData.losers} onStockClick={onStockClick} />
          </div>
          <div style={{ background: 'var(--color-black-8)' }} />
          <div>
            <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: '0 0 var(--spacing-x-small) 0' }}>Mest omsatt</p>
            <StockTable stocks={currentData.mostTraded} onStockClick={onStockClick} />
          </div>
        </div>
      </Card>
      <Card stack>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-small)' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {EXCHANGES.map(ex => (
              <Button key={ex.key} variant={exchange === ex.key ? 'primary' : 'secondary'} size="medium" onClick={() => setExchange(ex.key)}>{ex.label}</Button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {PERIODS.map(p => (
              <Button key={p} variant={period === p ? 'primary' : 'secondary'} size="medium" onClick={() => setPeriod(p)}>{p}</Button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-large)' }}>
          <div>
            <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: '0 0 var(--spacing-x-small) 0' }}>Vinnere</p>
            <StockTableEufemia stocks={currentData.winners} onStockClick={onStockClick} />
          </div>
          <div>
            <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: '0 0 var(--spacing-x-small) 0' }}>Tapere</p>
            <StockTableEufemia stocks={currentData.losers} onStockClick={onStockClick} />
          </div>
          <div>
            <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: '0 0 var(--spacing-x-small) 0' }}>Mest omsatt</p>
            <StockTableEufemia stocks={currentData.mostTraded} onStockClick={onStockClick} />
          </div>
        </div>
      </Card>
      <Card stack>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr', gap: 'var(--spacing-large)' }}>
          <div>
            <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: '0 0 var(--spacing-x-small) 0' }}>Indekser</p>
            <IndicesTable />
          </div>
          <div style={{ background: 'var(--color-black-8)' }} />
          <div>
            <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: '0 0 var(--spacing-x-small) 0' }}>Valuta</p>
            <CurrenciesTable />
          </div>
          <div style={{ background: 'var(--color-black-8)' }} />
          <div>
            <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: '0 0 var(--spacing-x-small) 0' }}>Råvarer</p>
            <CommoditiesTable />
          </div>
        </div>
      </Card>
      <Card stack>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-large)' }}>
          <div>
            <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: '0 0 var(--spacing-x-small) 0' }}>Indekser</p>
            <IndicesTableEufemia />
          </div>
          <div>
            <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: '0 0 var(--spacing-x-small) 0' }}>Valuta</p>
            <CurrenciesTableEufemia />
          </div>
          <div>
            <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: '0 0 var(--spacing-x-small) 0' }}>Råvarer</p>
            <CommoditiesTableEufemia />
          </div>
        </div>
      </Card>
      <NewsPanel dnbOnly maxItems={10} />    </div>
  )
}
