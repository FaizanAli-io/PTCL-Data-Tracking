"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import LegendControl from "./LegendControl";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";

interface MapViewProps {
  userPos: { lat: number; lng: number };
  primaryData: any[];
  secondaryData: any[];
  primaryLabel: string;
  secondaryLabel: string;
  userIcon: L.Icon;
  primaryIcon: L.Icon;
  secondaryIcon: L.Icon;
}

export default function MapView({
  userPos,
  primaryData,
  secondaryData,
  primaryLabel,
  secondaryLabel,
  userIcon,
  primaryIcon,
  secondaryIcon
}: MapViewProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "/leaflet/images/marker-icon.png",
      shadowUrl: "/leaflet/images/marker-shadow.png",
      iconRetinaUrl: "/leaflet/images/marker-icon-2x.png"
    });

    const style = document.createElement("style");
    style.textContent = `
      .leaflet-popup-content-wrapper {
        background: rgba(139, 92, 246, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(147, 51, 234, 0.3);
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(139, 92, 246, 0.2);
      }
      .leaflet-popup-content {
        color: white;
        font-weight: 500;
        margin: 8px 12px;
        font-size: 14px;
      }
      .leaflet-popup-tip {
        background: rgba(139, 92, 246, 0.95);
        border: 1px solid rgba(147, 51, 234, 0.3);
      }
      .leaflet-control-zoom a {
        background: rgba(139, 92, 246, 0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(147, 51, 234, 0.3);
        color: white;
        border-radius: 8px;
        margin: 2px;
        font-weight: bold;
      }
      .leaflet-control-zoom a:hover {
        background: rgba(147, 51, 234, 0.9);
        transform: scale(1.05);
      }
      .leaflet-control-attribution {
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .leaflet-control-attribution a {
        color: #e5e7eb;
      }
      .leaflet-tooltip.label-tooltip {
        background: rgba(0, 0, 0, 0.75);
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        pointer-events: none;
      }
    `;

    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const renderMarkers = (data: any[], icon: L.Icon, label: string) =>
    data.map((item, i) => {
      const lat = parseFloat(item.LAT);
      const lng = parseFloat(item.LOG);
      if (isNaN(lat) || isNaN(lng)) return null;

      return (
        <Marker key={`${label}-${i}`} position={[lat, lng]} icon={icon}>
          <Tooltip direction="top" offset={[0, -10]} className="label-tooltip" sticky>
            <div className="space-y-1 text-xs">
              {Object.entries(item).map(([k, v]) => (
                <div key={k}>
                  <strong>{k}:</strong> {String(v)}
                </div>
              ))}
            </div>
          </Tooltip>
        </Marker>
      );
    });

  return (
    <MapContainer
      zoom={14}
      scrollWheelZoom
      className="rounded-2xl"
      center={[userPos.lat, userPos.lng]}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <LegendControl
        userIconUrl={userIcon.options.iconUrl as string}
        entries={[
          { iconUrl: primaryIcon.options.iconUrl as string, label: primaryLabel },
          { iconUrl: secondaryIcon.options.iconUrl as string, label: secondaryLabel }
        ]}
      />

      <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
        <Popup>
          <div className="text-center">
            <div className="font-semibold text-base mb-1">📍 Your Location</div>
            <div className="text-sm opacity-90">
              {userPos.lat.toFixed(6)}, {userPos.lng.toFixed(6)}
            </div>
          </div>
        </Popup>
      </Marker>

      {renderMarkers(primaryData, primaryIcon, primaryLabel)}
      {renderMarkers(secondaryData, secondaryIcon, secondaryLabel)}
    </MapContainer>
  );
}
