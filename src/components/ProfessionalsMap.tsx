"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Professional, Area } from "@/lib/types";

interface Props {
  professionals: Professional[];
  area: Area;
}

// Planity-style split view: a light, clean embedded map showing every
// professional on this page as a pin. Uses Leaflet + CARTO's free light
// basemap (no API key, no billing) rather than the Google Maps JS API.
// Professionals without geocoded coordinates (scripts/geocode.mjs missed
// their address) are placed on a small ring around the area's centre so
// the map still reflects them approximately rather than dropping them.
export function ProfessionalsMap({ professionals, area }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let map: import("leaflet").Map | undefined;

    async function init() {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([area.mapCenter.lat, area.mapCenter.lng], 15);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="background:#5b21b6;width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.45);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 16],
        popupAnchor: [0, -16],
      });

      const bounds: [number, number][] = [];
      professionals.forEach((p, i) => {
        let lat = p.lat;
        let lng = p.lng;
        if (lat == null || lng == null) {
          const angle = (i / Math.max(professionals.length, 1)) * Math.PI * 2;
          lat = area.mapCenter.lat + Math.cos(angle) * 0.0035;
          lng = area.mapCenter.lng + Math.sin(angle) * 0.0035;
        }
        const marker = L.marker([lat, lng], { icon }).addTo(map!);
        const rating = p.ratingLabel ? `<div style="color:#666;font-size:12px;margin-top:2px;">${escapeHtml(p.ratingLabel)}</div>` : "";
        marker.bindPopup(
          `<div style="font-family:inherit;"><strong style="font-size:13px;">${escapeHtml(p.name)}</strong>${rating}</div>`,
        );
        bounds.push([lat, lng]);
      });

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [32, 32], maxZoom: 16 });
      }
    }

    init();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [professionals, area]);

  return <div ref={containerRef} className="h-full w-full rounded-2xl overflow-hidden border border-border" />;
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}
