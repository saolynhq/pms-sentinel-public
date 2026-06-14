// Loads the card manifest. At build time, fetches MANIFEST_URL (the R2/public URL of
// cards/manifest.json) when set; otherwise falls back to the bundled sample so the site
// builds locally without infrastructure.
import sample from "../data/manifest.sample.json";

export interface Severity { death: number; injury: number; malfunction: number; other: number; }
export interface FailureMode { imdrf_code: string | null; label: string; count: number; }
export interface AiMode { mode: string; count: number; }
export interface CoverageRow { source: string; status: string; detail: string; period: string | null; }
export interface Highlight {
  title: string; publication_date: string | null; study_design: string;
  cohort_size: number | null; is_preprint: boolean; source_ref: string | null;
}
export interface Card {
  card_scope: string; card_version: string; generated_at: string;
  freshness_watermark: string | null;
  title: {
    device_name: string; indication: string | null; manufacturer: string;
    fda_clearance_date: string | null; business_key: string;
    fda_product_code: string | null; device_class: string; methodology_url: string;
  };
  coverage_panel: CoverageRow[];
  maude: {
    rolling_12mo: Severity; cumulative: Severity;
    window_start: string | null; window_end: string | null;
    top_failure_modes: FailureMode[]; ai_failure_modes: AiMode[];
  };
  literature: {
    pubmed_count: number; epmc_count: number; preprint_count: number;
    highlights: Highlight[];
    deployment_positive: number; deployment_mixed: number; deployment_negative: number;
  };
  coverage_transparency: Record<string, unknown>;
  right_of_reply: { served_on: string | null; response_text: string | null };
  narrative: string | null;
  content_hash?: string;
}
export interface Manifest { generated_at: string; count: number; cards: Card[]; }

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

declare const process: { env: Record<string, string | undefined> };

export async function getManifest(): Promise<Manifest> {
  const url =
    (typeof process !== "undefined" ? process.env.MANIFEST_URL : undefined) ??
    (import.meta.env.MANIFEST_URL as string | undefined);
  if (url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`manifest fetch failed: ${res.status}`);
    return (await res.json()) as Manifest;
  }
  return sample as Manifest;
}
