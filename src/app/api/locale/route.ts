import { NextResponse } from "next/server";
import { PRESET_BRANDS, BrandProfile, StoreLocation } from "@/lib/stores-data";
import { fetchStoreCulturalIntelligence } from "@/lib/qloo-client";
import {
  generateStoreActivationBrief,
  getGroqApiKey,
  callGroqChat,
} from "@/lib/agent-planner";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Live Groq-Powered Bird Copilot Handler (Qloo Grounded vs. Generic LLM)
    if (body.action === "copilot_ask") {
      const groqKey = getGroqApiKey();
      if (!groqKey) {
        return NextResponse.json({
          ok: false,
          error: "Missing GROQ_API_KEY in .env or .env.local",
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

      const answer = await callGroqChat(
        groqKey,
        systemPrompt,
        String(body.question || "How does Qloo improve this store brief?")
      );

      return NextResponse.json({
        ok: true,
        answer:
          answer ||
          "Could not reach Groq live inference; check GROQ_API_KEY.",
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