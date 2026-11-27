"use client";

import { useEffect, useMemo, useState } from "react";
import s from "./SeoDashboard.module.css";
import { HBarChart, Scatter } from "./charts";
import type { KpRaw, Keyword, SeoBundle } from "./types";

const TABS = [
  ["overview", "Overview"],
  ["keywords", "Keywords"],
  ["pagemap", "Page map"],
  ["competitors", "Competitors"],
  ["serp", "Google results"],
  ["site", "Site audit"],
  ["plan", "Action plan"],
  ["explorer", "All Keyword Planner ideas"],
] as const;
type TabId = (typeof TABS)[number][0];

const TIERS = ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Excluded"];
const TIER_COLOR: Record<string, string> = { "Tier 1": "#0f766e", "Tier 2": "#2f6fb3", "Tier 3": "#b7791f", "Tier 4": "#8a95a1", Excluded: "#d0d6dc" };
const TIER_CLS: Record<string, string> = { "Tier 1": s.t1, "Tier 2": s.t2, "Tier 3": s.t3, "Tier 4": s.t4, Excluded: s.ex };
const SERVICES: [string, string][] = [
  ["ecommerce", "Ecommerce"], ["b2b", "B2B"], ["fba", "FBA prep"], ["warehousing", "Warehousing"], ["kitting", "Kitting"], ["pickpack", "Pick & pack"],
  ["returns", "Returns"], ["crossdock", "Cross-docking"], ["storage", "Storage"], ["subscription", "Subscription"], ["retail", "Retail / EDI"],
];
const EXTRA: [string, string][] = [["pricing", "Pricing"], ["locations", "Locations"], ["comparison", "Comparison"]];
const GAP_SITES: [string, string][] = [
  ["onefulfillcenter", "OneFulfillCenter"], ["flowspace", "Flowspace"], ["stord", "Stord"], ["shipbob", "ShipBob"], ["shipmonk", "ShipMonk"], ["dcl", "DCL"],
  ["ryder", "Ryder"], ["saddle_creek", "Saddle Creek"], ["red_stag", "Red Stag"], ["amz_prep", "AMZ Prep"], ["prep_prime", "Prep Prime"],
];

const money = (v: number | null | undefined) => (v == null ? "—" : `$${v.toFixed(2)}`);
const dash = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : String(v));
const fmt = (n: number) => n.toLocaleString("en-US");
const covKind = (v: string) => (v === "Yes" ? "yes" : String(v).startsWith("Partial") ? "part" : "no");
const covText = (v: string) => (v === "Yes" ? "Yes" : String(v).startsWith("Partial") ? "Blog only" : "No");
const priCls = (p: string) => { const x = String(p).toLowerCase(); return x.startsWith("high") ? s.high : x.startsWith("cond") ? s.part : ""; };
const shortName = (n: string) => n.replace(/ \(.*\)$/, "").replace(" Logistics Services", "").replace(" Fulfillment", "");

function Pill({ text, cls }: { text: string; cls?: string }) {
  return <span className={`${s.pill} ${cls || ""}`}>{text || "—"}</span>;
}

export default function SeoDashboard({ data }: { data: SeoBundle }) {
  const [tab, setTab] = useState<TabId>("overview");
  useEffect(() => {
    const sync = () => {
      const h = window.location.hash.replace("#", "") as TabId;
      if (TABS.some(([id]) => id === h)) setTab(h);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const go = (id: TabId) => { setTab(id); history.replaceState(null, "", `#${id}`); };

  const a = useMemo(() => analyse(data), [data]);

  return (
    <div className={s.root}>
      <div className={s.wrap}>
        <header className={s.header}>
          <span className={s.eyebrow}>Internal · SEO research · 27 Nov 2026 · United States</span>
          <h1 className={s.h1}>OneFulfillCenter SEO Intelligence</h1>
          <p className={s.lede}>
            OneFulfillCenter is on page 1 for <b>{a.page1}</b> of the <b>{a.checked}</b> commercial keywords checked on Google US.
            There are <b>{a.tier1}</b> Tier 1 keywords to go after, and <b>{a.siteIssues}</b> of {a.siteUrls} crawled URLs have an SEO issue.
          </p>
          <p className={s.muted}>
            Search volume, trends, Ads competition and bids come from Google Keyword Planner. Volumes are ranges (e.g. 100–1K) because the Ads account has no recent spend.
            Keyword difficulty and rank tracking are not available yet (Ahrefs is not connected), so &ldquo;ranking feasibility&rdquo; is an estimate from who ranks today.
          </p>
        </header>

        <nav className={s.tabs} role="tablist" aria-label="Dashboard sections">
          {TABS.map(([id, label]) => (
            <button key={id} role="tab" aria-selected={tab === id} className={`${s.tab} ${tab === id ? s.tabActive : ""}`} onClick={() => go(id)}>{label}</button>
          ))}
        </nav>

        {tab === "overview" && <Overview data={data} a={a} />}
        {tab === "keywords" && <KeywordsTab data={data} />}
        {tab === "pagemap" && <PageMapTab data={data} />}
        {tab === "competitors" && <CompetitorsTab data={data} a={a} />}
        {tab === "serp" && <SerpTab data={data} />}
        {tab === "site" && <SiteTab data={data} />}
        {tab === "plan" && <PlanTab data={data} />}
        {tab === "explorer" && <ExplorerTab />}

        <details className={`${s.card} ${s.details}`}>
          <summary>How this was researched</summary>
          <ul className={`${s.list} ${s.muted}`}>
            <li>Keyword Planner: 16 seed groups (one per page plus new-page, informational and comparison themes), United States, English, Nov 2025 – Oct 2026. 8,841 unique ideas; 5,431 matched a service theme.</li>
            <li>Ads competition is how many advertisers bid. It is not organic keyword difficulty.</li>
            <li>Score = 25% commercial intent + 25% business relevance + 20% search demand + 20% ranking feasibility (estimate) + 10% conversion potential, each out of 10.</li>
            <li>Google results: live Google.com, gl=us, personalization off, 27 Nov 2026. Competitor coverage: sitemaps plus about 240 pages fetched the same day.</li>
            <li>Not collected: city and industry keyword volumes. Location and industry page ideas are marked &ldquo;validate demand first&rdquo;.</li>
          </ul>
        </details>
      </div>
    </div>
  );
}

/* ---------------- analysis ---------------- */

function analyse(d: SeoBundle) {
  const kw = d.keywords;
  const active = kw.filter((k) => k.tier !== "Excluded");
  const tierCounts = TIERS.map((t) => ({ label: t, value: kw.filter((k) => k.tier === t).length, color: TIER_COLOR[t] }));
  const byPage = new Map<string, { label: string; value: number; overlay: number; bids: number[] }>();
  for (const k of active) {
    const r = byPage.get(k.page) || { label: k.page, value: 0, overlay: 0, bids: [] };
    r.value += 1; if (k.tier === "Tier 1") r.overlay += 1; if (k.bid_high != null && k.intent !== "Informational") r.bids.push(k.bid_high);
    byPage.set(k.page, r);
  }
  const pages = [...byPage.values()].sort((x, y) => y.value - x.value);
  const bidByPage = pages.filter((p) => p.bids.length).map((p) => ({ label: p.label, value: p.bids.reduce((a, b) => a + b, 0) / p.bids.length, note: `(${p.bids.length} kw)` })).sort((x, y) => y.value - x.value);
  const coverage = SERVICES.map(([key, label]) => ({ label, value: d.competitors.filter((c) => covKind(c[key]) !== "yes").length }))
    .sort((x, y) => y.value - x.value);
  const quickWins = active
    .filter((k) => k.competition === "Low" && (k.bid_high ?? 0) >= 30 && k.intent !== "Informational" && k.tier !== "Tier 4")
    .sort((x, y) => (y.bid_high ?? 0) - (x.bid_high ?? 0));
  const intentMix = ["Commercial / Transactional", "Comparison", "Informational", "Navigational", "Mixed / off-target"]
    .map((i) => ({ label: i, value: kw.filter((k) => k.intent === i).length })).filter((x) => x.value);
  const demand = ["10K-100K", "1K-10K", "100-1K", "10-100", "0-10"].map((v) => ({ label: v, value: active.filter((k) => k.volume === v).length }));
  const highest = [...active].filter((k) => k.bid_high != null).sort((x, y) => (y.bid_high ?? 0) - (x.bid_high ?? 0))[0];
  const topRank = (field: string) => d.gap.filter((g) => /^#\d/.test(String(g[field]))).length;
  const competitorPresence = GAP_SITES.slice(1).map(([k, label]) => ({ label, value: topRank(k) })).sort((x, y) => y.value - x.value);
  const serpTypes = new Map<string, number>();
  for (const r of d.serp) serpTypes.set(r.page_type, (serpTypes.get(r.page_type) || 0) + 1);
  return {
    tier1: kw.filter((k) => k.tier === "Tier 1").length,
    curated: active.length,
    checked: d.gap.length,
    page1: d.gap.filter((g) => !String(g.onefulfillcenter).startsWith("Not")).length,
    siteUrls: d.site.length,
    siteIssues: d.site.filter((x) => x.flag === "Issue").length,
    tierCounts, pages, bidByPage, coverage, quickWins, intentMix, demand, highest, competitorPresence,
    serpTypes: [...serpTypes.entries()].map(([label, value]) => ({ label, value })).sort((x, y) => y.value - x.value),
  };
}
type Analysis = ReturnType<typeof analyse>;

/* ---------------- tabs ---------------- */

function Overview({ data, a }: { data: SeoBundle; a: Analysis }) {
  const top = data.keywords.filter((k) => k.tier === "Tier 1").sort((x, y) => y.score - x.score).slice(0, 10);
  const most = a.coverage[0];
  const forum = a.serpTypes.find((t) => t.label.startsWith("Glossary"));
  return (
    <section className={s.section}>
      <div className={s.kpis}>
        <Kpi label="Keywords mapped to pages" value={fmt(a.curated)} note="Reviewed from 8,841 Keyword Planner ideas" />
        <Kpi label="Tier 1 commercial keywords" value={fmt(a.tier1)} note="Score 7.5+ and 100–1K+ searches a month" />
        <Kpi label="Page-1 rankings today" value={`${a.page1} / ${a.checked}`} note="Keywords checked on Google US" bad={a.page1 === 0} />
        <Kpi label="URLs with an SEO issue" value={`${a.siteIssues} / ${a.siteUrls}`} note="Sitemap URLs plus missing pages" bad />
      </div>

      <div className={s.card}>
        <h2 className={s.h2}>What the data says</h2>
        <ul className={s.findings}>
          <li>No page-1 rankings yet for any of the {a.checked} checked keywords. Competitors from your list appear in only a few of them: {a.competitorPresence.filter((c) => c.value).map((c) => `${c.label} (${c.value})`).join(", ") || "none"}. Most page-1 spots go to enterprise logistics firms, software vendors, directories and list articles.</li>
          <li>{most ? `${most.label} is the biggest opening: ${most.value} of 10 competitors have no dedicated page for it.` : ""} Cross-docking, kitting, subscription and storage are covered weakly across competitors, and you already have pages for all 12 services.</li>
          {a.highest && <li>The most valuable keyword by ad bids is &ldquo;{a.highest.keyword}&rdquo; ({money(a.highest.bid_low)}–{money(a.highest.bid_high)} per click, {a.highest.volume} searches/mo). Advertisers pay that much because these searches turn into customers.</li>}
          <li>{a.quickWins.length} keywords have low Ads competition but bids of $30+ per click, which suggests high buyer value with fewer advertisers. They are listed below as quick wins.</li>
          {forum && <li>{forum.value} of {data.serp.length} page-1 results captured are guides or glossaries. Google often rewards pages that explain the service, so add a short &ldquo;What is …&rdquo; section to each service page.</li>}
          <li>The homepage competes with the ecommerce page for &ldquo;ecommerce fulfillment&rdquo;. Retarget the homepage to &ldquo;3pl services&rdquo; and let each service page own its own term.</li>
        </ul>
      </div>

      <div className={s.grid2}>
        <div className={s.card}>
          <h2 className={s.h2}>Keywords by priority tier</h2>
          <p className={s.muted}>Tier 1 = high-priority commercial. Tier 4 = informational (blog). Excluded = wrong intent for a 3PL.</p>
          <HBarChart bars={a.tierCounts} label="Keyword count per priority tier" />
        </div>
        <div className={s.card}>
          <h2 className={s.h2}>Search demand of mapped keywords</h2>
          <p className={s.muted}>Monthly US searches, as Keyword Planner ranges. Most commercial 3PL searches sit in the 100–1K band.</p>
          <HBarChart bars={a.demand} label="Mapped keywords per monthly search range" />
        </div>
      </div>

      <div className={s.card}>
        <h2 className={s.h2}>Opportunity score against ad value</h2>
        <p className={s.muted}>Each dot is a keyword. Higher means a better overall opportunity; further right means advertisers pay more per click. Bigger dots have more searches. Point at a dot for details.</p>
        <div className={s.legend}>{TIERS.map((t) => <span key={t}><i className={s.swatch} style={{ background: TIER_COLOR[t] }} />{t}</span>)}</div>
        <Scatter
          label="Scatter of opportunity score against high top-of-page bid"
          xLabel="Top-of-page bid, high range (USD)" yLabel="Score" xFormat={(v) => `$${v}`}
          dots={data.keywords.filter((k) => k.bid_high != null).map((k) => ({
            id: k.keyword, x: k.bid_high as number, y: k.score, r: (k.kp_value ?? 0) >= 5000 ? 7 : (k.kp_value ?? 0) >= 500 ? 5.5 : 4, color: TIER_COLOR[k.tier] || "#8a95a1",
            lines: [k.keyword, `${k.volume} searches/mo · ${k.tier} · score ${k.score}`, `Bids ${money(k.bid_low)} – ${money(k.bid_high)}`, k.page],
          }))}
        />
      </div>

      <div className={s.grid2}>
        <div className={s.card}>
          <h2 className={s.h2}>Keywords mapped to each page</h2>
          <div className={s.legend}><span><i className={s.swatch} style={{ background: "#0f766e", opacity: 0.3 }} />All keywords</span><span><i className={s.swatch} style={{ background: "#0f766e" }} />Tier 1</span></div>
          <HBarChart bars={a.pages} label="Keywords mapped to each page with Tier 1 share" format={(v) => String(v)} />
        </div>
        <div className={s.card}>
          <h2 className={s.h2}>Average top bid by page</h2>
          <p className={s.muted}>Mean of the high top-of-page bid across each page&rsquo;s commercial keywords. A higher bid means the searches are worth more to advertisers.</p>
          <HBarChart bars={a.bidByPage} label="Average high top-of-page bid per page" format={(v) => `$${v.toFixed(2)}`} color="#2f6fb3" />
        </div>
      </div>

      <div className={s.card}>
        <h2 className={s.h2}>Quick wins: low Ads competition, high bids</h2>
        <p className={s.muted}>Commercial keywords where Keyword Planner shows Low competition but a top-of-page bid of $30 or more.</p>
        <KeywordTable rows={a.quickWins} compact />
      </div>

      <div className={s.card}>
        <h2 className={s.h2}>Top 10 opportunities</h2>
        <KeywordTable rows={top} compact />
      </div>
    </section>
  );
}

function Kpi({ label, value, note, bad }: { label: string; value: string; note: string; bad?: boolean }) {
  return (
    <div className={s.card}>
      <span className={s.muted}>{label}</span>
      <span className={`${s.kpiValue} ${bad ? s.kpiBad : ""}`}>{value}</span>
      <span className={s.muted}>{note}</span>
    </div>
  );
}

function KeywordTable({ rows, compact }: { rows: Keyword[]; compact?: boolean }) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Keyword</th><th>Searches / mo</th>
            {!compact && <><th>3-mo</th><th>YoY</th></>}
            <th>Ads competition</th>
            {!compact && <th className={s.num}>Comp. index</th>}
            <th className={s.num}>Bid low</th><th className={s.num}>Bid high</th>
            {!compact && <><th>Intent</th><th>Role</th></>}
            <th className={s.num}>Score</th><th>Tier</th><th>Target page</th>
            {!compact && <><th>On page 1?</th><th>Who ranks now (top 5)</th><th>Notes</th></>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.keyword}>
              <td className={s.kw}>{r.keyword}</td><td>{dash(r.volume)}</td>
              {!compact && <><td>{dash(r.change_3m)}</td><td>{dash(r.change_yoy)}</td></>}
              <td>{dash(r.competition)}</td>
              {!compact && <td className={s.num}>{dash(r.comp_index)}</td>}
              <td className={s.num}>{money(r.bid_low)}</td><td className={s.num}>{money(r.bid_high)}</td>
              {!compact && <><td>{r.intent}</td><td>{r.role}</td></>}
              <td className={s.num}>{r.score.toFixed(2)}</td><td><Pill text={r.tier} cls={TIER_CLS[r.tier]} /></td><td>{r.page}</td>
              {!compact && <><td>{r.ofc_rank}</td><td className={s.wrapCell}>{dash(r.top_results)}</td><td className={s.wrapCell}>{dash(r.notes)}</td></>}
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={16}>No keywords match these filters.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function KeywordsTab({ data }: { data: SeoBundle }) {
  const [q, setQ] = useState("");
  const [tier, setTier] = useState("");
  const [page, setPage] = useState("");
  const [intent, setIntent] = useState("");
  const [sort, setSort] = useState<"score" | "kp_value" | "bid_high" | "keyword">("score");
  const pages = useMemo(() => [...new Set(data.keywords.map((k) => k.page))].sort(), [data]);
  const intents = useMemo(() => [...new Set(data.keywords.map((k) => k.intent))].sort(), [data]);
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const r = data.keywords.filter((k) => (!needle || k.keyword.includes(needle) || k.page.toLowerCase().includes(needle)) && (!tier || k.tier === tier) && (!page || k.page === page) && (!intent || k.intent === intent));
    return r.sort((x, y) => (sort === "keyword" ? x.keyword.localeCompare(y.keyword) : ((y[sort] as number) ?? -1) - ((x[sort] as number) ?? -1)));
  }, [data, q, tier, page, intent, sort]);
  return (
    <section className={s.section}>
      <div className={s.card}>
        <h2 className={s.h2}>Master keyword database</h2>
        <p className={s.muted}>The reviewed keyword list, with every Keyword Planner metric, its score and the page it belongs on.</p>
        <div className={s.controls}>
          <label className={s.label} htmlFor="kw-q">Search<input id="kw-q" className={s.input} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. fba, kitting" /></label>
          <Select id="kw-tier" label="Tier" value={tier} onChange={setTier} options={TIERS} all="All tiers" />
          <Select id="kw-page" label="Target page" value={page} onChange={setPage} options={pages} all="All pages" />
          <Select id="kw-intent" label="Intent" value={intent} onChange={setIntent} options={intents} all="All intents" />
          <label className={s.label} htmlFor="kw-sort">Sort by
            <select id="kw-sort" className={s.select} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
              <option value="score">Score</option><option value="kp_value">Search volume</option><option value="bid_high">Top bid (high)</option><option value="keyword">Keyword A–Z</option>
            </select>
          </label>
        </div>
        <p className={s.muted}>Showing {rows.length} of {data.keywords.length} keywords</p>
        <KeywordTable rows={rows} />
      </div>
    </section>
  );
}

function Select({ id, label, value, onChange, options, all }: { id: string; label: string; value: string; onChange: (v: string) => void; options: string[]; all?: string }) {
  return (
    <label className={s.label} htmlFor={id}>{label}
      <select id={id} className={s.select} value={value} onChange={(e) => onChange(e.target.value)}>
        {all !== undefined && <option value="">{all}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function PageMapTab({ data }: { data: SeoBundle }) {
  const [pick, setPick] = useState(data.onpage[0]?.page || "");
  const op = data.onpage.find((p) => p.page === pick);
  return (
    <section className={s.section}>
      <div className={s.card}>
        <h2 className={s.h2}>One primary keyword per page</h2>
        <p className={s.muted}>Each page gets its own primary keyword so pages don&rsquo;t compete with each other in Google.</p>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Page</th><th>Primary keyword</th><th>Searches / mo</th><th>Bid range</th><th>Ads competition</th><th>Priority</th><th>Secondary keywords</th><th>Long-tail keywords</th><th>Target audience</th><th>Keyword gap</th></tr></thead>
            <tbody>
              {data.pages.map((p) => (
                <tr key={p.page}>
                  <td className={s.kw}>{p.page}</td><td>{p.primary}</td><td>{p.volume}</td><td>{p.bid_range}</td><td>{p.competition}</td><td><Pill text={p.priority} cls={priCls(p.priority)} /></td>
                  <td className={s.wrapCell}>{dash(p.secondary)}</td><td className={s.wrapCell}>{dash(p.longtail)}</td><td className={s.wrapCell}>{p.audience}</td><td className={s.wrapCell}>{p.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={s.card}>
        <h2 className={s.h2}>On-page recommendations</h2>
        <div className={s.controls}><Select id="op-page" label="Page" value={pick} onChange={setPick} options={data.onpage.map((p) => p.page)} /></div>
        {op && (
          <dl className={s.dl}>
            <dt>URL</dt><dd>{op.url}</dd>
            <dt>Primary keyword</dt><dd>{op.primary}</dd>
            <dt>SEO title</dt><dd>{op.title} <span className={s.chip}>{op.title_len} chars</span></dd>
            <dt>Meta description</dt><dd>{op.meta} <span className={s.chip}>{op.meta_len} chars</span></dd>
            <dt>H1</dt><dd>{op.h1}</dd>
            <dt>H2 / H3 outline</dt><dd><ul className={s.list}>{op.structure.split("|").map((x) => x.trim()).filter(Boolean).map((x) => <li key={x}>{x}</li>)}</ul></dd>
            <dt>Keyword placement</dt><dd>{op.primary_placement}</dd>
            <dt>Secondary keywords</dt><dd>{op.secondary_placement}</dd>
            <dt>Related terms</dt><dd>{op.entities}</dd>
            <dt>FAQ ideas</dt><dd>{op.faq}</dd>
            <dt>Internal links to add</dt><dd>{op.links}</dd>
            <dt>External references</dt><dd>{op.references}</dd>
            <dt>Image alt text</dt><dd>{op.alt}</dd>
            <dt>Schema</dt><dd>{op.schema}</dd>
            <dt>Call to action</dt><dd>{op.cta}</dd>
          </dl>
        )}
      </div>

      <div className={s.card}>
        <h2 className={s.h2}>Overlapping pages and how to split them</h2>
        <SimpleTable cols={[["conflict", "Overlap", s.kw], ["keywords", "Keywords at risk", s.wrapCell], ["decision", "Decision"], ["assignment", "How to assign them", s.wrapCell], ["priority", "Priority"]]} rows={data.cannibal} keyField="conflict" pill="priority" />
      </div>
      <div className={s.card}>
        <h2 className={s.h2}>Internal links to add</h2>
        <SimpleTable cols={[["source", "From"], ["destination", "To"], ["anchor", "Anchor text"], ["reason", "Why", s.wrapCell]]} rows={data.links} keyField="n" />
      </div>
    </section>
  );
}

function SimpleTable<T extends Record<string, unknown>>({ cols, rows, keyField, pill }: { cols: [string, string, string?][]; rows: T[]; keyField: string; pill?: string }) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead><tr>{cols.map(([k, l]) => <th key={k}>{l}</th>)}</tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r[keyField])}>
              {cols.map(([k, , cls]) => <td key={k} className={cls}>{k === pill ? <Pill text={String(r[k])} cls={priCls(String(r[k]))} /> : dash(r[k])}</td>)}
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={cols.length}>Nothing matches these filters.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function CompetitorsTab({ data, a }: { data: SeoBundle; a: Analysis }) {
  const [pick, setPick] = useState(data.competitors[0]?.name || "");
  const c = data.competitors.find((x) => x.name === pick);
  return (
    <section className={s.section}>
      <div className={s.card}>
        <h2 className={s.h2}>Which competitors have a page for each service</h2>
        <p className={s.muted}>From each competitor&rsquo;s sitemap and pages on 27 Nov 2026. &ldquo;Blog only&rdquo; means a blog post or bullet point, not a service page. OneFulfillCenter has a dedicated page for all 11 services shown.</p>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Competitor</th>{[...SERVICES, ...EXTRA].map(([k, l]) => <th key={k}>{l}</th>)}</tr></thead>
            <tbody>
              <tr><td className={s.kw}>OneFulfillCenter</td>{SERVICES.map(([k]) => <td key={k}><Pill text="Yes" cls={s.yes} /></td>)}<td><Pill text="No" cls={s.no} /></td><td><Pill text="No" cls={s.no} /></td><td><Pill text="No" cls={s.no} /></td></tr>
              {data.competitors.map((r) => (
                <tr key={r.name}><td className={s.kw}>{shortName(r.name)}</td>{[...SERVICES, ...EXTRA].map(([k]) => <td key={k}><Pill text={covText(r[k])} cls={s[covKind(r[k])]} /></td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={s.grid2}>
        <div className={s.card}>
          <h2 className={s.h2}>Competitors without a dedicated service page</h2>
          <p className={s.muted}>Out of 10. The longer the bar, the less the competition has invested in that topic.</p>
          <HBarChart bars={a.coverage} label="Number of competitors without a dedicated page per service" format={(v) => `${v} of 10`} color="#b7791f" />
        </div>
        <div className={s.card}>
          <h2 className={s.h2}>Page-1 appearances in the checked keywords</h2>
          <p className={s.muted}>How many of the {a.checked} checked keywords each competitor ranked for on page 1.</p>
          <HBarChart bars={a.competitorPresence} label="Page-1 appearances per competitor" color="#2f6fb3" />
        </div>
      </div>

      <div className={s.card}>
        <h2 className={s.h2}>Competitor profile</h2>
        <div className={s.controls}><Select id="comp-pick" label="Competitor" value={pick} onChange={setPick} options={data.competitors.map((x) => x.name)} /></div>
        {c && (
          <dl className={s.dl}>
            <dt>Domain</dt><dd>{c.domain}</dd>
            <dt>Positioning</dt><dd>{c.positioning}</dd>
            <dt>Content patterns</dt><dd>{dash(c.patterns)}</dd>
            <dt>Services without a dedicated page</dt><dd>{dash(c.not_found)}</dd>
            <dt>Industries</dt><dd>{dash(c.industries)}</dd>
            <dt>Claims (as stated on their site)</dt><dd>{dash(c.claims)}</dd>
          </dl>
        )}
      </div>

      <div className={s.card}>
        <h2 className={s.h2}>Keyword gap: who is on page 1</h2>
        <p className={s.muted}>Position held in the Google US results captured on 27 Nov 2026. A dash means not in the observed top results.</p>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Keyword</th><th>Searches / mo</th>{GAP_SITES.map(([k, l]) => <th key={k}>{l}</th>)}<th>Ranked #1</th></tr></thead>
            <tbody>
              {data.gap.map((g) => (
                <tr key={g.keyword}>
                  <td className={s.kw}>{g.keyword}</td><td>{g.volume}</td>
                  {GAP_SITES.map(([k]) => { const m = String(g[k]).match(/^#\d+/); return <td key={k}>{m ? <Pill text={m[0]} cls={s.yes} /> : "—"}</td>; })}
                  <td>{g.top1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={s.card}>
        <h2 className={s.h2}>What to do about each gap</h2>
        <SimpleTable cols={[["keywords", "Keywords", s.kw], ["why", "Why it matters"], ["winning", "Who is winning", s.wrapCell], ["action", "What to build or improve", s.wrapCell], ["difficulty", "Difficulty"]]} rows={data.gapnotes} keyField="n" />
      </div>
    </section>
  );
}

function SerpTab({ data }: { data: SeoBundle }) {
  const kws = useMemo(() => [...new Set(data.serp.map((r) => r.keyword))], [data]);
  const [k, setK] = useState(kws[0] || "");
  const rows = data.serp.filter((r) => r.keyword === k);
  const first = rows[0];
  const paa = first?.paa ? first.paa.split(";").map((x) => x.trim()).filter(Boolean) : [];
  const types = new Map<string, number>();
  rows.forEach((r) => types.set(r.page_type, (types.get(r.page_type) || 0) + 1));
  return (
    <section className={s.section}>
      <div className={s.card}>
        <h2 className={s.h2}>Live Google results (US)</h2>
        <p className={s.muted}>Captured from Google.com on 27 Nov 2026 with personalization off. A snapshot: results move, and the browser&rsquo;s location can affect them.</p>
        <div className={s.controls}><Select id="serp-kw" label="Keyword" value={k} onChange={setK} options={kws} /></div>
        {first?.rewards && <p><b>What Google rewards here:</b> {first.rewards}</p>}
        <p className={s.muted}>Page types on page 1: {[...types.entries()].map(([t, n]) => `${t} (${n})`).join(" · ")}</p>
        <div className={s.grid2}>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead><tr><th className={s.num}>#</th><th>Domain</th><th>Result (path shortened)</th><th>Page type</th></tr></thead>
              <tbody>{rows.map((r) => <tr key={r.position}><td className={s.num}>{r.position}</td><td className={s.kw}>{r.domain}</td><td className={s.wrapCell}>{r.url}</td><td>{r.page_type}</td></tr>)}</tbody>
            </table>
          </div>
          <div className={s.card}>
            <h3 className={s.h3}>{paa.length ? "People also ask" : "No “People also ask” questions captured"}</h3>
            {!!paa.length && <ul className={s.list}>{paa.map((x) => <li key={x}>{x}</li>)}</ul>}
            <p className={s.muted}>Use these as FAQ questions on the matching page.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteTab({ data }: { data: SeoBundle }) {
  const [flag, setFlag] = useState("");
  const [type, setType] = useState("");
  const types = useMemo(() => [...new Set(data.site.map((r) => r.type))].sort(), [data]);
  const rows = data.site.filter((r) => (!flag || r.flag === flag) && (!type || r.type === type));
  const byType = types.map((t) => ({ label: t, value: data.site.filter((r) => r.type === t).length, overlay: data.site.filter((r) => r.type === t && r.flag === "Issue").length }));
  return (
    <section className={s.section}>
      <div className={s.grid2}>
        <div className={s.card}>
          <h2 className={s.h2}>URLs by type, with issues</h2>
          <div className={s.legend}><span><i className={s.swatch} style={{ background: "#b42318", opacity: 0.3 }} />All URLs</span><span><i className={s.swatch} style={{ background: "#b42318" }} />With an issue</span></div>
          <HBarChart bars={byType.map((b) => ({ ...b, note: `(${b.overlay} with issues)` }))} label="URLs per page type with issue count" color="#b42318" />
        </div>
        <div className={s.card}>
          <h2 className={s.h2}>Fix first</h2>
          <ul className={s.findings}>
            <li>Remove the 3 redirecting URLs from <code>sitemap.ts</code>: /inventory-management/, /temperature-controlled-storage/, /kitting-assembly/.</li>
            <li>301 the two thin <code>/solutions/</code> pages to /warehousing/ and /b2b-fulfillment/.</li>
            <li>Rewrite the homepage title and H1 to target &ldquo;3pl services&rdquo;.</li>
            <li>Add an About page and a real Contact page (/contact-us/ currently redirects to a newsletter form), and an H1 on /request-demo/.</li>
            <li>Refresh outdated posts (a 2024 &ldquo;future&rdquo; post, UK spelling, grammar in titles).</li>
          </ul>
        </div>
      </div>
      <div className={s.card}>
        <h2 className={s.h2}>Website SEO inventory</h2>
        <div className={s.controls}>
          <label className={s.label} htmlFor="site-flag">Show
            <select id="site-flag" className={s.select} value={flag} onChange={(e) => setFlag(e.target.value)}><option value="">All URLs</option><option value="Issue">Only URLs with an issue</option></select>
          </label>
          <Select id="site-type" label="Page type" value={type} onChange={setType} options={types} all="All types" />
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Path</th><th>Type</th><th>HTTP</th><th>Status</th><th>Title (live)</th><th>H1 (live)</th><th className={s.num}>Words</th><th>Recommended primary keyword</th><th>Issue / note</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.url}>
                  <td className={s.kw}>{r.path}</td><td>{r.type}</td><td>{r.status}</td><td><Pill text={r.flag} cls={r.flag === "Issue" ? s.warn : s.yes} /></td>
                  <td className={s.wrapCell}>{dash(r.title).replace(/&amp;/g, "&")}</td><td className={s.wrapCell}>{dash(r.h1).replace(/&amp;/g, "&")}</td><td className={s.num}>{dash(r.words)}</td><td>{dash(r.primary)}</td><td className={s.wrapCell}>{dash(r.issue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className={s.note}>The homepage claims &ldquo;1–2 day ground delivery to 99% of US customers&rdquo; and shows 66 map locations, including 5 &ldquo;Primary Superhubs&rdquo;. The only address in the site&rsquo;s schema is Kissimmee, FL. Confirm which facilities you operate before building location pages or repeating these claims.</p>
    </section>
  );
}

function PlanTab({ data }: { data: SeoBundle }) {
  const [stage, setStage] = useState("");
  const stages = useMemo(() => [...new Set(data.roadmap.map((r) => r.stage))], [data]);
  return (
    <section className={s.section}>
      <div className={s.grid3}>
        {stages.filter((x) => x.startsWith("Days")).map((st) => (
          <div key={st} className={s.card}>
            <span className={s.eyebrow}>{st}</span>
            <span className={s.kpiValue}>{data.roadmap.filter((r) => r.stage === st).length}</span>
            <span className={s.muted}>actions planned</span>
          </div>
        ))}
      </div>
      <div className={s.card}>
        <h2 className={s.h2}>90-day roadmap</h2>
        <div className={s.controls}><Select id="rm-stage" label="Stage" value={stage} onChange={setStage} options={stages} all="All stages" /></div>
        <SimpleTable cols={[["stage", "Stage", s.kw], ["workstream", "Workstream"], ["action", "Action", s.wrapCell], ["owner", "Owner"], ["kpi", "How to measure it", s.wrapCell]]} rows={data.roadmap.filter((r) => !stage || r.stage === stage)} keyField="step" />
        <p className={s.muted}>No first-page or #1 ranking is promised within 90 days.</p>
      </div>
      <div className={s.card}>
        <h2 className={s.h2}>New pages to create</h2>
        <SimpleTable cols={[["url", "Proposed URL", s.kw], ["primary", "Primary keyword"], ["volume", "Searches / mo"], ["bid_range", "Bid range"], ["priority", "Priority"], ["evidence", "Why", s.wrapCell], ["structure", "Content outline", s.wrapCell], ["competitors", "Competitor pages", s.wrapCell]]} rows={data.newpages} keyField="url" pill="priority" />
      </div>
      <div className={s.card}>
        <h2 className={s.h2}>Blog posts to publish</h2>
        <SimpleTable cols={[["keyword", "Target keyword", s.kw], ["volume", "Searches / mo"], ["title", "Proposed title", s.wrapCell], ["url", "URL"], ["service_page", "Links to"], ["priority", "Priority"], ["notes", "Notes", s.wrapCell]]} rows={data.blog} keyField="keyword" pill="priority" />
      </div>
    </section>
  );
}

function ExplorerTab() {
  const [rows, setRows] = useState<KpRaw[] | null>(null);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [theme, setTheme] = useState("");
  const [min, setMin] = useState("0");
  useEffect(() => {
    fetch("/seo-dashboard/kp-raw.json").then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); }).then(setRows).catch(() => setErr("The Keyword Planner file failed to load. Reload the page to try again."));
  }, []);
  const themes = useMemo(() => (rows ? [...new Set(rows.map((r) => r.theme))].filter(Boolean).sort() : []), [rows]);
  const filtered = useMemo(() => {
    if (!rows) return [];
    const n = q.trim().toLowerCase(), m = Number(min);
    return rows.filter((r) => (!n || r.keyword.includes(n)) && (!theme || r.theme === theme) && (Number(r.kp_value) || 0) >= m);
  }, [rows, q, theme, min]);
  return (
    <section className={s.section}>
      <div className={s.card}>
        <h2 className={s.h2}>All Keyword Planner ideas</h2>
        <p className={s.muted}>Every idea from the 16 exports that matched a service theme (5,431 of 8,841). Theme and intent here were assigned automatically from word patterns, so check before relying on them. The Keywords tab holds the reviewed list.</p>
        <div className={s.controls}>
          <label className={s.label} htmlFor="ex-q">Search<input id="ex-q" className={s.input} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. prep center" /></label>
          <Select id="ex-theme" label="Theme" value={theme} onChange={setTheme} options={themes} all="All themes" />
          <label className={s.label} htmlFor="ex-min">Minimum searches
            <select id="ex-min" className={s.select} value={min} onChange={(e) => setMin(e.target.value)}>
              <option value="0">Any</option><option value="50">10–100 or more</option><option value="500">100–1K or more</option><option value="5000">1K–10K or more</option>
            </select>
          </label>
        </div>
        {err && <p className={s.note}>{err}</p>}
        {!rows && !err && <p className={s.muted}>Loading 5,431 keyword ideas…</p>}
        {rows && <p className={s.muted}>{fmt(filtered.length)} of {fmt(rows.length)} ideas match{filtered.length > 300 ? " · showing the 300 with the most searches" : ""}</p>}
        {rows && (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead><tr><th>Keyword</th><th>Searches / mo</th><th>3-mo</th><th>YoY</th><th>Ads competition</th><th className={s.num}>Bid low</th><th className={s.num}>Bid high</th><th>Theme (auto)</th><th>Intent (auto)</th><th>Seed group</th></tr></thead>
              <tbody>
                {filtered.slice(0, 300).map((r) => (
                  <tr key={r.keyword}><td className={s.kw}>{r.keyword}</td><td>{r.volume}</td><td>{dash(r.change_3m)}</td><td>{dash(r.change_yoy)}</td><td>{dash(r.competition)}</td><td className={s.num}>{money(r.bid_low)}</td><td className={s.num}>{money(r.bid_high)}</td><td>{r.theme}</td><td>{r.intent}</td><td>{r.seed_groups}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
