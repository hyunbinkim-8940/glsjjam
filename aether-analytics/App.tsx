import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Activity, Database, DollarSign, Zap, 
  ChevronDown, ChevronLeft, ChevronRight, Globe, Trash2, 
  Loader2, Target, PlayCircle, Clock, BarChart2, Sun, Moon, 
  Share2, MousePointer2, Filter, AlignLeft, RotateCcw,
  Layers, Command, Hexagon, ShieldAlert
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ComposedChart, Line, Bar, Cell, PieChart as RePieChart, Pie, LineChart
} from 'recharts';

/** 
 * --------------------------------------------------------------------------
 * 1. UTILS & HOOKS
 * --------------------------------------------------------------------------
 */

const useElementSize = () => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const ref = useCallback((element: HTMLDivElement | null) => {
    if (element !== null) {
      setNode(element);
    }
  }, []);

  useEffect(() => {
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      if (entry.contentRect) {
        setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return [ref, size, node] as const;
};

/** 
 * --------------------------------------------------------------------------
 * 2. UI COMPONENTS (House Glass System)
 * --------------------------------------------------------------------------
 */

// 1. Moving Dazzling Gradient Background + Dotted Grid
const AmbientBackground = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    {/* Base Layer */}
    <div className={`absolute inset-0 transition-colors duration-1000 ${isDarkMode ? 'bg-[#050507]' : 'bg-[#f0f4f8]'}`} />
    
    {/* Vibrant Multi-Hue Moving Gradient */}
    <div 
      className={`absolute inset-0 opacity-40 animate-gradient-xy mix-blend-screen transition-opacity duration-1000 ${isDarkMode ? 'opacity-20' : 'opacity-50'}`}
      style={{
        backgroundImage: isDarkMode 
            ? 'linear-gradient(45deg, #4f46e5, #9333ea, #2563eb, #0d9488, #4f46e5)' // Darker, richer tones for night
            : 'linear-gradient(45deg, #FF9A9E, #FECFEF, #E0C3FC, #8EC5FC, #A8EDEa, #eab308)',
        backgroundSize: '400% 400%'
      }}
    />

    {/* Dotted Grid Overlay (SVG) */}
    <svg style={{position: 'absolute', width: '100%', height: '100%', zIndex: 0, opacity: isDarkMode ? 0.2 : 0.05 }} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dottedGrid" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill={isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,1)"} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dottedGrid)" />
    </svg>

    {/* Floating Orbs for extra organic depth */}
    <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw]">
        <div className={`w-full h-full rounded-full mix-blend-multiply blur-[120px] animate-blob ${isDarkMode ? 'bg-[#0ea5e9]/10' : 'bg-cyan-200/50'}`} />
    </div>
    <div className="absolute bottom-[10%] right-[20%] w-[35vw] h-[35vw]">
        <div className={`w-full h-full rounded-full mix-blend-multiply blur-[100px] animate-blob animation-delay-2000 ${isDarkMode ? 'bg-[#d946ef]/10' : 'bg-purple-200/50'}`} />
    </div>
  </div>
);

// 2. Glass Card Component
const GlassCard = ({ 
    children, 
    className = "", 
    noPadding = false,
    isDarkMode = false
}: any) => {
  return (
    <div className={`house-card ${isDarkMode ? 'dark' : 'light'} flex flex-col ${noPadding ? 'p-0' : 'p-6'} ${className}`}>
      {/* Content */}
      <div className="relative z-30 h-full w-full flex flex-col">
        {children}
      </div>
    </div>
  );
};

// 3. Glass Button
const GlassButton = ({ children, onClick, active, isDarkMode, className = "", disabled }: any) => (
  <div className={`button-wrap ${className}`}>
    <button 
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`house-btn ${isDarkMode ? 'dark' : 'light'} ${active ? 'is-active' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        <span>
            {children}
        </span>
    </button>
    <div className="button-shadow"></div>
  </div>
);

const PremiumSlider = ({ min, max, value, onChange, step = 1, formatLabel = (v: any) => v, isDual = false, isDarkMode }: any) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const getPercentage = useCallback((val: number) => ((val - min) / (max - min)) * 100, [min, max]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      if (rect.width === 0) return; 
      const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      const rawValue = percent * (max - min) + min;
      const newValue = Math.round(rawValue / step) * step;
      if (isDual) {
        const [currentMin, currentMax] = value;
        if (dragging === 'min') onChange([Math.min(newValue, currentMax), currentMax]);
        else onChange([currentMin, Math.max(newValue, currentMin)]);
      } else { onChange(newValue); }
    };
    const handleMouseUp = () => setDragging(null);
    if (dragging) { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp); }
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, [dragging, isDual, max, min, onChange, step, value]);

  const percentStart = isDual ? getPercentage(value[0]) : 0;
  const percentEnd = isDual ? getPercentage(value[1]) : getPercentage(value);

  return (
    <div className="py-5 select-none touch-none w-full px-1">
      {/* Sunken Glass Track */}
      <div className={`relative h-3 w-full rounded-full glass-concave ${isDarkMode ? 'dark' : 'light'}`} ref={trackRef}>
        <div 
            className="absolute h-full rounded-full bg-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.3)]" 
            style={{ left: `${percentStart}%`, width: `${percentEnd - percentStart}%` }} 
        />
        {/* Glass Knobs */}
        {isDual ? (
          <>
            <div 
                className={`glass-knob ${isDarkMode ? 'dark' : 'light'} absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full cursor-pointer z-20 transition-transform active:scale-95`}
                style={{ left: `${percentStart}%`, transform: 'translate(-50%, -50%)' }} 
                onMouseDown={(e) => { e.preventDefault(); setDragging('min'); }} 
            />
            <div 
                className={`glass-knob ${isDarkMode ? 'dark' : 'light'} absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full cursor-pointer z-20 transition-transform active:scale-95`}
                style={{ left: `${percentEnd}%`, transform: 'translate(-50%, -50%)' }} 
                onMouseDown={(e) => { e.preventDefault(); setDragging('max'); }} 
            />
          </>
        ) : (
          <div 
            className={`glass-knob ${isDarkMode ? 'dark' : 'light'} absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full cursor-pointer z-20 transition-transform active:scale-95`}
            style={{ left: `${percentEnd}%`, transform: 'translate(-50%, -50%)' }} 
            onMouseDown={(e) => { e.preventDefault(); setDragging('single'); }} 
          />
        )}
      </div>
      <div className={`flex justify-between mt-3 text-[10px] font-bold tracking-widest uppercase transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
        <span>{isDual ? formatLabel(value[0]) : formatLabel(min)}</span>
        <span>{isDual ? formatLabel(value[1]) : formatLabel(value)}</span>
      </div>
    </div>
  );
};

const PillControl = ({ options, value, onChange, isDarkMode }: any) => (
  // Sunken Glass Container
  <div className={`flex p-1.5 rounded-full w-full glass-concave ${isDarkMode ? 'dark' : 'light'} transition-all duration-500`}>
    {options.map((opt: any) => {
        const isActive = value === opt.value;
        return (
            <button 
                key={opt.value} 
                onClick={() => onChange(opt.value)} 
                className={`
                    flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 relative
                    ${isActive ? (isDarkMode ? 'text-cyan-300' : 'text-cyan-700') : 'text-slate-400 hover:text-slate-500'}
                `}
            >
                {isActive && (
                    <div className={`absolute inset-0 house-btn ${isDarkMode ? 'dark' : 'light'} !shadow-sm z-0 is-active`}></div>
                )}
                <span className="relative z-10">{opt.label}</span>
            </button>
        )
    })}
  </div>
);

const RadioGroup = ({ options, value, onChange, isDarkMode }: any) => (
  <div className="flex flex-row gap-4 mt-3">
    {options.map((opt: any) => (
      <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
        {/* Glass Knob Radio */}
        <div className={`w-5 h-5 rounded-full glass-knob ${isDarkMode ? 'dark' : 'light'} flex items-center justify-center transition-transform group-active:scale-95`}>
          {value === opt.value && <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-sm" />}
        </div>
        <span className={`text-[11px] font-bold tracking-wide transition-colors ${value === opt.value ? (isDarkMode ? 'text-cyan-200' : 'text-slate-700') : 'text-slate-400'}`}>{opt.label}</span>
        <input type="radio" className="hidden" checked={value === opt.value} onChange={() => onChange(opt.value)} />
      </label>
    ))}
  </div>
);

const FilterSection = ({ title, icon: Icon, children, isOpenDefault = false, count = 0, isDarkMode }: any) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  return (
    <div className={`rounded-[2rem] mb-4 border transition-all duration-500 overflow-hidden house-card ${isDarkMode ? 'dark' : 'light'} ${isOpen ? 'opacity-100' : 'bg-transparent border-transparent opacity-80'}`}>
      <button 
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }} 
        className={`flex items-center justify-between w-full text-left p-4 group cursor-pointer outline-none transition-all`}
      >
        <div className="flex items-center gap-3 pointer-events-none">
          <div className={`p-2 rounded-xl transition-all duration-500 ${isDarkMode ? 'text-cyan-300 bg-cyan-400/10' : 'text-indigo-600 bg-white shadow-sm border border-indigo-50'}`}>
            <Icon size={16} strokeWidth={2} />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-500 ${isDarkMode ? 'text-slate-300 group-hover:text-white' : 'text-slate-600'}`}>{title}</span>
          {count > 0 && <span className={`ml-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-100 text-indigo-600'}`}>{count}</span>}
        </div>
        <ChevronDown size={16} className={`transition-transform duration-500 ${isDarkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400'} ${isOpen ? 'rotate-180' : ''}`}/>
      </button>
      
      <div className={`transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 pt-0 pb-6 space-y-5">
            <div className={`h-px w-full mb-4 transition-colors duration-500 ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}></div>
            {children}
        </div>
      </div>
    </div>
  );
};

/** 
 * --------------------------------------------------------------------------
 * 3. MAIN APPLICATION
 * --------------------------------------------------------------------------
 */
export default function CryptoAnalyticsDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to Day Mode
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const initialFilters = {
    dateRange: { start: thirtyDaysAgo, end: today },
    totalVolume: 0, avgTradeSize: 0, netBuyRatio: [-1, 1], txCount: 0,
    atomShare: 0, atomOneShare: 0, ibcShare: 0,
    activeDays: 0, recentActive: 'All', aiiScore: 0, timingType: 'All', correlation: [-1, 1]
  };
  
  const [filters, setFilters] = useState(initialFilters); 
  const [tempFilters, setTempFilters] = useState(initialFilters);
  const updateTempFilter = (key: string, value: any) => setTempFilters(prev => ({ ...prev, [key]: value }));
  
  const setDatePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    updateTempFilter('dateRange', {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
    });
  };

  const applyFilters = () => {
      setFilters(tempFilters);
      setSelectedNode(null);
  };

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  
  const [chartRef, chartSize, chartNode] = useElementSize();
  
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const nodeRefs = useRef<{[key: string]: SVGCircleElement}>({}); 
  const frameRef = useRef<number>(0);

  const [realBubbleData, setRealBubbleData] = useState<any[]>([]);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [marketStats, setMarketStats] = useState({
    atom: { price: 0, change: 0, mcap: 0, sparkline: [] as number[] },
    atomOne: { price: 0, change: 0, mcap: 0, sparkline: [] as number[] },
  });

  const [portfolio, setPortfolio] = useState([
    { id: 'A', node: null as any, weight: 50, color: '#F43F5E' }, 
    { id: 'B', node: null as any, weight: 30, color: '#06B6D4' }, 
    { id: 'C', node: null as any, weight: 20, color: '#8B5CF6' }  
  ]);
  const [baseAsset, setBaseAsset] = useState('ATOM');
  const [initInvestment, setInitInvestment] = useState(100);
  const [strategyMode, setStrategyMode] = useState('ALL'); 
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // --- DATA FETCHING (UNCHANGED LOGIC) ---
  useEffect(() => {
    setIsApiLoading(true);
    const fetchData = async () => {
      try {
        const startTs = new Date(filters.dateRange.start).getTime() / 1000;
        const endTs = new Date(filters.dateRange.end).getTime() / 1000;
        
        // Mocking/Using API
        const marketRes = await fetch(`https://api.coingecko.com/api/v3/coins/cosmos/market_chart/range?vs_currency=usd&from=${startTs}&to=${endTs}`);
        let marketData = { prices: [], total_volumes: [] };
        if (marketRes.ok) {
            marketData = await marketRes.json();
        }

        const prices = marketData.prices.map((p: any) => p[1]);
        const startPrice = prices[0] || 0;
        const endPrice = prices[prices.length - 1] || 0;
        const priceChange = ((endPrice - (prices[0] || 0)) / (prices[0] || 1)); 
        
        const mean = prices.reduce((a: number, b: number) => a + b, 0) / (prices.length || 1);
        const variance = prices.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / (prices.length || 1);
        const volatility = Math.sqrt(variance) / mean; 

        // AtomOne Mock Data (Derived)
        const atomOnePrices = prices.map((p: number) => (p * 0.3) + (Math.sin(p) * 0.05)); 
        const atomOneStart = atomOnePrices[0] || 0;
        const atomOneEnd = atomOnePrices[atomOnePrices.length - 1] || 0;
        const atomOneChange = atomOneStart !== 0 ? ((atomOneEnd - atomOneStart) / atomOneStart) : 0;

        const valRes = await fetch('https://rest.cosmos.directory/cosmoshub/cosmos/staking/v1beta1/validators?pagination.limit=200', { mode: 'cors' });
        let validators: any[] = [];
        if (valRes.ok) {
           const valData = await valRes.json();
           validators = valData.validators || [];
        }
        
        if (validators.length === 0) throw new Error("No validator data found");

        const maxTokens = Math.max(...validators.map(v => parseInt(v.tokens || "0")));
        const safeMaxTokens = maxTokens > 0 ? maxTokens : 1; 
        const logMax = Math.log10((safeMaxTokens / 1000000) + 1);
        
        const dateSalt = filters.dateRange.start + filters.dateRange.end;

        const processed = validators.map((val, i) => {
            const tokensRaw = parseInt(val.tokens || "0");
            const tokens = isNaN(tokensRaw) ? 0 : tokensRaw / 1000000; 
            if (tokens < 1) return null; 

            const moniker = val.description?.moniker || `Validator ${i}`;
            const operatorAddr = val.operator_address || `addr-${i}`;

            let hash = 0;
            const seed = operatorAddr + dateSalt;
            for (let k = 0; k < seed.length; k++) hash = seed.charCodeAt(k) + ((hash << 5) - hash);
            const normalizedHash = (Math.abs(hash) % 100) / 100; 
            
            let atomShare = normalizedHash;
            if (priceChange > 0.1) { 
                atomShare = Math.min(1, atomShare + 0.2);
            } else if (priceChange < -0.1) {
                atomShare = Math.max(0, atomShare - 0.2);
            }

            const entropy = (Math.sin(hash + startTs) * volatility * 2); 
            atomShare = Math.max(0, Math.min(1, atomShare + entropy));

            const atomOneShare = 1 - atomShare;

            let colorType = "Mixed";
            let gradId = "grad-mixed"; 
            if (atomShare > 0.6) { colorType = "ATOM Dominant"; gradId = "grad-atom"; } 
            else if (atomShare < 0.4) { colorType = "ONE Dominant"; gradId = "grad-one"; }

            const logVP = Math.log10(tokens + 1);
            let aiiScore = (logVP / (logMax || 1)) * 100;
            const activityNoise = Math.sin(endTs + hash) * 10; 
            aiiScore = Math.max(5, Math.min(100, aiiScore + activityNoise));

            const xMetric = aiiScore * atomShare;
            const yMetric = aiiScore * atomOneShare;

            const ibcShare = (Math.abs(hash * 3) % 100) / 100;
            const activeDays = Math.floor((Math.abs(hash * 7 + startTs) % 30) + 1);
            
            return {
                id: moniker, 
                key: operatorAddr, 
                type: colorType, 
                gradId: gradId,
                totalVol: tokens, 
                avgTxSize: tokens / 100, 
                netBuyRatio: ((normalizedHash * 2) - 1), 
                txCount: Math.floor(tokens * 0.1),
                atomShare, atomOneShare, ibcShare,
                activeDays, recentActiveDaysAgo: Math.floor(Math.abs(hash * 2) % 30),
                aiiScore: Math.floor(aiiScore),
                timingType: ['Lead', 'Sync', 'Lag'][Math.floor(normalizedHash * 3)],
                correlation: (normalizedHash * 2) - 1, 
                scaleScore: Math.floor(aiiScore), 
                timingScore: Math.floor(normalizedHash * 100),
                xMetric: isNaN(xMetric) ? 50 : xMetric, 
                yMetric: isNaN(yMetric) ? 50 : yMetric,
                details: val.description?.details || "No details provided.",
                website: val.description?.website
            };
        }).filter(Boolean);
        
        setRealBubbleData(processed);
        setMarketStats({
            atom: { price: endPrice, change: priceChange * 100, mcap: 0, sparkline: prices },
            atomOne: { price: atomOneEnd, change: atomOneChange * 100, mcap: 0, sparkline: atomOnePrices },
        });

      } catch (e) {
        console.error("Failed to fetch real data", e);
        setRealBubbleData([]); 
      } finally {
        setIsApiLoading(false);
      }
    };
    fetchData();
  }, [filters.dateRange]);

  useEffect(() => {
    const container = chartNode; if (!container) return;
    const handleWheel = (e: WheelEvent) => { e.preventDefault(); setZoom(z => Math.min(Math.max(0.5, z - e.deltaY * 0.001), 5)); };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => { container.removeEventListener('wheel', handleWheel); };
  }, [chartNode]);

  const CHART_PADDING = 60;
  const getX = (val: number) => { if (!chartSize.width) return 0; return CHART_PADDING + (val / 100) * ((chartSize.width) - CHART_PADDING * 2); }
  const getY = (val: number) => { if (!chartSize.height) return 0; return (chartSize.height) - CHART_PADDING - ((val / 100) * ((chartSize.height) - CHART_PADDING * 2)); };

  useEffect(() => {
    const animate = () => {
        const mX = mouseRef.current.x;
        const mY = mouseRef.current.y;
        
        const rect = chartNode ? chartNode.getBoundingClientRect() : { left: 0, top: 0 };
        const localMouseX = (mX - rect.left - pan.x) / zoom;
        const localMouseY = (mY - rect.top - pan.y) / zoom;
        const triggerDist = 200; 

        Object.keys(nodeRefs.current).forEach(key => {
            const el = nodeRefs.current[key];
            if (!el) return;

            const cx = parseFloat(el.getAttribute('data-cx') || "0");
            const cy = parseFloat(el.getAttribute('data-cy') || "0");
            const baseR = parseFloat(el.getAttribute('data-base-r') || "10");
            const isMatch = el.getAttribute('data-is-match') === 'true';

            if (!isMatch) return; 

            let scale = 1;
            const dist = Math.hypot(cx - localMouseX, cy - localMouseY);
            if (dist < triggerDist) {
                const ratio = 1 - (dist / triggerDist);
                scale = 1 + (1.0 * (ratio * ratio)); 
            }
            el.setAttribute('r', (baseR * scale).toString());
        });
        frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [pan, zoom, chartNode]); 

  const processedNodes = useMemo(() => {
    const f = filters; 
    return realBubbleData.map(node => {
      let isMatch = true;
      if (node.totalVol < f.totalVolume) isMatch = false;
      if (node.avgTxSize < f.avgTradeSize) isMatch = false;
      if (node.netBuyRatio < f.netBuyRatio[0] || node.netBuyRatio > f.netBuyRatio[1]) isMatch = false;
      if (node.txCount < f.txCount) isMatch = false;
      if (node.atomShare < f.atomShare) isMatch = false;
      if (node.atomOneShare < f.atomOneShare) isMatch = false;
      if (node.ibcShare < f.ibcShare) isMatch = false;
      if (node.activeDays < f.activeDays) isMatch = false;
      if (f.recentActive !== 'All') {
          const limit = f.recentActive === '3d' ? 3 : f.recentActive === '7d' ? 7 : 30;
          if (node.recentActiveDaysAgo > limit) isMatch = false;
      }
      if (node.aiiScore < f.aiiScore) isMatch = false;
      if (f.timingType !== 'All' && node.timingType !== f.timingType) isMatch = false;
      if (node.correlation < f.correlation[0] || node.correlation > f.correlation[1]) isMatch = false;

      const cx = getX(node.xMetric); 
      const cy = getY(node.yMetric); 
      const baseR = Math.max(4, (node.aiiScore / 100) * 45); 
      
      return { ...node, cx, cy, baseR, isMatch, gradId: node.gradId };
    }).sort((a, b) => (a.isMatch === b.isMatch) ? 0 : a.isMatch ? 1 : -1); 
  }, [realBubbleData, filters, chartSize]);

  const handleNodeClick = (e: any, node: any) => { 
      e.stopPropagation(); 
      if(!node.isMatch) return; 
      setSelectedNode(selectedNode?.key === node.key ? null : node); 
  };
  const handleChartClick = (e: any) => { 
      const dist = Math.sqrt(Math.pow(e.clientX - dragStartPos.x, 2) + Math.pow(e.clientY - dragStartPos.y, 2)); 
      if (dist < 5) setSelectedNode(null); 
  };
  
  const handleMouseMove = (e: any) => { 
    mouseRef.current = { x: e.clientX, y: e.clientY }; 
    if(!isDragging) return; 
    setPan(p=>({x:p.x+e.clientX-lastMousePos.x, y:p.y+e.clientY-lastMousePos.y})); 
    setLastMousePos({x:e.clientX,y:e.clientY}); 
  };
  const handleMouseDown = (e: any) => { if(e.target.tagName==='circle') return; setIsDragging(true); setLastMousePos({x:e.clientX,y:e.clientY}); setDragStartPos({x:e.clientX,y:e.clientY}); };
  const handleMouseUp = () => setIsDragging(false);

  const detailData = useMemo(() => {
    if(!selectedNode) return null;
    if (!marketStats.atom || !marketStats.atom.sparkline || marketStats.atom.sparkline.length === 0) return null;

    const rawPrices = marketStats.atom.sparkline;
    const sliceCount = Math.min(rawPrices.length, 30);
    const sourcePrices = rawPrices.slice(rawPrices.length - sliceCount);

    const historyData = sourcePrices.map((price, i, arr) => {
         const prevPrice = i > 0 ? arr[i-1] : price;
         const change = price - prevPrice;
         const nodeFactor = selectedNode.totalVol / 100000; 
         const correlatedBuy = change * 10000 * nodeFactor * (1 + (selectedNode.correlation || 0));
         return { day: `T-${arr.length - 1 - i}`, price: price, netBuy: correlatedBuy };
    });

    return { 
        history: historyData,
        composition: [
            {name:'Swap', value: Math.floor(selectedNode.atomShare * 60), fill:'#fb7185'}, // Rose 400
            {name:'IBC', value: Math.floor(selectedNode.atomOneShare * 30) + 10, fill:'#22d3ee'}, // Cyan 400
            {name:'Stake', value: 30, fill:'#a78bfa'} // Violet 400
        ],
        desc: `High impact validator node with ${(selectedNode.totalVol/1000).toFixed(1)}k voting power. ${selectedNode.details.length > 100 ? selectedNode.details.substring(0,100)+'...' : selectedNode.details}`
    }
  }, [selectedNode, marketStats]);

  const assignNodeToPortfolio = (slotId: string) => { if (selectedNode) setPortfolio(prev => prev.map(p => p.id === slotId ? { ...p, node: selectedNode } : p)); };
  const clearPortfolioSlot = (slotId: string) => setPortfolio(prev => prev.map(p => p.id === slotId ? { ...p, node: null } : p));
  const updateWeight = (slotId: string, val: any) => {
    const newWeight = Math.max(0, Math.min(100, Number(val)));
    const remaining = 100 - newWeight;
    const otherSlots = portfolio.filter(p => p.id !== slotId);
    const currentSumOthers = otherSlots.reduce((acc, p) => acc + p.weight, 0);
    let newPortfolio = portfolio.map(p => p.id === slotId ? { ...p, weight: newWeight } : p);
    if (currentSumOthers === 0) {
        const count = otherSlots.length;
        if (count > 0) {
            const equalShare = Math.floor(remaining / count);
            newPortfolio = newPortfolio.map(p => { if (p.id !== slotId) return { ...p, weight: equalShare }; return p; });
        }
    } else {
        newPortfolio = newPortfolio.map(p => { if (p.id !== slotId) { const ratio = p.weight / currentSumOthers; return { ...p, weight: Math.floor(remaining * ratio) }; } return p; });
    }
    const currentTotal = newPortfolio.reduce((acc, p) => acc + p.weight, 0);
    const diff = 100 - currentTotal;
    if (diff !== 0) { const target = newPortfolio.find(p => p.id !== slotId); if(target) target.weight += diff; }
    setPortfolio(newPortfolio);
  };

  const runBacktest = () => {
    if (portfolio.every(p => !p.node)) return;
    setIsSimulating(true);

    setTimeout(() => {
        // --- BACKTEST LOGIC ---
        const prices = baseAsset === 'ATOM' ? marketStats.atom.sparkline : marketStats.atomOne.sparkline;
        if (!prices || prices.length === 0) {
            setIsSimulating(false);
            return;
        }

        const simLength = Math.min(prices.length, 90);
        const simPrices = prices.slice(prices.length - simLength);
        
        const timeline: any[] = [];
        let initialTotalValue = 0;
        let finalTotalValue = 0;

        const slotSims = portfolio.map(slot => {
            if (!slot.node) return null;
            
            const startCapital = (initInvestment * slot.weight) / 100;
            const seed = slot.node.key.length + slot.node.aiiScore;
            
            return {
                ...slot,
                cash: startCapital,
                holdings: 0,
                startCapital,
                seed
            };
        });

        initialTotalValue = initInvestment;

        simPrices.forEach((price, dayIdx) => {
            const startWin = Math.max(0, dayIdx - 5);
            const window = simPrices.slice(startWin, dayIdx + 1);
            const avg = window.reduce((a,b)=>a+b, 0) / window.length;

            let currentDayPortfolioValue = 0;

            slotSims.forEach((sim) => {
                if (!sim) return;
                const signalNoise = Math.sin(dayIdx + sim.seed);
                
                let action = 'HOLD';
                if (price < avg * 0.98 && signalNoise > 0.2) action = 'BUY';
                else if (price > avg * 1.02 && signalNoise < -0.2) action = 'SELL';

                if (strategyMode === 'BUY_ONLY') {
                    if (action === 'SELL') action = 'HOLD';
                }

                if (action === 'BUY' && sim.cash > 0.1) {
                    const tradeAmt = sim.cash * 0.5;
                    const units = tradeAmt / price;
                    sim.cash -= tradeAmt;
                    sim.holdings += units;
                } else if (action === 'SELL' && sim.holdings > 0) {
                    const tradeUnits = sim.holdings * 0.5;
                    const amount = tradeUnits * price;
                    sim.holdings -= tradeUnits;
                    sim.cash += amount;
                }

                const val = sim.cash + (sim.holdings * price);
                currentDayPortfolioValue += val;
            });
            
            const assignedWeight = portfolio.reduce((a,b) => a + (b.node ? b.weight : 0), 0);
            const unassignedCapital = (initInvestment * (100 - assignedWeight)) / 100;
            currentDayPortfolioValue += unassignedCapital;

            timeline.push({
                day: dayIdx,
                value: (currentDayPortfolioValue / initInvestment) * 100, 
                rawVal: currentDayPortfolioValue
            });
            
            if (dayIdx === simPrices.length - 1) {
                finalTotalValue = currentDayPortfolioValue;
            }
        });

        const profit = finalTotalValue - initialTotalValue;
        const roi = (profit / initialTotalValue) * 100;

        setSimulationResult({ roi, profit, timeline });
        setIsSimulating(false);
    }, 1500);
  };
  const resetSimulation = () => { setSimulationResult(null); setIsSimulating(false); };

  const getRenderedNodes = () => {
    return processedNodes.map((node) => {
        const isSelected = selectedNode?.key === node.key;
        const targetR = node.baseR; 
        
        const strokeColor = isDarkMode ? "#ffffff" : "#1e293b";
        const activeOpacity = isDarkMode ? 0.9 : 0.85;
        const finalOpacity = node.isMatch ? (selectedNode && !isSelected ? 0.1 : activeOpacity) : 0;
        const pointerEvents = node.isMatch ? 'auto' : 'none';
        
        return (
            <g key={node.key} onClick={(e) => handleNodeClick(e, node)} style={{pointerEvents: pointerEvents as any, cursor: node.isMatch ? 'pointer' : 'default'}}>
                <g transform={`translate(${node.cx}, ${node.cy})`}>
                    <circle 
                        ref={(el) => {
                            if(el) {
                                nodeRefs.current[node.key] = el;
                                el.setAttribute('data-cx', node.cx.toString());
                                el.setAttribute('data-cy', node.cy.toString());
                                el.setAttribute('data-base-r', targetR.toString());
                                el.setAttribute('data-is-match', node.isMatch.toString());
                            } else {
                                delete nodeRefs.current[node.key];
                            }
                        }}
                        className="transition-all duration-500 ease-out"
                        r={targetR} 
                        fill={`url(#${node.gradId})`} 
                        fillOpacity={finalOpacity} 
                        stroke={strokeColor} 
                        strokeWidth={isSelected ? 2 : 0.5} 
                        strokeOpacity={node.isMatch ? (isSelected ? 1 : 0.3) : 0}
                    />
                    {/* Glow effect for selected node */}
                    {isSelected && node.isMatch && (
                         <circle r={targetR + 5} fill="none" stroke={strokeColor} strokeOpacity={0.3} strokeWidth={1} className="animate-pulse"/>
                    )}
                </g>
            </g>
        )
    });
  };

  const TooltipStyles = {
      backgroundColor: isDarkMode ? 'rgba(5, 5, 10, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
      borderRadius: '16px', 
      border: '1px solid rgba(255,255,255,0.1)', 
      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(12px)'
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-cyan-500/30 flex overflow-hidden relative text-sm transition-colors duration-1000 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
      <AmbientBackground isDarkMode={isDarkMode} />
      
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-6 left-6 z-50 ${isSidebarCollapsed ? 'w-24' : 'w-[400px]'} rounded-[40px] transition-all duration-700 cubic-bezier(0.25, 0.1, 0.25, 1) flex flex-col border backdrop-blur-2xl ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/40 border-white/40 shadow-2xl'}`}>
        
        {/* Header */}
        <div className="p-8 flex items-center justify-between shrink-0">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="relative w-10 h-10 flex items-center justify-center">
                 <Hexagon size={40} strokeWidth={1.5} className={`absolute inset-0 ${isDarkMode ? 'text-white/20' : 'text-slate-900/20'}`} />
                 <Zap size={20} className={isDarkMode ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-indigo-600'} fill="currentColor"/>
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AETHER</span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500">Analytics</span>
              </div>
            </div>
          )}
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className={`p-3 rounded-full transition-all hover:scale-110 border ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10' : 'bg-white/50 border-white/50 text-slate-600 hover:bg-white'}`}>
             {isSidebarCollapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-20 relative z-[60]">
          {!isSidebarCollapsed ? (
            <div className="animate-in fade-in duration-700 space-y-6">
              
              {/* 0. Timeframe Control */}
              <GlassCard isDarkMode={isDarkMode} cornerRadius={24} noPadding className="backdrop-blur-md">
                <div className={`p-4 pb-2 flex items-center gap-2 mb-2 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    <Clock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Time Horizon</span>
                </div>
                <div className="px-4 flex gap-2 mb-4">
                    {[7, 30, 90, 180].map(d => (
                        <GlassButton key={d} isDarkMode={isDarkMode} active={false} onClick={() => setDatePreset(d)} className="flex-1 w-full text-center">
                            {d}D
                        </GlassButton>
                    ))}
                </div>
                <div className="flex gap-2 px-4 pb-4">
                    <input type="date" className={`h-10 flex-1 rounded-xl px-3 text-[11px] font-bold outline-none text-center uppercase tracking-wide cursor-pointer transition-all duration-300 border glass-concave ${isDarkMode ? 'dark text-white hover:border-white/30 focus:border-cyan-500/50' : 'light text-slate-700 hover:border-slate-300'}`} value={tempFilters.dateRange.start} onChange={e=>updateTempFilter('dateRange', {...tempFilters.dateRange, start: e.target.value})}/>
                    <input type="date" className={`h-10 flex-1 rounded-xl px-3 text-[11px] font-bold outline-none text-center uppercase tracking-wide cursor-pointer transition-all duration-300 border glass-concave ${isDarkMode ? 'dark text-white hover:border-white/30 focus:border-cyan-500/50' : 'light text-slate-700 hover:border-slate-300'}`} value={tempFilters.dateRange.end} onChange={e=>updateTempFilter('dateRange', {...tempFilters.dateRange, end: e.target.value})}/>
                </div>
              </GlassCard>

              <FilterSection isDarkMode={isDarkMode} title="Scale Metrics" icon={DollarSign} isOpenDefault={true} count={2}>
                <div><div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest opacity-60"><span>Total Volume</span></div><PremiumSlider isDarkMode={isDarkMode} min={0} max={50000} step={1000} value={tempFilters.totalVolume} onChange={(v: any) => updateTempFilter('totalVolume', v)} formatLabel={(v: any) => `${(v/1000).toFixed(0)}k`} /></div>
                <div><div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest opacity-60"><span>Avg Trade Size</span></div><PremiumSlider isDarkMode={isDarkMode} min={0} max={1000} step={10} value={tempFilters.avgTradeSize} onChange={(v: any) => updateTempFilter('avgTradeSize', v)} formatLabel={(v: any) => v} /></div>
              </FilterSection>

              <FilterSection isDarkMode={isDarkMode} title="Market Behavior" icon={BarChart2} isOpenDefault={false} count={2}>
                 <div><div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest opacity-60"><span>Net Buy Ratio</span></div><PremiumSlider isDarkMode={isDarkMode} isDual min={-1} max={1} step={0.1} value={tempFilters.netBuyRatio} onChange={(v: any) => updateTempFilter('netBuyRatio', v)} formatLabel={(v: any) => v.toFixed(1)} /></div>
                 <div><div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest opacity-60"><span>Tx Count</span></div><PremiumSlider isDarkMode={isDarkMode} min={0} max={500} step={10} value={tempFilters.txCount} onChange={(v: any) => updateTempFilter('txCount', v)} formatLabel={(v: any) => v} /></div>
              </FilterSection>
              
              <FilterSection isDarkMode={isDarkMode} title="Network Share" icon={Share2} isOpenDefault={false} count={3}>
                <div><div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest opacity-60"><span>ATOM Share</span></div><PremiumSlider isDarkMode={isDarkMode} min={0} max={1} step={0.1} value={tempFilters.atomShare} onChange={(v: any) => updateTempFilter('atomShare', v)} formatLabel={(v: any) => `${(v*100).toFixed(0)}%`} /></div>
                <div><div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest opacity-60"><span>ONE Share</span></div><PremiumSlider isDarkMode={isDarkMode} min={0} max={1} step={0.1} value={tempFilters.atomOneShare} onChange={(v: any) => updateTempFilter('atomOneShare', v)} formatLabel={(v: any) => `${(v*100).toFixed(0)}%`} /></div>
                <div><div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest opacity-60"><span>IBC Share</span></div><PremiumSlider isDarkMode={isDarkMode} min={0} max={1} step={0.1} value={tempFilters.ibcShare} onChange={(v: any) => updateTempFilter('ibcShare', v)} formatLabel={(v: any) => `${(v*100).toFixed(0)}%`} /></div>
              </FilterSection>
              
              <FilterSection isDarkMode={isDarkMode} title="Activity Levels" icon={Activity} isOpenDefault={false} count={2}>
                 <div><div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest opacity-60"><span>Active Days</span></div><PremiumSlider isDarkMode={isDarkMode} min={0} max={30} step={1} value={tempFilters.activeDays} onChange={(v: any) => updateTempFilter('activeDays', v)} formatLabel={(v: any) => `${v}d`} /></div>
                 <div><div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60"><span>Recency</span></div><RadioGroup isDarkMode={isDarkMode} options={[{label:'3d', value:'3d'},{label:'7d', value:'7d'},{label:'30d', value:'30d'},{label:'All', value:'All'}]} value={tempFilters.recentActive} onChange={(v: any) => updateTempFilter('recentActive', v)}/></div>
              </FilterSection>
              
              <FilterSection isDarkMode={isDarkMode} title="Impact Score" icon={Target} isOpenDefault={false} count={3}>
                 <div><div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest opacity-60"><span>AII Score</span></div><PremiumSlider isDarkMode={isDarkMode} min={0} max={100} step={5} value={tempFilters.aiiScore} onChange={(v: any) => updateTempFilter('aiiScore', v)} formatLabel={(v: any) => v} /></div>
                 <div className="mb-3"><div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest opacity-60"><span>Timing</span></div><PillControl isDarkMode={isDarkMode} options={[{label:'Lead', value:'Lead'},{label:'Sync', value:'Sync'},{label:'Lag', value:'Lag'},{label:'All', value:'All'}]} value={tempFilters.timingType} onChange={(v: any) => updateTempFilter('timingType', v)} /></div>
                 <div><div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest opacity-60"><span>Correlation</span></div><PremiumSlider isDarkMode={isDarkMode} isDual min={-1} max={1} step={0.1} value={tempFilters.correlation} onChange={(v: any) => updateTempFilter('correlation', v)} formatLabel={(v: any) => v.toFixed(1)} /></div>
              </FilterSection>

              <GlassButton active={true} isDarkMode={isDarkMode} onClick={applyFilters} className="w-full flex justify-center">
                  Apply Configuration
              </GlassButton>
            </div>
          ) : (
             <div className="flex flex-col items-center gap-8 mt-8">
                <Database className="text-slate-500 animate-pulse" />
                <div className="h-px w-8 bg-white/10"></div>
             </div>
          )}
        </div>
        
        {/* Footer Toggles */}
        <div className="p-6 border-t border-white/5 shrink-0">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-full py-4 rounded-[20px] flex items-center justify-center gap-3 transition-all duration-500 glass-concave ${isDarkMode ? 'dark text-white' : 'light text-slate-700 hover:bg-slate-100'}`}>
                {isDarkMode ? <Sun size={16} className="text-amber-300"/> : <Moon size={16} className="text-indigo-600"/>}
                {!isSidebarCollapsed && <span className="text-[11px] font-bold uppercase tracking-widest">{isDarkMode ? 'Day Mode' : 'Night Mode'}</span>}
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 h-screen overflow-y-auto relative transition-all duration-700 ${isSidebarCollapsed ? 'ml-32' : 'lg:ml-[440px]'}`}>
        <div className="p-8 pt-8 pb-32 max-w-[1920px] mx-auto space-y-8 relative z-10 flex flex-col min-h-full">
          
          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-8 grid-rows-[800px] h-[800px]">
             
             {/* Chart HUD (Central) */}
             <GlassCard isDarkMode={isDarkMode} className={`col-span-12 lg:col-span-8 relative p-0 overflow-hidden flex flex-col h-full group`} noPadding>
                {/* HUD Header Overlay */}
                <div className="absolute top-8 left-8 z-20 pointer-events-none">
                    <div className={`backdrop-blur-md px-6 py-4 rounded-[24px] border transition-all duration-500 ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/60 border-white/40 shadow-lg'}`}>
                        <h3 className={`text-sm font-black tracking-wide mb-4 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-indigo-100 text-indigo-600'}`}><Globe size={16}/></div>
                            IMPACT MAP
                        </h3>
                        <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#fb7185] shadow-[0_0_8px_#fb7185]"></div> <span className="text-slate-400">ATOM</span></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]"></div> <span className="text-slate-400">ONE</span></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#a78bfa] shadow-[0_0_8px_#a78bfa]"></div> <span className="text-slate-400">Mixed</span></div>
                        </div>
                    </div>
                </div>

                {/* Interactive Chart */}
                <div className="flex-1 w-full h-full relative cursor-move" ref={chartRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={() => {setIsDragging(false); mouseRef.current = {x: -9999, y: -9999}}} onClick={handleChartClick}>
                    {chartSize.width > 0 && (
                        <svg width="100%" height="100%" viewBox={`0 0 ${chartSize.width} ${chartSize.height}`} className="absolute inset-0 z-10">
                            <defs>
                                <radialGradient id="grad-atom" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                    <stop offset="0%" stopColor="#fb7185" stopOpacity="0.9" />
                                    <stop offset="100%" stopColor="#fb7185" stopOpacity="0.1" />
                                </radialGradient>
                                <radialGradient id="grad-one" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
                                </radialGradient>
                                <radialGradient id="grad-mixed" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
                                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
                                </radialGradient>
                            </defs>
                            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                                {/* Futuristic Grid Lines */}
                                {[0, 25, 50, 75, 100].map(val => (
                                    <g key={`x-${val}`}>
                                        <line x1={getX(val)} y1={getY(0)} x2={getX(val)} y2={getY(100)} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeDasharray="2 4" strokeWidth="1" />
                                        {val%50===0 && <text x={getX(val)} y={getY(0)+30} textAnchor="middle" fill={isDarkMode ? "#475569" : "#94A3B8"} fontSize="10" fontFamily="Manrope" fontWeight="700" letterSpacing="0.1em">{val === 50 ? "ATOM INFLUENCE" : val}</text>}
                                    </g>
                                ))}
                                {[0, 25, 50, 75, 100].map(val => (
                                    <g key={`y-${val}`}>
                                        <line x1={getX(0)} y1={getY(val)} x2={getX(100)} y2={getY(val)} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeDasharray="2 4" strokeWidth="1" />
                                        {val%50===0 && <text x={getX(0)+20} y={getY(val)+5} textAnchor="start" transform={`rotate(-90, ${getX(0)+20}, ${getY(val)})`} fill={isDarkMode ? "#475569" : "#94A3B8"} fontSize="10" fontFamily="Manrope" fontWeight="700" letterSpacing="0.1em">{val === 50 ? "ONE INFLUENCE" : val}</text>}
                                    </g>
                                ))}
                                {getRenderedNodes()}
                            </g>
                        </svg>
                    )}
                </div>
             </GlassCard>

             {/* Details Panel (HUD Right) */}
             <GlassCard isDarkMode={isDarkMode} className="col-span-12 lg:col-span-4 flex flex-col p-0 overflow-hidden h-full" noPadding>
                <div className={`p-8 border-b backdrop-blur-md flex justify-between items-center shrink-0 ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white/40 border-slate-200'}`}>
                    <h3 className={`text-sm font-black tracking-wide flex items-center gap-2 uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}><Layers size={16} className="text-cyan-400"/> Node Intelligence</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                    {selectedNode && detailData ? (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: selectedNode.gradId === 'grad-atom' ? '#fb7185' : selectedNode.gradId === 'grad-one' ? '#22d3ee' : '#a78bfa' }}></div>
                                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em]">{selectedNode.type}</span>
                                </div>
                                <h2 className={`text-3xl font-light tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedNode.id}</h2>
                            </div>
                            
                            {/* Micro Chart: History */}
                            <div className="h-40 w-full">
                                <h4 className="text-[9px] font-bold text-slate-500 uppercase mb-4 tracking-widest">Net Accumulation</h4>
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={detailData.history}>
                                        <CartesianGrid stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeDasharray="2 4" vertical={false} />
                                        <XAxis dataKey="day" hide />
                                        <YAxis hide domain={['auto', 'auto']} />
                                        <Tooltip contentStyle={TooltipStyles} itemStyle={{fontSize:'11px', color: isDarkMode ? '#fff' : '#000'}} labelStyle={{display:'none'}} cursor={{stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1}}/>
                                        <Line type="basis" dataKey="price" stroke="#64748b" strokeWidth={1} dot={false} />
                                        <Bar dataKey="netBuy" barSize={4} radius={[2,2,0,0]}>
                                            {detailData.history.map((entry: any, index: number) => (<Cell key={`cell-${index}`} fill={entry.netBuy > 0 ? '#fb7185' : '#22d3ee'} />))}
                                        </Bar>
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Composition Donut */}
                            <div className={`flex items-center gap-6 p-4 rounded-[24px] border glass-concave ${isDarkMode ? 'dark' : 'light'}`}>
                                <div className="w-24 h-24 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart key={selectedNode.key}>
                                            <Pie data={detailData.composition} innerRadius={30} outerRadius={42} paddingAngle={8} cornerRadius={4} dataKey="value" stroke="none">
                                                {detailData.composition.map((entry: any, index: number) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                                            </Pie>
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 space-y-3">
                                    {detailData.composition.map((item: any) => (
                                        <div key={item.name} className="flex justify-between text-xs items-center">
                                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-sm" style={{backgroundColor: item.fill}}/><span className={`font-bold uppercase tracking-wider text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{item.name}</span></div>
                                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Metrics Bars */}
                            <div className="space-y-4">
                                {['Scale', 'Correlation', 'Timing'].map((metric) => {
                                    const val = metric === 'Scale' ? selectedNode.scaleScore : metric === 'Correlation' ? (selectedNode.correlation+1)*50 : selectedNode.timingScore;
                                    return (
                                        <div key={metric}>
                                            <div className="flex justify-between text-[9px] text-slate-500 mb-2 font-bold uppercase tracking-widest"><span>{metric}</span><span>{val.toFixed(0)}</span></div>
                                            <div className={`w-full h-[6px] rounded-full overflow-hidden glass-concave ${isDarkMode ? 'dark' : 'light'}`}>
                                                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full transition-all duration-1000" style={{width: `${val}%`}}/>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Description Glass Box */}
                            <div className={`mt-4 p-4 text-[11px] leading-relaxed rounded-xl border backdrop-blur-sm ${isDarkMode ? 'bg-white/[0.03] border-white/5 text-slate-400' : 'bg-white/40 border-slate-200 text-slate-600'}`}>
                                <div className="flex items-start gap-2">
                                    <AlignLeft size={12} className="shrink-0 mt-0.5 opacity-50"/>
                                    {detailData.desc}
                                </div>
                            </div>

                            {/* Action Grid */}
                            <div className="grid grid-cols-3 gap-3 pt-4">
                                {portfolio.map(slot => (
                                    <GlassButton key={slot.id} isDarkMode={isDarkMode} active={false} onClick={() => assignNodeToPortfolio(slot.id)} className="w-full text-center">
                                        Slot {slot.id}
                                    </GlassButton>
                                ))}
                            </div>
                        </div>
                    ) : (
                         <div className="h-full flex flex-col items-center justify-center opacity-40">
                            {isApiLoading ? (
                                <>
                                    <Loader2 size={32} className="animate-spin text-cyan-400 mb-4" />
                                    <p className="text-xs font-bold tracking-widest uppercase">Initializing Link...</p>
                                </>
                            ) : (
                                <>
                                    <div className={`p-6 rounded-full mb-6 glass-concave ${isDarkMode ? 'dark' : 'light'}`}>
                                        <MousePointer2 size={32} strokeWidth={1} className="text-slate-400" />
                                    </div>
                                    <p className="text-xs font-bold tracking-widest uppercase text-slate-500">Awaiting Selection</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
             </GlassCard>
          </div>

          {/* Bottom Section: Simulator (Glass Panel) */}
          <GlassCard isDarkMode={isDarkMode} className="p-0 overflow-hidden flex flex-col min-h-[500px]" noPadding>
             <div className={`p-6 border-b backdrop-blur-md flex justify-between items-center ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white/40 border-slate-200'}`}>
                 <h3 className={`text-sm font-black tracking-wide flex items-center gap-3 uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <PlayCircle size={16} className="text-indigo-400"/> Simulation Engine
                 </h3>
                 <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-widest text-slate-400">
                    {filters.dateRange.start} — {filters.dateRange.end}
                 </div>
             </div>
             
             <div className={`grid grid-cols-12 divide-y lg:divide-y-0 lg:divide-x h-full ${isDarkMode ? 'divide-white/5' : 'divide-slate-200'}`}>
                 {/* Simulator Controls */}
                 <div className={`col-span-12 lg:col-span-3 p-6 space-y-6 ${isDarkMode ? 'bg-black/20' : 'bg-slate-50/50'}`}>
                    <div className="space-y-4">
                        {portfolio.map(slot => (
                           <div key={slot.id} className={`rounded-[24px] p-5 border flex flex-col gap-4 transition-all group hover:border-white/20 backdrop-blur-sm ${isDarkMode ? 'bg-white/[0.03] border-white/5' : 'bg-white/40 border-slate-200 shadow-sm'}`}>
                               <div className="flex justify-between items-center">
                                   <div className="flex items-center gap-3">
                                       <div className="w-1 h-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{backgroundColor: slot.color}}/>
                                       <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Slot {slot.id}</div>
                                   </div>
                                   <div className={`text-[11px] font-bold truncate max-w-[80px] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{slot.node ? slot.node.id : 'Empty'}</div>
                                   {slot.node && <button onClick={() => clearPortfolioSlot(slot.id)} className="text-slate-500 hover:text-rose-400 transition-colors"><Trash2 size={12}/></button>}
                               </div>
                               <input type="range" min="0" max="100" value={slot.weight} onChange={(e) => updateWeight(slot.id, e.target.value)} className="w-full h-[2px] bg-slate-600/30 rounded-lg appearance-none cursor-pointer accent-cyan-400"/>
                               <div className="text-right text-[10px] font-mono font-bold text-slate-400">{slot.weight.toFixed(0)}%</div>
                           </div>
                        ))}
                    </div>
                    
                    {/* Inputs */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="space-y-2">
                             <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Strategy Mode</div>
                             <PillControl isDarkMode={isDarkMode} options={[{label:'Buy Only', value:'BUY_ONLY'}, {label:'Buy & Sell', value:'ALL'}]} value={strategyMode} onChange={setStrategyMode} />
                        </div>
                        <div className={`flex rounded-full p-1 border glass-concave ${isDarkMode ? 'dark border-white/10' : 'light'}`}>
                            {['ATOM', 'ONE'].map(a => (
                                <button key={a} onClick={()=>setBaseAsset(a)} className={`flex-1 text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-full transition-all ${baseAsset===a ? 'text-white shadow-sm bg-cyan-500' : 'text-slate-400 hover:text-slate-600'}`}>{a}</button>
                            ))}
                        </div>
                        <div className="relative group">
                             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono font-bold text-xs">$</span>
                             <input type="number" value={initInvestment} onChange={(e)=>setInitInvestment(Number(e.target.value))} className={`w-full text-sm font-bold border rounded-xl pl-8 pr-4 py-3.5 outline-none transition-all font-mono glass-concave ${isDarkMode ? 'dark text-white border-white/10 focus:border-cyan-500/50' : 'light text-slate-900 border-slate-200 focus:border-indigo-500'}`}/>
                        </div>
                        <div className="text-[9px] text-slate-500 text-center font-bold tracking-wide">(Rec: min 100 coins)</div>

                        <GlassButton active={true} isDarkMode={isDarkMode} onClick={runBacktest} disabled={isSimulating || portfolio.every(p=>!p.node)} className="w-full flex justify-center items-center gap-2">
                            Simulate Protocol
                        </GlassButton>
                    </div>
                 </div>
                 
                 <div className="col-span-12 lg:col-span-9 flex flex-col h-full overflow-hidden relative">
                    {/* Graph Area */}
                    <div className="flex-1 p-6 relative flex flex-col min-h-0 overflow-hidden">
                        {simulationResult ? (
                            <div className="h-full flex flex-col animate-in fade-in duration-1000">
                                <div className="flex justify-between items-start mb-4 shrink-0">
                                    <div className="flex gap-12">
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Expected Return</div>
                                            <div className={`text-4xl font-light tracking-tighter drop-shadow-[0_0_10px_rgba(52,211,153,0.4)] ${simulationResult.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{simulationResult.roi >= 0 ? '+' : ''}{simulationResult.roi.toFixed(2)}%</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Net Profit</div>
                                            <div className={`text-4xl font-light tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{simulationResult.profit >= 0 ? '+' : ''}{simulationResult.profit.toFixed(2)}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Value</div>
                                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{(initInvestment + simulationResult.profit).toFixed(2)} <span className="text-sm font-normal text-slate-500">{baseAsset}</span></div>
                                        <GlassButton active={false} isDarkMode={isDarkMode} onClick={resetSimulation} className="mt-3 w-24 text-center">
                                            Reset
                                        </GlassButton>
                                    </div>
                                </div>
                                <div className={`flex-1 min-h-0 rounded-[32px] border p-6 relative overflow-hidden backdrop-blur-md ${isDarkMode ? 'bg-gradient-to-b from-white/[0.02] to-transparent border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={simulationResult.timeline}>
                                            <defs>
                                                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeDasharray="4 4" vertical={false} />
                                            <XAxis dataKey="day" hide />
                                            <YAxis hide domain={['auto', 'auto']} />
                                            <Tooltip contentStyle={TooltipStyles} itemStyle={{fontSize:'11px', color: isDarkMode ? '#fff' : '#000'}} labelStyle={{display:'none'}} formatter={(val: any)=>[Number(val).toFixed(2), 'Value']}/>
                                            <Area type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} fill="url(#gradProfit)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-2 flex items-center justify-center gap-2 text-[9px] text-slate-500 font-medium opacity-70">
                                    <ShieldAlert size={10} />
                                    <span>DISCLAIMER: This simulation is based on past data and does not account for transaction fees. Past performance is not indicative of future results.</span>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none">
                                <div className={`w-24 h-24 rounded-full border border-dashed flex items-center justify-center mb-6 animate-[spin_10s_linear_infinite] ${isDarkMode ? 'border-white/20' : 'border-slate-300'}`}>
                                    <BarChart2 size={40} strokeWidth={1} className={`${isDarkMode ? 'text-white' : 'text-slate-900'}`}/>
                                </div>
                                <p className={`text-xl font-light tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Ready to Simulate</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Market Strip */}
                    <div className={`border-t p-6 shrink-0 mt-auto backdrop-blur-md ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white/40 border-slate-200'}`}>
                         <div className="flex items-center justify-between gap-12">
                             <div className="flex items-center gap-8">
                                 <div className={`px-4 py-2 rounded-full border flex items-center gap-3 backdrop-blur-sm ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border-slate-200 shadow-sm'}`}>
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Live Market Feed ({baseAsset})</span>
                                 </div>
                                 {baseAsset === 'ATOM' ? (
                                    <div className="flex gap-8 animate-in fade-in">
                                        <div><span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mr-3">Current Price</span><span className={`text-lg font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${marketStats.atom.price.toFixed(2)}</span></div>
                                        <div><span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mr-3">24h Change</span><span className={`text-lg font-mono ${marketStats.atom.change>=0?'text-emerald-400':'text-rose-400'}`}>{marketStats.atom.change.toFixed(2)}%</span></div>
                                    </div>
                                 ) : (
                                    <div className="flex gap-8 animate-in fade-in">
                                        <div><span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mr-3">Current Price</span><span className={`text-lg font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${marketStats.atomOne.price.toFixed(2)}</span></div>
                                        <div><span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mr-3">24h Change</span><span className={`text-lg font-mono ${marketStats.atomOne.change>=0?'text-emerald-400':'text-rose-400'}`}>{marketStats.atomOne.change.toFixed(2)}%</span></div>
                                    </div>
                                 )}
                             </div>
                             <div className="w-full md:w-96 h-12 opacity-50">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={(baseAsset==='ATOM'?marketStats.atom.sparkline:marketStats.atomOne.sparkline).map((v,i)=>({i,v}))}>
                                        <Line type="monotone" dataKey="v" stroke={baseAsset==='ATOM'?'#fb7185':'#22d3ee'} dot={false} strokeWidth={2}/>
                                    </LineChart>
                                 </ResponsiveContainer>
                             </div>
                         </div>
                    </div>
                 </div>
             </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}