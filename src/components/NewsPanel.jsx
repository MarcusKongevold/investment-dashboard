import React, { useState } from 'react'
import { List, Dialog, Button, Tabs } from '@dnb/eufemia'
import ChevronRight from '@dnb/eufemia/icons/dnb/chevron_right'
import { NEWS } from '../data/newsData.js'

const DNB_NEWS = [
  {
    category: 'Markedskommentar',
    date: '15.04 · 08:30',
    title: 'Oslo Børs åpner forsiktig ned etter uro i asiatiske markeder',
    body: 'Oslo Børs åpnet tirsdag morgen ned 0,4 prosent, påvirket av svak stemning i asiatiske markeder over natten. Nikkei falt 1,2 prosent og Hang Seng var ned 0,8 prosent etter at nye amerikanske tollsignaler skapte usikkerhet blant investorer i Asia.\n\nOljeprisen holder seg relativt stabil rundt 74 dollar fatet for Brent, noe som begrenser nedgangen for energisektoren på Oslo Børs.\n\nDNBs sjefsøkonom peker på at usikkerheten rundt handelspolitikk er den viktigste risikofaktoren for globale aksjemarkeder for øyeblikket, men understreker at de underliggende makroforholdene fortsatt er solide.',
    aiSummary: ['Oslo Børs åpner ned 0,4% etter svak Asia-stemning.', 'Oljepris rundt $74 fatet begrenser nedgangen for energiaksjer.'],
  },
  {
    category: 'Analyse',
    date: '14.04 · 12:15',
    title: 'Norsk økonomi viser styrke – DNB oppjusterer BNP-anslaget',
    body: 'DNBs sjefsøkonom Øystein Dørum oppjusterer BNP-anslaget for Fastlands-Norge i 2026 til 2,3 prosent, opp fra tidligere estimat på 1,9 prosent. Oppjusteringen skyldes sterkere enn ventet forbruksvekst og høy aktivitet i boligmarkedet.\n\nArbeidsledigheten holder seg lav på 3,8 prosent, og lønnsveksten ventes å ligge rundt 4,5 prosent i 2026, noe som kan gi Norges Bank grunn til å holde renten uendret lenger enn markedet for øyeblikket priser inn.\n\nDNB Markets forventer at første rentekutt fra Norges Bank kommer i september, ikke juni som tidligere antatt.',
    aiSummary: ['DNB oppjusterer Fastlands-BNP til 2,3% for 2026.', 'Første Norges Bank-kutt skyves til september ifølge DNB Markets.'],
  },
  {
    category: 'Sektor',
    date: '14.04 · 09:00',
    title: 'Energisektoren: Oljepris under press, men norske selskaper holder stand',
    body: 'Til tross for at oljeprisen har falt om lag 12 prosent siden årets start, viser norske olje- og gasselskaper overraskende god kostnadsdisiplin. DNBs sektoranalytiker peker på at de store norske aktørene som Equinor og Aker BP har lave break-even-kostnader og robuste balanseposter.\n\nUtbyttenivåene ventes opprettholdt selv om investeringene kuttes. Equinor har signalisert at aksjonæravkastning prioriteres, og de fleste analytikere forventer at utbytteprogrammene videreføres inn i 2027.\n\nDNB Markets har «kjøp» på Equinor med kursmål 310 kroner.',
    aiSummary: ['Norske oljeselskaper viser god kostnadsdisiplin til tross for prisfall.', 'DNB Markets har «kjøp» på Equinor med kursmål 310 kr.'],
  },
  {
    category: 'Renter',
    date: '11.04 · 14:45',
    title: 'Norges Bank holder renten – signaliserer kutt i andre halvår',
    body: 'Norges Bank besluttet torsdag å holde styringsrenten uendret på 4,50 prosent, i tråd med markedets forventninger. Sentralbanksjef Ida Wolden Bache pekte på at inflasjonen er på vei ned, men at lønnsveksten fortsatt gir grunn til varsomhet.\n\nSentralbanken signaliserer imidlertid at første rentekutt er ventet i løpet av andre halvår 2026, noe som er positivt for rentesensitive sektorer som eiendom og finans.\n\nKronen styrket seg 0,6 prosent mot euro etter pressekonferansen, og Oslo Børs steg 0,8 prosent på nyheten.',
    aiSummary: ['Norges Bank holder renten på 4,50%, varsler kutt i H2 2026.', 'Kronen styrker seg 0,6% mot euro etter pressekonferansen.'],
  },
  {
    category: 'Globalt',
    date: '10.04 · 10:20',
    title: 'Wall Street snur opp etter sterke sysselsettingstall fra USA',
    body: 'Amerikanske aksjemarkeder snudde fra rødt til grønt fredag etter at nye arbeidsmarkedstall viste en vekst på 228 000 nye jobber i mars, godt over forventningene på 185 000.\n\nS&P 500 endte opp 1,1 prosent og Nasdaq steg 1,4 prosent. Teknologiaksjer ledet an, med Nvidia og Microsoft blant de største bidragsyterne.\n\nDe sterke jobbdataene øker sannsynligheten for at Fed vil vente med å kutte renten til september, noe som ga en viss styrking av dollaren. DNBs valutastrateg ser ikke store bevegelser i NOK/USD på kort sikt.',
    aiSummary: ['USA skapte 228 000 jobber i mars – godt over ventet 185 000.', 'S&P 500 opp 1,1%; rentekutt fra Fed trolig utsatt til september.'],
  },
  {
    category: 'Fond',
    date: '09.04 · 08:00',
    title: 'DNB Global Indeks: Sterk start på 2026 til tross for volatilitet',
    body: 'DNB Global Indeks har levert en avkastning på 5,8 prosent hittil i 2026, til tross for perioder med betydelig markedsvolatilitet i kjølvannet av geopolitisk uro og rentebevegelser.\n\nFondets eksponering mot nordamerikanske teknologiselskaper har vært den viktigste avkastningsdriveren, mens eksponering mot fremvoksende markeder har trukket noe ned.\n\nDNBs fondsforvaltere vurderer å øke allokeringen til europeiske aksjer etter at disse har gjort det relativt svakt de siste 12 månedene og nå handles til attraktive verdsettelsesnivåer.',
    aiSummary: ['DNB Global Indeks opp 5,8% hittil i 2026.', 'Forvaltere vurderer økt eksponering mot europeiske aksjer.'],
  },
]

const ANALYSER = [
  {
    category: 'Aksjeanalyse', date: '16.04 · 09:00',
    title: 'Equinor: Oppgrader til kjøp – undervurdert på $74 olje',
    body: 'DNB Markets oppgraderer Equinor fra hold til kjøp med kursmål 310 kroner. Selskapet handles til en betydelig rabatt mot historisk gjennomsnitt, og vi mener markedet undervurderer selskapets evne til å generere kontantstrøm ved lavere oljepriser.\n\nUtbytteprogrammet på 4,2 milliarder dollar fremstår som svært godt sikret, og aksjonæravkastningen vil sannsynligvis bli opprettholdt gjennom syklusen. Vi ser en oppsidepotensial på 25 prosent fra dagens nivå.',
    aiSummary: ['Equinor oppgraderes til kjøp med kursmål 310 kr.', 'Solid utbytteprogram på $4,2 mrd fremstår som godt sikret.'],
  },
  {
    category: 'Sektoranalyse', date: '15.04 · 11:30',
    title: 'Norsk lakseoppdrett: Strukturell vekst til tross for volatilitet',
    body: 'Lakseprisen har falt 18 prosent siden nyttår, men DNB Markets mener den langsiktige investeringscasen for norske oppdrettsselskaper forblir intakt. Etterspørselsveksten fra Asia og begrensede konsesjoner gir strukturell støtte.\n\nMowi og SalMar fremheves som foretrukne eksponeringsvalg. Begge handles til attraktive multipler, og begge har demonstrert god kostnadskontroll i utfordrende perioder.',
    aiSummary: ['Lakseprisen ned 18% YTD, men langsiktig case intakt.', 'Mowi og SalMar er DNBs foretrukne valg i sektoren.'],
  },
  {
    category: 'Makroanalyse', date: '14.04 · 08:45',
    title: 'Norges Bank på vent – første kutt trolig i september 2026',
    body: 'Etter å ha holdt renten uendret på 4,50 prosent sender Norges Bank et klart signal om at pengepolitikken vil forbli stram lenger enn markedet tidligere hadde priset inn. DNB Markets justerer sin prognose og forventer nå første kutt i september 2026.\n\nKronekursen har styrket seg og handles nå under 10,50 mot dollar. En sterkere krone kan dempe eksportinntektene for norske industribedrifter.',
    aiSummary: ['DNB Markets skyver Norges Bank-kutt til september 2026.', 'NOK styrker seg under 10,50 mot USD.'],
  },
  {
    category: 'Aksjeanalyse', date: '11.04 · 13:20',
    title: 'Kongsberg Gruppen: Forsvarsvekst prises ikke fullt ut',
    body: 'Kongsberg Gruppen fortsetter å overraske på oppsiden, drevet av rekordstor ordrebok i forsvarsdivisjonen. DNB Markets opprettholder kjøpsanbefaling og hever kursmålet til 1 050 kroner.\n\nOrdreinngangen i Q1 oversteg forventningene med 22 prosent. Med økte forsvarsbudsjetter i Europa og langsiktige leveransekontrakter ser vi god synlighet i inntektsveksten frem mot 2028.',
    aiSummary: ['Kursmål hevet til 1 050 kr – kjøp opprettholdt.', 'Ordreinngangen i Q1 slo forventningene med 22%.'],
  },
  {
    category: 'Sektoranalyse', date: '10.04 · 10:00',
    title: 'Fintech og betalinger: Strukturelle vinnere i et høyrenteklima',
    body: 'Høye renter har paradoksalt nok gagnet betalingsselskaper med sterke balanser og høy omsetningshastighet. DNB Markets identifiserer tre nordiske selskaper som er posisjonert for å outperforme i dette miljøet.\n\nSpesielt fremheves selskaper med eksponering mot B2B-betalinger, der margiveksten har overrasket positivt de siste to kvartalene.',
    aiSummary: ['Betalingsselskaper gagnes av høyrenteregime.', 'B2B-betalinger viser sterkest marginvekst.'],
  },
]

const RAPPORTER = [
  {
    category: 'Kvartalsrapport', date: '15.04 · 07:00',
    title: 'Equinor Q1 2026: Overskudd på 4,9 mrd USD – over forventning',
    body: 'Equinor rapporterte et justert driftsresultat på 4,9 milliarder dollar for første kvartal 2026, mot konsensus på 4,5 milliarder. Produksjonen økte 3 prosent sammenlignet med samme kvartal i fjor, drevet av økt aktivitet på norsk sokkel.\n\nKontantgenerering forblir sterk, og selskapet bekrefter utbytteprogrammet for 2026. Ledelsen peker på at kostnadskontroll og effektivisering vil fortsette å være strategiske prioriteringer.',
    aiSummary: ['Equinor Q1: $4,9 mrd driftsresultat, 9% over konsensus.', 'Utbytteprogrammet for 2026 bekreftes.'],
  },
  {
    category: 'Årsrapport', date: '12.04 · 08:00',
    title: 'DNB Bank årsrapport 2025: Rekordresultat på 42 mrd NOK',
    body: 'DNB Bank leverte et historisk høyt årsresultat på 42 milliarder kroner for 2025, drevet av høye rentemarginer og sterk vekst i bedriftsmarkedet. Egenkapitalavkastningen endte på 16,8 prosent, godt over langsiktig mål på 13 prosent.\n\nStyret foreslår et utbytte på 12,50 kroner per aksje, pluss et ekstraordinært utbytte på 4,00 kroner. Total aksjonæravkastning inkludert tilbakekjøp utgjør over 18 milliarder kroner.',
    aiSummary: ['DNB Bank rekordresultat 42 mrd NOK i 2025.', 'Foreslår utbytte på 12,50 + 4,00 kr per aksje.'],
  },
  {
    category: 'Kvartalsrapport', date: '10.04 · 07:30',
    title: 'Kongsberg Gruppen Q1 2026: Ordreinngangen opp 34%',
    body: 'Kongsberg Gruppen rapporterte sterk ordreinngang i første kvartal 2026, opp 34 prosent fra samme periode i fjor. Forsvarsdivisjonen stod for hoveddelen av veksten, med kontrakter fra NATO-land i Øst-Europa.\n\nOMSETNINGEN økte 18 prosent til 9,2 milliarder kroner. EBITDA-marginen forbedret seg til 16,4 prosent. Selskapet hever guidingen for full-år 2026.',
    aiSummary: ['Ordreinngang opp 34% – forsvar driver veksten.', 'Full-år guiding heves etter sterkt Q1.'],
  },
  {
    category: 'Kvartalsrapport', date: '08.04 · 07:00',
    title: 'Mowi Q1 2026: Lavere lakspris demper resultatet',
    body: 'Mowi rapporterte et operasjonelt EBIT på 180 millioner euro for første kvartal 2026, ned fra 240 millioner euro i Q1 2025. Fallet skyldes i all vesentlighet lavere laksepris, mens volum og kostnader var på linje med forventningene.\n\nSelskapet opprettholder utbyttepolitikken og peker på forbedrede markedsutsikter for andre halvår, drevet av økt etterspørsel fra Asia og normalisering av tilbudet.',
    aiSummary: ['Mowi Q1 EBIT €180M – ned 25% på lavere lakspris.', 'Utbyttepolitikk opprettholdes, bedre H2 ventes.'],
  },
  {
    category: 'Halvårsrapport', date: '03.04 · 08:30',
    title: 'Yara International H2 2025: Marginpress fortsetter',
    body: 'Yara International rapporterte et svakere enn ventet halvårsresultat for H2 2025, preget av lave gjødselpriser og høye energikostnader i Europa. EBITDA endte på 480 millioner dollar, ned fra 720 millioner i H2 2024.\n\nSelskapet iverksetter ytterligere kostnadsreduksjoner og vurderer kapasitetsjusteringer ved europeiske produksjonsanlegg. Ledelsen er forsiktig optimistiske om prisutviklingen i andre halvår 2026.',
    aiSummary: ['Yara H2 EBITDA $480M – ned 33% på lave gjødselpriser.', 'Kostnadskutt og kapasitetsjusteringer vurderes i Europa.'],
  },
]

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

export default function NewsPanel({ dnbOnly = false, maxItems = 3 }) {
  const [selected, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState(dnbOnly ? 'dnb' : 'portfolio')

  const isPortfolio = !dnbOnly && activeTab === 'portfolio'

  const items = activeTab === 'portfolio' ? NEWS
    : activeTab === 'analyser' ? ANALYSER
    : activeTab === 'rapporter' ? RAPPORTER
    : DNB_NEWS

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-x-small)' }}>
      <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: 0 }}>Nyheter</p>
      <List.Card style={{ overflow: 'hidden' }}>
        <Tabs
          noBorder
          selectedKey={activeTab}
          data={dnbOnly ? [
            { title: 'DNB Nyheter', key: 'dnb' },
            { title: 'Analyser',    key: 'analyser' },
          ] : [
            { title: 'Portefølje nyheter', key: 'portfolio' },
            { title: 'DNB Nyheter',        key: 'dnb' },
          ]}
          
          onChange={({ selectedKey }) => setActiveTab(selectedKey)}
        />
        <List.ScrollView maxVisibleListItems={maxItems}>
          <List.Container>
            {items.map((item, i) => (
              <List.Item.Action key={`${activeTab}-${i}`} onClick={() => setSelected(item)}>
                <List.Cell.Title>
                  <List.Cell.Title.Overline>
                    {isPortfolio ? item.source : `${item.category} · ${item.date}`}
                  </List.Cell.Title.Overline>
                  {item.title}
                  {isPortfolio && (
                    <List.Cell.Title.Subline variant="description">{item.tickers}</List.Cell.Title.Subline>
                  )}
                </List.Cell.Title>
              </List.Item.Action>
            ))}
          </List.Container>
        </List.ScrollView>
      </List.Card>

      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="784px"
        trigger={() => null}
        title={<span className="dnb-sr-only">Nyhetsartikkel</span>}
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div>
              <p style={{ margin: 0, fontSize: 'var(--font-size-x-small)', color: 'var(--color-black-55)' }}>
                {isPortfolio ? selected.exchange : selected.category}
              </p>
              <h2 style={{
                margin: '0.25rem 0',
                fontSize: '2.125rem',
                fontWeight: 'var(--font-weight-medium)',
                lineHeight: '2.5rem',
                color: 'var(--color-black)',
              }}>
                {selected.title}
              </h2>
              <p style={{ margin: 0, fontSize: 'var(--font-size-x-small)', color: 'var(--color-black-55)' }}>
                {selected.date}
              </p>
            </div>

            {isPortfolio && selected.tickerTags && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-x-small)' }}>
                {selected.tickerTags.map(tag => (
                  <TickerTag key={tag.name} {...tag} />
                ))}
              </div>
            )}

            <div style={{
              background: 'var(--color-black-3)',
              border: '1px solid var(--color-black-8)',
              borderRadius: '1.5rem',
              padding: '1rem 1rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
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
                {selected.aiSummary.map((point, i) => (
                  <li key={i} style={{ marginBottom: '0.375rem' }}>{point}</li>
                ))}
              </ul>
            </div>

            <div style={{ fontSize: '1.125rem', lineHeight: '1.5rem', color: 'var(--color-black)' }}>
              {selected.body.split('\n\n').map((para, i) => (
                <p key={i} style={{ margin: '0 0 1rem 0' }}>{para}</p>
              ))}
            </div>

            <div>
              <Button variant="tertiary" icon={ChevronRight} iconPosition="right">
                {isPortfolio ? 'Link to news source' : 'Les mer på DNB.no'}
              </Button>
            </div>

          </div>
        )}
      </Dialog>
    </div>
  )
}
