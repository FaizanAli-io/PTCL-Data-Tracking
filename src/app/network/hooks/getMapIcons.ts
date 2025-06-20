import type L from "leaflet";

export function getMapIcons(): {
  userIcon: L.Icon;
  fdhIcon: L.Icon;
  fatIcon: L.Icon;
  dcIcon: L.Icon;
  dpIcon: L.Icon;
} {
  if (typeof window === "undefined") {
    throw new Error("getMapIcons must be called on the client");
  }

  const L = require("leaflet");

  const createIcon = (svg: string, size: number) =>
    new L.Icon({
      iconUrl: "data:image/svg+xml;base64," + btoa(svg),
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -(size / 2)]
    });

  const userIcon = new L.Icon({
    iconUrl:
      "data:image/svg+xml;base64," +
      btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="red" stroke="#ffffff" stroke-width="2"/>
      <circle cx="12" cy="12" r="6" fill="#ffffff"/>
      <circle cx="12" cy="12" r="3" fill="red"/>
    </svg>
  `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });

  return {
    userIcon,
    fdhIcon: createIcon(
      `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
    <rect x="5" y="5" width="14" height="14" rx="2" fill="#7e22ce" stroke="#000000" stroke-width="1.5"/>
    <line x1="9" y1="5" x2="9" y2="19" stroke="#ffffff" stroke-width="1"/>
    <line x1="15" y1="5" x2="15" y2="19" stroke="#ffffff" stroke-width="1"/>
  </svg>
  `,
      28
    ),

    fatIcon: createIcon(
      `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
    <polygon points="12,5 6,20 18,20" fill="#b91c1c" stroke="#000000" stroke-width="1.5"/>
    <line x1="5" y1="5" x2="19" y2="5" stroke="#000000" stroke-width="1.5"/>
  </svg>
  `,
      28
    ),

    dcIcon: createIcon(
      `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
    <rect x="5" y="5" width="14" height="14" rx="2" fill="#059669" stroke="#000000" stroke-width="1.5"/>
    <line x1="9" y1="5" x2="9" y2="19" stroke="#ffffff" stroke-width="1"/>
    <line x1="15" y1="5" x2="15" y2="19" stroke="#ffffff" stroke-width="1"/>
  </svg>
  `,
      28
    ),

    dpIcon: createIcon(
      `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
    <polygon points="12,5 6,20 18,20" fill="#2563eb" stroke="#000000" stroke-width="1.5"/>
    <line x1="5" y1="5" x2="19" y2="5" stroke="#000000" stroke-width="1.5"/>
  </svg>
  `,
      28
    )
  };
}
