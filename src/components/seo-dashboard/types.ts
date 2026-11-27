export type Keyword = {
  keyword: string;
  volume: string;
  kp_value: number | null;
  change_3m: string;
  change_yoy: string;
  competition: string;
  comp_index: number | null;
  bid_low: number | null;
  bid_high: number | null;
  intent: string;
  role: string;
  ofc_rank: string;
  top_results: string;
  relevance: number;
  conversion: number;
  commercial: number;
  demand: number;
  feasibility: number;
  score: number;
  tier: string;
  page: string;
  url: string;
  notes: string;
};

export type PageMap = {
  page: string; url: string; purpose: string; audience: string; primary: string; volume: string;
  bid_range: string; competition: string; secondary: string; longtail: string; intent: string;
  current_rank: string; competitor_urls: string; gap: string; priority: string;
};

export type SiteUrl = { url: string; path: string; type: string; status: string; title: string; h1: string; words: number | null; schema: string; primary: string; issue: string; flag: string };

export type Competitor = {
  name: string; domain: string; positioning: string; industries: string; patterns: string; not_found: string; claims: string;
  [service: string]: string;
};

export type SerpRow = { keyword: string; position: number; url: string; domain: string; page_type: string; paa: string; local_pack: string; rewards: string };
export type GapRow = { keyword: string; volume: string; competition: string; bid_range: string; top1: string; others: string; [site: string]: string };
export type GapNote = { n: number; keywords: string; why: string; winning: string; page_type: string; action: string; difficulty: string };
export type NewPage = { url: string; primary: string; volume: string; bid_range: string; competition: string; intent: string; customer: string; competitors: string; evidence: string; structure: string; links: string; priority: string };
export type BlogRow = { keyword: string; volume: string; competition: string; intent: string; title: string; url: string; secondary: string; service_page: string; cta: string; priority: string; notes: string };
export type CannibalRow = { conflict: string; urls: string; keywords: string; decision: string; assignment: string; priority: string };
export type OnPage = { page: string; url: string; primary: string; title: string; title_len: number; meta: string; meta_len: number; h1: string; structure: string; primary_placement: string; secondary_placement: string; entities: string; sections: string; faq: string; links: string; references: string; alt: string; schema: string; cta: string };
export type LinkRow = { n: number; source: string; destination: string; anchor: string; reason: string };
export type RoadmapRow = { step: number; stage: string; workstream: string; action: string; owner: string; notes: string; kpi: string };

export type KpRaw = {
  keyword: string; volume: string; kp_value: number; change_3m: string; change_yoy: string; competition: string;
  comp_index: string; bid_low: number | null; bid_high: number | null; theme: string; intent: string; seed_groups: string;
};

export type SeoBundle = {
  keywords: Keyword[]; pages: PageMap[]; site: SiteUrl[]; competitors: Competitor[]; serp: SerpRow[]; gap: GapRow[];
  gapnotes: GapNote[]; newpages: NewPage[]; blog: BlogRow[]; cannibal: CannibalRow[]; onpage: OnPage[]; links: LinkRow[]; roadmap: RoadmapRow[];
};
