# OneFulfillCenter: SEO Keyword Research and Competitor Intelligence

Research date: 2026-11-27. Market: United States, English. Full data: `OneFulfillCenter-SEO-Keyword-Research-2026-11-27.xlsx`

## Data sources and limitations

| Data | Source | Status |
|---|---|---|
| Search volume, 3-month and YoY change, Ads competition, low and high top-of-page bids, monthly trend | **Google Keyword Planner**, via the OneChannelAdmin Ads account. 16 seed groups, 8,841 unique keywords. Raw exports are in `kp-exports/`. | Measured. **Volumes are bucketed** because the account has no recent ad spend: 500 = 100–1K, 5,000 = 1K–10K, and so on. |
| Keyword difficulty, organic rankings, backlinks, traffic | Ahrefs, Semrush or OpenSEO | **N/A.** Ahrefs is installed but not authorized (run `/mcp`). |
| SERPs | Live Google.com (gl=us, hl=en, pws=0), 19 keywords plus a site: query | Measured snapshot |
| Competitors | Sitemaps plus about 240 fetched pages (titles, H1s, coverage) for all 10 competitors | Measured |
| City and industry volumes | Keyword Planner | **Not collected.** Keyword Planner started redirecting to the Ads Overview page before these runs completed. |

"Ranking feasibility" in the scores is an analyst estimate based on who ranks on page 1. It is not keyword difficulty.

## Executive summary

1. **OneFulfillCenter is not on page 1** for any of the 19 checked commercial keywords. Google shows about 75 indexed URLs. All 12 service pages exist, return 200, have about 1,050 words each and carry FAQ schema.
2. **The homepage competes with its own ecommerce page.** Its title leads with "Ecommerce Fulfillment", and its H1 ("Next Generation Fulfillment Center") contains no target keyword. Retarget it to **"3pl services"** (1K–10K, bids $9.85–$44.25).
3. **There are three technical issues and two duplicate pages:**
   - The sitemap lists three URLs that redirect: `/inventory-management/`, `/temperature-controlled-storage/` and `/kitting-assembly/`.
   - Two thin pages duplicate existing service pages: `/solutions/warehousing-and-inventory-storage/` should be 301'd to `/warehousing/`, and `/solutions/b2c-b2b-wholesale-fulfillment/` should be 301'd to `/b2b-fulfillment/`.
   - There's no About page, `/contact-us/` redirects to a newsletter anchor, and `/request-demo/` has no H1.
4. **The best openings are services that few competitors have pages for:**
   - **Cross docking** (1K–10K): 7 of the 10 competitors have no dedicated page.
   - **Kitting** (100–1K per variant, bids up to $58.70): Flowspace, Stord, ShipMonk and Prep Prime have no kitting page.
   - **Subscription box fulfillment**: only ShipBob, Red Stag and Saddle Creek among the 10 have a strong page.
   - **B2B fulfillment**: Google's page 1 is mostly glossaries, which a deeper service page can beat.
5. **The core value proposition ("store with us, replenish FBA on demand") has no page.** Search demand is low (10–100), but intent is very high, and no large competitor owns the topic. Build `/amazon-fba-replenishment/`.
6. **Avoid intent traps:**
   - "Returns management" results are dominated by returns software (Loop, ShipStation).
   - "Ecommerce inventory storage" results are dominated by self-storage companies.
   - "Multi channel fulfillment" results are dominated by Amazon's MCF program.
   - "Warehousing" and "warehouse management systems" are job-search and software searches.
   - "Co packing" means food and beverage contract manufacturing.

## Answers to the 9 questions

1. **Which keywords to target:** 177 curated keywords, with 57 in Tier 1 (sheet 2). Top Tier 1 keywords by score: kitting and assembly services, kitting fulfillment services, b2b fulfillment, ecommerce fulfillment services, pick and pack services, kitting services, subscription box fulfillment, fulfillment companies for ecommerce, 3pl for small business.
2. **Which keyword belongs to which page** (one primary per page, sheet 4):

| Page | Primary keyword | Volume (KP) |
|---|---|---|
| Homepage | 3pl services | 1K–10K |
| Ecommerce | ecommerce fulfillment services | 1K–10K |
| B2B | b2b fulfillment | 100–1K |
| Amazon FBA prep | fba prep services | 100–1K |
| Warehousing | 3pl warehousing | 1K–10K |
| Kitting | kitting services | 100–1K |
| Pick & pack | pick and pack services | 100–1K |
| Reverse logistics | reverse logistics services | 100–1K |
| Returns | returns processing | 100–1K |
| Cross docking | cross docking services | 1K–10K |
| Inventory storage | inventory storage | 100–1K |
| Subscription | subscription box fulfillment | 100–1K |
| Retail | retail fulfillment | 100–1K |

3. **Who dominates each keyword:**
   - ShipBob is #1 for "3pl fulfillment services" and "subscription box fulfillment".
   - Ryder is #1 for "pick and pack services".
   - Enterprise logistics firms (DHL, UPS, C.H. Robinson) lead "warehousing services" and "reverse logistics services".
   - Specialist prep centers and directories lead the FBA prep keywords.
   - See sheets 6 and 7 for the full results.
4. **Best commercial opportunities:**
   - "shipbob alternatives": bids up to $142.81.
   - "3pl ecommerce fulfillment": bids $43.90–$107.59.
   - "edi fulfillment": bids up to $104.86.
   - "3pl returns management": bids up to $83.20.
   - The kitting cluster.
5. **Pages to improve:** the homepage first, then the ecommerce, FBA prep, warehousing, kitting, cross-docking and inventory storage pages (sheet 11 has titles, meta descriptions, H1s, H2 outlines, FAQs and schema for each).
6. **New pages** (sheet 9):
   - `/amazon-fba-replenishment/`
   - `/3pl-pricing/` (needs real pricing input)
   - `/shopify-fulfillment/` (verify the integration first)
   - `/about/` and `/contact/`
   - Conditional, pending verification: `/edi-fulfillment/`, `/3pl-for-small-business/`, ShipBob alternatives, transloading, and location or industry pages
7. **Content to publish** (sheet 10, all checked against Keyword Planner):
   - "What is a 3PL" (1K–10K)
   - "What is cross-docking" (1K–10K)
   - "FNSKU labels" (1K–10K)
   - "FBA vs FBM" (100–1K)
   - Reverse logistics guide
   - "EDI compliance"
   - A refresh of the existing "how to choose" post (it uses UK spelling)
8. **How to compete with large 3PLs:**
   - Win the long-tail and service-specific queries the big players cover only as bullet points.
   - Own the FBA-replenishment hybrid position.
   - Publish clearer pricing.
   - Get listed in 3PL and prep-center directories and "best 3PL" lists.
   - Build location pages only for facilities you actually operate. Competitors run 150–620 templated city pages; Red Stag runs about 150 with only 2 warehouses.
9. **What to do first** (Days 1–30 in sheet 12):
   - Clean the sitemap and redirects.
   - Consolidate the two `/solutions/` pages.
   - Fix the homepage title and H1.
   - Set up Search Console and connect Ahrefs.
   - Optimize the 6 Tier 1 service pages.
   - Add About and Contact pages and internal links.

No first-page or #1 rankings are promised within 90 days. KPIs are tracked against a Search Console baseline.

## Claims to verify before publishing

The homepage claims "1–2 day ground delivery to 99% of US customers" and shows a map with 66 locations (including 5 "Primary Superhubs"). The only address in the schema is Kissimmee, FL. Confirm which facilities OneFulfillCenter actually operates before building location pages or repeating these claims.
