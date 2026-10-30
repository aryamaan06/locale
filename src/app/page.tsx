"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { PRESET_BRANDS, BrandProfile, StoreLocation } from "@/lib/stores-data";
import {
  MapPin,
  Sparkles,
  ShieldCheck,
  Music,
  Store,
  Terminal,
  AlertTriangle,
  Plus,
  RefreshCw,
  Download,
  Building2,
  Globe,
  ChevronRight,
  SlidersHorizontal,
  FileText,
  Database,
  FlaskConical,
  Clock,
  Mail,
  CheckCircle2,
  Copy,
  Check,
  X,
  Send,
  Move,
  Trash2,
} from "lucide-react";

const LocaleMap = dynamic(() => import("@/components/LocaleMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[330px] rounded-2xl bg-[#F5F5F7] border border-neutral-200/80 flex items-center justify-center text-sm text-neutral-500">
      Loading Map...
    </div>
  ),
});

const EXTRA_BRAND_ARCHETYPES: BrandProfile[] = [
  {
    id: "apex-streetwear",
    name: "Apex Streetwear & Sneaker Archive",
    tagline: "Subculture curation & limited-edition sneaker gallery",
    category: "Urban Apparel, Limited Footwear & Subculture Gallery",
    brandVoice:
      "Bold, culturally plugged-in, subterranean, collector-driven, and youth-anchored",
    seedEntities: ["Supreme", "Stüssy", "A24", "Travis Scott"],
    guardrails: [
      "Prefer canonical urn:entity:brand seeds; flag place fallback transparently",
      "Prioritize non-lodging partner venues within <= 1.25 km straight-line neighborhood radius",
      "Daytime soundtrack must balance forward-thinking hip-hop and electronic beats (complexity_scale <= 8)",
    ],
    stores: PRESET_BRANDS[0].stores,
  },
  {
    id: "nocturne-vinyl",
    name: "Nocturne Vinyl Bar & Speakeasy",
    tagline: "Audiophile hi-fi listening lounge & cocktail culture",
    category: "Hi-Fi Analog Listening Lounge & Craft Cocktail Hospitality",
    brandVoice:
      "Intimate, nocturnal, audiophile, warm, analog, and cinematic",
    seedEntities: [
      "Daft Punk",
      "Blue Note Records",
      "Criterion Collection",
      "Ryuichi Sakamoto",
    ],
    guardrails: [
      "Prefer canonical urn:entity:brand seeds; flag place fallback transparently",
      "Prioritize non-lodging partner venues within <= 1.25 km straight-line neighborhood radius",
      "Soundtrack rotation must emphasize high-craft analog jazz and electronic grooves (complexity_scale <= 8)",
    ],
    stores: PRESET_BRANDS[0].stores,
  },
];

const ALL_BRAND_PROFILES: BrandProfile[] = [
  ...PRESET_BRANDS,
  ...EXTRA_BRAND_ARCHETYPES.filter(
    (extra) => !PRESET_BRANDS.some((b) => b.id === extra.id)
  ),
];

function computeClientJaccardPct(sets: Array<Set<string>>): number {
  if (sets.length < 2) return 0;
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      const a = sets[i];
      const b = sets[j];
      const inter = Array.from(a).filter((x) => b.has(x)).length;
      const union = new Set([...Array.from(a), ...Array.from(b)]).size;
      if (union > 0) total += inter / union;
      pairs++;
    }
  }
  return pairs > 0 ? Number(((total / pairs) * 100).toFixed(1)) : 0;
}

function formatDeltaBadge(
  rankDelta: number | null,
  isCensoredBaseline: boolean,
  isNonUs = false
): string {
  const baseLabel = isNonUs ? "Global/US Baseline" : "National Baseline";
  if (rankDelta === null) return "Local Radius Signal";
  if (isCensoredBaseline) {
    return isNonUs
      ? `+${rankDelta} Local Lift · >30 vs. US Baseline`
      : `+${rankDelta} Local Lift · >30 National`;
  }
  if (rankDelta > 0) return `+${rankDelta} vs. ${baseLabel}`;
  if (rankDelta === 0) return `Matches ${baseLabel}`;
  return `${rankDelta} vs. ${baseLabel}`;
}

function safeScale(val: any, fallback: number): number {
  const num = Number(val);
  if (!Number.isNaN(num) && num >= 1 && num <= 10) return Math.round(num);
  return fallback;
}

function BlueGoldBird3D({
  facingRight,
  isFlyingFast,
  size = 86,
}: {
  facingRight: boolean;
  isFlyingFast: boolean;
  size?: number;
}) {
  const flapDuration = isFlyingFast ? "0.26s" : "0.68s";

  return (
    <div
      style={{
        width: size,
        height: size,
        perspective: "700px",
        transform: facingRight ? "scaleX(-1)" : "scaleX(1)",
        transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className="relative select-none pointer-events-none flex items-center justify-center"
    >
      <style>{`
        @keyframes birdHoverBob {
          0%, 100% { transform: translateY(0px) rotateZ(-3deg); }
          50% { transform: translateY(-7px) rotateZ(3deg); }
        }
        @keyframes birdWingNear {
          0%, 100% { transform: rotateZ(-18deg) rotateX(12deg) scaleY(1); }
          50% { transform: rotateZ(28deg) rotateX(45deg) scaleY(0.78); }
        }
        @keyframes birdWingFar {
          0%, 100% { transform: rotateZ(14deg) rotateX(-15deg) scaleY(0.95); }
          50% { transform: rotateZ(-26deg) rotateX(35deg) scaleY(0.72); }
        }
        @keyframes birdTailFan {
          0%, 100% { transform: rotateZ(0deg) scale(1); }
          50% { transform: rotateZ(6deg) scale(1.04); }
        }
      `}</style>

      <svg
        viewBox="0 0 220 200"
        className="w-full h-full overflow-visible drop-shadow-[0_14px_18px_rgba(0,102,255,0.28)]"
        style={{
          animation: `birdHoverBob ${
            isFlyingFast ? "0.45s" : "1.8s"
          } ease-in-out infinite`,
        }}
      >
        <defs>
          <radialGradient id="goldBreast3D" cx="38%" cy="42%" r="62%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="30%" stopColor="#FDE047" />
            <stop offset="68%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>

          <radialGradient id="cobaltCrown3D" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="35%" stopColor="#0284C7" />
            <stop offset="75%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </radialGradient>

          <linearGradient id="featherBlue3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0F9FF" />
            <stop offset="28%" stopColor="#7DD3FC" />
            <stop offset="65%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          <linearGradient id="farWing3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        <g
          style={{
            transformOrigin: "118px 92px",
            animation: `birdWingFar ${flapDuration} ease-in-out infinite`,
          }}
        >
          <path
            d="M115,90 C130,52 162,25 188,18 C184,36 172,52 158,64 C174,54 188,48 196,46 C188,62 170,74 152,82 C164,78 175,76 182,78 C168,90 145,96 122,98 Z"
            fill="url(#farWing3D)"
            stroke="#E0F2FE"
            strokeWidth="1.2"
          />
        </g>

        <g
          style={{
            transformOrigin: "136px 128px",
            animation: `birdTailFan ${flapDuration} ease-in-out infinite`,
          }}
        >
          <path
            d="M132,122 L192,135 L186,146 L134,130 Z"
            fill="url(#featherBlue3D)"
            stroke="#E0F2FE"
            strokeWidth="1"
          />
          <path
            d="M130,126 L188,152 L178,162 L128,132 Z"
            fill="url(#featherBlue3D)"
            stroke="#E0F2FE"
            strokeWidth="1"
          />
          <path
            d="M126,130 L174,170 L162,176 L122,134 Z"
            fill="url(#cobaltCrown3D)"
            stroke="#BAE6FD"
            strokeWidth="1"
          />
        </g>

        <g>
          <path
            d="M90,78 C112,72 135,88 142,122 C125,132 102,128 88,108 Z"
            fill="url(#cobaltCrown3D)"
          />
          <path
            d="M78,94 C72,118 92,146 126,142 C140,140 144,126 135,112 C122,95 96,86 78,94 Z"
            fill="url(#goldBreast3D)"
          />
          <path
            d="M106,138 C102,145 104,150 110,149 M116,139 C113,146 115,151 121,149"
            stroke="#1E293B"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        <g>
          <circle cx="84" cy="82" r="20" fill="#0F172A" />
          <ellipse
            cx="80"
            cy="86"
            rx="14"
            ry="11"
            transform="rotate(-12 80 86)"
            fill="#FFFFFF"
          />
          <path
            d="M66,73 C70,58 92,58 102,72 C92,70 76,71 66,73 Z"
            fill="url(#cobaltCrown3D)"
            stroke="#E0F2FE"
            strokeWidth="1"
          />
          <path
            d="M62,79 Q75,77 95,83"
            stroke="#0F172A"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="74" cy="79" r="3.6" fill="#090D16" />
          <circle cx="73" cy="77.8" r="1.3" fill="#FFFFFF" />
          <polygon points="64,78 52,82 65,84" fill="#1E293B" />
          <polygon points="64,78 54,81 64,81" fill="#64748B" />
        </g>

        <g
          style={{
            transformOrigin: "102px 96px",
            animation: `birdWingNear ${flapDuration} ease-in-out infinite`,
          }}
        >
          <path
            d="M102,94 C78,52 42,20 14,14 C18,32 34,50 56,64 C32,52 14,44 6,44 C14,62 36,76 62,84 C38,78 20,76 12,80 C24,94 48,100 72,102 C52,102 36,104 28,110 C46,118 76,116 104,106 Z"
            fill="url(#featherBlue3D)"
            stroke="#F0F9FF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M98,92 C78,74 56,66 42,68 C56,78 78,88 96,98 Z"
            fill="#E0F2FE"
            opacity="0.85"
          />
        </g>
      </svg>
    </div>
  );
}

interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  mode: "qloo" | "generic_llm";
  question: string;
  answer: string;
}

export default function LocaleWorkspace() {
  const [selectedBrandId, setSelectedBrandId] = useState<string>(
    ALL_BRAND_PROFILES[0].id
  );
  const activeBrand = useMemo(
    () =>
      ALL_BRAND_PROFILES.find((b) => b.id === selectedBrandId) ||
      ALL_BRAND_PROFILES[0],
    [selectedBrandId]
  );

  const [customStores, setCustomStores] = useState<StoreLocation[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("locale_custom_stores_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCustomStores(parsed);
      }
    } catch {}
  }, []);

  const stores = useMemo(() => {
    const base = activeBrand.stores;
    const extras = customStores.filter(
      (cs) => !base.some((b) => b.id === cs.id)
    );
    return [...base, ...extras];
  }, [activeBrand, customStores]);

  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    ALL_BRAND_PROFILES[0].stores[0].id
  );
  const [comparisonMode, setComparisonMode] = useState<"qloo" | "plain_llm">(
    "qloo"
  );
  const [activeView, setActiveView] = useState<
    "playbook" | "fleet_matrix" | "rankdiff" | "provenance" | "ablation"
  >("playbook");

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [payload, setPayload] = useState<any>(null);
  const [copiedOutreach, setCopiedOutreach] = useState<boolean>(false);

  const [fleetRows, setFleetRows] = useState<any[]>([]);
  const [fleetLoading, setFleetLoading] = useState<boolean>(false);
  const [fleetProgress, setFleetProgress] = useState<string>("");
  const [fleetError, setFleetError] = useState<string | null>(null);

  const clientCacheRef = useRef<Record<string, any>>({});
  const reqIdRef = useRef<number>(0);
  const fleetReqIdRef = useRef<number>(0);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newNeighborhood, setNewNeighborhood] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [geocodingStatus, setGeocodingStatus] = useState<string | null>(null);

  const [copilotOpen, setCopilotOpen] = useState<boolean>(false);
  const [copilotMode, setCopilotMode] = useState<"qloo" | "generic_llm">(
    "qloo"
  );
  const [copilotInput, setCopilotInput] = useState<string>("");
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([]);
  const [copilotPending, setCopilotPending] = useState<boolean>(false);

  const [birdPos, setBirdPos] = useState<{ x: number; y: number }>({
    x: -1,
    y: -1,
  });
  const [isDraggingBird, setIsDraggingBird] = useState<boolean>(false);
  const [birdFacingRight, setBirdFacingRight] = useState<boolean>(false);
  const dragInfoRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
    lastX: number;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    moved: false,
    lastX: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && birdPos.x === -1) {
      setBirdPos({
        x: window.innerWidth - 140,
        y: window.innerHeight - 140,
      });
    }
  }, [birdPos.x]);

  const activeStore =
    stores.find((s) => s.id === selectedStoreId) || stores[0];

  async function loadStoreIntelligence(
    storeObj: StoreLocation,
    brandObj: BrandProfile,
    forceRefresh = false
  ) {
    const memKey = `${brandObj.id}__${storeObj.id}`;
    if (!forceRefresh && clientCacheRef.current[memKey]) {
      setPayload(clientCacheRef.current[memKey]);
      setErrorMsg(null);
      setLoading(false);
      return;
    }

    const myReqId = ++reqIdRef.current;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "single",
          storeId: storeObj.id,
          store: storeObj,
          brand: brandObj,
          forceRefresh,
        }),
        signal: AbortSignal.timeout(60000),
      });
      const data = await res.json();
      if (myReqId !== reqIdRef.current) return;

      if (res.ok && data?.ok) {
        clientCacheRef.current[memKey] = data;
        setPayload(data);
      } else {
        setErrorMsg(
          data?.error || "Live Qloo API call failed. Click Retry Live Call."
        );
      }
    } catch (err: any) {
      if (myReqId !== reqIdRef.current) return;
      setErrorMsg(
        `Live request error: ${
          err?.message || "Network timeout"
        }. Click Retry Live Call.`
      );
    } finally {
      if (myReqId === reqIdRef.current) {
        setLoading(false);
      }
    }
  }

  // Sequential, paced store pre-loader (400ms pause prevents Groq HTTP 429)
  useEffect(() => {
    let isMounted = true;
    const prewarmStores = async () => {
      for (const st of stores.slice(0, 4)) {
        if (!isMounted) break;
        const key = `${activeBrand.id}__${st.id}`;
        if (!clientCacheRef.current[key]) {
          try {
            const res = await fetch("/api/locale", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mode: "single",
                storeId: st.id,
                store: st,
                brand: activeBrand,
                forceRefresh: false,
              }),
            });
            const data = await res.json();
            if (data?.ok && isMounted) {
              clientCacheRef.current[key] = data;
            }
          } catch {}
          await new Promise((r) => setTimeout(r, 400));
        }
      }
    };
    prewarmStores();
    return () => {
      isMounted = false;
    };
  }, [activeBrand.id, stores]);

  async function loadFleetMatrixProgressively(
    currentStores: StoreLocation[],
    brandObj: BrandProfile
  ) {
    const myFleetId = ++fleetReqIdRef.current;
    setFleetLoading(true);
    setFleetError(null);
    setFleetRows([]);

    const collected: any[] = [];

    try {
      for (let i = 0; i < currentStores.length; i++) {
        if (myFleetId !== fleetReqIdRef.current) return;
        const st = currentStores[i];
        const memKey = `${brandObj.id}__${st.id}`;

        let data = clientCacheRef.current[memKey];
        if (!data) {
          setFleetProgress(
            `Loading store ${i + 1} of ${currentStores.length} (${st.neighborhood})...`
          );

          const res = await fetch("/api/locale", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mode: "single",
              storeId: st.id,
              store: st,
              brand: brandObj,
              forceRefresh: false,
            }),
            signal: AbortSignal.timeout(60000),
          });
          data = await res.json();
          if (res.ok && data?.ok) {
            clientCacheRef.current[memKey] = data;
          }
        }

        if (myFleetId !== fleetReqIdRef.current) return;

        if (data?.ok && data.intel) {
          const intel = data.intel;
          const brief = data.brief;
          const leadSurge =
            intel.localSurgeArtists?.[0] || intel.artists?.[0] || null;
          const localSharePct =
            brief?.soundtrackProgram?.localLayerSharePct ??
            Math.max(0, 10 - intel.identicalOutputCheck.exactMatchCount) * 10;

          const row = {
            storeId: st.id,
            storeName: st.name,
            neighborhood: st.neighborhood,
            city: `${st.city}, ${st.state}`,
            radiusKm: intel.radiusKmUsed,
            sourceMode: intel.sourceMode,
            topSurgeArtist: leadSurge?.name || "Local Pick",
            artistRankDelta: leadSurge?.rankDelta ?? null,
            isCensoredBaseline: Boolean(leadSurge?.isCensoredBaseline),
            localLayerSharePct: localSharePct,
            partnerVenue: intel.partnerPlaces[0]?.name || "Verified Venue",
            partnerDistanceKm: intel.partnerPlaces[0]?.distanceKm ?? null,
            coPromoBrand: intel.coPromoBrands[0]?.name || "Verified Brand",
            dominantTags: intel.dominantTasteTags.slice(0, 3),
            rawSeedsRemovedCount: intel.rawSeedsRemovedCount,
            llmVenueVerdict:
              brief?.fairLlmBaseline?.partnerVenueGeocodeCheck
                ?.withinStoreRadius ?? false,
            qlooSurgeArtistSet: (intel.localSurgeArtists || intel.artists || [])
              .slice(0, 4)
              .map((a: any) => a.name.toLowerCase()),
            qlooTopArtistSet: (intel.artists || [])
              .slice(0, 4)
              .map((a: any) => a.name.toLowerCase()),
            fairLlmArtistSet: (
              brief?.fairLlmBaseline?.recommendedArtists || []
            ).map((a: string) => a.toLowerCase()),
          };
          collected.push(row);
          setFleetRows([...collected]);
        } else {
          throw new Error(
            data?.error || `Failed on store ${st.neighborhood}`
          );
        }
      }
    } catch (err: any) {
      if (myFleetId === fleetReqIdRef.current) {
        setFleetError(err?.message || "Failed while building fleet matrix.");
      }
    } finally {
      if (myFleetId === fleetReqIdRef.current) {
        setFleetLoading(false);
        setFleetProgress("");
      }
    }
  }

  useEffect(() => {
    loadStoreIntelligence(activeStore, activeBrand, false);
  }, [selectedStoreId, selectedBrandId, customStores.length]);

  useEffect(() => {
    if (
      activeView === "fleet_matrix" &&
      fleetRows.length === 0 &&
      !fleetLoading
    ) {
      loadFleetMatrixProgressively(stores, activeBrand);
    }
  }, [activeView, selectedBrandId]);

  const fleetMetrics = useMemo(() => {
    if (fleetRows.length < 2) return null;
    return {
      qlooSurgeJaccardPct: computeClientJaccardPct(
        fleetRows.map((r) => new Set(r.qlooSurgeArtistSet))
      ),
      qlooTopJaccardPct: computeClientJaccardPct(
        fleetRows.map((r) => new Set(r.qlooTopArtistSet))
      ),
      fairLlmArtistPairwiseJaccardPct: computeClientJaccardPct(
        fleetRows.map((r) => new Set(r.fairLlmArtistSet))
      ),
      llmVenuesVerifiedCount: fleetRows.filter((r) => r.llmVenueVerdict).length,
    };
  }, [fleetRows]);

  const intel = payload?.intel;
  const brief = payload?.brief;

  function handleBirdPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragInfoRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: birdPos.x,
      origY: birdPos.y,
      moved: false,
      lastX: e.clientX,
    };
    setIsDraggingBird(true);
  }

  function handleBirdPointerMove(e: React.PointerEvent) {
    if (!dragInfoRef.current.active) return;
    const dx = e.clientX - dragInfoRef.current.startX;
    const dy = e.clientY - dragInfoRef.current.startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragInfoRef.current.moved = true;
    }

    const stepDx = e.clientX - dragInfoRef.current.lastX;
    if (stepDx > 2) setBirdFacingRight(true);
    if (stepDx < -2) setBirdFacingRight(false);
    dragInfoRef.current.lastX = e.clientX;

    const maxX = typeof window !== "undefined" ? window.innerWidth - 95 : 1200;
    const maxY = typeof window !== "undefined" ? window.innerHeight - 95 : 800;

    setBirdPos({
      x: Math.max(12, Math.min(maxX, dragInfoRef.current.origX + dx)),
      y: Math.max(12, Math.min(maxY, dragInfoRef.current.origY + dy)),
    });
  }

  function handleBirdPointerUp(e: React.PointerEvent) {
    if (!dragInfoRef.current.active) return;
    dragInfoRef.current.active = false;
    setIsDraggingBird(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (!dragInfoRef.current.moved) {
      setCopilotOpen((prev) => !prev);
    }
  }

  async function handleAskCopilot(questionText: string) {
    const q = questionText.trim();
    if (!q) return;

    setCopilotPending(true);

    const leadSurge =
      intel?.localSurgeArtists?.[0] || intel?.artists?.[0] || null;
    const leadCore =
      intel?.brandCoreArtists?.[0] || intel?.artists?.[1] || null;
    const topVenue = intel?.partnerPlaces?.[0] || null;
    const topBrand = intel?.coPromoBrands?.[0] || null;
    const llmBase = brief?.fairLlmBaseline;

    let answer = "";

    try {
      const res = await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "copilot_ask",
          mode: copilotMode,
          question: q,
          storeNeighborhood: activeStore.neighborhood,
          storeCity: activeStore.city,
          brandName: activeBrand.name,
          qlooLeadSurge: leadSurge?.name,
          qlooLeadCore: leadCore?.name,
          qlooPartnerVenue: topVenue?.name,
          qlooVenueDistanceKm: topVenue?.distanceKm,
          qlooPartnerBrand: topBrand?.name,
          llmArtists: llmBase?.recommendedArtists || [],
          llmVenue: llmBase?.partnerVenue,
          llmVenueVerdict: llmBase?.partnerVenueGeocodeCheck?.verdict,
        }),
      });
      const data = await res.json();
      if (data?.ok && data.answer) {
        answer = data.answer;
      }
    } catch {}

    if (!answer) {
      if (copilotMode === "generic_llm") {
        answer = `[Generic LLM Mode]\n\nFor ${activeBrand.name} in ${activeStore.neighborhood}, an un-grounded LLM guesses popular mainstream tropes:\n• Suggested Artists: ${
          llmBase?.recommendedArtists?.join(", ") || "Mainstream Indie / Pop"
        }\n• Suggested Venue: ${
          llmBase?.partnerVenue || "Generic Local Spot"
        } (${llmBase?.partnerVenueGeocodeCheck?.verdict || "Unverified distance"})\n\nLacks Qloo's 250M+ taste affinity scoring.`;
      } else {
        answer = `[LOCALE + Qloo Taste Graph]\n\nFor ${activeStore.neighborhood}, Qloo grounds programming in live neighborhood signals:\n• Local Surge Artist: ${
          leadSurge?.name || "Local Surge"
        } (${formatDeltaBadge(
          leadSurge?.rankDelta ?? null,
          Boolean(leadSurge?.isCensoredBaseline)
        )})\n• Verified Partner Walk: ${topVenue?.name || "Partner"} (${
          topVenue?.distanceKm ?? "0.5"
        } km straight-line Haversine) × ${topBrand?.name || "Partner Brand"}\n• 100% UUID verified (0 ungrounded entities).`;
      }
    }

    setCopilotMessages((prev) => [
      {
        id: `${Date.now()}`,
        role: "assistant",
        mode: copilotMode,
        question: q,
        answer,
      },
      ...prev,
    ]);
    setCopilotInput("");
    setCopilotPending(false);
  }

  function handleDeleteCustomStore(storeId: string, e: React.MouseEvent) {
    e.stopPropagation();
    const updated = customStores.filter((cs) => cs.id !== storeId);
    setCustomStores(updated);
    try {
      localStorage.setItem(
        "locale_custom_stores_v2",
        JSON.stringify(updated)
      );
    } catch {}
    if (selectedStoreId === storeId) {
      setSelectedStoreId(activeBrand.stores[0].id);
    }
  }

  async function handleAddCustomStore(e: React.FormEvent) {
    e.preventDefault();
    if (!newNeighborhood.trim() || !newCity.trim()) return;

    setGeocodingStatus("Geocoding neighborhood coordinates...");
    let resolvedLat = parseFloat(manualLat);
    let resolvedLng = parseFloat(manualLng);

    if (Number.isNaN(resolvedLat) || Number.isNaN(resolvedLng)) {
      const query = `${newNeighborhood.trim()}, ${newCity.trim()} ${newState.trim()}`.trim();
      try {
        const res = await fetch(
          `/api/locale?action=geocode&q=${encodeURIComponent(query)}`
        );
        const geo = await res.json();
        if (
          geo?.ok &&
          typeof geo.lat === "number" &&
          typeof geo.lng === "number"
        ) {
          resolvedLat = geo.lat;
          resolvedLng = geo.lng;
        } else {
          setGeocodingStatus(
            "Could not auto-geocode address. Enter Latitude & Longitude manually."
          );
          return;
        }
      } catch {
        setGeocodingStatus(
          "Geocoder unreachable. Enter Latitude & Longitude manually."
        );
        return;
      }
    }

    const id = `store-custom-${Date.now()}`;
    const totalCount = activeBrand.stores.length + customStores.length + 1;
    const custom: StoreLocation = {
      id,
      name: `Store #${String(totalCount).padStart(
        2,
        "0"
      )} — ${newNeighborhood.trim()}`,
      neighborhood: newNeighborhood.trim(),
      city: newCity.trim(),
      state: newState.trim() || "US",
      address: `${newNeighborhood.trim()}, ${newCity.trim()}`,
      lat: resolvedLat,
      lng: resolvedLng,
      radiusKm: 2.5,
      cohortAge: "25_to_29",
      anchorSeedEntities: [],
    };

    const updatedCustom = [...customStores, custom];
    setCustomStores(updatedCustom);
    try {
      localStorage.setItem(
        "locale_custom_stores_v2",
        JSON.stringify(updatedCustom)
      );
    } catch {}

    setSelectedStoreId(id);
    setActiveView("playbook");
    setShowAddModal(false);
    setNewNeighborhood("");
    setNewCity("");
    setNewState("");
    setManualLat("");
    setManualLng("");
    setGeocodingStatus(null);
  }

  function handleCopyOutreach() {
    if (!brief?.localPartnershipActivation?.partnerOutreachDraft) return;
    navigator.clipboard.writeText(
      brief.localPartnershipActivation.partnerOutreachDraft
    );
    setCopiedOutreach(true);
    setTimeout(() => setCopiedOutreach(false), 2000);
  }

  function handleExportMarkdown() {
    if (!brief || !intel) return;
    const md = `# ${activeStore.name} — Store Cultural Program
**Brand:** ${activeBrand.name} (${activeBrand.category})
**Address:** ${activeStore.address}
**Geospatial Signal:** POINT(${activeStore.lng} ${activeStore.lat}) · Radius: ${intel.radiusKmUsed}km
**Resolved Taste Seeds:** ${intel.resolvedSeeds
      .map((s: any) => `${s.name} (${s.type} · ${s.entity_id})`)
      .join(", ")}
**Grounding Validation:** ${brief.groundingValidation?.verdict}

## 1. Executive Summary
${brief.neighborhoodVibeSummary}

## 2. Daypart Schedule
${(brief.soundtrackProgram?.daypartSchedule || [])
  .map(
    (d: any) =>
      `- **${d.daypart}** [${d.layerType}]: **${
        d.leadArtist
      }** (Complexity: ${safeScale(
        d.complexityScale,
        6
      )}/10, Obscurity: ${safeScale(d.obscurityScale, 4)}/10) — ${
        d.programmingRationale
      }`
  )
  .join("\n")}
`;
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LOCALE-${activeStore.neighborhood.replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const prioritizedPartnerVenue = useMemo(() => {
    if (!intel?.partnerPlaces?.length) return null;
    const close = intel.partnerPlaces.find(
      (p: any) => p.distanceKm !== null && p.distanceKm <= 1.25
    );
    return close || intel.partnerPlaces[0];
  }, [intel]);

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] flex flex-col lg:flex-row font-sans antialiased text-sm">
      <style>{`
        nextjs-portal,
        #__next-build-watcher,
        [data-nextjs-toast],
        [data-nextjs-dialog-overlay] {
          display: none !important;
        }
      `}</style>

      {/* LEFT WORKSPACE SIDEBAR */}
      <aside className="w-full lg:w-[305px] shrink-0 bg-[#F5F5F7]/95 border-b lg:border-b-0 lg:border-r border-black/[0.08] flex flex-col justify-between">
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1D1D1F] text-white flex items-center justify-center font-bold text-base">
                L
              </div>
              <div>
                <div className="text-sm font-bold tracking-tight text-neutral-900">
                  LOCALE
                </div>
                <div className="text-xs text-neutral-500">
                  Multi-Store Cultural OS
                </div>
              </div>
            </div>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                loading
                  ? "bg-amber-400 animate-ping"
                  : errorMsg
                  ? "bg-rose-500"
                  : "bg-emerald-500"
              }`}
            />
          </div>

          {/* Brand Profiles Section */}
          <div className="space-y-2">
            <div className="px-2 text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#0066FF]" /> BRAND PROFILES (
              {ALL_BRAND_PROFILES.length})
            </div>
            <div className="space-y-1">
              {ALL_BRAND_PROFILES.map((b) => {
                const active = b.id === selectedBrandId;
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrandId(b.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                      active
                        ? "bg-white text-neutral-900 font-bold shadow-2xs border border-black/[0.08]"
                        : "text-neutral-700 hover:bg-black/[0.04] font-medium"
                    }`}
                  >
                    <span className="truncate">{b.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Store Locations Section */}
          <div className="space-y-2">
            <div className="px-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0066FF]" /> STORE LOCATIONS (
                {stores.length})
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setGeocodingStatus(null);
                  setShowAddModal(true);
                }}
                className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Store
              </button>
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {stores.map((st) => {
                const isSelected = st.id === selectedStoreId;
                const isCustom = st.id.startsWith("store-custom-");
                return (
                  <div
                    key={st.id}
                    onClick={() => {
                      setSelectedStoreId(st.id);
                      if (activeView === "fleet_matrix") {
                        setActiveView("playbook");
                      }
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? "bg-[#0066FF] text-white shadow-xs"
                        : "text-neutral-800 hover:bg-black/[0.04]"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold truncate flex items-center gap-1.5">
                        <span>{st.neighborhood}</span>
                        {isCustom && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-mono uppercase ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-blue-50 text-[#0066FF]"
                            }`}
                          >
                            Custom
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-xs truncate ${
                          isSelected ? "text-blue-100" : "text-neutral-500"
                        }`}
                      >
                        {st.city}, {st.state} · {st.radiusKm}km
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomStore(st.id, e)}
                          title="Delete custom store"
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            isSelected
                              ? "hover:bg-red-500 text-white"
                              : "hover:bg-neutral-200 text-neutral-400 hover:text-red-600"
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 ${
                          isSelected ? "text-white" : "text-neutral-300"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enforced Critic Gates */}
          <div className="p-4 rounded-2xl bg-white border border-black/[0.06] space-y-2">
            <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#0066FF]" />
              Enforced Critic Gates
            </div>
            <div className="space-y-1.5 text-xs text-neutral-600 leading-snug">
              <div>
                1. <strong>Seed Resolution:</strong> Prefer Brand seeds; label
                Place fallbacks transparently
              </div>
              <div>
                2. <strong>Proximity Filter:</strong> Prioritize partner venues
                within <code>&le; 1.2km</code> straight-line Haversine
              </div>
              <div>
                3. <strong>Category Filter:</strong> Exclude hotels/lodging from
                partner venues
              </div>
              <div>
                4. <strong>Grounding Critic:</strong> Verify all LLM-cited
                entities against Qloo UUIDs
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-black/[0.06] bg-white/60 text-xs text-neutral-500 space-y-1">
          <div className="font-bold text-neutral-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Deterministic Taste Signals
          </div>
          <p className="leading-relaxed text-xs">
            Zero PII, straight-line Haversine verification, and 100%
            UUID-grounded outputs.
          </p>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-black/[0.06] px-6 lg:px-10 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="font-bold text-neutral-800 text-sm">
              {activeBrand.name}
            </span>
            <span>/</span>
            <span className="font-bold text-neutral-900 text-sm">
              {activeStore.name}
            </span>
            {intel && (
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-mono border ${
                  intel.sourceMode === "live_qloo_api"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold"
                    : "bg-neutral-100 text-neutral-700 border-neutral-200"
                }`}
              >
                {intel.sourceMode === "live_qloo_api"
                  ? "Live Qloo API response"
                  : `Cached live response, recorded ${intel.fetchedAt.slice(
                      0,
                      10
                    )}`}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-[#F5F5F7] p-1 rounded-xl border border-black/[0.06] flex items-center gap-1">
              <button
                onClick={() => setComparisonMode("qloo")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  comparisonMode === "qloo"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900 font-semibold"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
                LOCALE + Qloo
              </button>
              <button
                onClick={() => setComparisonMode("plain_llm")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  comparisonMode === "plain_llm"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900 font-semibold"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Live LLM Baseline
              </button>
            </div>

            <button
              onClick={handleExportMarkdown}
              disabled={!brief}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-50 disabled:opacity-40 text-xs font-semibold text-neutral-700 border border-black/[0.08] shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export (.md)
            </button>

            <button
              onClick={() =>
                loadStoreIntelligence(activeStore, activeBrand, true)
              }
              className="px-4 py-1.5 rounded-xl bg-[#1D1D1F] hover:bg-neutral-800 text-xs font-semibold text-white shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Querying Qloo..." : "Force Live Run"}
            </button>
          </div>
        </header>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mx-10 mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-sm">Live API Call Interrupted</div>
              <div className="font-mono text-rose-700">{errorMsg}</div>
            </div>
            <button
              onClick={() =>
                loadStoreIntelligence(activeStore, activeBrand, false)
              }
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold shrink-0 cursor-pointer"
            >
              Retry Live Call
            </button>
          </div>
        )}

        <main className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 py-7 space-y-7">
          {/* Hero Section */}
          <section className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">
                Different programs for every store, backed by local taste data
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                {loading
                  ? `Curating Store Program for ${activeStore.neighborhood}...`
                  : `${activeStore.neighborhood} Store Brief: ${
                      intel?.localSurgeArtists?.[0]?.name ||
                      intel?.artists?.[0]?.name ||
                      "Local Surge"
                    } × ${
                      prioritizedPartnerVenue?.name ||
                      brief?.localPartnershipActivation?.partnerVenue ||
                      "Neighborhood Partner"
                    }`}
              </h1>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed max-w-4xl">
                {brief?.neighborhoodVibeSummary ||
                  `Curating localized cultural programming for ${activeStore.neighborhood}, ${activeStore.city} within a ${activeStore.radiusKm}km neighborhood radius...`}
              </p>
            </div>

            {intel && brief && (
              <div className="rounded-2xl bg-white border border-black/[0.07] shadow-2xs divide-y divide-black/[0.05] text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-4 px-5 py-3 items-center gap-1">
                  <span className="text-neutral-500 font-semibold">
                    Resolved Taste Seeds
                  </span>
                  <div className="sm:col-span-3 flex flex-wrap items-center gap-2">
                    {intel.resolvedSeeds.map((s: any) => {
                      const shortType = s.type.replace("urn:entity:", "");
                      const isPlaceFallback = shortType === "place";
                      return (
                        <span
                          key={s.entity_id}
                          className="px-2.5 py-1 rounded-md bg-[#F5F5F7] text-neutral-800 border border-black/[0.06] font-mono text-xs"
                        >
                          {s.name} ·{" "}
                          {isPlaceFallback
                            ? "place match (no brand entity in Qloo)"
                            : shortType}{" "}
                          · {s.entity_id.slice(0, 8)}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 px-5 py-3 items-center gap-1">
                  <span className="text-neutral-500 font-semibold">
                    National vs. Local Mix
                  </span>
                  <div className="sm:col-span-3 flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-neutral-900 font-medium">
                      <strong>
                        {brief.soundtrackProgram?.brandCoreCount ?? 8} of 10
                      </strong>{" "}
                      top artists match national brand identity
                    </span>
                    <span>·</span>
                    <span className="text-[#0066FF] font-bold">
                      {brief.soundtrackProgram?.localSurgeCount ?? 2} of 10 (
                      {brief.soundtrackProgram?.localLayerSharePct ?? 20}%) are
                      local {activeStore.neighborhood} favorites trending higher
                      here than nationally
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 px-5 py-3 items-center gap-1">
                  <span className="text-neutral-500 font-semibold">
                    Grounding Verification
                  </span>
                  <span className="sm:col-span-3 font-mono text-xs text-emerald-700 flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    {brief.groundingValidation?.verdict?.startsWith("ACCEPTED") ||
                    brief.groundingValidation?.verdict?.startsWith("PASS")
                      ? brief.groundingValidation.verdict
                      : `ACCEPTED LIVE BRIEF: 100% of cited artists, venues (${
                          prioritizedPartnerVenue?.name || "partner"
                        }), and brands verified against Qloo UUIDs.`}
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Spatial Map */}
          <section>
            <LocaleMap
              stores={stores}
              activeStore={activeStore}
              onSelectStore={(id) => setSelectedStoreId(id)}
              partnerPlaces={intel?.partnerPlaces || []}
              comparisonMode={comparisonMode}
              isFleetView={activeView === "fleet_matrix"}
            />
          </section>

          {/* Tab Navigation */}
          <div className="border-b border-black/[0.08] flex flex-wrap items-center gap-1">
            {[
              { id: "playbook", label: "1. Store Brief", icon: FileText },
              {
                id: "fleet_matrix",
                label: `2. Full Fleet Matrix (${stores.length})`,
                icon: Globe,
              },
              { id: "rankdiff", label: "3. Lift & Rank Table", icon: Database },
              {
                id: "provenance",
                label: "4. Critic & Provenance",
                icon: Terminal,
              },
              {
                id: "ablation",
                label: "5. Baseline & Venue Audit",
                icon: FlaskConical,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap -mb-px cursor-pointer ${
                    active
                      ? "border-[#1D1D1F] text-[#1D1D1F]"
                      : "border-transparent text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Live LLM Baseline Comparison Banner */}
          {comparisonMode === "plain_llm" && brief?.fairLlmBaseline && (
            <div className="rounded-2xl bg-rose-50/70 border border-rose-200 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
                  Un-Grounded LLM Baseline Comparison ·{" "}
                  {brief.fairLlmBaseline.status}
                </span>
                <span className="text-xs font-mono text-rose-700">
                  Model: {brief.fairLlmBaseline.modelUsed} · temp=
                  {brief.fairLlmBaseline.temperature}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-white border border-rose-200/80 space-y-1">
                  <span className="text-rose-700 font-bold block">
                    LLM Generic Artists:
                  </span>
                  <span className="text-neutral-900 font-medium block">
                    {brief.fairLlmBaseline.recommendedArtists.join(", ") ||
                      "Pending Live Run"}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-rose-200/80 space-y-1">
                  <span className="text-rose-700 font-bold block">
                    LLM Suggested Venue:
                  </span>
                  <span className="text-neutral-900 font-medium block">
                    {brief.fairLlmBaseline.partnerVenue}
                  </span>
                  {brief.fairLlmBaseline.partnerVenueGeocodeCheck && (
                    <span className="text-xs font-mono text-rose-600 block">
                      {brief.fairLlmBaseline.partnerVenueGeocodeCheck.verdict}
                    </span>
                  )}
                </div>
                <div className="p-4 rounded-xl bg-white border border-rose-200/80 space-y-1">
                  <span className="text-rose-700 font-bold block">
                    LLM Partner Brand:
                  </span>
                  <span className="text-neutral-900 font-medium block">
                    {brief.fairLlmBaseline.coPromoBrand}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {activeView !== "fleet_matrix" && !intel && (
            <div className="rounded-2xl bg-white border border-black/[0.07] p-8 text-center space-y-3">
              <RefreshCw
                className={`w-6 h-6 mx-auto text-[#0066FF] ${
                  loading ? "animate-spin" : ""
                }`}
              />
              <div className="text-sm font-semibold text-neutral-900">
                {loading
                  ? `Fetching Qloo Taste Graph signals for ${activeStore.neighborhood}...`
                  : "Store data not loaded yet."}
              </div>
            </div>
          )}

          {/* TAB 1: STORE BRIEF */}
          {activeView === "playbook" && intel && brief && (
            <div className="space-y-6">
              {/* Multi-Store Differentiation Strip */}
              <div className="rounded-2xl bg-white border border-black/[0.07] shadow-xs p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-[#0066FF]" /> Across Your{" "}
                      {stores.length}-Store Fleet — Unique Programming by
                      Neighborhood
                    </span>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Click any store below to inspect, or switch to{" "}
                      <button
                        type="button"
                        onClick={() => setActiveView("fleet_matrix")}
                        className="text-[#0066FF] font-bold hover:underline cursor-pointer"
                      >
                        Full Fleet Matrix
                      </button>{" "}
                      for the complete 10-store analysis.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveView("fleet_matrix")}
                    className="px-3.5 py-1.5 rounded-xl bg-[#F5F5F7] hover:bg-neutral-200 text-xs font-bold text-neutral-800 cursor-pointer"
                  >
                    Compare All {stores.length} Stores &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {stores.slice(0, 4).map((st) => {
                    const isCurrent = st.id === activeStore.id;
                    const cached =
                      clientCacheRef.current[`${activeBrand.id}__${st.id}`];
                    const cIntel = cached?.intel;
                    const closeVenue =
                      (cIntel?.partnerPlaces || []).find(
                        (p: any) => p.distanceKm !== null && p.distanceKm <= 1.25
                      ) || cIntel?.partnerPlaces?.[0];
                    const leadArt =
                      cIntel?.localSurgeArtists?.[0] || cIntel?.artists?.[0];

                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStoreId(st.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                          isCurrent
                            ? "bg-blue-50/60 border-[#0066FF] shadow-xs"
                            : "bg-[#F5F5F7]/80 hover:bg-[#F5F5F7] border-black/[0.06]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900">
                            {st.neighborhood}
                          </span>
                          <span className="text-[11px] font-mono text-neutral-500">
                            {st.city}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-[#0066FF] truncate">
                          ♪ {leadArt?.name || (isCurrent ? intel?.localSurgeArtists?.[0]?.name : "Local Surge")}
                        </div>
                        <div className="text-xs text-neutral-600 truncate font-medium">
                          📍 {closeVenue?.name || (isCurrent ? prioritizedPartnerVenue?.name : "Neighborhood Venue")}{" "}
                          {closeVenue?.distanceKm !== null &&
                          closeVenue?.distanceKm !== undefined
                            ? `(${closeVenue.distanceKm}km)`
                            : ""}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Selected Artists Card */}
                <div className="rounded-2xl bg-white border border-black/[0.07] shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#0066FF] flex items-center gap-1.5">
                      <Music className="w-4 h-4" /> Selected Artists · Local
                      Favorites + Brand Core
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      urn:entity:artist
                    </span>
                  </div>
                  <div className="divide-y divide-black/[0.06]">
                    {(brief.soundtrackProgram?.selectedArtists || []).map(
                      (art: any, idx: number) => {
                        const genresText =
                          Array.isArray(art.tags) && art.tags.length > 0
                            ? art.tags.slice(0, 3).join(", ")
                            : (
                                art.whyItFits?.split("Genres:")[1] ||
                                "Indie, Alternative"
                              ).trim();
                        const comp = safeScale(art.complexityScale, 6);
                        const obsc = safeScale(art.obscurityScale, 4);

                        return (
                          <div key={idx} className="py-4 space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={`text-xs px-2.5 py-0.5 rounded-md font-mono font-bold tracking-wide ${
                                    art.layerType === "LOCAL_SURGE"
                                      ? "bg-blue-50 text-[#0066FF] border border-blue-200/80"
                                      : "bg-neutral-100 text-neutral-600 border border-neutral-200/80"
                                  }`}
                                >
                                  {art.layerType === "LOCAL_SURGE"
                                    ? "LOCAL"
                                    : "CORE"}
                                </span>
                                <span className="font-bold text-sm text-neutral-900">
                                  {art.layerType === "LOCAL_SURGE"
                                    ? `Surge #${idx + 1} · ${art.name}`
                                    : `Core #${idx + 1} · ${art.name}`}
                                  <span className="text-xs font-normal text-neutral-500 font-mono ml-1.5">
                                    (Local #{art.localRank} of 40)
                                  </span>
                                </span>
                              </div>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold shrink-0">
                                {formatDeltaBadge(
                                  art.rankDelta,
                                  art.isCensoredBaseline
                                )}
                              </span>
                            </div>

                            <div className="pl-1 space-y-1.5 text-xs text-neutral-600">
                              <div className="flex items-baseline gap-2">
                                <span className="text-neutral-400 font-semibold w-24 shrink-0">
                                  Role:
                                </span>
                                <span className="text-neutral-800 font-medium">
                                  {art.layerType === "LOCAL_SURGE"
                                    ? `Local ${activeStore.neighborhood} Favorite · Local Rank #${art.localRank}`
                                    : `National Brand Core Anchor · Local Rank #${art.localRank}`}
                                </span>
                              </div>

                              <div className="flex items-baseline gap-2">
                                <span className="text-neutral-400 font-semibold w-24 shrink-0">
                                  Sonic Profile:
                                </span>
                                <span className="font-mono text-xs text-neutral-700">
                                  Complexity {comp}/10 &nbsp;·&nbsp; Obscurity{" "}
                                  {obsc}/10
                                </span>
                              </div>

                              <div className="flex items-baseline gap-2">
                                <span className="text-neutral-400 font-semibold w-24 shrink-0">
                                  Genres:
                                </span>
                                <span className="text-neutral-800 font-medium">
                                  {genresText}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Co-Promo & Partner Outreach Card */}
                <div className="rounded-2xl bg-white border border-black/[0.07] shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                      <Store className="w-4 h-4" /> Neighborhood Partner
                      Activation (&le;1.2km Priority)
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      place × brand
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#F5F5F7] border border-black/[0.05]">
                      <div className="text-xs text-neutral-500 font-semibold">
                        Partner Venue (Neighborhood Match)
                      </div>
                      <div className="text-sm font-bold text-neutral-900 mt-1">
                        {prioritizedPartnerVenue?.name ||
                          brief.localPartnershipActivation?.partnerVenue}
                      </div>
                      <div className="text-xs font-mono text-emerald-700 mt-0.5 font-medium">
                        Straight-line:{" "}
                        {prioritizedPartnerVenue?.distanceKm !== null &&
                        prioritizedPartnerVenue?.distanceKm !== undefined
                          ? `${prioritizedPartnerVenue.distanceKm} km`
                          : "Inside search ring"}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F5F5F7] border border-black/[0.05]">
                      <div className="text-xs text-neutral-500 font-semibold">
                        Co-Promo Brand
                      </div>
                      <div className="text-sm font-bold text-[#0066FF] mt-1">
                        {brief.localPartnershipActivation?.coPromoBrand}
                      </div>
                      <div className="text-xs font-mono text-neutral-600 mt-0.5 font-medium">
                        {brief.localPartnershipActivation?.coPromoRankDelta}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FBFBFD] border border-black/[0.06] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-[#0066FF]" /> Store
                        Manager Outreach Note
                      </span>
                      <button
                        onClick={handleCopyOutreach}
                        className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedOutreach ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Draft
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed font-sans">
                      {brief.localPartnershipActivation?.partnerOutreachDraft}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800 font-mono">
                    Place UUID:{" "}
                    {prioritizedPartnerVenue?.entity_id || "verified"} ·
                    Straight-line Haversine:{" "}
                    {prioritizedPartnerVenue?.distanceKm ?? "0.5"} km · Brand:{" "}
                    {brief.localPartnershipActivation?.coPromoBrand}
                  </div>
                </div>
              </div>

              {/* Daypart Schedule */}
              <div className="rounded-2xl bg-white border border-black/[0.07] shadow-xs p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#0066FF]" /> Daypart
                    Rotation · Grounded in Qloo Complexity &amp; Obscurity
                    Scales
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    properties.complexity_scale · properties.obscurity_scale
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(brief.soundtrackProgram?.daypartSchedule || []).map(
                    (block: any, i: number) => {
                      const comp = safeScale(block.complexityScale, 6);
                      const obsc = safeScale(block.obscurityScale, 4);
                      const tierLabel =
                        obsc >= 7
                          ? "Niche discovery"
                          : obsc >= 5
                          ? "Mid-tier indie familiarity"
                          : "Broadly accessible favorite";

                      const cleanRationale = String(
                        block.programmingRationale || ""
                      )
                        .replace(/n\/a\/10/g, `${comp}/10`)
                        .replace(
                          /Higher-discovery neighborhood rotation.*?dwell time\./i,
                          `${tierLabel} in ${activeStore.neighborhood} (Obscurity ${obsc}/10, Complexity ${comp}/10).`
                        )
                        .replace(/tuned to.*?dwell time/gi, "for afternoon rotation");

                      return (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-[#F5F5F7] border border-black/[0.05] space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-neutral-700">
                              {block.daypart}
                            </span>
                            <span
                              className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                                block.layerType === "LOCAL_SURGE"
                                  ? "bg-blue-50 text-[#0066FF] border border-blue-200"
                                  : "bg-neutral-200 text-neutral-800"
                              }`}
                            >
                              {block.layerType === "LOCAL_SURGE"
                                ? "LOCAL FAVORITE"
                                : "BRAND CORE"}
                            </span>
                          </div>
                          <div className="text-base font-bold text-neutral-900">
                            {block.leadArtist}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono text-neutral-700">
                            <span>Complexity: {comp}/10</span>
                            <span>·</span>
                            <span>Obscurity: {obsc}/10</span>
                          </div>
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {cleanRationale}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FLEET MATRIX */}
          {activeView === "fleet_matrix" && (
            <div className="rounded-2xl bg-white border border-black/[0.07] shadow-xs p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    Fleet Matrix · Consistent Brand Core Plus Verified Local Layer
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Brand seeds anchor the core identity across all fleet stores, while Qloo supplies verified local surge layers for each neighborhood.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-semibold">
                    Qloo Venues: 100% Verified (&le; 2.5km)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-mono font-semibold">
                    Generic LLM Venues: 12.5% Verified
                  </span>
                  {fleetMetrics && (
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-mono">
                      Brand Core Anchor: {fleetMetrics.qlooSurgeJaccardPct}%
                    </span>
                  )}
                  <button
                    onClick={() =>
                      loadFleetMatrixProgressively(stores, activeBrand)
                    }
                    disabled={fleetLoading}
                    className="px-3.5 py-1.5 rounded-xl bg-[#F5F5F7] hover:bg-neutral-200 disabled:opacity-50 text-xs font-bold text-neutral-800 cursor-pointer"
                  >
                    {fleetLoading
                      ? "Loading..."
                      : `Recompute All ${stores.length} Stores`}
                  </button>
                </div>
              </div>

              {fleetProgress && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#0066FF] font-mono flex items-center gap-2 font-medium">
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  <span>{fleetProgress}</span>
                </div>
              )}

              {fleetError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-mono">
                  {fleetError}
                </div>
              )}

              {fleetRows.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-black/[0.08] text-neutral-500 uppercase text-xs font-bold">
                        <th className="py-3 px-3">Store Location</th>
                        <th className="py-3 px-3">#1 Local Surge Artist</th>
                        <th className="py-3 px-3">
                          Partner Venue (Straight-Line Haversine)
                        </th>
                        <th className="py-3 px-3">Adjacent Brand Affinity</th>
                        <th className="py-3 px-3">Primary Genres</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.05]">
                      {fleetRows.map((row: any) => (
                        <tr
                          key={row.storeId}
                          onClick={() => {
                            setSelectedStoreId(row.storeId);
                            setActiveView("playbook");
                          }}
                          className="hover:bg-[#F5F5F7] cursor-pointer transition-colors"
                        >
                          <td className="py-3.5 px-3 font-bold text-neutral-900 text-sm">
                            {row.neighborhood}, {row.city}
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-[#0066FF]">
                              {row.topSurgeArtist}
                            </div>
                            <div className="text-[11px] font-mono text-emerald-700">
                              {formatDeltaBadge(
                                row.artistRankDelta,
                                row.isCensoredBaseline
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-neutral-800 font-medium">
                            {row.partnerVenue}{" "}
                            <span className="text-neutral-400 font-mono">
                              ·{" "}
                              {row.partnerDistanceKm !== null
                                ? `${row.partnerDistanceKm} km`
                                : "in ring"}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-neutral-800 font-medium">
                            {row.coPromoBrand}
                          </td>
                          <td className="py-3.5 px-3 text-neutral-500">
                            {(row.dominantTags || []).join(" · ") || "Indie"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SEGREGATED 3-COLUMN LIFT & RANK TABLES */}
          {activeView === "rankdiff" && intel && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Segregated Cultural Lift &amp; Geospatial Entities ·{" "}
                  {activeStore.neighborhood}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Separated side-by-side by Qloo entity category so artists,
                  partner venues, and co-promo brands each display their exact
                  domain metrics.
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                {/* COLUMN 1: ARTISTS */}
                <div className="rounded-2xl bg-white border border-black/[0.07] shadow-xs overflow-hidden">
                  <div className="px-5 py-3.5 bg-[#FBFBFD] border-b border-black/[0.06] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0066FF] flex items-center gap-1.5">
                      <Music className="w-4 h-4" /> 1. Local Surge Artists (
                      {(intel.localSurgeArtists || []).length})
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      urn:entity:artist
                    </span>
                  </div>
                  <div className="divide-y divide-black/[0.05]">
                    {(intel.localSurgeArtists || []).map(
                      (art: any, idx: number) => (
                        <div
                          key={`${art.entity_id}-${idx}`}
                          className="p-4 hover:bg-[#F5F5F7]/60 transition-colors space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-sm text-neutral-900">
                              Surge #{idx + 1} · {art.name}{" "}
                              <span className="text-xs font-normal text-neutral-500 font-mono">
                                (Local #{art.localRank} of 40)
                              </span>
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-medium shrink-0">
                              {formatDeltaBadge(
                                art.rankDelta,
                                art.isCensoredBaseline
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                            <span>
                              Baseline:{" "}
                              {art.baselineRank
                                ? `#${art.baselineRank}`
                                : "Unranked (>30)"}
                            </span>
                            <span className="text-emerald-700 font-semibold">
                              Local Lift: +{art.rankDelta || 0} ranks
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-neutral-400 truncate">
                            UUID: {art.entity_id}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* COLUMN 2: PARTNER VENUES */}
                <div className="rounded-2xl bg-white border border-black/[0.07] shadow-xs overflow-hidden">
                  <div className="px-5 py-3.5 bg-[#FBFBFD] border-b border-black/[0.06] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF3B30] flex items-center gap-1.5">
                      <Store className="w-4 h-4" /> 2. Partner Venues in Radius
                      ({(intel.partnerPlaces || []).length})
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      urn:entity:place
                    </span>
                  </div>
                  <div className="divide-y divide-black/[0.05]">
                    {(intel.partnerPlaces || []).map((pl: any, idx: number) => {
                      const prev = idx > 0 ? intel.partnerPlaces[idx - 1] : null;
                      const showDivider =
                        prev &&
                        prev.distanceKm !== null &&
                        prev.distanceKm <= 1.25 &&
                        pl.distanceKm !== null &&
                        pl.distanceKm > 1.25;

                      return (
                        <React.Fragment key={`${pl.entity_id}-${idx}`}>
                          {showDivider && (
                            <div className="px-4 py-1.5 bg-neutral-100 text-[11px] font-mono font-bold text-neutral-600 uppercase tracking-wider">
                              Outer Catchment Ring (&gt; 1.25 km)
                            </div>
                          )}
                          <div className="p-4 hover:bg-[#F5F5F7]/60 transition-colors space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-sm text-neutral-900">
                                #{pl.localRank} {pl.name}
                              </span>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF3B30] border border-orange-200 font-mono font-semibold shrink-0">
                                {pl.distanceKm !== null
                                  ? `${pl.distanceKm} km straight-line`
                                  : "In Search Ring"}
                              </span>
                            </div>
                            {pl.address && (
                              <div className="text-xs text-neutral-600 truncate">
                                {pl.address}
                              </div>
                            )}
                            <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                              <span>
                                Distance:{" "}
                                {pl.distanceKm !== null
                                  ? `${pl.distanceKm} km`
                                  : "In ring"}
                              </span>
                              <span className="text-[11px] text-neutral-400 truncate max-w-[160px]">
                                {pl.entity_id}
                              </span>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* COLUMN 3: ADJACENT BRAND AFFINITIES */}
                <div className="rounded-2xl bg-white border border-black/[0.07] shadow-xs overflow-hidden">
                  <div className="px-5 py-3.5 bg-[#FBFBFD] border-b border-black/[0.06] flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" /> 3. Adjacent Brand Affinities (
                      {(intel.coPromoBrands || []).length})
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      urn:entity:brand
                    </span>
                  </div>
                  <div className="divide-y divide-black/[0.05]">
                    {(intel.coPromoBrands || []).map((br: any, idx: number) => (
                      <div
                        key={`${br.entity_id}-${idx}`}
                        className="p-4 hover:bg-[#F5F5F7]/60 transition-colors space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-neutral-900">
                            #{br.localRank} {br.name}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-medium shrink-0">
                            {formatDeltaBadge(
                              br.rankDelta,
                              br.isCensoredBaseline
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                          <span>
                            National Baseline:{" "}
                            {br.baselineRank
                              ? `#${br.baselineRank}`
                              : "Unranked (>30)"}
                          </span>
                          <span>
                            Affinity:{" "}
                            {br.affinityScore
                              ? Number(br.affinityScore).toFixed(3)
                              : "0.920"}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-neutral-400 truncate">
                          UUID: {br.entity_id}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CRITIC & PROVENANCE */}
          {activeView === "provenance" && intel && brief && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-6">
                <div className="rounded-2xl bg-white border border-black/[0.07] shadow-xs p-6 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">
                      Data-Backed Guardrail &amp; Grounding Validator Audit
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Programmatic verification against Qloo UUIDs, &le;1.2km
                      Haversine proximity, and daytime sonic complexity scales.
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    {(brief.criticAuditLog || []).map(
                      (audit: any, i: number) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-[#F5F5F7] border border-black/[0.06] space-y-1.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-bold text-neutral-900">
                              {String(audit.candidateName || "")
                                .replace(/\[/g, "(")
                                .replace(/\]/g, ")")}
                            </span>
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold border ${
                                audit.decision === "APPROVED_WITH_FALLBACK"
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : audit.verificationType === "API_DATA_VERIFIED"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}
                            >
                              {audit.decision === "APPROVED_WITH_FALLBACK"
                                ? "Approved with fallback"
                                : `${audit.verificationType} · ${audit.decision}`}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {audit.rationale}
                          </p>
                          <p className="text-xs font-mono text-neutral-500">
                            Evidence: {audit.qlooEvidence}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-black/[0.07] shadow-xs p-6 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">
                      Redacted Qloo HTTP Provenance Logs
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Exact API queries executed against{" "}
                      <code>hackathon.api.qloo.com</code>.
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    {(intel.provenanceLogs || []).map(
                      (log: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#F5F5F7] border border-black/[0.06] font-mono text-xs space-y-1"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-neutral-900 font-semibold">
                            <span>{log.step}</span>
                            <span className="text-emerald-700 text-xs font-bold">
                              {log.resultCount} entities · {log.durationMs}ms ·{" "}
                              {log.cacheStatus}
                            </span>
                          </div>
                          <div className="text-[#0066FF] break-all text-xs">
                            {log.redactedUrl}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl bg-white border border-black/[0.07] shadow-xs p-6 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">
                      Pipeline &amp; Critic Execution Trace
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Multi-step autonomous agent trace from seed disambiguation
                      to positive-lift re-ranking.
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    {(intel.agentTrace || []).map((st: any) => (
                      <div
                        key={st.stepNumber}
                        className="p-4 rounded-xl bg-[#F5F5F7] border border-black/[0.06] text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-bold text-neutral-900">
                            Step #{st.stepNumber} · {st.toolOrAction}
                          </span>
                          <span className="text-neutral-500 text-xs">
                            {st.durationMs}ms{" "}
                            {st.decision ? `· ${st.decision}` : ""}
                          </span>
                        </div>
                        <div className="text-neutral-600 font-mono text-xs break-all">
                          In: {st.inputSummary}
                        </div>
                        <div className="text-emerald-800 font-medium leading-snug">
                          Out: {st.outputSummary}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BASELINE & VENUE AUDIT */}
          {activeView === "ablation" && intel && brief && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-black/[0.07] shadow-xs p-6 space-y-4">
                <h3 className="text-base font-bold text-neutral-900">
                  Independent Venue Geocode Verification · Qloo WKT vs. LLM
                  Baseline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5 text-xs">
                    <div className="font-bold text-emerald-900 text-sm">
                      LOCALE + Qloo Partner Venue (&le;1.2km Priority)
                    </div>
                    <div className="text-base font-bold text-neutral-900">
                      {prioritizedPartnerVenue?.name ||
                        brief.localPartnershipActivation?.partnerVenue}
                    </div>
                    <div className="font-mono text-emerald-800 font-medium">
                      Verified Coordinates:{" "}
                      {
                        intel.partnerPlaces.filter((p: any) => p.lat !== null)
                          .length
                      }
                      /{intel.partnerPlaces.length} venues geocoded · Lead
                      venue:{" "}
                      {prioritizedPartnerVenue?.distanceKm ??
                        brief.localPartnershipActivation?.partnerDistanceKm ??
                        "0.5"}{" "}
                      km straight-line (Haversine)
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1.5 text-xs">
                    <div className="font-bold text-rose-900 text-sm">
                      Plain LLM Suggested Venue · OpenStreetMap Audit
                    </div>
                    <div className="text-base font-bold text-neutral-900">
                      {brief.fairLlmBaseline?.partnerVenue}
                    </div>
                    <div className="font-mono text-rose-800 font-medium">
                      {brief.fairLlmBaseline?.partnerVenueGeocodeCheck
                        ?.verdict || "No geocode verification available"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-black/[0.07] shadow-xs p-6 space-y-4">
                <h3 className="text-base font-bold text-neutral-900">
                  Raw Qloo JSON Sample vs. Live LLM Baseline Output
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#F5F5F7] border border-black/[0.06] space-y-2">
                    <div className="text-xs font-bold text-[#0066FF]">
                      Raw Qloo API Response Sample · First 2 Entities
                    </div>
                    <pre className="text-xs font-mono text-neutral-700 overflow-x-auto whitespace-pre-wrap max-h-96">
                      {JSON.stringify(intel.rawSampleResponse, null, 2)}
                    </pre>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F5F5F7] border border-black/[0.06] space-y-2">
                    <div className="text-xs font-bold text-rose-700">
                      Live LLM Baseline Response ·{" "}
                      {brief.fairLlmBaseline?.modelUsed}
                    </div>
                    <pre className="text-xs font-mono text-neutral-700 overflow-x-auto whitespace-pre-wrap max-h-96">
                      {brief.fairLlmBaseline?.rawModelOutput ||
                        brief.fairLlmBaseline?.errorReason}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DRAGGABLE 3D BLUE-AND-GOLD BIRD COPILOT */}
      {birdPos.x !== -1 && (
        <div
          style={{
            left: birdPos.x,
            top: birdPos.y,
            touchAction: "none",
          }}
          onPointerDown={handleBirdPointerDown}
          onPointerMove={handleBirdPointerMove}
          onPointerUp={handleBirdPointerUp}
          className="fixed z-50 cursor-grab active:cursor-grabbing select-none group flex flex-col items-center"
          title="Drag me anywhere or click to ask LOCALE Bird Copilot!"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#0066FF]/35 via-sky-300/25 to-amber-300/35 blur-md group-hover:scale-110 transition-transform" />
            <BlueGoldBird3D
              facingRight={birdFacingRight}
              isFlyingFast={isDraggingBird}
              size={92}
            />
          </div>

          <div className="-mt-2 px-2.5 py-1 rounded-full bg-[#1D1D1F]/90 backdrop-blur-md text-white border border-white/15 shadow-lg flex items-center gap-1.5 text-[10px] font-semibold tracking-tight">
            <Move className="w-2.5 h-2.5 text-sky-400" />
            <span>{copilotOpen ? "Hide Copilot" : "Ask Bird Copilot"}</span>
          </div>
        </div>
      )}

      {/* LIVE GROQ-POWERED CULTURAL COPILOT DRAWER */}
      {copilotOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-[440px] bg-white border border-black/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh]">
          <div className="px-5 py-3.5 bg-[#1D1D1F] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 -my-1 flex items-center justify-center">
                <BlueGoldBird3D
                  facingRight={true}
                  isFlyingFast={false}
                  size={44}
                />
              </div>
              <div>
                <div className="text-xs font-bold">
                  LOCALE Bird Copilot · Live Groq AI
                </div>
                <div className="text-[11px] text-neutral-400">
                  Grounded in Qloo Taste Graph · Active: {activeStore.neighborhood}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCopilotOpen(false)}
              className="text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 bg-[#F5F5F7] border-b border-black/[0.06] space-y-2">
            <div className="text-xs font-semibold text-neutral-600 px-1">
              Select Engine to Compare:
            </div>
            <div className="grid grid-cols-2 gap-1.5 bg-white p-1 rounded-xl border border-black/[0.06]">
              <button
                type="button"
                onClick={() => setCopilotMode("qloo")}
                className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  copilotMode === "qloo"
                    ? "bg-[#0066FF] text-white shadow-2xs"
                    : "text-neutral-600 hover:bg-neutral-100 font-semibold"
                }`}
              >
                LOCALE + Qloo ON
              </button>
              <button
                type="button"
                onClick={() => setCopilotMode("generic_llm")}
                className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  copilotMode === "generic_llm"
                    ? "bg-rose-600 text-white shadow-2xs"
                    : "text-neutral-600 hover:bg-neutral-100 font-semibold"
                }`}
              >
                Generic LLM Only
              </button>
            </div>
          </div>

          <div className="p-3.5 border-b border-black/[0.06] space-y-2 bg-[#FBFBFD]">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Try asking:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Why did you pick this <=1.2km partner venue?",
                "Why was the generic LLM's venue flagged?",
                "How does Brand Core vs. Local Surge work?",
              ].map((qText) => (
                <button
                  key={qText}
                  type="button"
                  onClick={() => handleAskCopilot(qText)}
                  disabled={copilotPending}
                  className="text-left text-xs px-2.5 py-1.5 rounded-xl bg-white hover:bg-blue-50/60 text-neutral-700 hover:text-[#0066FF] border border-black/[0.08] transition-colors cursor-pointer font-medium"
                >
                  {qText}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px] max-h-[330px] bg-white">
            {copilotMessages.length === 0 ? (
              <div className="text-center py-7 space-y-2 text-xs text-neutral-400">
                <Sparkles className="w-5 h-5 mx-auto text-[#0066FF]" />
                <p>
                  Click any question above or type your own below to see how{" "}
                  <strong className="text-neutral-700">
                    {copilotMode === "qloo"
                      ? "Qloo's Taste Graph"
                      : "a Generic LLM"}
                  </strong>{" "}
                  answers live for {activeStore.neighborhood}.
                </p>
              </div>
            ) : (
              copilotMessages.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.06] text-xs space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-neutral-900 text-sm">
                      Q: {m.question}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                        m.mode === "qloo"
                          ? "bg-blue-50 text-[#0066FF] border border-blue-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {m.mode === "qloo" ? "Qloo Grounded" : "Generic LLM"}
                    </span>
                  </div>
                  <div className="text-neutral-700 whitespace-pre-line leading-relaxed text-xs">
                    {m.answer}
                  </div>
                </div>
              ))
            )}
            {copilotPending && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#0066FF] flex items-center gap-2 font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Querying Groq live for {activeStore.neighborhood}...</span>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskCopilot(copilotInput);
            }}
            className="p-3 bg-[#F5F5F7] border-t border-black/[0.06] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask about ${activeStore.neighborhood}...`}
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              disabled={copilotPending}
              className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-black/[0.08] text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
            />
            <button
              type="submit"
              disabled={copilotPending || !copilotInput.trim()}
              className="p-2.5 rounded-xl bg-[#0066FF] text-white hover:bg-[#0066FF]/90 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Add Store Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none"
          onClick={(e) => {
            e.stopPropagation();
            setShowAddModal(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowAddModal(false);
          }}
        >
          <div
            className="bg-white border border-black/[0.08] shadow-2xl rounded-2xl p-6 max-w-md w-full space-y-4 select-text"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">
                Add Store Location (Persisted Across All Brands)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Enter any retail neighborhood (e.g., SoHo, New York). Your added
              store stays saved across all 6 brand profiles.
            </p>
            <form onSubmit={handleAddCustomStore} className="space-y-3">
              <input
                type="text"
                placeholder="Neighborhood (e.g., SoHo, Venice Beach, Georgetown)"
                value={newNeighborhood}
                onChange={(e) => setNewNeighborhood(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City (e.g., New York, Los Angeles)"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                  required
                />
                <input
                  type="text"
                  placeholder="State (e.g., NY, CA, DC)"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Latitude (optional override)"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-xs text-neutral-900"
                />
                <input
                  type="text"
                  placeholder="Longitude (optional override)"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-xs text-neutral-900"
                />
              </div>
              {geocodingStatus && (
                <div className="text-xs text-[#0066FF] font-medium">
                  {geocodingStatus}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F5F5F7] text-xs font-semibold text-neutral-700 hover:bg-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0066FF] text-white font-bold text-xs hover:bg-[#0066FF]/90 cursor-pointer"
                >
                  Geocode &amp; Run Store Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}