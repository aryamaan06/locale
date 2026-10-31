"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { StoreLocation } from "@/lib/stores-data";
import { Maximize2, Minimize2, MapPin, Navigation } from "lucide-react";

interface PartnerPlacePin {
  name: string;
  entity_id: string;
  address?: string;
  lat: number | null;
  lng: number | null;
  distanceKm: number | null;
  affinityScore: number | null;
}

interface LocaleMapProps {
  stores: StoreLocation[];
  activeStore: StoreLocation;
  onSelectStore: (storeId: string) => void;
  partnerPlaces: PartnerPlacePin[];
  comparisonMode: "qloo" | "plain_llm";
  isFleetView?: boolean;
}

function MapViewUpdater({
  lat,
  lng,
  isExpanded,
  isFleetView,
}: {
  lat: number;
  lng: number;
  isExpanded: boolean;
  isFleetView?: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (isFleetView) {
        map.setView([38.0, -30.0], 2, { animate: true });
      } else {
        map.setView([lat, lng], isExpanded ? 14 : 13, { animate: true });
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [lat, lng, isExpanded, isFleetView, map]);

  return null;
}

export default function LocaleMap({
  stores,
  activeStore,
  onSelectStore,
  partnerPlaces,
  comparisonMode,
  isFleetView,
}: LocaleMapProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  const validPartnerPins = (partnerPlaces || []).filter(
    (p) => typeof p.lat === "number" && typeof p.lng === "number"
  );

  const renderLeafletCanvas = (heightClass: string) => (
    <div className={`relative w-full ${heightClass} overflow-hidden`}>
      <style>{`
        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>

      <MapContainer
        center={[activeStore.lat, activeStore.lng]}
        zoom={isExpanded ? 14 : 13}
        scrollWheelZoom={true}
        attributionControl={false}
        className="w-full h-full z-10"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapViewUpdater
          lat={activeStore.lat}
          lng={activeStore.lng}
          isExpanded={isExpanded}
          isFleetView={isFleetView}
        />

        {/* Outer Search Ring (Blue / Red in LLM mode) - only in single store view */}
        {!isFleetView && (
          <Circle
            center={[activeStore.lat, activeStore.lng]}
            radius={activeStore.radiusKm * 1000}
            pathOptions={{
              color: comparisonMode === "qloo" ? "#0066FF" : "#E11D48",
              weight: 1.5,
              dashArray: "6 6",
              fillColor: comparisonMode === "qloo" ? "#0066FF" : "#E11D48",
              fillOpacity: 0.05,
            }}
          />
        )}

        {/* Inner 1.2km Priority Neighborhood Zone (Green) - only in single store view */}
        {!isFleetView && comparisonMode === "qloo" && (
          <Circle
            center={[activeStore.lat, activeStore.lng]}
            radius={1200}
            pathOptions={{
              color: "#10B981",
              weight: 1.5,
              dashArray: "3 4",
              fillColor: "#10B981",
              fillOpacity: 0.06,
            }}
          />
        )}

        {/* Other Stores in Chain */}
        {stores
          .filter((s) => s.id !== activeStore.id)
          .map((st) => (
            <CircleMarker
              key={st.id}
              center={[st.lat, st.lng]}
              radius={isFleetView ? 8 : 6}
              pathOptions={{
                color: "#FFFFFF",
                weight: 2,
                fillColor: "#1D1D1F",
                fillOpacity: 0.85,
              }}
              eventHandlers={{
                click: () => onSelectStore(st.id),
              }}
            >
              <Tooltip direction="top" offset={[0, -6]}>
                <span className="font-sans text-xs font-semibold">
                  {st.neighborhood} · {st.city}
                </span>
              </Tooltip>
            </CircleMarker>
          ))}

        {/* Verified Neighborhood Partner Venues - only in single store view */}
        {!isFleetView &&
          comparisonMode === "qloo" &&
          validPartnerPins.map((place, idx) => {
            const isCloseMatch =
              place.distanceKm !== null && place.distanceKm <= 1.25;
            return (
              <CircleMarker
                key={`${place.entity_id}-${idx}`}
                center={[place.lat as number, place.lng as number]}
                radius={idx === 0 ? 10 : isExpanded ? 9 : 8}
                pathOptions={{
                  color: "#FFFFFF",
                  weight: idx === 0 ? 3 : 2,
                  fillColor: isCloseMatch ? "#FF3B30" : "#FB923C",
                  fillOpacity: 0.95,
                }}
              >
                <Tooltip direction="top" offset={[0, -8]}>
                  <div className="font-sans text-xs">
                    <div className="font-bold text-neutral-900">
                      {idx === 0 ? `Lead Partner: ${place.name}` : place.name}
                    </div>
                    <div className="text-[11px] text-neutral-600">
                      {place.distanceKm !== null
                        ? `${place.distanceKm} km straight-line (Haversine)`
                        : "Inside search ring"}
                    </div>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="font-sans text-xs space-y-1 min-w-[190px]">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF3B30] font-semibold">
                      {isCloseMatch
                        ? "Priority Partner (<= 1.2km)"
                        : "Outer Search Ring (> 1.2km)"}
                    </div>
                    <div className="font-bold text-sm text-neutral-900">
                      {place.name}
                    </div>
                    {place.address && (
                      <div className="text-neutral-500 text-[11px]">
                        {place.address}
                      </div>
                    )}
                    <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-neutral-700 border-t border-neutral-200">
                      <span>
                        Straight-line:{" "}
                        <strong>
                          {place.distanceKm !== null
                            ? `${place.distanceKm} km`
                            : "In ring"}
                        </strong>
                      </span>
                      <span>
                        Affinity:{" "}
                        <strong>
                          {place.affinityScore
                            ? `${Math.round(place.affinityScore * 100)}%`
                            : "High"}
                        </strong>
                      </span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {/* Active Store Pin */}
        <CircleMarker
          center={[activeStore.lat, activeStore.lng]}
          radius={isExpanded ? 11 : 10}
          pathOptions={{
            color: "#FFFFFF",
            weight: 3,
            fillColor: "#0066FF",
            fillOpacity: 1,
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} permanent={isExpanded}>
            <div className="font-sans text-xs font-bold text-[#0066FF]">
              {activeStore.name} · {activeStore.radiusKm}km Ring
            </div>
          </Tooltip>
          <Popup>
            <div className="font-sans text-xs space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#0066FF] font-semibold">
                Active Store Location
              </div>
              <div className="font-bold text-sm text-neutral-900">
                {activeStore.name}
              </div>
              <div className="text-neutral-600">{activeStore.address}</div>
              <div className="text-[11px] font-mono text-neutral-500">
                1.2km Neighborhood Partner Ring · {activeStore.radiusKm}km Outer
                Taste Ring
              </div>
            </div>
          </Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );

  return (
    <>
      <div className="rounded-2xl bg-white border border-black/[0.08] shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-[#FBFBFD] border-b border-black/[0.06] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="font-semibold text-neutral-900 flex items-center gap-1.5 text-sm">
              <Navigation className="w-4 h-4 text-[#0066FF]" />
              {isFleetView
                ? `Global Retail Fleet Matrix · ${stores.length} Stores Worldwide`
                : `${activeStore.neighborhood}, ${activeStore.city}`}
            </span>

            {/* Clear Legend Explaining Both Rings or Fleet View */}
            {isFleetView ? (
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#0066FF] border-2 border-white shadow-2xs inline-block" />
                  Selected: {activeStore.neighborhood}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1D1D1F] border-2 border-white shadow-2xs inline-block" />
                  Fleet Locations ({stores.length} Stores)
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  (Click any pin to inspect store)
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#0066FF] border-2 border-white shadow-2xs inline-block" />
                  Active Store
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#10B981] inline-block" />
                  1.2km Walkable Partner Zone
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-[#0066FF] inline-block" />
                  {activeStore.radiusKm}km Outer Search Ring
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF3B30] border-2 border-white shadow-2xs inline-block" />
                  Walkable Partner (&le; 1.25km)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FB923C] border-2 border-white shadow-2xs inline-block" />
                  Outer Catchment (1.25 - 2.5km)
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#1D1D1F] hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Expand Map
          </button>
        </div>

        {renderLeafletCanvas("h-[330px]")}
      </div>

      {isExpanded && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="bg-white border border-black/10 rounded-3xl shadow-2xl w-full max-w-6xl h-[84vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-[#FBFBFD] border-b border-black/[0.07] flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-base font-bold text-neutral-900">
                    {activeStore.name} — Geospatial Radius
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  Green inner circle indicates the 1.2km immediate neighborhood
                  zone. Red pins show non-lodging cultural venues verified
                  against Qloo UUIDs.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  Close Map
                </button>
              </div>
            </div>

            <div className="px-6 py-2.5 bg-[#F5F5F7] border-b border-black/[0.06] flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mr-2 shrink-0 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Store:
              </span>
              {stores.map((st) => {
                const active = st.id === activeStore.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onSelectStore(st.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                      active
                        ? "bg-[#0066FF] text-white font-semibold shadow-2xs"
                        : "bg-white text-neutral-700 hover:bg-neutral-100 border border-black/[0.06]"
                    }`}
                  >
                    {st.neighborhood}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 min-h-0">{renderLeafletCanvas("h-full")}</div>
          </div>
        </div>
      )}
    </>
  );
}