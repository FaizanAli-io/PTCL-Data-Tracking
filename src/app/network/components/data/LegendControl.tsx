"use client";

import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

type Props = {
  userIconUrl: string;
  fdhIconUrl: string;
  fatIconUrl: string;
};

export default function LegendControl({ userIconUrl, fdhIconUrl, fatIconUrl }: Props) {
  const map = useMap();

  useEffect(() => {
    const legend = (L.control as unknown as (opts: L.ControlOptions) => L.Control)({
      position: "bottomright"
    });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      div.innerHTML = `
        <div style="background: rgba(0,0,0,0.6); backdrop-filter: blur(6px); padding: 10px 12px; border-radius: 12px; color: white; font-size: 13px; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
          <div style="margin-bottom: 6px;">🔍 <strong>Legend</strong></div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <img src="${userIconUrl}" width="20" height="20" />
            <span>Your Location</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">
            <img src="${fdhIconUrl}" width="20" height="20" />
            <span>FDH</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">
            <img src="${fatIconUrl}" width="20" height="20" />
            <span>FAT</span>
          </div>
        </div>
      `;
      return div;
    };

    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map, userIconUrl, fdhIconUrl, fatIconUrl]);

  return null;
}
