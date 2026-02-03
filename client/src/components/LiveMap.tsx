import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";
import { TrendingUp, Volume2, MapPin, Clock } from "lucide-react";
import Recorder from "./Recorder";

interface SoundPoint {
  lat: number;
  lng: number;
  label: string;
  confidence: number;
  timestamp: string;
}

const HeatmapLayer = ({ points }: { points: Array<[number, number, number]> }) => {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);
  const [zoom, setZoom] = useState<number | null>(null);

  useEffect(() => {
    if (!map) return;
    const onZoom = () => setZoom(map.getZoom());
    map.on('zoomend', onZoom);
    setZoom(map.getZoom());
    return () => {
      map.off('zoomend', onZoom);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    if (heatLayerRef.current) {
      try {
        map.removeLayer(heatLayerRef.current);
      } catch (e) {
        console.warn("Layer already removed");
      }
      heatLayerRef.current = null;
    }

    if (points.length > 0) {
      // Zoom-aware radius
      const z = zoom ?? map.getZoom();
      const radius = Math.max(10, Math.min(60, (z || 12) * 2 + 8));
      const blur = Math.round(radius * 0.7);
      heatLayerRef.current = (L as any).heatLayer(points, {
        radius,
        blur,
        maxZoom: 19,
        max: 1.0,
        gradient: {
          0.0: "rgba(0, 0, 255, 0)",
          0.2: "rgba(0, 255, 255, 0.3)",
          0.4: "rgba(0, 255, 0, 0.5)",
          0.6: "rgba(255, 255, 0, 0.7)",
          0.8: "rgba(255, 165, 0, 0.8)",
          1.0: "rgba(255, 0, 0, 1)",
        },
      }).addTo(map);
    }

    return () => {
      if (heatLayerRef.current) {
        try {
          if (map && map.hasLayer && map.hasLayer(heatLayerRef.current)) {
            map.removeLayer(heatLayerRef.current);
          }
        } catch (e) {
          console.warn("Error removing heatmap layer:", e);
        }
        heatLayerRef.current = null;
      }
    };
  }, [map, points, zoom]);

  return null;
};

// Interactive overlay using raw Leaflet circle markers + tooltips (avoids dependency exports issues)
const InteractiveMarkers = ({ markers }: { markers: SoundPoint[] }) => {
  const map = useMap();
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!map) return;
    // Clear previous group
    if (layerGroupRef.current) {
      layerGroupRef.current.clearLayers();
      map.removeLayer(layerGroupRef.current);
      layerGroupRef.current = null;
    }
    layerGroupRef.current = L.layerGroup();

    markers.forEach((m) => {
      const circle = L.circleMarker([m.lat, m.lng], {
        radius: 8,
        color: 'transparent',
        weight: 0,
        fillColor: 'transparent',
        fillOpacity: 0,
      });

      circle.on('mouseover', () => {
        circle.setStyle({
          color: '#ffffff',
          weight: 2,
          fillColor: '#ffffff',
          fillOpacity: 0.3,
        });
      });
      circle.on('mouseout', () => {
        circle.setStyle({
          color: 'transparent',
          weight: 0,
          fillColor: 'transparent',
          fillOpacity: 0,
        });
      });

      const html = `<div class="p-2 min-w-[180px]">
          <div class="font-bold text-sm mb-1">${m.label.split('(')[0].trim()}</div>
          <div class="text-xs space-y-1">
            <div class="flex justify-between"><span class="opacity-70">Confidence:</span><span class="font-semibold">${(m.confidence * 100).toFixed(1)}%</span></div>
            <div class="flex justify-between"><span class="opacity-70">Location:</span><span class="font-mono">${m.lat.toFixed(3)}, ${m.lng.toFixed(3)}</span></div>
            <div class="opacity-70 pt-1 border-t">${new Date(m.timestamp).toLocaleString()}</div>
          </div>
        </div>`;
      circle.bindTooltip(html, { direction: 'top', offset: [0, -10], opacity: 0.95, className: 'custom-tooltip' });
      circle.addTo(layerGroupRef.current!);
    });

    layerGroupRef.current.addTo(map);
    return () => {
      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
        map.removeLayer(layerGroupRef.current);
        layerGroupRef.current = null;
      }
    };
  }, [map, markers]);

  return null;
};

// Hover probe to summarize noise distribution around cursor
type ProbeInfo = {
  lat: number;
  lng: number;
  count: number;
  avgConfidence: number;
  top: Array<{ label: string; count: number }>;
} | null;

const HoverProbe = ({
  markers,
  radius = 60,
  onUpdate,
}: {
  markers: SoundPoint[];
  radius?: number; // meters
  onUpdate: (info: ProbeInfo) => void;
}) => {
  const map = useMap();
  const probeCircleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!map) return;

    const onMove = (e: L.LeafletMouseEvent) => {
      const { latlng } = e;
      // Update circle
      if (!probeCircleRef.current) {
        probeCircleRef.current = L.circle(latlng, {
          radius,
          color: '#06b6d4',
          weight: 1,
          fillColor: '#06b6d4',
          fillOpacity: 0.08,
        }).addTo(map);
      } else {
        probeCircleRef.current.setLatLng(latlng);
        probeCircleRef.current.setRadius(radius);
      }

      // Aggregate within radius
      const counts: Record<string, number> = {};
      let total = 0;
      let confSum = 0;
      markers.forEach((m) => {
        const d = latlng.distanceTo(L.latLng(m.lat, m.lng));
        if (d <= radius) {
          const label = m.label.split('(')[0].trim();
          counts[label] = (counts[label] || 0) + 1;
          confSum += m.confidence;
          total += 1;
        }
      });
      const top = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([label, count]) => ({ label, count }));
      onUpdate({
        lat: latlng.lat,
        lng: latlng.lng,
        count: total,
        avgConfidence: total ? confSum / total : 0,
        top,
      });
    };

    const onOut = () => {
      if (probeCircleRef.current) {
        map.removeLayer(probeCircleRef.current);
        probeCircleRef.current = null;
      }
      onUpdate(null);
    };

    map.on('mousemove', onMove);
    map.on('mouseout', onOut);
    map.on('dragstart', onOut);
    return () => {
      map.off('mousemove', onMove);
      map.off('mouseout', onOut);
      map.off('dragstart', onOut);
      if (probeCircleRef.current) {
        map.removeLayer(probeCircleRef.current);
        probeCircleRef.current = null;
      }
    };
  }, [map, markers, radius, onUpdate]);

  return null;
};

// Simple locate control button
const LocateButton = () => {
  const map = useMap();
  useEffect(() => {
    // nothing on mount
  }, []);
  const handleLocate = () => {
    if (!map) return;
    map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
  };
  return (
    <div className="leaflet-top leaflet-right z-[1200]">
      <div className="leaflet-control">
        <button
          onClick={handleLocate}
          className="m-2 px-3 py-1.5 rounded-md bg-card/95 border border-border shadow text-sm hover:border-primary/40"
          title="Locate me"
        >
          Locate me
        </button>
      </div>
    </div>
  );
};

function RecenterMap({ lat, lng }: { lat?: number; lng?: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15, { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

const LiveMap = () => {
  const [soundPoints, setSoundPoints] = useState<[number, number, number][]>([]);
  const [soundMarkers, setSoundMarkers] = useState<SoundPoint[]>([]);
  const [selectedSound, setSelectedSound] = useState<SoundPoint | null>(null);
  const [probeInfo, setProbeInfo] = useState<ProbeInfo>(null);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [timeWindow, setTimeWindow] = useState<"1h" | "6h" | "24h" | "all">("all");

  useEffect(() => {
    fetch("http://localhost:5000/history")
      .then((res) => res.json())
      .then((data) => {
        if (data.history) {
          const points: [number, number, number][] = [];
          const markers: SoundPoint[] = [];
          data.history.forEach((item: any) => {
            points.push([item.lat, item.lng, item.confidence]);
            markers.push({
              lat: item.lat,
              lng: item.lng,
              label: item.label,
              confidence: item.confidence,
              timestamp: item.timestamp,
            });
          });
          setSoundPoints(points);
          setSoundMarkers(markers);
        }
      })
      .catch((err) => console.error("Failed to fetch history:", err));
  }, []);

  // Unique categories derived from current data (label before '(')
  const categories = useMemo(() => {
    const set = new Set<string>();
    soundMarkers.forEach((m) => set.add(m.label.split("(")[0].trim()));
    return Array.from(set).sort();
  }, [soundMarkers]);

  // Compute time threshold in ms
  const timeThreshold = useMemo(() => {
    const now = Date.now();
    switch (timeWindow) {
      case "1h":
        return now - 1 * 60 * 60 * 1000;
      case "6h":
        return now - 6 * 60 * 60 * 1000;
      case "24h":
        return now - 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  }, [timeWindow]);

  // Apply filters to markers and points
  const filteredMarkers = useMemo(() => {
    return soundMarkers.filter((m) => {
      const label = m.label.split("(")[0].trim();
      const ts = new Date(m.timestamp).getTime();
      const inTime = timeThreshold === 0 || ts >= timeThreshold;
      const inCat =
        selectedCategories.length === 0 || selectedCategories.includes(label);
      return inTime && inCat;
    });
  }, [soundMarkers, selectedCategories, timeThreshold]);

  const filteredPoints = useMemo<[number, number, number][]>(() => {
    return filteredMarkers.map((m) => [m.lat, m.lng, m.confidence]);
  }, [filteredMarkers]);

  const handleNewSound = (
    lat: number,
    lng: number,
    results: Array<{ label: string; confidence: number }>
  ) => {
    if (lat && lng && results.length > 0) {
      const topResult = results.reduce((max, r) =>
        r.confidence > max.confidence ? r : max
      );

      setSoundPoints((prev) => [...prev, [lat, lng, topResult.confidence]]);

      const newMarker = {
        lat,
        lng,
        label: results
          .map((r) => `${r.label} (${(r.confidence * 100).toFixed(1)}%)`)
          .join(", "),
        confidence: topResult.confidence,
        timestamp: new Date().toISOString(),
      };

      setSoundMarkers((prev) => [newMarker, ...prev]);
      setSelectedSound(newMarker);
    }
  };

  const getCategoryStats = () => {
    const categories: { [key: string]: number } = {};
    filteredMarkers.forEach((marker) => {
      const mainLabel = marker.label.split("(")[0].trim();
      categories[mainLabel] = (categories[mainLabel] || 0) + 1;
    });
    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  // Export helpers
  const download = (content: string, filename: string, mime = "text/plain") => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const header = ["lat", "lng", "label", "confidence", "timestamp"]; 
    const rows = filteredMarkers.map((m) => [
      m.lat,
      m.lng,
      m.label.split("(")[0].trim(),
      m.confidence,
      m.timestamp,
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    download(csv, "noise-data.csv", "text/csv");
  };

  const exportGeoJSON = () => {
    const fc = {
      type: "FeatureCollection",
      features: filteredMarkers.map((m) => ({
        type: "Feature",
        properties: {
          label: m.label.split("(")[0].trim(),
          confidence: m.confidence,
          timestamp: m.timestamp,
        },
        geometry: {
          type: "Point",
          coordinates: [m.lng, m.lat],
        },
      })),
    } as const;
    download(JSON.stringify(fc), "noise-data.geojson", "application/geo+json");
  };

  return (
    <section id="live-map" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Real-Time <span className="text-primary">Noise Map</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Record sounds and see them visualized on the map with AI-powered classification
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <Recorder onSoundClassified={handleNewSound} />
        </div>

        {/* Controls row */}
        <div className="max-w-7xl mx-auto mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Category filters */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Filter:</span>
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(cat)
                          ? prev.filter((c) => c !== cat)
                          : [...prev, cat]
                      )
                    }
                    className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                      active
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-card/50 border-border hover:border-primary/40"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
              {categories.length === 0 && (
                <span className="text-sm text-muted-foreground">No categories yet</span>
              )}
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="ml-2 text-xs text-muted-foreground underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          {/* Time window & export */}
          <div className="flex flex-wrap gap-2 items-center justify-start lg:justify-end">
            <div className="flex items-center gap-2 mr-2">
              <span className="text-sm text-muted-foreground">Time:</span>
              {["1h", "6h", "24h", "all"].map((tw) => (
                <button
                  key={tw}
                  onClick={() => setTimeWindow(tw as any)}
                  className={`px-2.5 py-1 rounded-md border text-sm ${
                    timeWindow === tw
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-card/50 border-border hover:border-primary/40"
                  }`}
                >
                  {tw}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="px-2.5 py-1 rounded-md border bg-card/50 border-border hover:border-primary/40 text-sm"
              >
                Export CSV
              </button>
              <button
                onClick={exportGeoJSON}
                className="px-2.5 py-1 rounded-md border bg-card/50 border-border hover:border-primary/40 text-sm"
              >
                Export GeoJSON
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative bg-secondary rounded-3xl overflow-hidden border border-primary/20 glow-teal">
              <div className="absolute top-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-xl p-4 border border-border shadow-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-primary" />
                  Heat Intensity
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-3 rounded" style={{ background: "linear-gradient(to right, rgba(0,0,255,0.3), rgba(0,255,255,0.5))" }} />
                    <span className="text-muted-foreground">Low</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-3 rounded" style={{ background: "linear-gradient(to right, rgba(0,255,0,0.5), rgba(255,255,0,0.7))" }} />
                    <span className="text-muted-foreground">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-3 rounded" style={{ background: "linear-gradient(to right, rgba(255,165,0,0.8), rgba(255,0,0,1))" }} />
                    <span className="text-muted-foreground">High</span>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-xl p-4 border border-border shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="font-semibold">Live Stats</span>
                </div>
                <div className="text-2xl font-bold text-primary">{filteredMarkers.length}</div>
                <div className="text-xs text-muted-foreground">Total recordings</div>
              </div>

              <MapContainer
                center={[28.61, 77.21]}
                zoom={13}
                style={{ height: "70vh", width: "100%" }}
                className="rounded-3xl"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <HeatmapLayer points={filteredPoints} />
                <InteractiveMarkers markers={filteredMarkers} />
                <HoverProbe markers={filteredMarkers} radius={60} onUpdate={setProbeInfo} />
                <LocateButton />
                {selectedSound && (
                  <RecenterMap lat={selectedSound.lat} lng={selectedSound.lng} />
                )}
              </MapContainer>
              {/* Probe overlay card */}
              {probeInfo && (
                <div className="absolute left-1/2 -translate-x-1/2 top-4 z-[1100] bg-card/95 backdrop-blur-sm rounded-xl px-4 py-3 border border-border shadow-md">
                  <div className="text-xs text-muted-foreground">Within 60m • {probeInfo.count} sample{probeInfo.count===1?'':'s'}</div>
                  {probeInfo.count > 0 ? (
                    <div className="mt-1 text-sm">
                      <div className="flex gap-3">
                        {probeInfo.top.map((t) => (
                          <span key={t.label} className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30 text-xs">
                            {t.label} × {t.count}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Avg confidence: {(probeInfo.avgConfidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-muted-foreground">No samples nearby</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-secondary rounded-3xl p-6 border border-primary/20 h-full">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Detections
              </h3>

              {getCategoryStats().length > 0 && (
                <div className="mb-6 p-4 bg-card/50 rounded-xl">
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Top Categories</h4>
                  <div className="space-y-2">
                    {getCategoryStats().map(([label, count], idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-foreground">{label}</span>
                        <span className="text-primary font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 max-h-[calc(70vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                {filteredMarkers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No recordings yet. Start recording to see detections here!
                  </p>
                ) : (
                  filteredMarkers.map((marker, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedSound(marker)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-primary/50 ${
                        selectedSound === marker
                          ? "bg-primary/10 border-primary"
                          : "bg-card/50 border-border"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm mb-1 truncate">{marker.label.split("(")[0]}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span>{(marker.confidence * 100).toFixed(1)}% confidence</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            📍 {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(marker.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveMap;