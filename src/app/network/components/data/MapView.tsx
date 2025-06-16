"use client";

import L from "leaflet";
import { useEffect, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

type Props = {
  userPos: { lat: number; lng: number };
  fdh: any[];
  fat: any[];
};

export default function MapView({ userPos, fdh, fat }: Props) {
  // Create custom icons
  const userIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl:
          "data:image/svg+xml;base64," +
          btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <circle cx="12" cy="12" r="10" fill="#8b5cf6" stroke="#ffffff" stroke-width="2"/>
        <circle cx="12" cy="12" r="6" fill="#ffffff"/>
        <circle cx="12" cy="12" r="3" fill="#8b5cf6"/>
      </svg>
    `),
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      }),
    []
  );

  const fdhIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl:
          "data:image/svg+xml;base64," +
          btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
        <path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7l-8-5z" fill="#10b981" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="3" fill="#ffffff"/>
      </svg>
    `),
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      }),
    []
  );

  const fatIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl:
          "data:image/svg+xml;base64=" +
          btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26">
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="3" fill="#ffffff"/>
      </svg>
    `),
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -13]
      }),
    []
  );

  useEffect(() => {
    // Fix default markers
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "/leaflet/images/marker-icon.png",
      shadowUrl: "/leaflet/images/marker-shadow.png",
      iconRetinaUrl: "/leaflet/images/marker-icon-2x.png"
    });

    // Add custom CSS for map styling
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
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <MapContainer
      center={[userPos.lat, userPos.lng]}
      zoom={14}
      scrollWheelZoom
      style={{ height: "500px", width: "100%" }}
      className="rounded-2xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* User position marker */}
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

      {/* FDH markers */}
      {fdh.map((item, i) => {
        const lat = parseFloat(item.LAT);
        const lng = parseFloat(item.LOG);

        if (isNaN(lat) || isNaN(lng)) return null;

        return (
          <Marker key={`fdh-${i}`} position={[lat, lng]} icon={fdhIcon}>
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-base mb-2">🏢 FDH Location</div>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>ID:</strong> {item["FDH NO"] || item["FDH"] || "N/A"}
                  </div>
                  <div className="opacity-90">
                    📍 {lat.toFixed(6)}, {lng.toFixed(6)}
                  </div>
                  {item.ADDRESS && (
                    <div className="mt-2 pt-2 border-t border-purple-300/30">
                      <strong>Address:</strong> {item.ADDRESS}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* FAT markers */}
      {fat.map((item, i) => {
        const lat = parseFloat(item.LAT);
        const lng = parseFloat(item.LOG);

        if (isNaN(lat) || isNaN(lng)) return null;

        return (
          <Marker key={`fat-${i}`} position={[lat, lng]} icon={fatIcon}>
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-base mb-2">📡 FAT Location</div>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>ID:</strong> {item["FAT#"] || "N/A"}
                  </div>
                  <div className="opacity-90">
                    📍 {lat.toFixed(6)}, {lng.toFixed(6)}
                  </div>
                  {item.ADDRESS && (
                    <div className="mt-2 pt-2 border-t border-purple-300/30">
                      <strong>Address:</strong> {item.ADDRESS}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
