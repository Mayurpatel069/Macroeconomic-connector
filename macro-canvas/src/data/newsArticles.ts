import type { NewsArticle } from '../types'

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-001',
    title: 'Fed Holds Rates Steady Amid Inflation Progress',
    summary: 'The Federal Reserve kept its benchmark interest rate unchanged at 4.25–4.50%, signaling confidence that inflation is moving sustainably toward the 2% target while monitoring labor market conditions.',
    content: `The Federal Open Market Committee voted unanimously to maintain the federal funds rate at its current target range of 4.25 to 4.50 percent. Chair Jerome Powell indicated that the committee remains attentive to the risks on both sides of its dual mandate.

"Inflation has eased substantially from its peak but remains somewhat elevated," Powell said at the post-meeting press conference. "We want to see more progress before we begin to reduce our policy rate."

Core PCE inflation, the Fed's preferred gauge, registered 2.6% year-over-year in the latest reading. The labor market remains resilient with the unemployment rate at 4.1%.

Markets have priced in two quarter-point rate cuts for 2025, though the path forward remains data-dependent. Treasury yields moved slightly lower on the announcement as investors interpreted the statement as a signal of eventual easing.`,
    category: 'Monetary Policy',
    publishedAt: '2026-05-15T14:30:00Z',
    source: 'Blue Business Bytes',
    tags: ['Federal Reserve', 'Interest Rates', 'Inflation', 'FOMC'],
    sentiment: 'neutral',
    relatedSeriesIds: ['fedfunds', 'cpi', 'unrate'],
    duration: 142,
  },
  {
    id: 'news-002',
    title: 'US CPI Rises 3.1% YoY — Core Inflation Remains Sticky',
    summary: 'Consumer prices increased 3.1% from a year ago in April, driven by shelter costs and services inflation, while goods deflation continues to provide some offset.',
    content: `The Bureau of Labor Statistics reported that the Consumer Price Index rose 0.3% in April on a monthly basis and 3.1% on a year-over-year basis, broadly in line with analyst expectations.

Core CPI, which excludes food and energy, increased 3.6% year-over-year — still meaningfully above the Federal Reserve's 2% target.

Shelter costs, which comprise roughly one-third of the CPI basket, rose 5.4% year-over-year, remaining the primary driver of elevated readings. Services inflation broadly showed little sign of cooling.

On the goods side, used vehicle prices fell 2.1% and apparel declined 0.4%, providing some downward pressure on headline figures.

Economists noted that the "last mile" of disinflation remains challenging. "Getting from 3% to 2% on CPI is proving significantly harder than the journey from 9% to 3%," said Sarah Chen, chief economist at Meridian Capital.`,
    category: 'Inflation',
    publishedAt: '2026-05-14T08:45:00Z',
    source: 'Blue Business Bytes',
    tags: ['CPI', 'Inflation', 'Consumer Prices', 'Core CPI'],
    sentiment: 'negative',
    relatedSeriesIds: ['cpi', 'fedfunds', 'ppi'],
    duration: 118,
  },
  {
    id: 'news-003',
    title: 'US Jobs Report: 187K Jobs Added, Unemployment Holds at 4.1%',
    summary: 'April nonfarm payrolls came in below expectations at 187,000, suggesting some cooling in the labor market while overall conditions remain relatively healthy.',
    content: `The U.S. economy added 187,000 jobs in April, according to the Bureau of Labor Statistics, coming in below the consensus estimate of 215,000. The unemployment rate remained unchanged at 4.1%.

Job gains were concentrated in healthcare (+62,000), government (+40,000), and leisure and hospitality (+32,000). Manufacturing employment was flat, while retail trade shed 14,000 positions.

Average hourly earnings increased 0.2% month-over-month and 3.9% year-over-year, slightly below forecasts and representing continued progress on the wage-inflation front.

The labor force participation rate edged up to 62.7%. The broader U-6 measure of unemployment, which includes part-time workers who want full-time work, rose to 7.4%.

"The labor market is cooling but not collapsing," said Dr. Marcus Rivera, labor economist at the Brookings Institution. "This is the soft landing scenario the Fed has been hoping for."`,
    category: 'Labor Market',
    publishedAt: '2026-05-10T13:00:00Z',
    source: 'Blue Business Bytes',
    tags: ['Jobs', 'Unemployment', 'Nonfarm Payrolls', 'Labor Market'],
    sentiment: 'neutral',
    relatedSeriesIds: ['unrate', 'fedfunds', 'rsafs'],
    duration: 156,
  },
  {
    id: 'news-004',
    title: 'S&P 500 Hits Record High on AI Earnings Surge',
    summary: 'US equity markets reached new all-time highs as technology giants reported blowout earnings driven by artificial intelligence infrastructure spending and cloud revenue growth.',
    content: `The S&P 500 index closed at a record high of 5,847 points, surging 1.8% in a single session after a slate of major technology companies reported better-than-expected quarterly results.

The gains were led by semiconductor and cloud computing companies, with the AI-driven investment cycle showing no signs of deceleration. Capital expenditure announcements from hyperscalers totaled over $150 billion for the coming year.

"We are in the early innings of an AI infrastructure build-out that will reshape productivity across every sector," said portfolio manager Alexandra Torres of Summit Asset Management.

The earnings season has so far delivered positive surprises in 78% of reporting S&P 500 companies, well above the historical average of 67%. Aggregate earnings per share growth is tracking at 11.4% year-over-year.

Bond markets responded with modest yield increases, reflecting both positive economic signals and reduced expectations for near-term Fed rate cuts.`,
    category: 'Equities',
    publishedAt: '2026-05-12T20:00:00Z',
    source: 'Blue Business Bytes',
    tags: ['S&P 500', 'Equities', 'AI', 'Earnings', 'Technology'],
    sentiment: 'positive',
    relatedSeriesIds: ['sp500', 'dgs10', 'gdp'],
    duration: 134,
  },
  {
    id: 'news-005',
    title: 'Oil Prices Fall on OPEC+ Supply Increase Speculation',
    summary: 'WTI crude dropped below $75/barrel as reports emerged that OPEC+ members were discussing a larger-than-expected production increase, raising supply concerns.',
    content: `West Texas Intermediate crude oil fell 3.2% to $74.80 per barrel after Reuters reported that OPEC+ is considering a production increase of 400,000 barrels per day at their upcoming meeting, double the previously anticipated amount.

The decline puts pressure on oil-exporting economies while providing potential relief for US consumers facing elevated energy costs. Brent crude, the international benchmark, similarly slid to $78.50.

Demand-side concerns have also mounted, with global manufacturing PMI data showing contraction in Europe and slower expansion in emerging markets. China's crude imports, a key indicator of global demand, came in 8% below year-ago levels in April.

US strategic petroleum reserve levels have partially recovered from their historic lows, providing some buffer against supply disruptions. The Energy Information Administration's weekly data showed US production holding near record levels of 13.1 million barrels per day.

"The combination of rising supply and softening demand creates a bearish setup for crude over the next quarter," said energy analyst James Park of Horizon Energy Research.`,
    category: 'Commodities',
    publishedAt: '2026-05-13T11:30:00Z',
    source: 'Blue Business Bytes',
    tags: ['Oil', 'WTI', 'OPEC', 'Energy', 'Commodities'],
    sentiment: 'negative',
    relatedSeriesIds: ['wti', 'cpi', 'ppi', 'dollar'],
    duration: 128,
  },
  {
    id: 'news-006',
    title: 'Trade Deficit Widens to $68.9 Billion in March',
    summary: 'The US trade deficit widened more than expected in March, driven by a surge in consumer goods imports and modest export growth, adding to concerns about Q1 GDP.',
    content: `The United States trade deficit in goods and services widened to $68.9 billion in March from $58.1 billion in February, the Commerce Department reported. The figure exceeded analyst forecasts of $62.0 billion.

Exports rose 2.1% to $271.5 billion, led by capital goods and industrial supplies. However, imports surged 6.4% to $340.4 billion as businesses and consumers front-loaded purchases ahead of potential tariff increases.

The widening deficit is expected to subtract approximately 1.5 percentage points from first quarter GDP, a significant drag on headline growth. Economists lowered their Q1 GDP estimates following the release.

The dollar's relative strength versus major trading partner currencies contributed to making US exports more expensive and imports cheaper. The US dollar index remained near multi-year highs.

"The front-loading effect explains much of this month's spike, and we expect some reversal in subsequent months," said international economist Dr. Priya Sharma of the Peterson Institute.`,
    category: 'Trade',
    publishedAt: '2026-05-08T09:00:00Z',
    source: 'Blue Business Bytes',
    tags: ['Trade Deficit', 'Exports', 'Imports', 'GDP', 'Dollar'],
    sentiment: 'negative',
    relatedSeriesIds: ['trade', 'dollar', 'gdp'],
    duration: 147,
  },
  {
    id: 'news-007',
    title: 'M2 Money Supply Rebounds — Implications for Inflation',
    summary: 'US M2 money supply grew 3.8% year-over-year in April after contracting for much of 2023–2024, raising questions about whether monetary conditions are becoming more accommodative.',
    content: `The Federal Reserve's H.6 statistical release showed M2 money supply increased to $21.4 trillion in April, representing year-over-year growth of 3.8% — the fastest pace since early 2023.

The rebound in M2 has caught the attention of monetary hawks who argue that a resurgence in money supply growth could foreshadow renewed inflationary pressures in 6 to 18 months.

The relationship between M2 and inflation has been debated extensively following the 2020–2022 episode when unprecedented monetary expansion preceded the highest inflation in four decades. Some economists argue the traditional monetarist transmission mechanism has become unreliable.

"M2 rebounding is worth watching but not yet alarming — the velocity of money matters enormously," said monetary economist Prof. David Chen of the University of Chicago. "We need to see both M2 growth and velocity pick up simultaneously to worry about inflationary money supply effects."

The Federal Reserve continues to monitor broad money aggregates as one of many inputs into its policy deliberations.`,
    category: 'Monetary Policy',
    publishedAt: '2026-05-09T16:00:00Z',
    source: 'Blue Business Bytes',
    tags: ['M2', 'Money Supply', 'Inflation', 'Federal Reserve', 'Monetary Policy'],
    sentiment: 'neutral',
    relatedSeriesIds: ['m2', 'cpi', 'fedfunds'],
    duration: 163,
  },
  {
    id: 'news-008',
    title: 'Housing Starts Jump 7.2% — Affordability Remains Major Challenge',
    summary: 'New housing construction surged in April as homebuilders ramped up activity, but elevated mortgage rates and land costs continue to make homeownership unaffordable for many first-time buyers.',
    content: `New residential construction activity surged 7.2% in April to an annualized rate of 1.41 million units, according to the Census Bureau. Single-family starts led the gain, rising 8.4% to 1.06 million units annualized.

The pickup in construction comes as homebuilders attempt to address the persistent shortage of housing inventory that has kept home prices elevated despite significantly higher mortgage rates compared to the 2020–2021 era.

The 30-year fixed mortgage rate averaged 6.82% in the week ending May 9, far above the pandemic-era lows below 3% that allowed millions of homeowners to lock in cheap financing — creating a "lock-in effect" that has constrained existing home sales.

Building permits, a leading indicator of future construction, also increased, rising 5.8% to 1.46 million units annualized. Multifamily permitting saw particularly strong gains in Sun Belt metros.

"The supply response is encouraging, but it will take years to meaningfully close the estimated housing shortage of 3 to 5 million units," said housing economist Rebecca Morrison of the National Association of Home Builders.`,
    category: 'Housing',
    publishedAt: '2026-05-07T10:30:00Z',
    source: 'Blue Business Bytes',
    tags: ['Housing', 'Housing Starts', 'Real Estate', 'Mortgage Rates'],
    sentiment: 'positive',
    relatedSeriesIds: ['houst', 'dgs10', 'cpi'],
    duration: 152,
  },
]
