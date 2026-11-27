# Curated keyword map. Format: keyword | page_key | role | business_relevance(1-10) | conversion_potential(1-10) | note
# page keys map to URLs in PAGES. Metrics are pulled from Google Keyword Planner exports at build time.
PAGES = {
    "HOME": ("Homepage", "https://onefulfillcenter.com/"),
    "ECOM": ("Ecommerce Fulfillment", "https://onefulfillcenter.com/ecommerce-fulfillment/"),
    "B2B": ("B2B Fulfillment", "https://onefulfillcenter.com/b2b-fulfillment/"),
    "FBA": ("Amazon FBA Prep", "https://onefulfillcenter.com/amazon-fba-prep/"),
    "WH": ("Warehousing", "https://onefulfillcenter.com/warehousing/"),
    "KIT": ("Kitting", "https://onefulfillcenter.com/kitting/"),
    "PP": ("Pick & Pack", "https://onefulfillcenter.com/pick-and-pack/"),
    "RL": ("Reverse Logistics", "https://onefulfillcenter.com/reverse-logistics/"),
    "RM": ("Returns Management", "https://onefulfillcenter.com/returns-management/"),
    "XD": ("Cross Docking", "https://onefulfillcenter.com/cross-docking/"),
    "IS": ("Inventory Storage", "https://onefulfillcenter.com/inventory-storage/"),
    "SUB": ("Subscription Fulfillment", "https://onefulfillcenter.com/subscription-fulfillment/"),
    "RET": ("Retail Fulfillment", "https://onefulfillcenter.com/retail-fulfillment/"),
    "N-PRICE": ("NEW: 3PL Pricing", "https://onefulfillcenter.com/3pl-pricing/ (proposed)"),
    "N-SHOP": ("NEW: Shopify Fulfillment", "https://onefulfillcenter.com/shopify-fulfillment/ (proposed)"),
    "N-SMB": ("NEW: 3PL for Small Business", "https://onefulfillcenter.com/3pl-for-small-business/ (proposed)"),
    "N-REPL": ("NEW: Amazon FBA Replenishment & Storage", "https://onefulfillcenter.com/amazon-fba-replenishment/ (proposed)"),
    "N-EDI": ("NEW: EDI & Retail Compliance Fulfillment", "https://onefulfillcenter.com/edi-fulfillment/ (proposed)"),
    "N-SBALT": ("NEW: ShipBob Alternatives", "https://onefulfillcenter.com/compare/shipbob-alternatives/ (proposed)"),
    "N-TRANS": ("NEW (conditional): Transloading", "https://onefulfillcenter.com/transloading/ (proposed, only if offered)"),
    "N-MCF": ("NEW: Multichannel / Marketplace Fulfillment", "https://onefulfillcenter.com/multichannel-fulfillment/ (proposed)"),
    "BLOG": ("Blog (new or refreshed article)", "https://onefulfillcenter.com/blog/"),
    "EXCL": ("Do not target", "—"),
}

KEYWORDS = """
3pl services|HOME|Primary|10|9|Broad commercial 3PL intent; homepage is the only page that covers every service
3pl company|HOME|Secondary|10|9|Same intent cluster as primary; SERP mixes listicles and provider pages
3pl providers|HOME|Secondary|10|9|
third party logistics companies|HOME|Secondary|10|9|
3pl logistics company|HOME|Secondary|10|9|
3pl fulfillment services|HOME|Secondary|10|9|SERP checked 2026-11-27
3pl fulfillment|HOME|Secondary|10|8|
warehousing and fulfillment|HOME|Secondary|10|9|High bid ceiling ($63.54)
third party fulfillment|HOME|Secondary|9|8|
omnichannel fulfillment|HOME|Secondary|9|7|Supports homepage omnichannel positioning
order fulfillment company|HOME|Long-tail|9|8|
fulfillment center usa|HOME|Long-tail|8|7|
third party logistics|HOME|Supporting-section|7|4|Head term; SERP is definitional (Wikipedia, guides) - support with a short 'What we do as a 3PL' section, target via blog pillar
3pl|HOME|Supporting-section|7|4|Head term; mostly informational/navigational
3pl near me|HOME|Supporting-section|7|8|Local-pack intent; only addressable with verified location pages + Google Business Profile
ecommerce fulfillment services|ECOM|Primary|10|10|SERP checked 2026-11-27
ecommerce fulfillment|ECOM|Secondary|10|8|
ecommerce fulfillment center|ECOM|Secondary|10|9|
fulfillment companies for ecommerce|ECOM|Secondary|10|9|
ecommerce fulfillment companies|ECOM|Secondary|10|9|
ecommerce 3pl|ECOM|Secondary|10|9|
order fulfillment services|ECOM|Secondary|9|9|
ecommerce order fulfillment|ECOM|Secondary|9|8|
ecommerce fulfillment provider|ECOM|Secondary|10|9|
3pl ecommerce fulfillment|ECOM|Long-tail|10|10|Highest bid range in dataset ($43.90-$107.59)
d2c fulfillment|ECOM|Long-tail|9|9|
dtc fulfillment|ECOM|Long-tail|9|9|
order fulfillment|BLOG|Blog|7|4|Head term, mixed intent - guide 'What is order fulfillment'
b2b fulfillment|B2B|Primary|10|9|SERP checked: glossary-heavy, winnable with a deeper service page + definitions section
b2b fulfillment services|B2B|Secondary|10|10|
wholesale fulfillment|B2B|Secondary|10|9|SERP checked 2026-11-27
warehouse and distribution services|B2B|Secondary|9|8|
b2b warehouse|B2B|Long-tail|9|8|
b2b order fulfillment|B2B|Long-tail|9|9|
edi fulfillment|N-EDI|Primary|9|9|Bid range up to $104.86 - strong commercial value
edi 3pl|N-EDI|Secondary|9|9|
3pl edi|N-EDI|Secondary|9|9|
edi compliance|BLOG|Blog|8|5|Informational; supports N-EDI and RET
wholesale distribution|EXCL|Exclude|3|2|SERP/variants dominated by food/apparel distributors (distributor intent, not 3PL)
distribution services|EXCL|Exclude|4|3|Ambiguous head term; ideas skew to food-service distributors
fba prep services|FBA|Primary|10|10|SERP checked 2026-11-27
fba prep center|FBA|Secondary|10|10|SERP checked: specialist prep centers dominate
amazon prep center|FBA|Secondary|10|9|
amazon fba prep center|FBA|Secondary|10|10|
prep center for amazon fba|FBA|Secondary|10|10|
amazon fba prep service|FBA|Secondary|10|10|
fba prep|FBA|Secondary|10|9|
fba prep logistics|FBA|Long-tail|9|9|
amazon prep service|FBA|Long-tail|10|9|
amazon fba prep|FBA|Long-tail|10|9|
fba prep and ship|FBA|Long-tail|10|10|
fba prep warehouse|FBA|Long-tail|10|10|
fnsku labeling|FBA|Supporting-section|8|6|1K-10K; mixed DIY/service intent - FNSKU labeling section on FBA page + blog how-to
fnsku label|BLOG|Blog|7|4|Mostly DIY 'how to print' intent
amazon fnsku barcode|BLOG|Blog|6|3|DIY/tooling intent; Amazon Seller Central dominates
amazon fba replenishment|N-REPL|Primary|10|10|Low volume but this is the core OneFulfillCenter value proposition
fba replenishment|N-REPL|Secondary|10|10|
fba inventory storage|N-REPL|Secondary|10|10|
fba vs fbm|BLOG|Blog|8|5|
amazon fba wholesale|EXCL|Exclude|4|2|Sourcing/business-model intent, not a logistics service
3pl warehousing|WH|Primary|10|10|Same KP metrics as '3pl warehouse'; commercial modifier
warehousing services|WH|Secondary|10|8|SERP checked: enterprise + glossary heavy (DHL, Ryder, Iron Mountain)
third party warehousing companies|WH|Secondary|10|9|
3pl warehouse|WH|Secondary|10|8|SERP checked: informational 'what is a 3PL' results - cover with definitions block
outsourced warehousing|WH|Secondary|10|9|
warehousing solutions|WH|Secondary|9|8|
warehousing and distribution|WH|Secondary|9|8|
ecommerce warehousing|WH|Long-tail|10|9|
contract warehousing|WH|Long-tail|9|9|
public warehouse|WH|Long-tail|7|7|
warehousing company|WH|Long-tail|9|8|
warehousing|EXCL|Exclude|5|2|100K-1M head term dominated by job/near-me/Amazon warehouse intent
warehouse management systems|EXCL|Exclude|2|1|Software (WMS) intent - do not confuse with 3PL warehousing
inventory storage|IS|Primary|9|8|SERP for 'ecommerce inventory storage' is self-storage heavy - page must signal business/3PL storage
business inventory storage|IS|Secondary|9|8|
overflow storage|IS|Secondary|10|9|Supports 'store in US warehouse, send to FBA when needed'
inventory warehouse|IS|Secondary|9|9|
warehouse storage services|IS|Secondary|10|9|
pallet storage warehouse|IS|Long-tail|9|8|
short term warehouse storage|IS|Long-tail|9|9|
ecommerce inventory storage|IS|Long-tail|10|9|SERP checked 2026-11-27
amazon inventory storage|IS|Long-tail|10|9|KP shows minimal volume - supporting line only
warehouse storage|IS|Supporting-section|7|6|Mixed with self-storage intent
pallet storage|EXCL|Exclude|3|2|Ideas dominated by racking equipment purchases
kitting services|KIT|Primary|10|10|SERP checked: mid-size 3PLs rank - winnable
kitting and assembly services|KIT|Secondary|10|10|
kitting fulfillment services|KIT|Secondary|10|10|High bid ceiling ($58.70)
kitting fulfillment|KIT|Secondary|10|9|
kitting and assembly|KIT|Secondary|10|9|
kitting warehouse|KIT|Secondary|10|9|
product bundling services|KIT|Long-tail|10|9|
kitting company|KIT|Long-tail|10|9|
kitting|BLOG|Blog|7|4|Head term; definitional intent ('what is kitting')
co packing|EXCL|Exclude|3|2|Food/beverage contract manufacturing intent - only target if OFC offers co-packing
co packing services|EXCL|Exclude|3|2|As above
pick and pack services|PP|Primary|10|10|SERP checked 2026-11-27
pick and pack fulfillment|PP|Secondary|10|10|
pick and pack warehouse|PP|Secondary|10|9|
pick pack ship|PP|Secondary|9|9|
pick and pack companies|PP|Long-tail|10|10|High competition, bid ceiling $72.24
3pl pick and pack|PP|Long-tail|10|10|
pick and pack fulfillment services|PP|Long-tail|10|10|
pick and pack|BLOG|Blog|7|4|Head term; definitional PAA ('What is pick and pack fulfillment?')
reverse logistics services|RL|Primary|10|9|SERP checked: enterprise (UPS, C.H. Robinson) - long-tail first
reverse logistics company|RL|Secondary|10|9|
reverse logistics companies|RL|Secondary|10|9|
reverse logistics solutions|RL|Secondary|9|8|
reverse logistics 3pl|RL|Long-tail|10|10|
reverse logistics warehouse|RL|Long-tail|10|9|
product returns processing|RL|Long-tail|9|9|
reverse logistics|BLOG|Blog|7|4|Head term; informational - pillar guide
what is reverse logistics|BLOG|Blog|7|4|
liquidation services|EXCL|Exclude|3|2|Only target if OFC offers liquidation
returns processing|RM|Primary|10|9|Chosen over 'returns management' because that SERP is returns-software dominated (Loop, ShipStation)
returns management|RM|Secondary|9|8|Keep in H1/title; SERP is software-led
ecommerce returns management|RM|Secondary|10|9|SERP checked 2026-11-27
3pl returns management|RM|Secondary|10|10|Bid ceiling $83.20
returns processing center|RM|Long-tail|10|9|
returns warehouse|RM|Long-tail|9|8|
returns fulfillment|RM|Long-tail|10|9|
rma management|RM|Long-tail|8|7|
ecommerce returns|BLOG|Blog|7|4|
cross docking services|XD|Primary|10|9|SERP checked 2026-11-27
cross dock warehouse|XD|Secondary|10|9|
cross docking warehouse|XD|Secondary|10|9|
cross dock facility|XD|Secondary|10|9|
cross docking companies|XD|Long-tail|10|9|
container unloading services|XD|Long-tail|8|8|Only if offered
cross docking|BLOG|Blog|7|4|10K-100K head term; definitional
what is cross docking|BLOG|Blog|7|4|
transloading services|N-TRANS|Primary|7|8|Only build if OFC actually offers transloading
transloading|N-TRANS|Secondary|7|6|
transload warehouse|N-TRANS|Secondary|7|8|
subscription box fulfillment|SUB|Primary|10|10|SERP checked: ShipBob + niche 3PLs - winnable
subscription fulfillment|SUB|Secondary|10|9|
subscription box fulfillment services|SUB|Secondary|10|10|
subscription box fulfillment companies|SUB|Secondary|10|10|
subscription box 3pl|SUB|Long-tail|10|10|
subscription box fulfillment center|SUB|Long-tail|10|10|
subscription fulfillment services|SUB|Long-tail|10|10|
outsource subscription box|SUB|Long-tail|10|10|
subscription box fulfillment cost|SUB|Long-tail|9|8|
retail fulfillment|RET|Primary|10|8|SERP checked: guide-heavy (Salesforce, Bain, Shopify) - page needs definitional section
retail distribution|RET|Secondary|9|7|
retail logistics|RET|Secondary|9|7|
retail warehousing|RET|Secondary|10|8|
retail 3pl|RET|Long-tail|10|10|
retail replenishment|RET|Long-tail|9|8|
retail distribution center|RET|Long-tail|9|8|
walmart fulfillment services|EXCL|Exclude|3|2|Walmart's own program (WFS) - navigational; do not imply OFC is WFS
3pl pricing|N-PRICE|Primary|10|10|A 3PL or fulfillment cost question appears in People Also Ask on 6 of 19 SERPs checked
3pl costs|N-PRICE|Secondary|10|9|
shopify fulfillment service|N-SHOP|Primary|9|10|Confirm Shopify integration before publishing
shopify 3pl|N-SHOP|Secondary|9|10|
shopify fulfillment|N-SHOP|Secondary|9|9|
3pl for small business|N-SMB|Primary|10|9|
best 3pl for small business|N-SMB|Secondary|9|8|SERP checked: listicles + Reddit
multi channel fulfillment|N-MCF|Primary|8|7|SERP checked: Amazon MCF dominates - position as 'multichannel fulfillment for brands', not Amazon MCF
amazon multi channel fulfillment|BLOG|Blog|6|4|Amazon program (navigational)
marketplace fulfillment|N-MCF|Secondary|9|8|
walmart marketplace fulfillment|N-MCF|Long-tail|9|8|
shipbob alternatives|N-SBALT|Primary|8|9|Bid range $30.00-$142.81 = very high commercial value
shipmonk alternatives|N-SBALT|Secondary|8|9|
best 3pl companies|BLOG|Comparison|8|7|Listicle SERP
top 3pl companies|BLOG|Comparison|8|7|
best fulfillment companies|BLOG|Comparison|8|7|
best ecommerce fulfillment companies|BLOG|Comparison|8|8|
best 3pl for amazon sellers|BLOG|Comparison|9|8|
top fulfillment companies|BLOG|Comparison|8|7|
flowspace|EXCL|Competitor brand|2|2|Navigational competitor brand - reference only
stord|EXCL|Competitor brand|2|2|Navigational competitor brand - reference only
red stag fulfillment|EXCL|Competitor brand|2|2|Navigational competitor brand - reference only
what is a 3pl|BLOG|Blog|9|4|1K-10K informational
what is a 3pl warehouse|BLOG|Blog|9|4|
how to choose a 3pl|BLOG|Blog|9|6|Refresh existing post /blog/how-to-choose-the-right-fulfilment-service-provider/
how to send inventory to amazon fba|BLOG|Blog|9|6|
what is b2b fulfillment|BLOG|Blog|8|5|
"""
