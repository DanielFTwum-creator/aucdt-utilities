import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { IPData, getIpAttackCount } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, RefreshCw, Zap, X, Layers, ZoomIn, ZoomOut, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Move } from "lucide-react";
import { getFlagEmoji } from "./IPTable";

interface IPMapProps {
  ipsData: IPData[];
  serverLocation: { name: string; lat: number; lon: number; countryCode: string };
  highlightedIp?: string | null;
  onHighlightIp?: (ip: string | null) => void;
  mitigationMode?: boolean;
}

// Map color palette
const JAIL_COLORS: Record<string, { dot: string; glow: string; text: string; bg: string }> = {
  ssh: {
    dot: "#3b82f6", // Blue
    glow: "rgba(59, 130, 246, 0.5)",
    text: "text-blue-400",
    bg: "bg-blue-950/40 border-blue-800/30"
  },
  "plesk-panel": {
    dot: "#10b981", // Green/Emerald
    glow: "rgba(16, 185, 129, 0.5)",
    text: "text-emerald-400",
    bg: "bg-emerald-950/40 border-emerald-800/30"
  },
  "plesk-postfix": {
    dot: "#f59e0b", // Amber/Orange
    glow: "rgba(245, 158, 11, 0.5)",
    text: "text-amber-400",
    bg: "bg-amber-950/40 border-amber-800/30"
  },
  "plesk-modsecurity": {
    dot: "#ef4444", // Red
    glow: "rgba(239, 68, 68, 0.5)",
    text: "text-red-400",
    bg: "bg-red-950/40 border-red-900/30"
  },
  other: {
    dot: "#a855f7", // Purple (for custom jails)
    glow: "rgba(168, 85, 247, 0.5)",
    text: "text-purple-400",
    bg: "bg-purple-950/40 border-purple-800/30"
  }
};

export default function IPMap({ ipsData, serverLocation, highlightedIp, onHighlightIp, mitigationMode = false }: IPMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [autoZoom, setAutoZoom] = useState(true);
  const [hoveredLocation, setHoveredLocation] = useState<{
    city: string;
    country: string;
    ips: IPData[];
    lat: number;
    lon: number;
    x: number;
    y: number;
  } | null>(null);
  const [pinnedLocation, setPinnedLocation] = useState<{
    city: string;
    country: string;
    ips: IPData[];
    lat: number;
    lon: number;
    x: number;
    y: number;
  } | null>(null);
  const [showAttackLines, setShowAttackLines] = useState(true);
  const [showHeatmapOverlay, setShowHeatmapOverlay] = useState(true);
  const [showHeatmapView, setShowHeatmapView] = useState(true);
  const [showNodesLayer, setShowNodesLayer] = useState(true);
  const [heatmapIntensityBasis, setHeatmapIntensityBasis] = useState<"ipCount" | "attackVolume">("attackVolume");
  const [disabledJails, setDisabledJails] = useState<Set<string>>(new Set());
  const [hoveredCountry, setHoveredCountry] = useState<{
    name: string;
    ipCount: number;
    attackVolume: number;
    ips: string[];
    x: number;
    y: number;
  } | null>(null);

  // Setup D3 Zoom behavior
  const zoomBehavior = useMemo(() => {
    return d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 12])
      .on("zoom", (event) => {
        setTransform(event.transform);
      });
  }, []);

  // Attach zoom behavior
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.call(zoomBehavior);
  }, [zoomBehavior]);

  // Interactive zoom and pan helper methods
  const handleZoomIn = () => {
    if (svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomBehavior.scaleBy as any, 1.45);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomBehavior.scaleBy as any, 0.7);
    }
  };

  const handlePan = (dx: number, dy: number) => {
    if (svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomBehavior.translateBy as any, dx, dy);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(800)
        .ease(d3.easeCubicInOut)
        .call(zoomBehavior.transform as any, d3.zoomIdentity);
    }
  };

  // Filter IPs based on toggled jail categories
  const filteredIpsData = useMemo(() => {
    return ipsData.filter(ip => {
      const jailName = ip.jail || "other";
      return !disabledJails.has(jailName);
    });
  }, [ipsData, disabledJails]);

  const toggleJail = (jailName: string) => {
    setDisabledJails(prev => {
      const next = new Set(prev);
      if (next.has(jailName)) {
        next.delete(jailName);
      } else {
        next.add(jailName);
      }
      return next;
    });
  };

  // Load world map GeoJSON
  useEffect(() => {
    let active = true;
    const fetchGeoJson = async () => {
      try {
        setLoading(true);
        // Using a highly optimized, standard, low-resolution world GeoJSON
        const response = await d3.json(
          "https://cdn.jsdelivr.net/npm/@highcharts/map-collection@1.1.3/custom/world.geo.json"
        );
        if (active) {
          setGeoData(response);
          setError(null);
        }
      } catch (err: any) {
        console.error("Failed to load world map GeoJSON:", err);
        if (active) {
          setError("Could not load map geometries. Please check your internet connection.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      };
    };

    fetchGeoJson();

    return () => {
      active = false;
    };
  }, []);

  // Handle responsive sizing of container
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      const { width } = containerRef.current!.getBoundingClientRect();
      // Keep a good aspect ratio
      const height = Math.max(300, width * 0.48);
      setDimensions({ width, height });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [loading]);

  // Setup D3 Projection
  // Equirectangular projection fits the layout perfectly
  const projection = useMemo(() => {
    return d3.geoEquirectangular()
      .scale(dimensions.width / 6.4) // Proportional scale
      .translate([dimensions.width / 2, dimensions.height / 1.7]);
  }, [dimensions.width, dimensions.height]);

  const pathGenerator = useMemo(() => {
    return d3.geoPath().projection(projection);
  }, [projection]);

  // Generate graticule lines & outline for map context
  const { graticulePath, outlinePath } = useMemo(() => {
    if (!pathGenerator) return { graticulePath: null, outlinePath: null };
    const graticule = d3.geoGraticule().step([15, 15]); // 15-degree increments for a clean grid
    return {
      graticulePath: pathGenerator(graticule()),
      outlinePath: pathGenerator(graticule.outline())
    };
  }, [pathGenerator]);

  // Group IP data by geographic location (lat, lon coordinates)
  const locationsList = useMemo(() => {
    const groupedLocations = filteredIpsData.reduce((acc, ip) => {
      if (ip.status !== "success" || isNaN(ip.lat) || isNaN(ip.lon)) return acc;
      const key = `${ip.lat.toFixed(2)},${ip.lon.toFixed(2)}`;
      if (!acc[key]) {
        acc[key] = {
          lat: ip.lat,
          lon: ip.lon,
          city: ip.city || "Unknown",
          country: ip.country || "Unknown",
          ips: [] as IPData[]
        };
      }
      acc[key].ips.push(ip);
      return acc;
    }, {} as Record<string, { lat: number; lon: number; city: string; country: string; ips: IPData[] }>);
    return Object.values(groupedLocations);
  }, [filteredIpsData]);

  // Find max IP count for normalized density calculations
  const maxIpsCount = useMemo(() => {
    return Math.max(...locationsList.map(loc => loc.ips.length), 1);
  }, [locationsList]);

  // Find max attack volume for normalized density calculations
  const maxAttackVolume = useMemo(() => {
    return Math.max(...locationsList.map(loc => 
      loc.ips.reduce((sum, ip) => sum + getIpAttackCount(ip.ip), 0)
    ), 1);
  }, [locationsList]);

  // Map country code or country name to aggregated threat statistics (IP count, attack volume)
  const countryThreatMetrics = useMemo(() => {
    const metrics: Record<string, { ipCount: number; attackVolume: number; ips: string[] }> = {};
    
    filteredIpsData.forEach(ip => {
      if (ip.status !== "success") return;
      
      const code = ip.countryCode ? ip.countryCode.toUpperCase() : "";
      const name = ip.country ? ip.country.toLowerCase() : "";
      const attackVol = getIpAttackCount(ip.ip);
      
      if (code) {
        if (!metrics[code]) {
          metrics[code] = { ipCount: 0, attackVolume: 0, ips: [] };
        }
        metrics[code].ipCount += 1;
        metrics[code].attackVolume += attackVol;
        if (!metrics[code].ips.includes(ip.ip)) {
          metrics[code].ips.push(ip.ip);
        }
      }
      
      if (name) {
        if (!metrics[name]) {
          metrics[name] = { ipCount: 0, attackVolume: 0, ips: [] };
        }
        metrics[name].ipCount += 1;
        metrics[name].attackVolume += attackVol;
        if (!metrics[name].ips.includes(ip.ip)) {
          metrics[name].ips.push(ip.ip);
        }
      }
    });
    
    return metrics;
  }, [filteredIpsData]);

  // Helper to resolve threat metrics for a geoJSON feature
  const getCountryThreatMetrics = useCallback((feature: any) => {
    if (!feature || !feature.properties) return null;
    
    const props = feature.properties;
    const candidates = [
      props["iso-a2"],
      props["ISO_A2"],
      props["code"],
      props["hc-key"],
      props["hc-a2"],
      props["name"],
      props["NAME"]
    ];
    
    for (const rawVal of candidates) {
      if (rawVal !== undefined && rawVal !== null) {
        const strVal = String(rawVal).trim();
        const keyUpper = strVal.toUpperCase();
        if (countryThreatMetrics[keyUpper]) {
          return countryThreatMetrics[keyUpper];
        }
        const keyLower = strVal.toLowerCase();
        if (countryThreatMetrics[keyLower]) {
          return countryThreatMetrics[keyLower];
        }
      }
    }
    
    return null;
  }, [countryThreatMetrics]);

  // Find max country metric for normalization
  const maxCountryMetric = useMemo(() => {
    let maxVal = 1;
    filteredIpsData.forEach(ip => {
      if (ip.status !== "success") return;
      const metrics = countryThreatMetrics[ip.countryCode?.toUpperCase() || ""] || 
                       countryThreatMetrics[ip.country?.toLowerCase() || ""];
      if (metrics) {
        const val = heatmapIntensityBasis === "attackVolume" ? metrics.attackVolume : metrics.ipCount;
        if (val > maxVal) {
          maxVal = val;
        }
      }
    });
    return maxVal;
  }, [countryThreatMetrics, filteredIpsData, heatmapIntensityBasis]);

  // Color scale for country shading
  const countryColorScale = useMemo(() => {
    return d3.scaleSequential<string>()
      .domain([0, 1])
      .interpolator(d3.interpolateRgbBasis([
        "rgba(24, 24, 27, 0.95)", // zinc-900 (empty background)
        "rgba(30, 58, 138, 0.45)", // deep transparent blue (low threat)
        "rgba(146, 64, 14, 0.55)", // amber/orange (medium threat)
        "rgba(153, 27, 27, 0.75)", // solid red (high threat)
        "rgba(220, 38, 38, 0.95)"  // intense neon red (critical threat)
      ]));
  }, []);

  // D3 Scales for data-driven density rendering
  const densityD3Scales = useMemo(() => {
    // Interpolate across custom premium thermal array:
    // Cyan/Blue -> Emerald Green -> Amber -> Bright Coral Orange -> Red
    const colorScale = d3.scaleSequential<string>()
      .domain([0, 1])
      .interpolator(d3.interpolateRgbBasis(["#3b82f6", "#06b6d4", "#10b981", "#eab308", "#f97316", "#ef4444"]));

    const radiusScale = d3.scaleLinear()
      .domain([0, 1])
      .range([12, 60]);

    const opacityScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0.3, 0.9]);

    return { colorScale, radiusScale, opacityScale };
  }, []);

  // Project server location coordinates
  const serverCoords = useMemo(() => {
    return projection([serverLocation.lon, serverLocation.lat]);
  }, [projection, serverLocation.lon, serverLocation.lat]);

  // Auto zoom to selection when filteredIpsData changes
  useEffect(() => {
    if (!autoZoom || !svgRef.current) return;

    // Get coordinates of all current locations
    const coords = locationsList
      .map(loc => projection([loc.lon, loc.lat]))
      .filter(Boolean) as [number, number][];

    if (coords.length > 0) {
      const xExtent = d3.extent(coords, d => d[0]);
      const yExtent = d3.extent(coords, d => d[1]);

      if (xExtent[0] !== undefined && xExtent[1] !== undefined && yExtent[0] !== undefined && yExtent[1] !== undefined) {
        const minX = xExtent[0];
        const maxX = xExtent[1];
        const minY = yExtent[0];
        const maxY = yExtent[1];

        const dx = maxX - minX;
        const dy = maxY - minY;
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;

        const mapWidth = dimensions.width;
        const mapHeight = dimensions.height;

        // Pad the bounding box so nodes are not right at the border
        let scale = Math.min(8, 0.75 / Math.max(dx / mapWidth, dy / mapHeight));
        
        if (isNaN(scale) || !isFinite(scale) || scale < 1) {
          scale = 1;
        }

        // Handle single point or very tight cluster
        if (dx < 10 && dy < 10) {
          scale = 3.5;
        }

        const tx = mapWidth / 2 - cx * scale;
        const ty = mapHeight / 2 - cy * scale;

        const targetTransform = d3.zoomIdentity.translate(tx, ty).scale(scale);

        d3.select(svgRef.current)
          .transition()
          .duration(1000)
          .ease(d3.easeCubicInOut)
          .call(zoomBehavior.transform as any, targetTransform);
      }
    } else {
      // No active IP locations, reset to standard view
      d3.select(svgRef.current)
        .transition()
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .call(zoomBehavior.transform as any, d3.zoomIdentity);
    }
  }, [locationsList, autoZoom, dimensions, zoomBehavior, projection]);

  // Unique jail names present in the active dataset
  const activeJails = Array.from(new Set(ipsData.map(ip => ip.jail).filter(Boolean)));

  return (
    <div id="attack-origins-section" className="bg-[#111] border border-zinc-800 p-6 rounded-lg mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-medium text-white tracking-tight flex items-center gap-2">
            Attack origins
            <span className="text-xs font-mono font-normal text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-full bg-zinc-900">
              Interactive
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Visualizing geolocation origins of malicious security events. Dot size reflects count.
          </p>
        </div>

        {/* Legend & Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Legend Items (Jail Categories) / Interactive Filter Panel */}
          <div className="flex flex-wrap items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md text-xs">
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider select-none">Filters:</span>
            {activeJails.map(jail => {
              const style = JAIL_COLORS[jail] || JAIL_COLORS.other;
              const count = ipsData.filter(ip => ip.jail === jail).length;
              const isHidden = disabledJails.has(jail);
              return (
                <button
                  key={jail}
                  onClick={() => toggleJail(jail)}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all cursor-pointer font-mono text-xs ${
                    isHidden
                      ? "bg-zinc-950/40 text-zinc-500 border-zinc-800/40 line-through decoration-zinc-700/50 hover:border-zinc-800 hover:text-zinc-400"
                      : "bg-zinc-900 text-zinc-200 border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-850"
                  }`}
                  title={`${isHidden ? "Show" : "Hide"} ${jail} vectors on map`}
                >
                  <span
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      backgroundColor: isHidden ? "transparent" : style.dot,
                      border: isHidden ? "1px solid #52525b" : "none",
                      boxShadow: isHidden ? "none" : `0 0 4px ${style.dot}`
                    }}
                  />
                  <span>
                    {jail} <span className="text-[10px] text-zinc-500">({count})</span>
                  </span>
                </button>
              );
            })}

            {disabledJails.size > 0 && (
              <button
                onClick={() => setDisabledJails(new Set())}
                className="text-[10px] font-mono text-amber-500 hover:text-amber-400 border border-amber-900/40 bg-amber-950/10 px-1.5 py-0.5 rounded cursor-pointer transition-all ml-1"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Density Heatmap Legend */}
          {showHeatmapOverlay && (
            <div className="flex flex-wrap items-center gap-2.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md text-xs">
              <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider">Density:</span>
              <div className="w-20 h-2.5 rounded bg-gradient-to-r from-blue-500 via-cyan-400 via-emerald-400 via-amber-400 to-red-500" />
              <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-400">
                <span>Min</span>
                <span>→</span>
                <span className="font-semibold text-red-400">Max</span>
              </div>
            </div>
          )}

          {/* Heatmap Intensity Basis Toggle */}
          {showHeatmapOverlay && (
            <div className="bg-zinc-950 border border-zinc-800 p-0.5 rounded-lg flex items-center">
              <button
                onClick={() => setHeatmapIntensityBasis("ipCount")}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  heatmapIntensityBasis === "ipCount"
                    ? "bg-zinc-900 text-white font-medium shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                title="Calculate heatmap density based on number of unique banned IP addresses"
              >
                IP Count
              </button>
              <button
                onClick={() => setHeatmapIntensityBasis("attackVolume")}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  heatmapIntensityBasis === "attackVolume"
                    ? "bg-zinc-900 text-white font-medium shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                title="Calculate heatmap density based on total login attack volume"
              >
                Attack Vol
              </button>
            </div>
          )}

          {/* Threat Nodes Sliding Toggle Switch */}
          <div className="flex items-center gap-2.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md text-xs">
            <span className="text-zinc-300 font-mono text-xs font-medium">Threat Nodes</span>
            <button
              onClick={() => setShowNodesLayer(!showNodesLayer)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                showNodesLayer ? "bg-blue-500" : "bg-zinc-700"
              }`}
              id="nodes-layer-toggle"
              role="switch"
              aria-checked={showNodesLayer}
              title="Toggle Geolocated Threat Nodes Layer"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-250 ease-in-out ${
                  showNodesLayer ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Heatmap Overlay Sliding Toggle Switch */}
          <div className="flex items-center gap-2.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md text-xs">
            <span className="text-zinc-300 font-mono text-xs font-medium">Heatmap Overlay</span>
            <button
              onClick={() => setShowHeatmapOverlay(!showHeatmapOverlay)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                showHeatmapOverlay ? "bg-red-500" : "bg-zinc-700"
              }`}
              id="heatmap-overlay-toggle"
              role="switch"
              aria-checked={showHeatmapOverlay}
              title="Toggle Heatmap Density Overlay"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-250 ease-in-out ${
                  showHeatmapOverlay ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Heatmap View (Radial Opacity Gradients) sliding toggle switch */}
          <div className="flex items-center gap-2.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md text-xs">
            <span className="text-zinc-300 font-mono text-xs font-medium">Heatmap View</span>
            <button
              onClick={() => setShowHeatmapView(!showHeatmapView)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                showHeatmapView ? "bg-orange-500" : "bg-zinc-700"
              }`}
              id="heatmap-view-toggle"
              role="switch"
              aria-checked={showHeatmapView}
              title="Toggle High-Fidelity Animated Opacity Gradient Heatmap View"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-250 ease-in-out ${
                  showHeatmapView ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle connection lines */}
          <button
            onClick={() => setShowAttackLines(!showAttackLines)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border transition-all cursor-pointer ${
              showAttackLines
                ? "bg-amber-950/30 text-amber-400 border-amber-900/40"
                : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700"
            }`}
            title="Toggle attack lines originating from server location"
          >
            <Zap className={`w-3.5 h-3.5 ${showAttackLines ? "animate-pulse" : ""}`} />
            Lines {showAttackLines ? "On" : "Off"}
          </button>

          {/* Toggle Auto-Zoom */}
          <button
            onClick={() => setAutoZoom(!autoZoom)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border transition-all cursor-pointer ${
              autoZoom
                ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/40 hover:bg-emerald-950/50"
                : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700"
            }`}
            title="Automatically zoom/pan to focus on displayed threat sources when filters change"
          >
            <ZoomIn className={`w-3.5 h-3.5 ${autoZoom ? "text-emerald-400" : ""}`} />
            Auto-Zoom {autoZoom ? "On" : "Off"}
          </button>

          {/* Manual Reset Zoom */}
          <button
            onClick={handleResetZoom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700 cursor-pointer transition-all"
            title="Reset map zoom and center coordinates"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Zoom
          </button>
        </div>
      </div>

      <div 
        ref={containerRef} 
        className="relative bg-black rounded-lg border border-zinc-900 overflow-hidden flex items-center justify-center min-h-[300px]"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-zinc-500 font-mono text-xs">
            <RefreshCw className="w-5 h-5 animate-spin text-zinc-400" />
            Loading landmass geometries...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-red-400 font-mono text-xs max-w-md text-center px-4">
            <AlertErrorIcon className="w-6 h-6 text-red-500" />
            <p>{error}</p>
          </div>
        ) : (
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="select-none block"
            onClick={() => setPinnedLocation(null)}
          >
            {/* SVG Filter for density heatmap blurring and color blending */}
            <defs>
              <filter id="heatmap-blur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="16" />
              </filter>
              {showHeatmapView && locationsList.map((loc, idx) => {
                const isAttackVolume = heatmapIntensityBasis === "attackVolume";
                const value = isAttackVolume 
                  ? loc.ips.reduce((sum, ip) => sum + getIpAttackCount(ip.ip), 0)
                  : loc.ips.length;
                
                const maxValue = isAttackVolume ? maxAttackVolume : maxIpsCount;
                const intensity = Math.log(value + 1) / Math.log(maxValue + 1);

                const heatColor = densityD3Scales.colorScale(intensity);
                const heatOpacity = densityD3Scales.opacityScale(intensity);

                return (
                  <radialGradient key={`rad-grad-${idx}`} id={`heat-radial-grad-${idx}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={heatColor} stopOpacity={heatOpacity * 1.0} />
                    <stop offset="25%" stopColor={heatColor} stopOpacity={heatOpacity * 0.75} />
                    <stop offset="55%" stopColor={heatColor} stopOpacity={heatOpacity * 0.35} />
                    <stop offset="100%" stopColor={heatColor} stopOpacity="0" />
                  </radialGradient>
                );
              })}
            </defs>            {/* World Grid Lines (Oceans graticule in background) */}
            <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
              {graticulePath && (
                <path
                  d={graticulePath}
                  className="fill-none stroke-zinc-900/60 pointer-events-none"
                  style={{ strokeWidth: `${0.5 / transform.k}px` }}
                />
              )}

              {/* Map Outer Boundary Outline */}
              {outlinePath && (
                <path
                  d={outlinePath}
                  className="fill-none stroke-zinc-800/30 pointer-events-none"
                  style={{ strokeWidth: `${0.75 / transform.k}px` }}
                />
              )}

              {/* World Landmass paths */}
              <g id="world-map-paths">
                {geoData && pathGenerator
                  ? geoData.features.map((feature: any, index: number) => {
                      const d = pathGenerator(feature);
                      if (!d) return null;

                      const metrics = getCountryThreatMetrics(feature);
                      const centroid = pathGenerator.centroid(feature);
                      const hasCentroid = centroid && !isNaN(centroid[0]) && !isNaN(centroid[1]);

                      const val = metrics 
                        ? (heatmapIntensityBasis === "attackVolume" ? metrics.attackVolume : metrics.ipCount)
                        : 0;

                      const intensity = maxCountryMetric > 0 ? val / maxCountryMetric : 0;

                      // Use premium country color scale if heatmap is enabled and country has threats
                      const fillColor = showHeatmapOverlay && metrics
                        ? countryColorScale(intensity)
                        : "#141419"; // standard dark map fill

                      const strokeColor = showHeatmapOverlay && metrics
                        ? d3.color(fillColor)?.brighter(0.5)?.toString() || "#3f3f46"
                        : "#27272a"; // standard dark map border

                      return (
                        <path
                          key={`country-${index}`}
                          d={d}
                          fill={fillColor}
                          stroke={strokeColor}
                          className="transition-colors duration-300 hover:fill-zinc-800/90 cursor-crosshair"
                          style={{ strokeWidth: `${1.0 / transform.k}px` }}
                          onMouseEnter={() => {
                            if (metrics) {
                              setHoveredCountry({
                                name: feature.properties.name || "Unknown Country",
                                ipCount: metrics.ipCount,
                                attackVolume: metrics.attackVolume,
                                ips: metrics.ips,
                                x: hasCentroid ? centroid[0] * transform.k + transform.x : 0,
                                y: hasCentroid ? centroid[1] * transform.k + transform.y : 0
                              });
                            }
                          }}
                          onMouseLeave={() => setHoveredCountry(null)}
                        />
                      );
                    })
                  : null}
              </g>

              {/* Density Heatmap Layer */}
              {showHeatmapOverlay && (
                <g id="heatmap-layer" filter="url(#heatmap-blur)" className="pointer-events-none opacity-85 mix-blend-screen">
                  {locationsList.map((loc, idx) => {
                    const coords = projection([loc.lon, loc.lat]);
                    if (!coords) return null;

                    // Calculate value based on toggleable basis
                    const isAttackVolume = heatmapIntensityBasis === "attackVolume";
                    const value = isAttackVolume 
                      ? loc.ips.reduce((sum, ip) => sum + getIpAttackCount(ip.ip), 0)
                      : loc.ips.length;
                    
                    const maxValue = isAttackVolume ? maxAttackVolume : maxIpsCount;
                    
                    // Logarithmic normalization for elegant contrast
                    const intensity = Math.log(value + 1) / Math.log(maxValue + 1);

                    // Continuous data-driven rendering with D3 scales
                    const heatRadius = densityD3Scales.radiusScale(intensity);
                    const heatColor = densityD3Scales.colorScale(intensity);
                    const heatOpacity = densityD3Scales.opacityScale(intensity);

                    return (
                      <circle
                        key={`heat-${idx}`}
                        cx={coords[0]}
                        cy={coords[1]}
                        r={heatRadius}
                        fill={heatColor}
                        opacity={heatOpacity}
                      />
                    );
                  })}
                </g>
              )}

              {/* Radial Heatmap View Layer (Vector Opacity Gradients) */}
              {showHeatmapView && (
                <g id="radial-heatmap-layer" className="pointer-events-none mix-blend-screen">
                  {locationsList.map((loc, idx) => {
                    const coords = projection([loc.lon, loc.lat]);
                    if (!coords) return null;

                    const isAttackVolume = heatmapIntensityBasis === "attackVolume";
                    const value = isAttackVolume 
                      ? loc.ips.reduce((sum, ip) => sum + getIpAttackCount(ip.ip), 0)
                      : loc.ips.length;
                    
                    const maxValue = isAttackVolume ? maxAttackVolume : maxIpsCount;
                    const intensity = Math.log(value + 1) / Math.log(maxValue + 1);

                    // Slightly wider radius scale for heat map view to allow beautiful overlapping gradients
                    const radialRadius = densityD3Scales.radiusScale(intensity) * 1.8;

                    return (
                      <motion.circle
                        key={`radial-heat-${idx}`}
                        cx={coords[0]}
                        cy={coords[1]}
                        r={radialRadius}
                        fill={`url(#heat-radial-grad-${idx})`}
                        animate={{
                          r: [radialRadius * 0.92, radialRadius * 1.08, radialRadius * 0.92],
                          opacity: [0.85, 1.0, 0.85],
                        }}
                        transition={{
                          duration: 3 + (idx % 3) * 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    );
                  })}
                </g>
              )}

              {/* Server Location Node (GHANA) */}
              {serverCoords && (
                <g id="server-node" className="cursor-help">
                  {/* Ping rings */}
                  <circle
                    cx={serverCoords[0]}
                    cy={serverCoords[1]}
                    r={12 / transform.k}
                    className="fill-none stroke-emerald-500/20 animate-ping"
                    style={{ transformOrigin: `${serverCoords[0]}px ${serverCoords[1]}px` }}
                  />
                  <circle
                    cx={serverCoords[0]}
                    cy={serverCoords[1]}
                    r={6 / transform.k}
                    className="fill-none stroke-emerald-500/40 animate-pulse"
                  />
                  {/* Main Server dot */}
                  <circle
                    cx={serverCoords[0]}
                    cy={serverCoords[1]}
                    r={4.5 / transform.k}
                    className="fill-emerald-400 stroke-black stroke-2"
                    style={{ strokeWidth: `${2 / transform.k}px` }}
                  />
                  {/* Label */}
                  <text
                    x={serverCoords[0]}
                    y={serverCoords[1] - 8 / transform.k}
                    textAnchor="middle"
                    className="fill-emerald-400 font-mono font-semibold"
                    style={{ fontSize: `${9 / transform.k}px` }}
                  >
                    Server ({serverLocation.countryCode})
                  </text>
                </g>
              )}

              {/* Attack Vectors (Lines from source points to Server) */}
              {showAttackLines && serverCoords && (
                <g id="attack-lines">
                  {locationsList.map((loc, idx) => {
                    const sourceCoords = projection([loc.lon, loc.lat]);
                    if (!sourceCoords) return null;

                    // Skip drawing lines for server local nodes to prevent zero-length paths
                    if (
                      Math.abs(loc.lat - serverLocation.lat) < 0.5 &&
                      Math.abs(loc.lon - serverLocation.lon) < 0.5
                    ) {
                      return null;
                    }

                    // Find top jail color for this path
                    const firstJail = loc.ips[0]?.jail || "other";
                    const colorStyle = JAIL_COLORS[firstJail] || JAIL_COLORS.other;

                    // Create a curved arc path using SVG Bezier Curves
                    const sx = sourceCoords[0];
                    const sy = sourceCoords[1];
                    const dx = serverCoords[0];
                    const dy = serverCoords[1];

                    // Control point for quadratic curve (bend)
                    const mx = (sx + dx) / 2;
                    const my = (sy + dy) / 2 - Math.min(100, Math.hypot(dx - sx, dy - sy) * 0.25);

                    const pathData = `M ${sx} ${sy} Q ${mx} ${my} ${dx} ${dy}`;

                    return (
                      <g key={`arc-${idx}`}>
                        {/* Ambient glow line */}
                        <path
                          d={pathData}
                          fill="none"
                          stroke={colorStyle.dot}
                          strokeWidth={1 / transform.k}
                          className="opacity-15"
                        />
                        {/* Animated dash line to show vector flow */}
                        <path
                          d={pathData}
                          fill="none"
                          stroke={colorStyle.dot}
                          strokeWidth={1.2 / transform.k}
                          strokeDasharray={`${6 / transform.k},${12 / transform.k}`}
                          className="opacity-40 animate-[dash_3s_linear_infinite]"
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Geolocated Malicious IPs Nodes */}
              {showNodesLayer && (
                <g id="malicious-nodes">
                  {locationsList.map((loc, idx) => {
                    const coords = projection([loc.lon, loc.lat]);
                    if (!coords) return null;

                    const ipCount = loc.ips.length;
                    // Scale dot size based on the density of IPs at that location
                    const radius = Math.min(15, 3 + Math.sqrt(ipCount) * 1.5) / Math.sqrt(transform.k);
                    const firstJail = loc.ips[0]?.jail || "other";
                    const colorStyle = JAIL_COLORS[firstJail] || JAIL_COLORS.other;

                    const isHighlighted = !!highlightedIp && loc.ips.some(ip => ip.ip === highlightedIp);
                    const isPinned = !!pinnedLocation && pinnedLocation.lat === loc.lat && pinnedLocation.lon === loc.lon;
                    const hasHighFrequency = mitigationMode && loc.ips.some(ip => getIpAttackCount(ip.ip) >= 8);

                    return (
                      <g
                        key={`loc-${idx}`}
                        onMouseEnter={() => {
                          setHoveredLocation({
                            city: loc.city,
                            country: loc.country,
                            ips: loc.ips,
                            lat: loc.lat,
                            lon: loc.lon,
                            x: coords[0] * transform.k + transform.x,
                            y: coords[1] * transform.k + transform.y
                          });
                        }}
                        onMouseLeave={() => setHoveredLocation(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          const locObj = {
                            city: loc.city,
                            country: loc.country,
                            ips: loc.ips,
                            lat: loc.lat,
                            lon: loc.lon,
                            x: coords[0] * transform.k + transform.x,
                            y: coords[1] * transform.k + transform.y
                          };
                          const isCurrentlyPinned = pinnedLocation && pinnedLocation.lat === loc.lat && pinnedLocation.lon === loc.lon;
                          if (isCurrentlyPinned) {
                            setPinnedLocation(null);
                            onHighlightIp?.(null);
                          } else {
                            setPinnedLocation(locObj);
                            if (loc.ips.length > 0) {
                              onHighlightIp?.(loc.ips[0].ip);
                            }
                          }
                        }}
                        className="cursor-pointer group"
                      >
                        {/* Glowing outer circle */}
                        <circle
                          cx={coords[0]}
                          cy={coords[1]}
                          r={radius + (isHighlighted || isPinned ? 8 : (hasHighFrequency ? 6 : 4)) / transform.k}
                          fill={isHighlighted || isPinned ? "#f59e0b" : (hasHighFrequency ? "#ef4444" : colorStyle.dot)}
                          opacity={isHighlighted || isPinned ? 0.35 : (hasHighFrequency ? 0.25 : 0.12)}
                          className={`transition-all duration-300 ${
                            isHighlighted || isPinned || hasHighFrequency ? "animate-pulse" : "group-hover:scale-150"
                          }`}
                          style={{ transformOrigin: `${coords[0]}px ${coords[1]}px` }}
                        />
                        
                        {/* Concentric ping ripple for highlighted node or high frequency node */}
                        {(isHighlighted || isPinned) && (
                          <circle
                            cx={coords[0]}
                            cy={coords[1]}
                            r={radius + 12 / transform.k}
                            fill="none"
                            stroke={hasHighFrequency ? "#ef4444" : "#f59e0b"}
                            strokeWidth={1 / transform.k}
                            className="animate-ping opacity-60"
                            style={{ transformOrigin: `${coords[0]}px ${coords[1]}px` }}
                          />
                        )}

                        {/* Additional red warning ring for high-frequency attackers under Mitigation Mode */}
                        {hasHighFrequency && !(isHighlighted || isPinned) && (
                          <circle
                            cx={coords[0]}
                            cy={coords[1]}
                            r={radius + 6 / transform.k}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth={1.5 / transform.k}
                            className="animate-[pulse_1.5s_infinite] opacity-75"
                            style={{ transformOrigin: `${coords[0]}px ${coords[1]}px` }}
                          />
                        )}

                        {/* Main Node dot */}
                        <circle
                          cx={coords[0]}
                          cy={coords[1]}
                          r={radius}
                          fill={isHighlighted || isPinned ? "#f59e0b" : (hasHighFrequency ? "#ef4444" : colorStyle.dot)}
                          stroke={isHighlighted || isPinned ? "white" : (hasHighFrequency ? "#f87171" : "black")}
                          strokeWidth={(isHighlighted || isPinned ? 1.5 : (hasHighFrequency ? 2 : 1)) / transform.k}
                          opacity={1.0}
                          strokeOpacity={1.0}
                          className="group-hover:stroke-white transition-all duration-200"
                        />
                      </g>
                    );
                  })}
                </g>
              )}
            </g>
          </svg>
        )}

        {/* Hover / Pinned Tooltip Overlay (HTML based overlay on canvas) */}
        <AnimatePresence>
          {(hoveredLocation || pinnedLocation) && (() => {
            const activeTooltip = hoveredLocation || pinnedLocation;
            const tooltipIsPinned = !hoveredLocation && !!pinnedLocation;

            // Calculate primary (most frequent) jail for this location
            const jailCounts: Record<string, number> = {};
            activeTooltip.ips.forEach(ip => {
              if (ip.jail) {
                jailCounts[ip.jail] = (jailCounts[ip.jail] || 0) + 1;
              }
            });
            let primaryJail = "Unknown";
            let maxCount = 0;
            Object.entries(jailCounts).forEach(([jName, count]) => {
              if (count > maxCount) {
                maxCount = count;
                primaryJail = jName;
              }
            });
            const primaryJailStyle = JAIL_COLORS[primaryJail] || JAIL_COLORS.other;

            return (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="absolute z-10 bg-[#0c0c0e]/95 border p-4 rounded-lg shadow-2xl w-64 text-left backdrop-blur-md transition-colors duration-200"
                style={{
                  left: Math.min(dimensions.width - 270, Math.max(16, activeTooltip.x - 120)),
                  top: activeTooltip.y > dimensions.height / 2 
                    ? activeTooltip.y - 230 
                    : activeTooltip.y + 16,
                  borderColor: tooltipIsPinned ? "#f59e0b" : "#27272a",
                  pointerEvents: tooltipIsPinned ? "auto" : "none"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="border-b border-zinc-900 pb-2 mb-2 relative">
                  {tooltipIsPinned && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPinnedLocation(null);
                      }}
                      className="absolute right-0 top-0 text-zinc-500 hover:text-zinc-200 p-0.5 rounded transition-colors"
                      title="Dismiss pinned tooltip"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider flex items-center gap-1">
                    {tooltipIsPinned ? "📌 Pinned Intel" : "Origin Location"}
                  </span>
                  <h4 className="text-sm font-semibold text-white">
                    {activeTooltip.city}, {activeTooltip.country}
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    Lat: {activeTooltip.lat.toFixed(4)}, Lon: {activeTooltip.lon.toFixed(4)}
                  </p>
                  
                  {/* Primary Jail indicator */}
                  <div className="flex items-center justify-between gap-1.5 mt-2 bg-zinc-950/80 border border-zinc-900/60 px-2 py-1.5 rounded">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                      Primary Jail
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-medium border ${primaryJailStyle.bg} ${primaryJailStyle.text}`}>
                      {primaryJail}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>Blocked IP ({activeTooltip.ips.length})</span>
                    <span>Jail</span>
                  </div>
                  {activeTooltip.ips.slice(0, 5).map((item, index) => {
                    const style = JAIL_COLORS[item.jail] || JAIL_COLORS.other;
                    const isCurrentHighlight = highlightedIp === item.ip;
                    return (
                      <div 
                        key={index} 
                        onClick={(e) => {
                          if (tooltipIsPinned) {
                            e.stopPropagation();
                            onHighlightIp?.(isCurrentHighlight ? null : item.ip);
                          }
                        }}
                        className={`flex justify-between items-center text-xs font-mono rounded px-1.5 py-1.5 border transition-all ${
                          tooltipIsPinned 
                            ? "cursor-pointer hover:bg-zinc-900/60 active:scale-[0.98]" 
                            : "pointer-events-none"
                        } ${
                          isCurrentHighlight 
                            ? "bg-amber-500/10 border-amber-500/30 text-white" 
                            : "border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <span className="text-sm flex-shrink-0">{getFlagEmoji(item.countryCode)}</span>
                          <span className={`truncate text-zinc-200 font-medium ${isCurrentHighlight ? "text-amber-400 font-bold" : ""}`}>
                            {item.ip}
                          </span>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border flex-shrink-0 ${style.bg} ${style.text}`}>
                          {item.jail}
                        </span>
                      </div>
                    );
                  })}
                  {activeTooltip.ips.length > 5 && (
                    <p className="text-[9px] text-zinc-500 italic font-mono text-center">
                      + {activeTooltip.ips.length - 5} more IPs at this location
                    </p>
                  )}
                  {tooltipIsPinned && (
                    <p className="text-[9px] text-amber-500/80 font-mono text-center pt-1.5 border-t border-zinc-900/40">
                      💡 Click any IP to focus in the table
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Country Threat Tooltip Overlay */}
        <AnimatePresence>
          {showHeatmapOverlay && hoveredCountry && !hoveredLocation && !pinnedLocation && (() => {
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="absolute z-10 bg-[#0c0c0e]/98 border border-zinc-800 p-3.5 rounded-lg shadow-2xl w-56 text-left backdrop-blur-md pointer-events-none"
                style={{
                  left: Math.min(dimensions.width - 240, Math.max(16, hoveredCountry.x - 110)),
                  top: hoveredCountry.y > dimensions.height / 2 
                    ? hoveredCountry.y - 140 
                    : hoveredCountry.y + 16,
                }}
              >
                <div className="border-b border-zinc-900 pb-1.5 mb-1.5">
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">
                    Regional Threat Intel
                  </span>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {hoveredCountry.name}
                  </h4>
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Unique IPs:</span>
                    <span className="text-zinc-200 font-bold">{hoveredCountry.ipCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Attack Vol:</span>
                    <span className="text-amber-400 font-bold">{hoveredCountry.attackVolume} attempts</span>
                  </div>
                  <div className="pt-1.5 border-t border-zinc-900/50 flex justify-between text-[9px]">
                    <span className="text-zinc-500 uppercase">Threat Level:</span>
                    <span className={`font-bold uppercase ${
                      hoveredCountry.attackVolume >= 40 
                        ? "text-red-500 animate-pulse" 
                        : hoveredCountry.attackVolume >= 15 
                        ? "text-orange-400" 
                        : "text-blue-400"
                    }`}>
                      {hoveredCountry.attackVolume >= 40 
                        ? "CRITICAL" 
                        : hoveredCountry.attackVolume >= 15 
                        ? "HIGH" 
                        : "MODERATE"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Floating Map Legend Overlay */}
        <div className="absolute left-4 bottom-4 z-20 bg-zinc-950/95 border border-zinc-800 p-4 rounded-lg text-left backdrop-blur-md shadow-2xl w-[280px] max-h-[460px] overflow-y-auto select-none pointer-events-auto flex flex-col gap-3.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <div className="flex flex-col gap-0.5 border-b border-zinc-900 pb-2">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span className="text-[11px] font-mono text-zinc-200 uppercase tracking-wider font-bold">Map Key & Intelligence</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-500">Interactive threat indicators</span>
          </div>

          {/* Geographical Markers */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">Geographical Markers:</span>
            <div className="space-y-2 pl-1">
              <div className="flex items-center gap-2.5">
                <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                  <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/30 animate-ping" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 border border-black" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-zinc-200 font-medium">Protected Server Target</span>
                  <span className="text-[9px] font-mono text-zinc-400">Host system in {serverLocation.name} ({serverLocation.countryCode})</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-zinc-400 border border-zinc-950" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-zinc-200 font-medium">Intrusion Source Node</span>
                  <span className="text-[9px] font-mono text-zinc-400">Geolocated attacker coordinate</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                  <span className="absolute w-3 h-3 rounded-full bg-amber-500/40 animate-ping" />
                  <span className="relative w-2 h-2 rounded-full bg-amber-400 border border-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-zinc-200 font-medium">Pinned Threat Intel</span>
                  <span className="text-[9px] font-mono text-zinc-400">Active highlighted selection</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attack Intensity & Density */}
          <div className="space-y-2 pt-2.5 border-t border-zinc-900/50">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">Attack Intensity & Density:</span>
            
            <div className="space-y-2.5 pl-1">
              {/* Heatmap intensity gradient */}
              {(showHeatmapOverlay || showHeatmapView) && (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400">
                      <span className="text-zinc-500">Threat Intensity Scale:</span>
                      <span className="text-[8px] text-zinc-500 uppercase">({heatmapIntensityBasis === "attackVolume" ? "Attack Vol" : "IP Count"})</span>
                    </div>
                    <div className="h-2 w-full rounded bg-gradient-to-r from-blue-500 via-cyan-400 via-emerald-400 via-amber-400 to-red-500" />
                    <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 px-0.5">
                      <span className="text-blue-400 font-semibold">Low (Blue)</span>
                      <span className="text-red-400 font-bold">Severe (Red)</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-[9px] font-mono text-zinc-400 pl-1 border-l border-zinc-900">
                    {showHeatmapOverlay && (
                      <div className="flex gap-1.5 items-start">
                        <span className="text-red-500">■</span>
                        <span><strong className="text-zinc-300">Regional Shading</strong>: Country landmasses are colored proportionally based on local threat source density.</span>
                      </div>
                    )}
                    {showHeatmapOverlay && (
                      <div className="flex gap-1.5 items-start">
                        <span className="text-cyan-400">●</span>
                        <span><strong className="text-zinc-300">Radial Points</strong>: Radial glowing circles show the high-intensity epicenter of active attacks.</span>
                      </div>
                    )}
                    {showHeatmapView && (
                      <div className="flex gap-1.5 items-start">
                        <span className="text-orange-500">☼</span>
                        <span><strong className="text-zinc-300">Thermal Gradients</strong>: Pulsing vector opacity rings highlight high-density geographic hot zones.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Node size indicator */}
              {showNodesLayer && (
                <div className="flex items-center gap-2.5">
                  <div className="flex items-end justify-center gap-0.5 w-6 h-4">
                    <span className="w-1 h-1 rounded-full bg-zinc-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-zinc-200">Threat Volume Scaling</span>
                    <span className="text-[9px] font-mono text-zinc-400">Radius proportional to IP density</span>
                  </div>
                </div>
              )}

              {/* High Frequency Indicator */}
              {mitigationMode && (
                <div className="flex items-center gap-2.5">
                  <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                    <span className="absolute w-3 h-3 rounded-full border border-red-500 animate-[pulse_1s_infinite]" />
                    <span className="relative w-2 h-2 rounded-full bg-red-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-red-400 font-medium">Critical Attacker</span>
                    <span className="text-[9px] font-mono text-zinc-400">Extreme attack frequency (≥8 logs)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Threat Protocols Layer filter */}
          {showNodesLayer && (
            <div className="space-y-2 pt-2.5 border-t border-zinc-900/50">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">Threat Protocols:</span>
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Click to Toggle</span>
              </div>
              <div className="grid grid-cols-1 gap-1 pl-1">
                <button
                  onClick={() => toggleJail("ssh")}
                  className={`flex items-center justify-between w-full hover:bg-zinc-900/60 p-1 rounded transition-all text-left group cursor-pointer ${
                    disabledJails.has("ssh") ? "opacity-35 line-through text-zinc-500" : ""
                  }`}
                  title="Toggle SSH Protocol Nodes"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full ring-2 ring-blue-500/20 bg-blue-500" />
                    <span className="text-[11px] font-mono text-zinc-300">SSH Brute-force</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1 rounded border transition-colors ${
                    disabledJails.has("ssh") 
                      ? "border-zinc-800 text-zinc-500" 
                      : "border-blue-500/30 text-blue-400 bg-blue-950/20"
                  }`}>
                    {disabledJails.has("ssh") ? "HIDDEN" : "ACTIVE"}
                  </span>
                </button>

                <button
                  onClick={() => toggleJail("plesk-panel")}
                  className={`flex items-center justify-between w-full hover:bg-zinc-900/60 p-1 rounded transition-all text-left group cursor-pointer ${
                    disabledJails.has("plesk-panel") ? "opacity-35 line-through text-zinc-500" : ""
                  }`}
                  title="Toggle Plesk Protocol Nodes"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full ring-2 ring-emerald-500/20 bg-emerald-500" />
                    <span className="text-[11px] font-mono text-zinc-300">Plesk Login</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1 rounded border transition-colors ${
                    disabledJails.has("plesk-panel") 
                      ? "border-zinc-800 text-zinc-500" 
                      : "border-emerald-500/30 text-emerald-400 bg-emerald-950/20"
                  }`}>
                    {disabledJails.has("plesk-panel") ? "HIDDEN" : "ACTIVE"}
                  </span>
                </button>

                <button
                  onClick={() => toggleJail("plesk-postfix")}
                  className={`flex items-center justify-between w-full hover:bg-zinc-900/60 p-1 rounded transition-all text-left group cursor-pointer ${
                    disabledJails.has("plesk-postfix") ? "opacity-35 line-through text-zinc-500" : ""
                  }`}
                  title="Toggle SMTP Protocol Nodes"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full ring-2 ring-amber-500/20 bg-amber-500" />
                    <span className="text-[11px] font-mono text-zinc-300">SMTP Postfix Spam</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1 rounded border transition-colors ${
                    disabledJails.has("plesk-postfix") 
                      ? "border-zinc-800 text-zinc-500" 
                      : "border-amber-500/30 text-amber-400 bg-amber-950/20"
                  }`}>
                    {disabledJails.has("plesk-postfix") ? "HIDDEN" : "ACTIVE"}
                  </span>
                </button>

                <button
                  onClick={() => toggleJail("plesk-modsecurity")}
                  className={`flex items-center justify-between w-full hover:bg-zinc-900/60 p-1 rounded transition-all text-left group cursor-pointer ${
                    disabledJails.has("plesk-modsecurity") ? "opacity-35 line-through text-zinc-500" : ""
                  }`}
                  title="Toggle WAF Protocol Nodes"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full ring-2 ring-red-500/20 bg-red-500" />
                    <span className="text-[11px] font-mono text-zinc-300">WAF ModSecurity</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1 rounded border transition-colors ${
                    disabledJails.has("plesk-modsecurity") 
                      ? "border-zinc-800 text-zinc-500" 
                      : "border-red-500/30 text-red-400 bg-red-950/20"
                  }`}>
                    {disabledJails.has("plesk-modsecurity") ? "HIDDEN" : "ACTIVE"}
                  </span>
                </button>

                <button
                  onClick={() => toggleJail("other")}
                  className={`flex items-center justify-between w-full hover:bg-zinc-900/60 p-1 rounded transition-all text-left group cursor-pointer ${
                    disabledJails.has("other") ? "opacity-35 line-through text-zinc-500" : ""
                  }`}
                  title="Toggle Other Protocol Nodes"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full ring-2 ring-purple-500/20 bg-purple-500" />
                    <span className="text-[11px] font-mono text-zinc-300">Other / Custom Protocol</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1 rounded border transition-colors ${
                    disabledJails.has("other") 
                      ? "border-zinc-800 text-zinc-500" 
                      : "border-purple-500/30 text-purple-400 bg-purple-950/20"
                  }`}>
                    {disabledJails.has("other") ? "HIDDEN" : "ACTIVE"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating Zoom & Pan Controls Dashboard */}
        <div className="absolute right-4 bottom-4 z-20 flex flex-col items-center gap-2 bg-zinc-950/95 border border-zinc-800 p-2.5 rounded-lg backdrop-blur-md shadow-2xl w-[110px] select-none pointer-events-auto">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">Navigator</span>
          
          {/* Pan Directional Pad */}
          <div className="grid grid-cols-3 gap-1 w-20 h-20 items-center justify-items-center">
            <div />
            <button
              onClick={() => handlePan(0, 80)}
              className="w-6 h-6 rounded bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:text-white active:scale-95 text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
              title="Pan Up"
              id="map-pan-up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <div />

            <button
              onClick={() => handlePan(80, 0)}
              className="w-6 h-6 rounded bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:text-white active:scale-95 text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
              title="Pan Left"
              id="map-pan-left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-5 h-5 flex items-center justify-center text-zinc-600">
              <Move className="w-3.5 h-3.5" />
            </div>
            <button
              onClick={() => handlePan(-80, 0)}
              className="w-6 h-6 rounded bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:text-white active:scale-95 text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
              title="Pan Right"
              id="map-pan-right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div />
            <button
              onClick={() => handlePan(0, -80)}
              className="w-6 h-6 rounded bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:text-white active:scale-95 text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
              title="Pan Down"
              id="map-pan-down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <div />
          </div>

          <div className="border-t border-zinc-900 w-full my-1" />

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 w-full justify-between">
            <button
              onClick={handleZoomOut}
              className="flex-1 py-1.5 rounded bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:text-white active:scale-95 text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
              title="Zoom Out"
              id="map-zoom-out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomIn}
              className="flex-1 py-1.5 rounded bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:text-white active:scale-95 text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
              title="Zoom In"
              id="map-zoom-in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset View Button */}
          <button
            onClick={handleResetZoom}
            className="w-full py-1 text-[10px] font-mono text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 rounded text-center transition-all cursor-pointer"
            title="Reset Map View"
            id="map-zoom-reset"
          >
            Reset
          </button>
        </div>
      </div>

      <p className="text-[10px] text-zinc-500 font-mono mt-3 text-center flex items-center justify-center gap-1">
        <HelpCircle className="w-3 h-3" />
        Toggle between Nodes, Heatmap, and Hybrid views to analyze threat distributions. Hover or click nodes to pin localized intel.
      </p>

      {/* Embedded CSS for SVG line dash animations */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -180;
          }
        }
      `}</style>
    </div>
  );
}

function AlertErrorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={props.className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
