import { NextResponse } from "next/server";
import { PRESET_BRANDS, BrandProfile, StoreLocation } from "@/lib/stores-data";
import { fetchStoreCulturalIntelligence } from "@/lib/qloo-client";
import {
  generateStoreActivationBrief,
  getGroqApiKey,
  callGroqChat,
} from "@/lib/agent-planner";

export const maxDuration = 30;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    // Live OpenStreetMap Nominatim Geocoder for "Add Store" Modal
    if (action === "geocode") {
      const q = searchParams.get("q")?.trim();
      if (!q) {
        return NextResponse.json(
          { ok: false, error: "Missing query parameter 'q'" },
          { status: 400 }
        );
      }

      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        q
      )}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "LOCALE-Qloo-Hackathon-App/1.0",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(5000),
      });

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        return NextResponse.json({
          ok: false,
          error: `Could not geocode "${q}"`,
        });
      }

      return NextResponse.json({
        ok: true,
        lat: Number(parseFloat(data[0].lat).toFixed(5)),
        lng: Number(parseFloat(data[0].lon).toFixed(5)),
        displayName: data[0].display_name,
      });
    }

    return NextResponse.json({
      ok: true,
      service: "LOCALE Multi-Store Cultural OS API",
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "GET request failed" },
      { status: 500 }
    );
  }
}

function generateIntelligentCopilotAnswer(body: any): string {
  const isGeneric = body.mode === "generic_llm";
  const qLower = String(body.question || "").toLowerCase();
  const brand = body.brandName || "the brand";
  const neigh = body.storeNeighborhood || "this neighborhood";
  const partnerVenue = body.qlooPartnerVenue || "the local partner venue";
  const venueDist = body.qlooVenueDistanceKm ?? "0.78";
  const surge = body.qlooLeadSurge || "the local surge artist";
  const core = body.qlooLeadCore || "the brand core anchor";
  const brandAffinity = body.qlooPartnerBrand || "the adjacent brand partner";
  const llmVenue = body.llmVenue || "a popular venue";
  const llmVerdict =
    body.llmVenueVerdict || "outside the walkable neighborhood zone";
  const llmArtists = (
    body.llmArtists || ["Mitski", "Phoebe Bridgers", "Mac DeMarco"]
  ).join(", ");

  if (
    qLower.includes("<=1.2km") ||
    qLower.includes("partner venue") ||
    qLower.includes("pick this")
  ) {
    if (isGeneric) {
      return `As an un-grounded LLM, I recommended "${llmVenue}" based purely on broad city notoriety. Because I lack geospatial coordinates and local foot-traffic affinity data, my suggestion was flagged by OpenStreetMap audit: ${llmVerdict}.\n\nGeneric language models rely on statistical word associations rather than real demographic overlap, which often leads to picking venues miles away across water or city boundaries.`;
    }
    return `For ${brand} in ${neigh}, Qloo's taste graph identified ${partnerVenue} at ${venueDist} km straight-line Haversine distance, well within the 1.25 km walkable catchment ring.\n\nUnlike generic AI that guesses tourist hotspots, Qloo mathematically validates cross-domain demographic affinity between ${brand}'s visitors and ${partnerVenue}'s patron base, while enforcing our strict non-competing business filter.`;
  }

  if (qLower.includes("flagged") || qLower.includes("generic llm's venue")) {
    if (isGeneric) {
      return `My suggestion of "${llmVenue}" was flagged because I do not verify physical geographic coordinates or retail trade radii. In this store's case, the automated audit confirmed: ${llmVerdict}.\n\nWithout access to a dedicated taste and geospatial graph, generic LLMs frequently recommend venues that are too far away for retail foot traffic or in completely different sub-markets.`;
    }
    return `The generic LLM suggested "${llmVenue}", which our automated OpenStreetMap Nominatim audit flagged as: ${llmVerdict}.\n\nStandard language models hallucinate venues that exceed pedestrian thresholds (often 2–4 km away) or are direct competitors. LOCALE's Critic Gate enforces physical Haversine distance boundaries alongside Qloo affinity scores to ensure 100% verified partnerships.`;
  }

  if (
    qLower.includes("brand core") ||
    qLower.includes("local surge") ||
    qLower.includes("work")
  ) {
    if (isGeneric) {
      return `Generic LLMs suffer from "cultural beige"—we tend to recommend the same 4–5 mainstream indie artists (${llmArtists}) for every store regardless of whether it is in Brooklyn, Tokyo, Austin, or Berlin.\n\nBecause we don't have separate national and localized taste signals, our outputs fail to adapt to neighborhood subcultures.`;
    }
    return `LOCALE decouples retail programming into two mathematical layers: 1) A Brand Core Anchor (~50% fleet consistency) anchored by ${core} to protect brand identity across all locations, and 2) A Local Surge Layer (ΔRank > 0) spotlighting ${surge}, who jumps significantly higher in local neighborhood affinity compared to national baselines.\n\nThis gives each store manager an activation that feels native to ${neigh} while maintaining chain-wide brand integrity.`;
  }

  // General questions
  if (isGeneric) {
    return `From a generic LLM perspective, I can only provide high-level recommendations for ${brand} in ${neigh} based on broad internet data (suggesting artists like ${llmArtists} and venue "${llmVenue}"). I cannot compute statistical lift or verify local trade areas.`;
  }
  return `For ${brand} at ${neigh}, LOCALE leverages Qloo's Taste Graph to pair ${core} (Brand Core Anchor) with ${surge} (Local Surge Layer). On the ground, we activate with ${partnerVenue} (${venueDist} km away) and partner brand ${brandAffinity}, delivering 100% verified cultural alignment.`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Live Groq-Powered Bird Copilot Handler (Qloo Grounded vs. Generic LLM)
    if (body.action === "copilot_ask") {
      const groqKey = getGroqApiKey();
      const fallbackAnswer = generateIntelligentCopilotAnswer(body);

      if (!groqKey) {
        return NextResponse.json({
          ok: true,
          answer: fallbackAnswer,
        });
      }

      const isGeneric = body.mode === "generic_llm";
      const systemPrompt = isGeneric
        ? `You are an un-grounded, generic LLM answering a question about retail programming for "${
            body.brandName
          }" in ${body.storeNeighborhood} (${
            body.storeCity
          }). You do NOT have access to Qloo's taste graph or local coordinates. Reference your generic suggested artists (${
            (body.llmArtists || []).join(", ") || "mainstream indie"
          }) and your suggested venue ("${
            body.llmVenue || "a popular local spot"
          }", OpenStreetMap audit: ${
            body.llmVenueVerdict || "unverified distance"
          }). Explain honestly why a generic LLM only relies on broad city stereotypes without geospatial affinity math. Keep your answer concise (2 short paragraphs).`
        : `You are LOCALE's Cultural Intelligence Copilot powered by Qloo's Taste Graph. Answer the user's question about "${
            body.brandName
          }" at ${body.storeNeighborhood} (${body.storeCity}).
Verified Qloo Taste Graph Data for this store:
- Lead Local Surge Artist: ${body.qlooLeadSurge || "Local Surge"}
- National Brand Core Anchor: ${body.qlooLeadCore || "Brand Core"}
- Immediate Neighborhood Partner Venue (<= 1.2km priority): ${
            body.qlooPartnerVenue || "Verified Venue"
          } (${
            body.qlooVenueDistanceKm ?? "0.5"
          } km straight-line Haversine distance)
- Co-Promo Brand: ${body.qlooPartnerBrand || "Verified Brand"}
- By contrast, the un-grounded LLM suggested "${
            body.llmVenue || "an unverified venue"
          }" (${body.llmVenueVerdict || "unverified"}).
Answer the question directly using these exact entities and numbers. Keep your answer concise, sharp, and executive (2 short paragraphs).`;

      let answer = "";
      try {
        answer = await callGroqChat(
          groqKey,
          systemPrompt,
          String(body.question || "How does Qloo improve this store brief?")
        );
      } catch {}

      return NextResponse.json({
        ok: true,
        answer: answer && answer.length > 20 ? answer : fallbackAnswer,
      });
    }

    // 2. Standard Store Intelligence & Activation Brief Pipeline
    const brand: BrandProfile =
      body.brand ||
      PRESET_BRANDS.find((b) => b.id === body.brandId) ||
      PRESET_BRANDS[0];

    const store: StoreLocation =
      body.store ||
      brand.stores.find((s) => s.id === body.storeId) ||
      brand.stores[0];

    const forceRefresh = Boolean(body.forceRefresh);

    const intel = await fetchStoreCulturalIntelligence(
      brand,
      store,
      forceRefresh
    );
    const brief = await generateStoreActivationBrief(brand, store, intel, true);

    return NextResponse.json({
      ok: true,
      storeId: store.id,
      brandId: brand.id,
      intel,
      brief,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Failed to generate store cultural intelligence",
      },
      { status: 500 }
    );
  }
}