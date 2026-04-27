import React, { useState } from 'react'
import { List, Dialog, Button } from '@dnb/eufemia'
import ChevronRight from '@dnb/eufemia/icons/dnb/chevron_right'

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
    body: 'Norges Bank besluttet torsdag å holde styringsrenten uendret på 4,50 prosent, i tråd med markedets forventninger. Sentralbanksjef Ida Wolden Bache pekte på at inflasjonen er på vei ned, men at lønnsveksten fortsatt gir grunn til varsomhet.\n\nSentralbanken signaliserer imidlertid at første rentekutt er ventet i løpet av andre halvår 2026, noe som er positivt for rentesensitive sektorer som eiendom og finans.\n\nKronen styrket seg 0,6 prosent mot euro etter pressekonferansen, og Oslo Børs steg 0,8 prosent på nyheten om sentralbankens relativt forsiktig formulerte rentesignal.',
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

export default function DnbNyheter() {
  const [selected, setSelected] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-x-small)' }}>
      <p style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-lead)', margin: 0 }}>DNB Nyheter</p>
      <List.Card>
        <List.ScrollView maxVisibleListItems={3}>
          <List.Container>
            {DNB_NEWS.map((item, i) => (
              <List.Item.Action key={i} onClick={() => setSelected(item)}>
                <List.Cell.Title>
                  <List.Cell.Title.Overline>{item.category} · {item.date}</List.Cell.Title.Overline>
                  {item.title}
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
        title={<span className="dnb-sr-only">DNB Nyheter</span>}
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div>
              <p style={{ margin: 0, fontSize: 'var(--font-size-x-small)', color: 'var(--color-black-55)' }}>
                {selected.category}
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
                Les mer på DNB.no
              </Button>
            </div>

          </div>
        )}
      </Dialog>
    </div>
  )
}
