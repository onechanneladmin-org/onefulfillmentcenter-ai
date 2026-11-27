import json, re
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter
from data_keywords import PAGES, KEYWORDS

DATE = "2026-11-27"
KP_SRC = "Google Keyword Planner (US, English, Nov 2025-Oct 2026), export " + DATE
KP = {r["keyword"]: r for r in json.load(open("kp_classified.json"))}
BUCKET = {0: "0-10", 5: "0-10", 50: "10-100", 500: "100-1K", 5000: "1K-10K", 50000: "10K-100K", 500000: "100K-1M", 5000000: "1M-10M"}
DEMAND = {0: 1, 5: 1, 50: 3, 500: 6, 5000: 8, 50000: 9, 500000: 10}
SERP = [json.loads(l) for l in open("research/serp.jsonl")]
SERPK = {s["k"]: s for s in SERP}
COMP = json.load(open("research/competitors-1-5.json")) + json.load(open("research/competitors-6-10.json"))
SITE = json.load(open("research/site-inventory.json"))

# Analyst feasibility baseline per page, from observed SERP composition (NOT keyword difficulty).
FEAS = {"HOME": 3, "ECOM": 4, "B2B": 6, "FBA": 5, "WH": 3, "KIT": 6, "PP": 5, "RL": 3, "RM": 4, "XD": 5, "IS": 4,
        "SUB": 6, "RET": 4, "N-PRICE": 6, "N-SHOP": 4, "N-SMB": 5, "N-REPL": 7, "N-EDI": 6, "N-SBALT": 5, "N-TRANS": 5,
        "N-MCF": 3, "BLOG": 5, "EXCL": 2}

def intent_of(k, role):
    if role in ("Comparison",) or re.search(r"\b(best|top|alternatives?|vs)\b", k): return "Comparison" if "vs" not in k else "Informational"
    if role == "Blog" or re.match(r"^(what|how|why)\b", k): return "Informational"
    if role == "Competitor brand": return "Navigational"
    if role == "Exclude": return "Mixed / off-target"
    return "Commercial / Transactional"

def score(k, page, role, rel, conv):
    r = KP.get(k)
    vol = r["vol"] if r else None
    it = intent_of(k, role)
    ci = {"Commercial / Transactional": 9, "Comparison": 7, "Informational": 3, "Navigational": 2, "Mixed / off-target": 2}[it]
    try:
        if r and float(r["high"] or 0) >= 40 and ci >= 7: ci = min(10, ci + 1)
    except ValueError: pass
    sd = DEMAND.get(vol, 1) if vol is not None else 1
    rf = FEAS.get(page, 5)
    if vol is not None and vol <= 50: rf += 2
    if vol is not None and vol >= 5000: rf -= 1
    rf = max(1, min(10, rf))
    s = round(.25 * ci + .25 * rel + .2 * sd + .2 * rf + .1 * conv, 2)
    if role in ("Exclude", "Competitor brand"): tier = "Excluded"
    elif it == "Informational": tier = "Tier 4 - Informational"
    elif s >= 7.5 and (vol or 0) >= 500: tier = "Tier 1 - High-priority commercial"
    elif s >= 7.0: tier = "Tier 2 - Strong supporting"
    else: tier = "Tier 3 - Long-tail"
    if it == "Commercial / Transactional" and (vol or 0) <= 50 and tier.startswith("Tier 2") is False and tier != "Excluded" and not tier.startswith("Tier 1"):
        tier = "Tier 3 - Long-tail"
    return it, ci, sd, rf, s, tier

def kp_fields(k):
    r = KP.get(k)
    if not r: return ["N/A (not returned by Keyword Planner)"] * 2 + ["N/A"] * 6 + ["Not in KP export"]
    def money(x): return f"${float(x):.2f}" if x not in ("", None) else "N/A"
    return [BUCKET.get(r["vol"], str(r["vol"])), r["vol"], r["m3"] or "N/A", r["yoy"] or "N/A", r["comp"] or "N/A",
            r["compidx"] or "N/A", money(r["low"]), money(r["high"]), r["groups"]]

def serp_presence(k):
    s = SERPK.get(k)
    if not s: return "Not checked", "N/A"
    ofc = "Not in observed top results" if not any("onefulfillcenter" in u for u in s["o"]) else "Present"
    return ofc, "; ".join(f"#{i+1} {u}" for i, u in enumerate(s["o"][:5]))

ROWS = []
for line in KEYWORDS.strip().split("\n"):
    k, page, role, rel, conv, note = (line.split("|") + [""])[:6]
    rel, conv = int(rel), int(conv)
    it, ci, sd, rf, s, tier = score(k, page, role, rel, conv)
    ofc, top = serp_presence(k)
    ROWS.append(dict(k=k, page=page, role=role, rel=rel, conv=conv, note=note, intent=it, ci=ci, sd=sd, rf=rf, score=s, tier=tier, ofc=ofc, top=top))

HDR_FILL = PatternFill("solid", fgColor="1F3864")
HDR_FONT = Font(bold=True, color="FFFFFF")

def sheet(wb, title, headers, rows, widths=None):
    ws = wb.create_sheet(title[:31])
    ws.append(headers)
    for c in ws[1]:
        c.fill, c.font = HDR_FILL, HDR_FONT
        c.alignment = Alignment(wrap_text=True, vertical="top")
    for r in rows: ws.append(r)
    ws.freeze_panes = "B2"
    ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}{max(2, len(rows) + 1)}"
    for i, h in enumerate(headers, 1):
        w = (widths or {}).get(h) or min(60, max(12, len(str(h)) + 2, *[min(60, len(str(r[i - 1])) + 2) for r in rows[:60] if i - 1 < len(r)] or [12]))
        ws.column_dimensions[get_column_letter(i)].width = w
    for row in ws.iter_rows(min_row=2):
        for c in row: c.alignment = Alignment(wrap_text=True, vertical="top")
    return ws

wb = Workbook(); wb.remove(wb.active)

# ---------- 0 README ----------
readme = [
 ["Report", "OneFulfillCenter SEO Keyword Research & Competitor Intelligence"],
 ["Research date", DATE],
 ["Market", "United States, English"],
 ["Search volume / competition / bids source", KP_SRC + ". Exported from the OneChannelAdmin Google Ads account via Keyword Planner > Discover new keywords > Download to Google Sheets. 16 seed groups, 8,841 unique keywords. Raw exports: seo-research/kp-exports/."],
 ["IMPORTANT - volume buckets", "The Google Ads account has no recent spend, so Keyword Planner returns bucketed volumes. Export value 50 = UI range 10-100; 500 = 100-1K; 5,000 = 1K-10K; 50,000 = 10K-100K; 500,000 = 100K-1M. Both are shown. Do not read 500 as an exact figure."],
 ["Competition column", "Google Ads (paid) competition only. It is NOT organic keyword difficulty."],
 ["Keyword difficulty / organic rankings / backlinks", "N/A. Ahrefs connector present but not authorized in this session; no Semrush/OpenSEO access. Run /mcp to authorize Ahrefs and these columns can be filled."],
 ["Ranking feasibility score", "Analyst estimate based on observed SERP composition (enterprise brands, software vendors, listicles, specialist 3PLs) - not a KD metric. Labeled as estimate everywhere it appears."],
 ["SERP data", "Live Google.com (gl=us, hl=en, pws=0) via logged-in Chrome on " + DATE + ". 19 keywords + site: query. Result URLs are truncated paths. Browser location may influence results; treat as a snapshot."],
 ["OneFulfillCenter current rankings", "Not in the observed first-page organic results for any of the 19 checked keywords. No Search Console access, so positions beyond page 1 are N/A."],
 ["Competitor site data", "Sitemaps + ~240 pages fetched by research agents on " + DATE + " (titles, meta descriptions, H1s, service coverage). See 'Competitor Pages'."],
 ["Site data", "Next.js codebase (src/app, src/data/serviceLandings.ts) + live crawl of all 44 sitemap URLs on " + DATE + "."],
 ["Not collected", "City/state and industry keyword volumes (Keyword Planner began redirecting to the Ads Overview before those runs could complete). These are marked 'Volume not collected'."],
 ["Opportunity score", "0.25 x Commercial intent + 0.25 x Business relevance + 0.20 x Search demand + 0.20 x Ranking feasibility (estimate) + 0.10 x Conversion potential. Each factor 1-10."],
 ["Spelling", "US English (fulfillment, center)."],
]
ws = wb.create_sheet("README"); [ws.append(r) for r in readme]
ws.column_dimensions["A"].width = 38; ws.column_dimensions["B"].width = 130
for r in ws.iter_rows():
    r[0].font = Font(bold=True)
    for c in r: c.alignment = Alignment(wrap_text=True, vertical="top")

# ---------- 1 Website URLs ----------
issues = {
 "https://onefulfillcenter.com/": "H1 'Next Generation Fulfillment Center' has no target keyword; title leads with 'Ecommerce Fulfillment' which competes with /ecommerce-fulfillment/; brand inconsistency (OneChannelAdmin/OneFulfillmentCenter/One Fulfillment Center in copy).",
 "https://onefulfillcenter.com/solutions/warehousing-and-inventory-storage/": "Thin (352 words) duplicate of /warehousing/ + /inventory-storage/ intent. Recommend 301 -> /warehousing/ and remove from sitemap.",
 "https://onefulfillcenter.com/solutions/b2c-b2b-wholesale-fulfillment/": "Thin (368 words) overlap with /b2b-fulfillment/. Recommend 301 -> /b2b-fulfillment/ and remove from sitemap.",
 "https://onefulfillcenter.com/inventory-management/": "In sitemap but live URL 301s to /solutions/warehousing-and-inventory-storage/ (code says /inventory-storage/ - deployed config differs). Remove from sitemap; point redirect to final destination.",
 "https://onefulfillcenter.com/temperature-controlled-storage/": "In sitemap but 308-redirects to /inventory-storage/. Remove from sitemap. Do not imply temperature control unless offered.",
 "https://onefulfillcenter.com/kitting-assembly/": "In sitemap but 308-redirects to /kitting/. Remove from sitemap.",
 "https://onefulfillcenter.com/request-demo/": "No H1. Thin (226 words). Add H1 + trust content.",
 "https://onefulfillcenter.com/blog/the-future-of-e-commerce-fulfillment-what-to-anticipate-by-2025/": "Outdated: title says 2024, slug says 2025. Refresh or redirect.",
 "https://onefulfillcenter.com/blog/top-10-benefits-of-using-a-third-party-logistics-provider/": "Title grammar ('benefits using a third party logistic provider'). Fix and retarget 'benefits of a 3PL'.",
 "https://onefulfillcenter.com/blog/how-to-choose-the-right-fulfilment-service-provider/": "UK spelling 'fulfilment'. Refresh to target 'how to choose a 3pl'.",
}
blog_low = ["cart-abandonment", "seamless-checkout", "mobile-optimization", "personalizing", "customer-service"]
pk_by_url = {}
for r in ROWS:
    if r["role"] == "Primary": pk_by_url[PAGES[r["page"]][1]] = r["k"]
url_rows = []
for s in SITE:
    u = s["url"]; st = s.get("status")
    typ = "Homepage" if u.rstrip("/") == "https://onefulfillcenter.com" else ("Blog post" if "/blog/" in u and u != "https://onefulfillcenter.com/blog/" else ("Blog hub" if u.endswith("/blog/") else ("Legal" if any(x in u for x in ["privacy", "terms"]) else ("Conversion" if "demo" in u else ("Legacy solution page" if "/solutions/" in u or "inventory-management" in u else ("Redirecting URL" if st != 200 else "Service page"))))))
    note = issues.get(u, "")
    if not note and any(b in u for b in blog_low): note = "Off-topic for a 3PL buyer (storefront CX). Low business relevance; consider consolidating or adding fulfillment angle + internal links."
    if not note and typ == "Service page": note = "Indexable, ~1,050 words, FAQPage schema present on service template. See On-Page sheet."
    url_rows.append([u, typ, st, s.get("title", ""), s.get("desc", ""), s.get("h1", ""), s.get("h1_count", ""), s.get("words", ""), s.get("canonical", ""), ", ".join(s.get("schema", []) or []), pk_by_url.get(u, ""), note, "Live crawl " + DATE])
for u, t, n in [("https://onefulfillcenter.com/contact-us/", "Missing page", "301 -> /#newsletter. No real contact page; weak for 'contact' and trust. Create /contact/."),
                ("https://onefulfillcenter.com/about-us/", "Missing page", "404. No About page - E-E-A-T gap for a B2B service."),
                ("https://onefulfillcenter.com/pricing/", "Missing page", "404. A 3PL or fulfillment cost question appears in People Also Ask on 6 of 19 SERPs; see New Pages."),
                ("https://onefulfillcenter.com/locations/", "Missing page", "404. Homepage map shows 66 pins incl. 5 'Primary Superhubs' (LA, DFW, Chicago, Atlanta, Newark) - verify before building location pages.")]:
    url_rows.append([u, t, "404/301", "", "", "", "", "", "", "", "", n, "Live check " + DATE])
sheet(wb, "1 Website URLs", ["URL", "Page type", "HTTP status", "Title (live)", "Meta description (live)", "H1 (live)", "H1 count", "Word count (approx.)", "Canonical", "Schema types", "Recommended primary keyword", "SEO status / issue", "Source & date"], url_rows,
      {"Title (live)": 45, "Meta description (live)": 45, "SEO status / issue": 60, "URL": 55})

# ---------- 2 Master Keywords ----------
mk = []
for r in ROWS:
    f = kp_fields(r["k"])
    mk.append([r["k"], f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7], "N/A (no Ahrefs/Semrush access)", r["intent"], r["role"], r["ofc"], r["top"],
               r["rel"], r["conv"], r["ci"], r["sd"], r["rf"], r["score"], r["tier"], PAGES[r["page"]][0], PAGES[r["page"]][1], r["note"], KP_SRC if KP.get(r["k"]) else "N/A", DATE])
mk.sort(key=lambda x: (x[20], -x[19]))
sheet(wb, "2 Master Keywords", ["Keyword", "Avg monthly searches (KP range)", "KP export value (bucket midpoint)", "3-month change", "YoY change", "Google Ads competition", "Competition index (0-100)", "Top-of-page bid low (USD)", "Top-of-page bid high (USD)",
      "Keyword difficulty", "Search intent", "Keyword role", "OneFulfillCenter ranking (observed SERP)", "Observed top organic results (Google US)", "Business relevance (1-10)", "Conversion potential (1-10)", "Commercial intent (1-10)", "Search demand (1-10)", "Ranking feasibility (1-10, estimate)", "Opportunity score", "Priority tier", "Target page", "Target URL", "Notes", "Metric source", "Research date"], mk,
      {"Observed top organic results (Google US)": 50, "Notes": 50})

# ---------- 2b KP raw (relevant) ----------
raw = [[r["keyword"], BUCKET.get(r["vol"], r["vol"]), r["vol"], r["m3"], r["yoy"], r["comp"], r["compidx"], r["low"], r["high"], r.get("theme", ""), r.get("intent", ""), r["groups"], r["months"], "Google Keyword Planner", DATE]
       for r in sorted(KP.values(), key=lambda x: -x["vol"]) if r.get("relevant")]
sheet(wb, "KP Raw (theme-filtered)", ["Keyword", "Avg monthly searches (range)", "Export value", "3-month change", "YoY change", "Competition", "Competition index", "Bid low (USD)", "Bid high (USD)", "Auto theme (regex)", "Auto intent (regex)", "Seed group(s)", "Monthly searches Nov25..Oct26", "Source", "Date"], raw,
      {"Monthly searches Nov25..Oct26": 40})

# ---------- 3 Homepage ----------
home = [[r["k"], *kp_fields(r["k"])[:1], *kp_fields(r["k"])[4:8], r["intent"], r["role"], r["score"], r["tier"], r["ofc"], r["top"], r["note"]] for r in ROWS if r["page"] == "HOME"]
home += [["--- Belongs on other pages (do NOT target on homepage) ---", "", "", "", "", "", "", "", "", "", "", "", ""]]
for k, p in [("ecommerce fulfillment services", "ECOM"), ("3pl warehousing", "WH"), ("fba prep services", "FBA"), ("b2b fulfillment", "B2B"), ("3pl pricing", "N-PRICE"), ("3pl for small business", "N-SMB")]:
    home.append([k, *kp_fields(k)[:1], *kp_fields(k)[4:8], "", "Owned by " + PAGES[p][0], "", "", "", "", "Mention + link from homepage; do not use as homepage title/H1 target"])
sheet(wb, "3 Homepage Keywords", ["Keyword", "Avg monthly searches (KP range)", "Google Ads competition", "Competition index", "Bid low", "Bid high", "Intent", "Role", "Opportunity score", "Tier", "OFC observed ranking", "Observed top results", "Notes"], home)

# ---------- 4 Service page keyword mapping ----------
svc = ["ECOM", "B2B", "FBA", "WH", "KIT", "PP", "RL", "RM", "XD", "IS", "SUB", "RET"]
AUD = {"ECOM": "DTC/Shopify/marketplace brands shipping parcels to consumers", "B2B": "Brands, manufacturers and wholesalers shipping cases/pallets to retailers & distributors",
       "FBA": "Amazon sellers (private label, wholesale, importers) needing prep before FBA inbound", "WH": "Brands needing outsourced 3PL warehouse space plus fulfillment",
       "KIT": "Brands selling bundles, gift sets, sample kits, retail display packs", "PP": "Ecommerce brands outsourcing order picking/packing",
       "RL": "Brands/retailers recovering value from returns, vendor returns, repairs", "RM": "DTC brands needing RMA intake, inspection, restock, exchanges",
       "XD": "Importers & brands moving inbound freight to outbound lanes with minimal dwell", "IS": "Sellers needing overflow/business inventory storage, incl. buffer stock before Amazon FBA",
       "SUB": "Subscription box companies with recurring kitting and ship waves", "RET": "Suppliers to big-box/specialty retail needing store/DC replenishment and compliance"}
GAP = {"ECOM": "Shopify/marketplace-specific landing page; pricing transparency; carrier/2-day coverage proof",
       "B2B": "EDI/retailer-compliance depth (ShipBob has 9 retailer EDI pages); wholesale fulfillment definitions; ASN/routing-guide content",
       "FBA": "FBA replenishment & storage page (core value prop, no competitor among the 10 owns it well); FNSKU labeling how-to; prep pricing (AMZ Prep & Prep Prime put prices in titles)",
       "WH": "Definitions block for '3PL warehouse'; location proof; 'outsourced warehousing' cost content",
       "KIT": "Few competitors have a dedicated kitting page (Stord, ShipMonk, Flowspace, DCL lack one) - strong opening",
       "PP": "Pick & pack fee explanation (PAA 'What is a pick and pack fee?'); accuracy process",
       "RL": "Enterprise SERP - win long-tail: 'reverse logistics 3pl', 'reverse logistics warehouse'",
       "RM": "Differentiate from returns software: physical returns processing, 3PL returns management",
       "XD": "Most competitors lack a cross-docking service page (Stord, ShipMonk, DCL, Ryder, Red Stag, AMZ Prep, Prep Prime) - strong opening",
       "IS": "Self-storage SERP intent mismatch - lead with 'business inventory storage / overflow / FBA buffer storage'",
       "SUB": "Only ShipBob among the 10 has a strong dedicated page; niche 3PLs rank - winnable",
       "RET": "Guide-heavy SERP - add 'What is retail fulfillment' section; EDI & routing-guide compliance"}
PRIO = {"ECOM": "High", "B2B": "High", "FBA": "High", "WH": "High", "KIT": "High", "PP": "Medium", "RL": "Medium", "RM": "Medium", "XD": "High", "IS": "High", "SUB": "Medium", "RET": "Medium"}
COMPURL = {}
for c in COMP:
    for p in c.get("pages", []):
        COMPURL.setdefault(p.get("theme", "").lower(), []).append(p.get("url", ""))
THEMEKEY = {"ECOM": "ecommerce", "B2B": "b2b", "FBA": "fba", "WH": "warehous", "KIT": "kitting", "PP": "pick", "RL": "return", "RM": "return", "XD": "cross", "IS": "storage", "SUB": "subscription", "RET": "retail"}
def comp_urls(p):
    out = []
    for th, urls in COMPURL.items():
        if THEMEKEY[p] in th: out += [u for u in urls if u and "N/A" not in u]
    return "; ".join(dict.fromkeys(out))[:900] or "N/A"
svc_rows = []
for p in ["HOME"] + svc:
    rs = [r for r in ROWS if r["page"] == p]
    prim = next(r for r in rs if r["role"] == "Primary")
    f = kp_fields(prim["k"])
    svc_rows.append([PAGES[p][0], PAGES[p][1], "Rank and convert for " + PAGES[p][0].lower() + " intent" if p != "HOME" else "Brand + broad 3PL intent; route to service pages",
        AUD.get(p, "Any business evaluating a 3PL (Amazon sellers, DTC, wholesalers, retailers, importers)"), prim["k"], f[0], "N/A (no KD source)", f"{f[6]} - {f[7]}", f[4],
        "; ".join(r["k"] for r in rs if r["role"] == "Secondary"), "; ".join(r["k"] for r in rs if r["role"] == "Long-tail"),
        prim["intent"], "Not in observed page-1 results" if prim["k"] in SERPK else "N/A (no rank tracker / GSC)", comp_urls(p) if p != "HOME" else "See SERP sheet", GAP.get(p, "Homepage H1/title should target 3PL services, not 'ecommerce fulfillment'"), PRIO.get(p, "High"), KP_SRC])
sheet(wb, "4 Service Page Keywords", ["Page name", "URL", "Page purpose", "Target audience", "Primary keyword", "Search volume (KP range)", "Keyword difficulty", "Top-of-page bid range (USD)", "Google Ads competition", "Secondary keywords", "Long-tail keywords", "Search intent", "Current ranking", "Competitor URLs (verified pages)", "Keyword gap", "Priority", "Source"], svc_rows,
      {"Competitor URLs (verified pages)": 60, "Secondary keywords": 50, "Long-tail keywords": 45, "Keyword gap": 50})

# ---------- 5 Competitor analysis ----------
crow, prow = [], []
for c in COMP:
    pg = [(p.get("theme", "").lower(), p.get("url", "")) for p in c.get("pages", []) if str(p.get("url", "")).startswith("http")]
    nf_items = []
    for s in c.get("services_not_found", []):
        s = s.lower()
        if s.startswith("no dedicated service page found for:"):
            nf_items.append(s.split(":", 1)[1].split("(")[0])
        else:
            nf_items.append(re.split(r"[(;]", s)[0])
    nf = " | ".join(nf_items)
    def has(t):
        if t in nf: return "No dedicated page (see notes)"
        hits = [(th, u) for th, u in pg if t in th]
        if not hits: return "Not found"
        full = [h for h in hits if not re.search(r"only|no service page|no dedicated|section|bullet|value-added|mention", h[0]) and not re.search(r"/blog|/insights/|/resources/", h[1])]
        return "Yes" if full else "Partial (blog/section only)"
    crow.append([c["name"], c["domain"], c.get("positioning", ""), has("ecommerce"), has("b2b") if has("b2b") == "Yes" else has("wholesale"), has("fba"), has("warehous"), has("kitting"), has("pick"),
                 has("return"), has("cross"), has("storage"), has("subscription"), has("retail") if has("retail") == "Yes" else has("edi"), has("pricing"), has("location"), has("compar") if has("compar") == "Yes" else has("alternative"),
                 "; ".join(c.get("industries", [])[:15]), "; ".join(c.get("content_patterns", []))[:900], "; ".join(c.get("services_not_found", []))[:700],
                 "; ".join(f"{x.get('text','')} ({x.get('url','')})" for x in c.get("claims", [])[:4])[:700], "; ".join(c.get("access_issues", []))[:400], c.get("research_date", DATE)])
    for p in c.get("pages", []):
        prow.append([c["name"], p.get("theme", ""), p.get("url", ""), p.get("title", ""), p.get("meta", ""), p.get("h1", ""), c.get("research_date", DATE)])
sheet(wb, "5 Competitor Analysis", ["Competitor", "Domain", "Positioning (from site)", "Ecommerce page", "B2B/wholesale page", "FBA prep page", "Warehousing page", "Kitting page", "Pick & pack page", "Returns/RL page", "Cross-docking page", "Storage page", "Subscription page", "Retail/EDI page", "Pricing page", "Location pages", "Comparison pages",
      "Industries", "Content patterns", "Services not found (checked)", "Claims (as stated on site)", "Access issues", "Research date"], crow,
      {"Positioning (from site)": 50, "Content patterns": 60, "Services not found (checked)": 50, "Claims (as stated on site)": 50, "Industries": 40})
sheet(wb, "Competitor Pages", ["Competitor", "Theme", "URL", "Title", "Meta description", "H1", "Research date"], prow, {"Title": 50, "Meta description": 50, "H1": 40, "URL": 55})

# ---------- 6 Keyword gap ----------
COMPDOM = {"Flowspace": "flow.space", "Stord": "stord.com", "ShipBob": "shipbob.com", "ShipMonk": "shipmonk.com", "DCL": "dclcorp.com", "Ryder": "ryder.com", "Saddle Creek": "sclogistics.com", "Red Stag": "redstagfulfillment.com", "AMZ Prep": "amzprep.com", "Prep Prime": "prepprime.com"}
gap = []
for s in SERP:
    if s["k"].startswith(("onefulfillcenter", "site:")): continue
    f = kp_fields(s["k"])
    def pos(dom):
        for i, u in enumerate(s["o"]):
            if u.startswith(dom): return f"#{i+1} ({u})"
        return "Not in observed top results"
    others = [f"#{i+1} {u.split('/')[0]}" for i, u in enumerate(s["o"]) if not any(u.startswith(d) for d in COMPDOM.values())]
    winner = s["o"][0].split("/")[0] if s["o"] else ""
    gap.append([s["k"], f[0], f[4], f"{f[6]} - {f[7]}", pos("onefulfillcenter.com")] + [pos(d) for d in COMPDOM.values()] + ["; ".join(others[:6]), winner])
sheet(wb, "6 Keyword Gap", ["Keyword", "Search volume (KP range)", "Ads competition", "Bid range", "OneFulfillCenter"] + list(COMPDOM.keys()) + ["Other domains in observed top results", "Observed #1"], gap)
gap_notes = [
 ["3pl fulfillment services / 3pl company / 3pl services", "Homepage head intent; 1K-10K", "ShipBob (#1 for '3pl fulfillment services'); listicles (curagroup, builtin, supplychaindigital); 3plogistics.com", "Mix of provider homepages, 'best 3PL' listicles, definitions", "Retarget homepage title/H1 to 3PL services; add 'What a 3PL does / how it works / pricing model' blocks; earn listicle inclusion (outreach to curagroup, 3plhub, builtin type lists)", "Hard - large brands + aggregators; expect long-tail wins first"],
 ["ecommerce fulfillment services", "1K-10K, bid $12.92-$43.29", "ShipBob (#7), efulfillmentservice.com (#1), CEVA, Kenco", "Service pages + listicles + Reddit", "Strengthen /ecommerce-fulfillment/ with integrations, coverage proof, pricing link, FAQs; build Shopify sub-page", "Hard-Medium"],
 ["b2b fulfillment / wholesale fulfillment", "100-1K / 10-100", "Flexport glossary, Fidelitone, Shopify blog, DP Wagner, Ryder", "Glossary/definition pages beat service pages", "Add definitional H2 ('What is B2B fulfillment?') + B2B vs B2C table + EDI/ASN/routing-guide detail on /b2b-fulfillment/", "Medium - specialist 3PLs rank; no giant dominance"],
 ["fba prep services / fba prep center", "100-1K each", "Amazon Seller Central, specialist prep centers (prepcenter.com, riteprep, simple-distribution), ShipMonk (#8)", "Specialist prep-center homepages + directories (fbaprepfinder) + Reddit", "Position FBA prep as part of a full 3PL: 'store in our warehouse, replenish FBA on demand'. Add prep pricing, turnaround, accepted prep types, Amazon requirements references; get listed on prep-center directories", "Medium"],
 ["warehousing services / 3pl warehouse", "1K-10K", "DHL, Ryder, Iron Mountain, Averitt; Extensiv/what-is pages", "Enterprise service pages + glossaries", "Target '3pl warehousing', 'outsourced warehousing', 'ecommerce warehousing' long-tail; add definitions block", "Hard"],
 ["kitting services", "100-1K, bid ceiling $28.86-$58.70 across variants", "WTB Logistics, Taylor, Veritiv, Ryder", "Mid-size 3PL service pages", "Expand /kitting/ with kit types, BOM control, examples, pricing model, FAQ ('What is a kitting fee?')", "Medium - best opening among services"],
 ["pick and pack services", "100-1K", "Ryder (#1), 3plcenter, Radial, explainers", "Service pages + explainers", "Add 'pick and pack fees explained' section; process visuals", "Medium"],
 ["reverse logistics services", "100-1K", "UPS, C.H. Robinson, NetSuite, Gartner", "Enterprise + software", "Focus on 'reverse logistics 3pl/warehouse' long-tail; differentiate from returns software", "Hard"],
 ["ecommerce returns management", "10-100, bid $23.20-$55.87", "Loop, ShipStation, Shippo, DCL blog, Ryder", "Returns SOFTWARE dominates", "Do not chase software intent; target 'returns processing' + '3pl returns management'", "Hard for head term; Medium for long-tail"],
 ["cross docking services", "1K-10K", "Universal Logistics, Averitt, GEODIS, Hub Group", "Freight/contract logistics providers + explainers", "Expand /cross-docking/ (most of the 10 competitors lack a page); add 'what is cross docking' blog", "Medium"],
 ["subscription box fulfillment", "100-1K", "ShipBob (#1), Boxzooka, Argents, KSP", "Niche 3PL pages + guides", "Rename title/H1 to 'Subscription Box Fulfillment'; add kitting + ship-wave details, cost FAQ", "Medium - winnable"],
 ["retail fulfillment", "100-1K", "Salesforce, Legacy SCS, Ryder, Bain, Shopify", "Guides", "Add definitional section; link to new EDI page", "Medium-Hard"],
 ["ecommerce inventory storage", "10-100", "Self-storage brands (Extra Space, Public Storage, Morningstar)", "Self-storage intent mismatch", "Make /inventory-storage/ clearly business/3PL storage (pallet, overflow, FBA buffer)", "Medium (weak competing content)"],
 ["best 3pl for small business", "10-100 (related '3pl for small business' 100-1K)", "Reddit, listicles, ShipBob /3pl/companies/", "Listicles", "New /3pl-for-small-business/ landing page; outreach to listicles", "Medium"],
 ["multi channel fulfillment", "100-1K", "Amazon MCF pages (#1-4), ShipBob blog", "Amazon program dominates", "Low priority; use 'multichannel fulfillment for brands' framing on a marketplace page", "Hard"],
]
ws = sheet(wb, "Gap Analysis Notes", ["Keyword(s)", "Why it matters (KP)", "Who is winning (observed)", "Page type ranking", "What OneFulfillCenter should create/improve", "Difficulty (qualitative)"], gap_notes, {"What OneFulfillCenter should create/improve": 60, "Who is winning (observed)": 45})

# ---------- 7 SERP ----------
WHAT = {"3pl fulfillment services": "Mix: provider explainer pages (ShipBob, Amazon), 3PL directories; rewards explanatory provider pages", "3pl company": "Listicles + definitions + local pack; rewards 'best/top 3PL' lists and explainers",
        "ecommerce fulfillment services": "Provider service pages + listicles + Reddit; rewards dedicated service pages with clear offer", "b2b fulfillment": "Glossary/definition pages; rewards clear definitions + B2B vs B2C explanation",
        "fba prep services": "Amazon policy + specialist prep centers + directories; rewards specialist pages with prep detail", "warehousing services": "Enterprise providers + glossaries + YouTube",
        "kitting services": "Mid-size 3PL kitting pages + definition content", "pick and pack services": "Ryder + explainers + 3PL pages; PAA about fees", "reverse logistics services": "Enterprise logistics + software + analyst reviews",
        "ecommerce returns management": "Returns software vendors - software intent", "cross docking services": "Freight/contract logistics providers + explainers", "ecommerce inventory storage": "Self-storage businesses - intent mismatch",
        "subscription box fulfillment": "Subscription-focused 3PL pages + guides", "retail fulfillment": "Guides from Salesforce/Bain/Shopify - informational", "3pl warehouse": "What-is explainers + Reddit + directories - informational",
        "fba prep center": "Prep-center homepages + Amazon + directories", "wholesale fulfillment": "Glossaries + 3PL pages", "best 3pl for small business": "Listicles + Reddit", "multi channel fulfillment": "Amazon MCF program pages"}
serp_rows = []
for s in SERP:
    if s["k"].startswith(("onefulfillcenter", "site:")): continue
    for i, u in enumerate(s["o"]):
        dom = u.split("/")[0]
        typ = "Competitor (provided list)" if dom in COMPDOM.values() else ("Forum/UGC" if "reddit" in dom or "youtube" in dom else ("Glossary/guide" if re.search(r"glossary|blog|learn|resources|insights|articles|encyclopedia|what-is|guide|wiki|faq|newsroom", u) else "Provider/other page"))
        serp_rows.append([s["k"], i + 1, u, dom, typ, "; ".join(s.get("paa", [])) if i == 0 else "", ("Yes" if s.get("local_pack") else "Not detected") if i == 0 else "", WHAT.get(s["k"], "") if i == 0 else "", "Google.com US, logged-in Chrome, pws=0 - " + DATE])
sheet(wb, "7 SERP Analysis", ["Keyword", "Position (observed)", "Result URL (truncated path)", "Domain", "Page type (classified)", "People Also Ask (observed)", "Local pack", "What Google rewards (analysis)", "Source & date"], serp_rows,
      {"Result URL (truncated path)": 55, "People Also Ask (observed)": 50, "What Google rewards (analysis)": 50})

# ---------- 8 Cannibalisation ----------
can = [
 ["Homepage vs Ecommerce Fulfillment", "/ (title starts 'Ecommerce Fulfillment & 3PL Warehousing Services') vs /ecommerce-fulfillment/", "ecommerce fulfillment services", "Separate pages", "Homepage retargets '3pl services / 3pl company'; 'ecommerce fulfillment services' owned by /ecommerce-fulfillment/. Change homepage title + H1.", "High"],
 ["Warehousing vs Inventory Storage vs /solutions/warehousing-and-inventory-storage/", "/warehousing/, /inventory-storage/, /solutions/warehousing-and-inventory-storage/ (+ /inventory-management/ redirecting there)", "3pl warehousing / inventory storage", "Consolidate legacy page; keep 2 pages with distinct intent", "/warehousing/ = full-service 3PL warehousing (receive, putaway, fulfill). /inventory-storage/ = storage-first (overflow, pallet, FBA buffer). 301 the /solutions/ page to /warehousing/.", "High"],
 ["B2B vs /solutions/b2c-b2b-wholesale-fulfillment/", "/b2b-fulfillment/ vs /solutions/b2c-b2b-wholesale-fulfillment/", "b2b fulfillment / wholesale fulfillment", "Consolidate", "301 /solutions/b2c-b2b-wholesale-fulfillment/ -> /b2b-fulfillment/; move any unique omnichannel copy to homepage.", "High"],
 ["B2B Fulfillment vs Retail Fulfillment", "/b2b-fulfillment/ vs /retail-fulfillment/", "wholesale fulfillment, retail distribution", "Separate pages, shared cluster", "B2B = wholesale/distributor/case & pallet orders. Retail = store/DC replenishment, retailer compliance, omnichannel retail. Cross-link; EDI terms go to new /edi-fulfillment/.", "Medium"],
 ["Returns Management vs Reverse Logistics", "/returns-management/ vs /reverse-logistics/", "returns processing / reverse logistics services", "Separate pages", "Returns Management = consumer DTC returns (RMA, inspection, restock, exchanges). Reverse Logistics = B2B/retail returns, vendor returns, repair routing, value recovery. Never use 'reverse logistics' as returns-page primary.", "Medium"],
 ["Amazon FBA Prep vs Inventory Storage vs proposed FBA Replenishment", "/amazon-fba-prep/, /inventory-storage/, /amazon-fba-replenishment/ (proposed)", "fba prep services / fba inventory storage / amazon fba replenishment", "Separate pages with supporting sections", "FBA Prep = labeling/bagging/bundling to Amazon rules. Replenishment page = store in OFC warehouse, ship to FBA on demand (core value prop). Inventory Storage mentions FBA buffer and links to replenishment page.", "High"],
 ["Ecommerce Fulfillment vs Pick & Pack", "/ecommerce-fulfillment/ vs /pick-and-pack/", "order fulfillment services vs pick and pack services", "Separate pages", "Ecommerce = end-to-end DTC service. Pick & Pack = the operational process, fees and accuracy. Ecommerce links to Pick & Pack with descriptive anchor.", "Low"],
 ["Kitting vs Subscription Fulfillment", "/kitting/ vs /subscription-fulfillment/", "kitting fulfillment vs subscription box fulfillment", "Separate pages", "Kitting = bundles/kits for any channel. Subscription = recurring box programs (kitting + ship waves). Subscription page links to Kitting.", "Low"],
 ["Cross Docking vs proposed Transloading", "/cross-docking/ vs /transloading/ (conditional)", "cross docking services vs transloading services", "Separate only if transloading is offered", "If not offered, do not create; mention container unloading only if true.", "Low"],
 ["3PL Pricing vs every service page", "/3pl-pricing/ (proposed)", "3pl pricing / 3pl costs", "Single page + FAQ links", "Service pages answer 'How much does X cost?' briefly and link to the pricing page.", "Medium"],
 ["Blog 'how to choose' vs Homepage", "/blog/how-to-choose-the-right-fulfilment-service-provider/ vs /", "how to choose a 3pl", "Separate (informational vs commercial)", "Blog keeps informational query; links to homepage with 'compare our 3PL services'.", "Low"],
]
sheet(wb, "8 Cannibalisation", ["Conflict", "URLs involved", "Keyword(s) at risk", "Decision", "Assignment & reasoning", "Priority"], can, {"Assignment & reasoning": 70, "URLs involved": 45})

# ---------- 9 New pages ----------
def kv(k): f = kp_fields(k); return f[0], f"{f[6]} - {f[7]}", f[4]
newp = [
 ["/amazon-fba-replenishment/", "amazon fba replenishment", *kv("amazon fba replenishment"), "Commercial", "Amazon sellers who want to avoid sending all inventory to FBA at once (storage fees, capacity limits)", "No strong dedicated page among the 10 competitors (AMZ Prep closest)", "Core differentiator - store in US warehouse, replenish FBA on demand. Low volume but highest-intent buyers.", "H1 Amazon FBA Replenishment & Storage | How it works (receive > store > prep > ship to FBA) | Why not send everything to FBA | Prep services included | Inventory visibility | Pricing model | FAQ", "From /amazon-fba-prep/, /inventory-storage/, /warehousing/, homepage, FBA blog posts", "High"],
 ["/3pl-pricing/", "3pl pricing", *kv("3pl pricing"), "Commercial investigation", "All prospects; late-stage evaluators", "AMZ Prep and Prep Prime put prices in page titles; ShipBob, Flowspace, Stord, Red Stag have /pricing URLs (see Competitor Pages); DCL /pricing/ is 404", "A 3PL or fulfillment cost question appears in People Also Ask on 6 of 19 SERPs checked. Only publish real pricing model/ranges.", "Pricing model (receiving, storage, pick & pack, kitting, FBA prep, returns) | What affects cost | Example scenarios | Quote CTA | FAQ", "From every service page FAQ and homepage", "High (requires business pricing input)"],
 ["/shopify-fulfillment/", "shopify fulfillment service", *kv("shopify fulfillment service"), "Commercial", "Shopify DTC brands", "ShipBob, ShipMonk, Saddle Creek have Shopify landing pages", "3 related keywords at 100-1K each with $45-$60 bid ceilings. Verify the Shopify integration first.", "Integration flow | Order sync | Inventory sync | Pricing | Case study | FAQ", "From /ecommerce-fulfillment/, homepage integrations section", "High"],
 ["/3pl-for-small-business/", "3pl for small business", *kv("3pl for small business"), "Commercial", "Small and early-stage ecommerce/Amazon sellers", "Listicles + Reddit dominate SERP", "100-1K with bid ceiling $67.01", "Minimums | Onboarding | Pricing | When to switch to a 3PL | FAQ", "From homepage, pricing, blog 'fulfillment strategies for small businesses'", "Medium-High"],
 ["/edi-fulfillment/", "edi fulfillment", *kv("edi fulfillment"), "Commercial", "Suppliers selling to big-box retail", "ShipBob has 9 retailer EDI pages; Red Stag has retailer pages", "Bid ceiling $104.86; supports B2B + Retail pages. Only if EDI capability is real (site copy mentions EDI-ready workflows, ASN support).", "EDI documents (850/856/810) | Routing guides | Labeling compliance | Chargeback prevention | Supported retailers (only verified)", "From /b2b-fulfillment/, /retail-fulfillment/", "Medium"],
 ["/compare/shipbob-alternatives/", "shipbob alternatives", *kv("shipbob alternatives"), "Comparison", "Brands unhappy with current 3PL", "Red Stag has ~19 vs/alternatives pages; Flowspace has a competitors blog category; ShipMonk has /lp/compare-to-shipmonk", "Bid range $30-$142.81 - the most valuable commercial-investigation term found. Must be factual and fair.", "Who should switch | Comparison table (verified facts only) | Migration process | FAQ", "From pricing page, homepage footer", "Medium"],
 ["/multichannel-fulfillment/", "multi channel fulfillment", *kv("multi channel fulfillment"), "Commercial", "Brands selling on Amazon + Walmart + Shopify + B2B", "Amazon MCF dominates SERP", "Supports homepage omnichannel story; target 'marketplace fulfillment', 'walmart marketplace fulfillment'", "Channels supported | One inventory pool | Allocation rules | FAQ", "From homepage, ecommerce, B2B", "Low-Medium"],
 ["/transloading/ (conditional)", "transloading services", *kv("transloading services"), "Commercial", "Importers moving containers to domestic trucks", "Not covered by the 10 competitors", "Only if OFC performs transloading/container unloading", "Process | Container types | Port proximity (verified only)", "From /cross-docking/", "Conditional"],
 ["/locations/ + superhub pages (conditional)", "3pl near me (+ city terms, volume not collected)", *kv("3pl near me"), "Local commercial", "Buyers needing regional coverage", "ShipBob ~620, Flowspace ~627, Red Stag ~150 city pages (Red Stag with 2 warehouses)", "Only build for facilities OFC actually operates (site map claims 5 superhubs: LA, DFW, Chicago, Atlanta, Newark + Kissimmee, FL address). Avoid doorway pages. Re-run Keyword Planner for city terms.", "Facility details | Services at site | Shipping zones | Local proof", "From homepage map", "Conditional - verify first"],
 ["/about/ and /contact/", "brand + trust", "N/A", "N/A", "N/A", "Navigational", "All prospects", "All competitors have About/Contact", "E-E-A-T and conversion; /contact-us/ currently redirects to a newsletter anchor and /about-us/ is 404", "Company story | Team | Facilities | Contact form, phone, address", "Footer, header", "High (low effort)"],
 ["Industry pages (conditional)", "apparel / beauty / auto parts fulfillment (volume not collected)", "Not collected", "N/A", "N/A", "Commercial", "Industry buyers", "ShipBob ~50 industry pages; Red Stag ~100 product-type pages", "Homepage lists 8 industries and blog posts exist for most. Run Keyword Planner for industry terms before building.", "Industry challenges | Services used | Compliance | FAQ", "From homepage Industries section + matching blog posts", "Medium (validate demand first)"],
]
sheet(wb, "9 New Page Opportunities", ["Proposed URL", "Primary keyword", "Search volume (KP range)", "Bid range (USD)", "Google Ads competition", "Search intent", "Target customer", "Competitor pages (verified)", "Commercial opportunity / evidence", "Recommended content structure", "Internal linking", "Priority"], newp,
      {"Recommended content structure": 55, "Commercial opportunity / evidence": 55, "Competitor pages (verified)": 45})

# ---------- 10 Blog ----------
blog = [
 ["what is a 3pl", "What Is a 3PL? How Third-Party Logistics Works (and When You Need One)", "/blog/what-is-a-3pl/", "third party logistics; 3pl; what is a 3pl warehouse", "Homepage, /warehousing/", "Pillar for '3pl' head terms; CTA to quote"],
 ["what is cross docking", "What Is Cross-Docking? Process, Types and When It Saves Money", "/blog/what-is-cross-docking/", "cross docking; cross docking logistics", "/cross-docking/", "Supports a service page few competitors have"],
 ["fnsku label", "FNSKU Labels: How to Create, Print and Apply Them (Amazon FBA)", "/blog/fnsku-labels/", "fnsku labeling; amazon fnsku barcode; fnsku", "/amazon-fba-prep/", "High-volume Amazon-seller entry point"],
 ["fba vs fbm", "FBA vs FBM: Costs, Control and a Hybrid Approach With a 3PL", "/blog/fba-vs-fbm/", "fba vs fbm; fbm fulfillment", "/amazon-fba-replenishment/, /ecommerce-fulfillment/", "Natural lead-in to 'store at 3PL, replenish FBA'"],
 ["reverse logistics", "Reverse Logistics: Process, Costs and How a 3PL Handles It", "/blog/reverse-logistics-guide/", "what is reverse logistics; reverse logistics process", "/reverse-logistics/, /returns-management/", ""],
 ["what is a 3pl warehouse", "3PL Warehouse vs Your Own Warehouse: What Changes", "/blog/3pl-warehouse/", "3pl warehouse; third party warehousing", "/warehousing/", ""],
 ["edi compliance", "EDI Compliance for Retail Suppliers: Documents, Routing Guides and Chargebacks", "/blog/edi-compliance-retail/", "edi compliance; edi 3pl", "/edi-fulfillment/, /retail-fulfillment/", ""],
 ["how to choose a 3pl", "How to Choose a 3PL: 15 Questions to Ask (Refresh)", "/blog/how-to-choose-a-3pl/ (301 from existing fulfilment post)", "how to choose a 3pl; 3pl comparison", "Homepage, /3pl-pricing/", "Refresh + US spelling"],
 ["how to send inventory to amazon fba", "How to Send Inventory to Amazon FBA (Step-by-Step)", "/blog/send-inventory-to-amazon-fba/", "amazon fba prep requirements", "/amazon-fba-prep/", ""],
 ["what is b2b fulfillment", "B2B Fulfillment Explained: Cases, Pallets, EDI and Retail Compliance", "/blog/what-is-b2b-fulfillment/", "b2b vs b2c fulfillment", "/b2b-fulfillment/", "B2B SERP rewards definitions"],
 ["kitting", "What Is Kitting? Examples, Costs and Kitting vs Bundling", "/blog/what-is-kitting/", "kitting; what is a kitting fee (PAA)", "/kitting/", ""],
 ["pick and pack", "Pick and Pack Fulfillment: Process and Fees Explained", "/blog/pick-and-pack-explained/", "pick and pack fee (PAA)", "/pick-and-pack/", ""],
 ["order fulfillment", "What Is Order Fulfillment? The 6-Step Process", "/blog/what-is-order-fulfillment/", "order fulfillment process", "/ecommerce-fulfillment/", ""],
 ["best 3pl for amazon sellers", "Best 3PLs for Amazon Sellers: What to Look For", "/blog/3pl-for-amazon-sellers/", "best 3pl for amazon sellers", "/amazon-fba-replenishment/", "Comparison intent - be factual"],
 ["ecommerce returns", "Ecommerce Returns: Building a Returns Process That Protects Margin", "/blog/ecommerce-returns-process/", "returns processing", "/returns-management/", ""],
]
blog_rows = []
for k, title, url, sec, link, note in blog:
    f = kp_fields(k); r = next((x for x in ROWS if x["k"] == k), None)
    blog_rows.append([k, f[0], "N/A (no KD source)", f[4], "Informational" if not r else r["intent"], "Ecommerce/Amazon sellers & ops leads researching 3PLs", title, url, k, sec, link, "In-article CTA to " + link.split(",")[0], ("High" if f[1] not in ("N/A (not returned by Keyword Planner)",) and isinstance(f[1], int) and f[1] >= 5000 else "Medium"), note, KP_SRC])
blog_rows.append(["(refresh) existing off-topic posts", "N/A", "", "", "", "", "Cart abandonment, checkout, mobile optimization, personalization, customer service posts", "existing", "", "", "", "Add fulfillment angle + links or consolidate", "Low", "Low business relevance for a 3PL buyer", "Site crawl"])
sheet(wb, "10 Blog Opportunities", ["Target keyword", "Search volume (KP range)", "Keyword difficulty", "Ads competition", "Search intent", "Target audience", "Proposed title", "Suggested URL", "Primary keyword", "Secondary keywords", "Service page to link", "Conversion opportunity", "Priority", "Notes", "Source"], blog_rows, {"Proposed title": 50})

# ---------- 11 On-page ----------
OP = {
 "HOME": ("3PL Services: Warehousing, Fulfillment & FBA Prep | OneFulfillCenter", "US 3PL services for ecommerce, B2B and Amazon sellers: warehousing, pick & pack, FBA prep, kitting and returns from one inventory pool. Get a quote.", "3PL Services for Ecommerce, B2B and Amazon Sellers",
          "H2 What our 3PL does (services grid linking to all 12) | H2 How it works (send inventory > we store > we fulfill any channel > replenish FBA on demand) | H2 Warehouse network (verified facilities only) | H2 Industries | H2 Pricing model (link) | H2 FAQ", "Organization (fix to one brand name), WebSite, Service list (ItemList), FAQPage"),
 "ECOM": ("Ecommerce Fulfillment Services for DTC Brands | OneFulfillCenter", "Outsource ecommerce fulfillment: inventory sync, pick & pack, carrier rate shopping and returns for Shopify and marketplace orders. Request a quote.", "Ecommerce Fulfillment Services Built to Help Your Brand Scale",
          "H2 How ecommerce fulfillment works | H2 Integrations (verified) | H2 Pick & pack accuracy | H2 Shipping & carriers | H2 Returns | H2 Pricing | H2 FAQ", "Service, FAQPage, BreadcrumbList"),
 "B2B": ("B2B Fulfillment Services: Wholesale, Case & Pallet Orders | OneFulfillCenter", "B2B and wholesale fulfillment for brands shipping cases and pallets to retailers and distributors, with EDI-ready workflows and compliant labeling.", "B2B Fulfillment for Wholesale Speed and Accuracy",
          "H2 What is B2B fulfillment? | H2 B2B vs B2C fulfillment (table) | H2 Case, pallet & mixed-SKU orders | H2 EDI, ASN & routing guides | H2 LTL/FTL | H2 FAQ", "Service, FAQPage, BreadcrumbList"),
 "FBA": ("FBA Prep Services & Amazon Prep Center | OneFulfillCenter", "Amazon FBA prep services: FNSKU labeling, polybagging, bundling and inbound shipments - plus storage so you replenish FBA only when you need to.", "Amazon FBA Prep Services That Get Inventory Inbound Without Delays",
          "H2 FBA prep services we handle | H3 FNSKU labeling | H3 Polybagging & protective packaging | H3 Bundles | H2 Store with us, replenish FBA on demand (link) | H2 Amazon prep requirements (cite Seller Central) | H2 Turnaround & pricing | H2 FAQ", "Service, FAQPage, BreadcrumbList"),
 "WH": ("3PL Warehousing Services for Ecommerce & B2B | OneFulfillCenter", "Outsourced 3PL warehousing: receiving, putaway, cycle counts and fulfillment-ready storage for ecommerce and wholesale inventory.", "3PL Warehousing Built to Store Inventory and Move Orders Faster",
          "H2 What is a 3PL warehouse? | H2 Receiving & putaway | H2 Inventory accuracy | H2 Network (verified) | H2 Warehousing vs inventory storage (link) | H2 FAQ", "Service, FAQPage, BreadcrumbList"),
 "KIT": ("Kitting Services: Kitting & Assembly, Bundles, Gift Sets | OneFulfillCenter", "Kitting and assembly services for bundles, gift sets, sample kits and retail packs, with BOM control and finished-SKU labeling.", "Kitting Services That Assemble Bundles Before the Order Ships",
          "H2 Types of kits | H2 Kitting process & BOM control | H2 Kitting for Amazon, retail, subscription | H2 Kitting fees explained | H2 FAQ", "Service, FAQPage, BreadcrumbList"),
 "PP": ("Pick and Pack Services & Fulfillment | OneFulfillCenter", "Pick and pack fulfillment with barcode verification and scan-to-pack checks. See how pick and pack fees work and request a quote.", "Pick and Pack Services Built for Speed and Accuracy",
          "H2 How pick and pack works | H2 Accuracy controls | H2 Packaging options | H2 Pick and pack fees explained | H2 FAQ", "Service, FAQPage, BreadcrumbList"),
 "RL": ("Reverse Logistics Services & 3PL Returns Recovery | OneFulfillCenter", "Reverse logistics services for B2B and retail returns: inspection, grading, restock, repair routing and vendor returns.", "Reverse Logistics Services That Recover Inventory Value",
          "H2 Reverse logistics vs returns management | H2 Process | H2 Disposition options (only offered ones) | H2 Reporting | H2 FAQ", "Service, FAQPage"),
 "RM": ("Returns Processing & Ecommerce Returns Management | OneFulfillCenter", "Ecommerce returns processing: RMA intake, inspection, restocking and exchanges handled in our warehouse so outbound orders keep moving.", "Returns Management and Processing for Ecommerce Brands",
          "H2 Returns processing workflow | H2 Inspection & grading | H2 Restock & exchanges | H2 Works with your returns software | H2 FAQ", "Service, FAQPage"),
 "XD": ("Cross Docking Services & Cross Dock Warehouse | OneFulfillCenter", "Cross docking services that move inbound freight to outbound lanes with minimal storage dwell. Pallet and carton cross-dock for brands and importers.", "Cross Docking Services That Move Freight Through, Not Into Storage",
          "H2 What is cross docking? | H2 How our cross dock works | H2 When cross docking saves money | H2 Cross docking vs warehousing | H2 FAQ", "Service, FAQPage"),
 "IS": ("Business Inventory Storage & Overflow Warehouse Storage | OneFulfillCenter", "Business inventory storage for ecommerce and Amazon sellers: pallet and overflow storage with SKU-level tracking, ready to ship to FBA or customers.", "Business Inventory Storage Built for Accuracy",
          "H2 Overflow & seasonal storage | H2 Pallet and shelf storage | H2 Buffer stock for Amazon FBA (link replenishment) | H2 Visibility | H2 Storage pricing | H2 FAQ", "Service, FAQPage"),
 "SUB": ("Subscription Box Fulfillment Services | OneFulfillCenter", "Subscription box fulfillment: recurring kitting, inventory planning and on-time ship waves for monthly and quarterly box programs.", "Subscription Box Fulfillment Built for Recurring Programs",
          "H2 How subscription box fulfillment works | H2 Kitting & ship waves | H2 Variants & personalization | H2 Cost factors | H2 FAQ", "Service, FAQPage"),
 "RET": ("Retail Fulfillment & Store Replenishment Services | OneFulfillCenter", "Retail fulfillment for store and DC replenishment with retailer-compliant labeling and EDI-ready workflows, from the same inventory as your DTC orders.", "Retail Fulfillment for Stores, DCs and Digital Demand",
          "H2 What is retail fulfillment? | H2 Store & DC replenishment | H2 Retailer compliance & EDI (link) | H2 Omnichannel inventory | H2 FAQ", "Service, FAQPage"),
}
FAQ = {"HOME": "What is a 3PL? / How much does a 3PL cost? / Do you have minimums? / Which channels do you support?", "ECOM": "How much do fulfillment services cost? / Which platforms integrate? / How fast do orders ship?",
       "B2B": "What is B2B fulfillment? / Do you support EDI? / Can you ship LTL?", "FBA": "What are FBA prep services? / Can you store inventory and replenish FBA? / What does FBA prep cost?",
       "WH": "What does 3PL mean in warehousing? / What are storage minimums?", "KIT": "What is a kitting fee? / What is a kitting company?", "PP": "What is a pick and pack fee? / What is pick and pack fulfillment?",
       "RL": "What does reverse logistics do? / What are the 5 R's of reverse logistics?", "RM": "How are returns inspected? / Do you work with returns apps?", "XD": "What is cross-docking service? / What companies use cross-docking?",
       "IS": "Is this self-storage? (No - business/3PL storage) / Short-term storage?", "SUB": "What does subscription box fulfillment cost?", "RET": "What is retail fulfilment? / Which retailers' requirements do you meet? (verified only)"}
REF = {"FBA": "Amazon Seller Central FBA packaging & prep requirements", "B2B": "GS1 US (labels/barcodes)", "RET": "GS1 US; retailer routing guides (only those supported)", "XD": "None required", "HOME": "None required"}
op_rows = []
for p in ["HOME"] + svc:
    t, d, h1, h2, sch = OP[p]
    rs = [r for r in ROWS if r["page"] == p]
    prim = next(r for r in rs if r["role"] == "Primary")
    links = {"HOME": "All 12 service pages + /3pl-pricing/", "ECOM": "/pick-and-pack/, /returns-management/, /shopify-fulfillment/", "B2B": "/retail-fulfillment/, /edi-fulfillment/, /warehousing/",
             "FBA": "/amazon-fba-replenishment/, /inventory-storage/, /kitting/", "WH": "/inventory-storage/, /cross-docking/, /b2b-fulfillment/", "KIT": "/subscription-fulfillment/, /amazon-fba-prep/",
             "PP": "/ecommerce-fulfillment/, /kitting/", "RL": "/returns-management/, /retail-fulfillment/", "RM": "/reverse-logistics/, /ecommerce-fulfillment/", "XD": "/warehousing/, /b2b-fulfillment/",
             "IS": "/warehousing/, /amazon-fba-replenishment/", "SUB": "/kitting/, /ecommerce-fulfillment/", "RET": "/b2b-fulfillment/, /edi-fulfillment/"}[p]
    op_rows.append([PAGES[p][0], PAGES[p][1], prim["k"], t, len(t), d, len(d), h1, h2,
        f"Primary in title (front), H1, first 100 words, one H2, URL already contains topic", "; ".join(r["k"] for r in rs if r["role"] in ("Secondary", "Long-tail"))[:400] + " - use once each in H2/H3, FAQ or body where natural",
        "3PL, SKU, ASN, BOL, LTL/FTL, carrier rate shopping, cycle counts, FNSKU, BOM, RMA, EDI 856/850, putaway, slotting (use only where relevant)", h2, FAQ.get(p, ""), links, REF.get(p, "None required"),
        f"Alt text describing the real operation, e.g. '{prim['k']} at OneFulfillCenter warehouse' (no stuffing)", sch, "Primary CTA 'Get a quote'; secondary 'See pricing'; add proof (client logos/testimonials only if real)"])
sheet(wb, "11 On-Page Recommendations", ["Page", "URL", "Primary keyword", "Recommended SEO title", "Title length", "Recommended meta description", "Meta length", "Recommended H1", "H2/H3 structure", "Primary keyword placement", "Secondary keyword placement", "Semantic entities", "Content sections", "FAQ opportunities (PAA-based)", "Internal links to add", "External authoritative references", "Image alt-text", "Schema", "CTA"], op_rows,
      {"H2/H3 structure": 60, "Content sections": 50, "Secondary keyword placement": 50, "Recommended meta description": 50})

# ---------- Internal linking ----------
il = [
 ["Homepage", "/ecommerce-fulfillment/", "ecommerce fulfillment services", "Pass homepage authority to top commercial page"], ["Homepage", "/amazon-fba-prep/", "Amazon FBA prep", "Core service"], ["Homepage", "/warehousing/", "3PL warehousing", "Core service"],
 ["Homepage", "/b2b-fulfillment/", "B2B and wholesale fulfillment", "Core service"], ["Homepage", "/amazon-fba-replenishment/", "store inventory and replenish FBA on demand", "Value proposition page"], ["Homepage", "/3pl-pricing/", "see how 3PL pricing works", "Conversion"],
 ["/amazon-fba-prep/", "/amazon-fba-replenishment/", "replenish FBA from our warehouse", "Cluster"], ["/amazon-fba-prep/", "/inventory-storage/", "buffer inventory storage", "Cluster"], ["/amazon-fba-prep/", "/kitting/", "multi-pack and bundle kitting", "Related service"],
 ["/inventory-storage/", "/warehousing/", "full-service warehousing", "Disambiguation"], ["/warehousing/", "/inventory-storage/", "overflow and pallet storage", "Disambiguation"], ["/warehousing/", "/cross-docking/", "cross-dock freight instead of storing it", "Related"],
 ["/ecommerce-fulfillment/", "/pick-and-pack/", "how our pick and pack process works", "Process detail"], ["/ecommerce-fulfillment/", "/returns-management/", "returns processing", "Related"], ["/ecommerce-fulfillment/", "/shopify-fulfillment/", "Shopify fulfillment", "New page"],
 ["/b2b-fulfillment/", "/retail-fulfillment/", "store and DC replenishment", "Disambiguation"], ["/b2b-fulfillment/", "/edi-fulfillment/", "EDI and retailer compliance", "New page"], ["/retail-fulfillment/", "/b2b-fulfillment/", "wholesale case and pallet orders", "Disambiguation"],
 ["/returns-management/", "/reverse-logistics/", "B2B and vendor returns recovery", "Disambiguation"], ["/reverse-logistics/", "/returns-management/", "consumer returns processing", "Disambiguation"],
 ["/subscription-fulfillment/", "/kitting/", "kit assembly", "Dependency"], ["/kitting/", "/subscription-fulfillment/", "subscription box programs", "Related"], ["/pick-and-pack/", "/kitting/", "bundles assembled before picking", "Related"],
 ["/blog/what-is-a-3pl/", "Homepage", "3PL services", "Blog to money page"], ["/blog/fnsku-labels/", "/amazon-fba-prep/", "FNSKU labeling service", "Blog to service"], ["/blog/fba-vs-fbm/", "/amazon-fba-replenishment/", "a hybrid FBA replenishment approach", "Blog to new page"],
 ["/blog/what-is-cross-docking/", "/cross-docking/", "cross docking services", "Blog to service"], ["/blog/edi-compliance-retail/", "/edi-fulfillment/", "EDI fulfillment", "Blog to new page"], ["/blog/how-to-choose-a-3pl/", "/3pl-pricing/", "compare 3PL pricing", "Blog to conversion"],
 ["Industry blog posts (apparel, beauty, auto parts, etc.)", "Relevant service pages", "descriptive service anchors (vary)", "Currently isolated posts; add 2-3 contextual service links each"],
 ["Footer", "/about/, /contact/", "About us; Contact", "Trust + crawl paths (new pages)"],
]
sheet(wb, "Internal Linking", ["Source page", "Destination page", "Suggested anchor text", "Reason"], il)

# ---------- 12 Roadmap ----------
road = [
 ["Days 1-30", "Technical", "Remove redirecting URLs (/inventory-management/, /temperature-controlled-storage/, /kitting-assembly/) from sitemap.ts; fix redirect chains", "Dev", "Sitemap returns only 200, indexable, canonical URLs", "0 redirecting URLs in sitemap"],
 ["Days 1-30", "Technical", "301 /solutions/warehousing-and-inventory-storage/ -> /warehousing/ and /solutions/b2c-b2b-wholesale-fulfillment/ -> /b2b-fulfillment/", "Dev", "Consolidates duplicate intent", "Legacy URLs 301; dropped from index within ~4-8 weeks"],
 ["Days 1-30", "Technical", "Verify Google Search Console + submit sitemap; connect Ahrefs (/mcp) for KD and rank tracking", "Marketing", "Fills N/A ranking/KD columns", "GSC verified; baseline impressions/clicks recorded"],
 ["Days 1-30", "On-page", "Homepage: new title/H1 targeting '3pl services'; unify brand name (OneFulfillCenter) in copy and schema", "Content + Dev", "Fixes homepage vs ecommerce cannibalisation", "Title/H1 live; brand consistent"],
 ["Days 1-30", "On-page", "Optimize Tier 1 pages: /ecommerce-fulfillment/, /amazon-fba-prep/, /warehousing/, /kitting/, /cross-docking/, /inventory-storage/", "Content", "Titles, H1s, H2 definitions blocks, FAQs from PAA", "6 pages updated"],
 ["Days 1-30", "Trust", "Create /about/ and real /contact/ page; add H1 to /request-demo/", "Content + Dev", "E-E-A-T + conversion", "Pages live"],
 ["Days 1-30", "Internal links", "Implement Internal Linking sheet (service-to-service + homepage)", "Dev", "", "All service pages have >= 3 contextual inbound links"],
 ["Days 31-60", "On-page", "Optimize remaining service pages (B2B, Pick & Pack, Reverse Logistics, Returns, Subscription, Retail)", "Content", "", "12/12 service pages updated"],
 ["Days 31-60", "New pages", "Publish /amazon-fba-replenishment/, /3pl-pricing/ (with real pricing inputs), /shopify-fulfillment/ (after integration check)", "Content + Sales", "", "3 pages live and indexed"],
 ["Days 31-60", "Blog", "Publish 4-6 validated posts: what is a 3PL, FNSKU labels, FBA vs FBM, what is cross-docking, B2B fulfillment explained; refresh 'how to choose a 3PL'", "Content", "", "6 posts live; each links to its service page"],
 ["Days 31-60", "Off-page", "Directory/citation listings (prep-center directories, 3PL directories, Google Business Profile for verified facility), outreach to 'best 3PL' listicle authors", "Marketing", "", "10+ relevant citations/links"],
 ["Days 61-90", "Measurement", "Review GSC: queries with impressions but CTR below site average -> rewrite titles/metas", "Marketing", "", "CTR uplift on targeted pages vs baseline"],
 ["Days 61-90", "Optimization", "Find queries at positions 5-20 (GSC/Ahrefs) and strengthen those pages (content, internal links)", "Content", "", "Count of keywords moving into top 10 (tracked, not promised)"],
 ["Days 61-90", "New pages", "Decide on /edi-fulfillment/, /3pl-for-small-business/, ShipBob alternatives, location and industry pages after re-running Keyword Planner for city/industry terms and verifying capabilities", "Marketing + Ops", "", "Go/no-go documented per page"],
 ["Days 61-90", "Competitive", "Re-run competitor gap with Ahrefs once connected", "Marketing", "", "Updated gap list"],
 ["KPIs (all stages)", "Measurement", "Indexed pages (GSC), impressions/clicks for Tier 1 keywords, non-brand organic sessions to service pages, demo/quote form submissions from organic, keywords in top 20/top 10", "Marketing", "Baseline at day 1; report at day 30/60/90", "No first-page or #1 ranking is promised within 90 days"],
]
sheet(wb, "12 90-Day Roadmap", ["Stage", "Workstream", "Action", "Owner", "Notes", "KPI / success measure"], road, {"Action": 70, "KPI / success measure": 45})

out = "OneFulfillCenter-SEO-Keyword-Research-2026-11-27.xlsx"
wb.save(out)
print("saved", out, [ws.title for ws in wb.worksheets], len(ROWS), "curated keywords")
tiers = {}
for r in ROWS: tiers[r["tier"]] = tiers.get(r["tier"], 0) + 1
print(tiers)
for r in sorted(ROWS, key=lambda x: -x["score"])[:15]: print(r["score"], r["tier"], r["k"], r["page"])
