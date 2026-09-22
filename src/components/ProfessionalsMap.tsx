"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Professional, Area } from "@/lib/types";
import { parseRating } from "@/lib/text";

interface Props {
  professionals: Professional[];
  area: Area;
}

// Planity-style split view: a light, clean embedded map showing every
// professional on this page as a pin. Uses Leaflet + plain OpenStreetMap
// raster tiles (genuinely no API key, no billing) rather than the Google
// Maps JS API. CARTO's basemap CDN used to work the same way key-free but
// now requires a free-tier API key, which is why this isn't pointed there.
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

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const pinIcon = L.divIcon({
        className: "",
        html: `<div style="background:#5b21b6;width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.45);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 16],
        popupAnchor: [0, -16],
      });
      // Fresha-style rating badge for pins where we have a real parsed
      // rating, plain teardrop otherwise (never fabricate a rating badge).
      function ratingIcon(value: string) {
        const width = 34 + value.length * 7;
        return L.divIcon({
          className: "",
          html: `<div style="background:#1f1f1f;color:white;font-size:11px;font-weight:700;padding:3px 8px;border-radius:999px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.45);border:1.5px solid white;">★ ${value}</div>`,
          iconSize: [width, 22],
          iconAnchor: [width / 2, 26],
          popupAnchor: [0, -26],
        });
      }

      const bounds: [number, number][] = [];
      professionals.forEach((p, i) => {
        let lat = p.lat;
        let lng = p.lng;
        if (lat == null || lng == null) {
          const angle = (i / Math.max(professionals.length, 1)) * Math.PI * 2;
          lat = area.mapCenter.lat + Math.cos(angle) * 0.0035;
          lng = area.mapCenter.lng + Math.sin(angle) * 0.0035;
        }
        const parsedRating = parseRating(p.ratingLabel);
        const icon = parsedRating ? ratingIcon(parsedRating.value) : pinIcon;
        const marker = L.marker([lat, lng], { icon }).addTo(map!);
        const ratingHtml = p.ratingLabel ? `<div style="color:#666;font-size:12px;margin-top:2px;">${escapeHtml(p.ratingLabel)}</div>` : "";
        marker.bindPopup(
          `<div style="font-family:inherit;"><strong style="font-size:13px;">${escapeHtml(p.name)}</strong>${ratingHtml}</div>`,
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
