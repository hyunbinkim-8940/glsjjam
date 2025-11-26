
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Activity, DollarSign, Zap, Info, 
  ChevronDown, Globe, Trash2, 
  Loader2, Target, PlayCircle, Clock, BarChart2, Sun, Moon, 
  Share2, MousePointer2, Filter, AlignLeft, AlertTriangle, 
  Calendar, RotateCcw, Layers, Command, Hexagon, ShieldAlert,
  Search, TrendingUp, TrendingDown, Lock, Unlock, GripVertical
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ComposedChart, Line, Bar, Cell, PieChart as RePieChart, Pie, LineChart, Legend
} from 'recharts';

/**
 * --------------------------------------------------------------------------
 * CSS INJECTION FOR REALISTIC GLASS
 * Incorporating the user's specific CSS for the physical button feel and bg.
 * --------------------------------------------------------------------------
 */
const GlobalStyles = () => (
  <style>{`
    @property --angle-1 {
      syntax: "<angle>";
      inherits: false;
      initial-value: -75deg;
    }

    @property --angle-2 {
      syntax: "<angle>";
      inherits: false;
      initial-value: -45deg;
    }

    :root {
      --global--size: clamp(2rem, 4vw, 5rem);
      --anim--hover-time: 400ms;
      --anim--hover-ease: cubic-bezier(0.25, 1, 0.5, 1);
    }

    /* Button specific styles */
    .button-wrap {
      position: relative;
      z-index: 2;
      border-radius: 999vw;
      background: transparent;
      pointer-events: none;
      transition: all var(--anim--hover-time) var(--anim--hover-ease);
      display: inline-block;
      width: 100%;
    }

    .button-shadow {
      --shadow-cuttoff-fix: 2em;
      position: absolute;
      width: calc(100% + var(--shadow-cuttoff-fix));
      height: calc(100% + var(--shadow-cuttoff-fix));
      top: calc(0% - var(--shadow-cuttoff-fix) / 2);
      left: calc(0% - var(--shadow-cuttoff-fix) / 2);
      filter: blur(clamp(2px, 0.125em, 12px));
      overflow: visible;
      pointer-events: none;
    }

    .button-shadow::after {
      content: "";
      position: absolute;
      z-index: 0;
      inset: 0;
      border-radius: 999vw;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
      width: calc(100% - var(--shadow-cuttoff-fix) - 0.25em);
      height: calc(100% - var(--shadow-cuttoff-fix) - 0.25em);
      top: calc(var(--shadow-cuttoff-fix) - 0.5em);
      left: calc(var(--shadow-cuttoff-fix) - 0.875em);
      padding: 0.125em;
      box-sizing: border-box;
      mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      mask-composite: exclude;
      transition: all var(--anim--hover-time) var(--anim--hover-ease);
      opacity: 1;
    }

    .glass-btn {
      --border-width: clamp(1px, 0.0625em, 4px);
      all: unset;
      cursor: pointer;
      position: relative;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      pointer-events: auto;
      z-index: 3;
      background: linear-gradient(
        -75deg,
        rgba(255, 255, 255, 0.05),
        rgba(255, 255, 255, 0.2),
        rgba(255, 255, 255, 0.05)
      );
      border-radius: 999vw;
      box-shadow: inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
        inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5),
        0 0.25em 0.125em -0.125em rgba(0, 0, 0, 0.2),
        0 0 0.1em 0.25em inset rgba(255, 255, 255, 0.2),
        0 0 0 0 rgba(255, 255, 255, 1);
      backdrop-filter: blur(clamp(1px, 0.125em, 4px));
      transition: all var(--anim--hover-time) var(--anim--hover-ease);
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }

    .glass-btn:hover {
      transform: scale(0.975);
      backdrop-filter: blur(0.01em);
      box-shadow: inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
        inset 0 -0.125em 0.125em rgba(255, 255, 255, 0.5),
        0 0.15em 0.05em -0.1em rgba(0, 0, 0, 0.25),
        0 0 0.05em 0.1em inset rgba(255, 255, 255, 0.5),
        0 0 0 0 rgba(255, 255, 255, 1);
    }

    .glass-btn span {
      position: relative;
      display: block;
      user-select: none;
      font-family: "Inter", sans-serif;
      letter-spacing: -0.05em;
      font-weight: 600;
      font-size: 0.75rem;
      color: rgba(50, 50, 50, 1);
      text-shadow: 0em 0.25em 0.05em rgba(0, 0, 0, 0.1);
      transition: all var(--anim--hover-time) var(--anim--hover-ease);
      padding-inline: 1.5em;
      padding-block: 1em;
      text-transform: uppercase;
    }
    
    .dark .glass-btn span {
        color: rgba(220, 220, 220, 1);
    }

    .glass-btn::after {
      content: "";
      position: absolute;
      z-index: 1;
      inset: 0;
      border-radius: 999vw;
      width: calc(100% + var(--border-width));
      height: calc(100% + var(--border-width));
      top: calc(0% - var(--border-width) / 2);
      left: calc(0% - var(--border-width) / 2);
      padding: var(--border-width);
      box-sizing: border-box;
      background: conic-gradient(
        from var(--angle-1) at 50% 50%,
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0) 5% 40%,
        rgba(0, 0, 0, 0.5) 50%,
        rgba(0, 0, 0, 0) 60% 95%,
        rgba(0, 0, 0, 0.5)
      ),
      linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5));
      mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      mask-composite: exclude;
      transition: all var(--anim--hover-time) var(--anim--hover-ease), --angle-1 500ms ease;
      box-shadow: inset 0 0 0 calc(var(--border-width) / 2) rgba(255, 255, 255, 0.5);
    }

    .glass-btn:hover::after {
      --angle-1: -125deg;
    }
    
    /* Panel Glass Styling */
    .glass-panel {
        background: linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1));
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        border: 1px solid rgba(255,255,255,0.6);
        box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.1),
            inset 0 0 0 1px rgba(255,255,255,0.2),
            inset 0 1px 0 0 rgba(255,255,255,0.5); 
    }
    
    .dark .glass-panel {
        background: linear-gradient(135deg, rgba(20,20,20,0.6), rgba(20,20,20,0.2));
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.4),
            inset 0 0 0 1px rgba(255,255,255,0.05),
            inset 0 1px 0 0 rgba(255,255,255,0.1); 
    }
  `}</style>
);

/**
 * --------------------------------------------------------------------------
 * UTILS & HOOKS
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
 * COMPONENTS
 * --------------------------------------------------------------------------
 */

// Primary Action Button using the user's specific CSS
const RealisticButton = ({ children, onClick, className = '' }: { children: React.ReactNode, onClick?: () => void, className?: string }) => (
  <div className={`button-wrap ${className}`} onClick={onClick}>
    <button className="glass-btn">
      <span>{children}</span>
    </button>
    <div className="button-shadow"></div>
  </div>
);

// Container with "Physical" Glass Effect
const GlassCard = ({ children, className = "", noPadding = false }: { children: React.ReactNode, className?: string, noPadding?: boolean }) => (
  <div className={`glass-panel rounded-[24px] overflow-hidden transition-all duration-500 ${noPadding ? 'p-0' : 'p-6'} ${className}`}>
    {children}
  </div>
);

// Custom Slider to match the aesthetic
const GlassSlider = ({ min, max, value, onChange, formatLabel = (v:number) => v, isDual = false }: any) => {
  const getPercentage = useCallback((val: number) => ((val - min) / (max - min)) * 100, [min, max]);
  const percentStart = isDual ? getPercentage(value[0]) : 0;
  const percentEnd = isDual ? getPercentage(value[1]) : getPercentage(value);

  return (
    <div className="py-4 select-none touch-none w-full px-1">
      <div className="relative h-1 w-full rounded-full bg-black/10 dark:bg-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
        <div 
            className="absolute h-full rounded-full bg-slate-600 dark:bg-slate-300 shadow-[0_0_8px_rgba(0,0,0,0.2)]" 
            style={{ left: `${percentStart}%`, width: `${percentEnd - percentStart}%` }} 
        />
        {isDual ? (
          <>
            <input type="range" min={min} max={max} value={value[0]} onChange={(e) => onChange([Math.min(Number(e.target.value), value[1]), value[1]])} className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full" />
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#f0f0f0] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_-1px_1px_rgba(0,0,0,0.1)] border border-white z-10 pointer-events-none" style={{ left: `${percentStart}%`, transform: 'translate(-50%, -50%)' }} />
            <input type="range" min={min} max={max} value={value[1]} onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0])])} className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full" />
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#f0f0f0] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_-1px_1px_rgba(0,0,0,0.1)] border border-white z-10 pointer-events-none" style={{ left: `${percentEnd}%`, transform: 'translate(-50%, -50%)' }} />
          </>
        ) : (
          <>
            <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full" />
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#f0f0f0] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_-1px_1px_rgba(0,0,0,0.1)] border border-white z-10 pointer-events-none" style={{ left: `${percentEnd}%`, transform: 'translate(-50%, -50%)' }} />
          </>
        )}
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
        <span>{isDual ? formatLabel(value[0]) : formatLabel(min)}</span>
        <span>{isDual ? formatLabel(value[1]) : formatLabel(value)}</span>
      </div>
    </div>
  );
};

// 3-Segment Slider for Weights (A/B/C)
const MultiSegmentSlider = ({ points, onChange, colors }: { points: [number, number], onChange: (p: [number, number]) => void, colors: string[] }) => {
    // Points are split percentages, e.g. [33, 66] means:
    // Segment A: 0-33%, Segment B: 33-66%, Segment C: 66-100%
    const trackRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState<number | null>(null);

    const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        setDragging(index);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (dragging === null || !trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect();
            const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1) * 100;
            
            const newPoints = [...points] as [number, number];
            if (dragging === 0) {
                // Moving first handle: constrained between 0 and second handle
                newPoints[0] = Math.min(Math.max(0, percent), points[1] - 5);
            } else {
                // Moving second handle: constrained between first handle and 100
                newPoints[1] = Math.min(Math.max(points[0] + 5, percent), 100);
            }
            onChange(newPoints);
        };
        const handleMouseUp = () => setDragging(null);

        if (dragging !== null) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, points, onChange]);

    return (
        <div className="py-2 select-none w-full">
            <div className="relative h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden" ref={trackRef}>
                {/* Segment A */}
                <div className="absolute h-full top-0 left-0" style={{ width: `${points[0]}%`, backgroundColor: colors[0] }} />
                {/* Segment B */}
                <div className="absolute h-full top-0" style={{ left: `${points[0]}%`, width: `${points[1] - points[0]}%`, backgroundColor: colors[1] }} />
                {/* Segment C */}
                <div className="absolute h-full top-0" style={{ left: `${points[1]}%`, width: `${100 - points[1]}%`, backgroundColor: colors[2] }} />
            </div>
            {/* Handles */}
            <div className="relative w-full h-0 -top-2" style={{ pointerEvents: 'none' }}>
                <div 
                    className="absolute w-4 h-6 bg-white border border-slate-200 shadow-md rounded-sm cursor-col-resize z-10 flex items-center justify-center top-1"
                    style={{ left: `${points[0]}%`, transform: 'translateX(-50%)', pointerEvents: 'auto' }}
                    onMouseDown={handleMouseDown(0)}
                >
                    <GripVertical size={10} className="text-slate-400" />
                </div>
                <div 
                    className="absolute w-4 h-6 bg-white border border-slate-200 shadow-md rounded-sm cursor-col-resize z-10 flex items-center justify-center top-1"
                    style={{ left: `${points[1]}%`, transform: 'translateX(-50%)', pointerEvents: 'auto' }}
                    onMouseDown={handleMouseDown(1)}
                >
                    <GripVertical size={10} className="text-slate-400" />
                </div>
            </div>
        </div>
    );
};

// Filter Section Accordion
const FilterSection = ({ title, icon: Icon, children, isOpenDefault = false, count = 0, isDarkMode }: any) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  return (
    <div className={`rounded-2xl mb-3 overflow-hidden transition-all duration-300 ${isOpen ? 'bg-black/5 dark:bg-white/5' : ''}`}>
      <button 
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }} 
        className="flex items-center justify-between w-full text-left p-3 group cursor-pointer outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-white/40 dark:bg-white/10 text-slate-700 dark:text-slate-200 shadow-sm border border-white/50">
            <Icon size={14} strokeWidth={2.5} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">{title}</span>
          {count > 0 && <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{count}</span>}
        </div>
        <ChevronDown size={14} className={`transition-transform duration-300 text-slate-400 ${isOpen ? 'rotate-180' : ''}`}/>
      </button>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-3 pb-4 space-y-4">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent opacity-50 mb-2"></div>
            {children}
        </div>
      </div>
    </div>
  );
};

/**
 * --------------------------------------------------------------------------
 * MAIN APPLICATION
 * --------------------------------------------------------------------------
 */
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light/metallic mode
  
  // -- Data State --
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

  // -- Interaction State --
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [portfolio, setPortfolio] = useState([
    { id: 'A', node: null as any, weight: 33, color: '#F43F5E' }, 
    { id: 'B', node: null as any, weight: 33, color: '#06B6D4' }, 
    { id: 'C', node: null as any, weight: 34, color: '#8B5CF6' }  
  ]);
  const [weightSplit, setWeightSplit] = useState<[number, number]>([33, 66]); // Split points for A, B, C

  const [baseAsset, setBaseAsset] = useState('ATOM');
  const [initInvestment, setInitInvestment] = useState(100);
  const [strategyMode, setStrategyMode] = useState<'COPY_ALL' | 'BUY_ONLY'>('COPY_ALL');
  const [marketOverviewAsset, setMarketOverviewAsset] = useState('ATOM'); // for bottom panel toggle

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // -- Mock Data Generation --
  const [nodes, setNodes] = useState<any[]>([]);
  const [marketStats, setMarketStats] = useState<any>({
    atom: { price: 10.50, change: 2.4, sparkline: [] },
    atomOne: { price: 3.20, change: -1.2, sparkline: [] },
  });

  const [chartRef, chartSize, chartNode] = useElementSize();

  // Initialize Data
  useEffect(() => {
    // Generate Deterministic Mock Nodes
    const newNodes = Array.from({ length: 60 }).map((_, i) => {
        const atomShare = Math.random();
        const oneShare = 1 - atomShare;
        const totalVol = Math.floor(Math.random() * 50000) + 1000;
        const aiiScore = Math.floor(Math.random() * 100);
        
        let colorType = "Mixed";
        let gradId = "grad-mixed";
        if (atomShare > 0.6) { colorType = "ATOM Dominant"; gradId = "grad-atom"; } 
        else if (atomShare < 0.4) { colorType = "ONE Dominant"; gradId = "grad-one"; }

        // Influence Coords (X=Atom, Y=One)
        const xMetric = Math.min(100, (aiiScore * atomShare) + (Math.random() * 20));
        const yMetric = Math.min(100, (aiiScore * oneShare) + (Math.random() * 20));

        // Details for charts
        const historyData = Array.from({length: 15}).map((_, idx) => ({
            day: `D-${15-idx}`,
            price: 8 + Math.random() * 4,
            netBuy: (Math.random() - 0.5) * 2000
        }));

        const transactionType = [
            { name: 'Swap', value: Math.floor(Math.random() * 60) + 20, fill: '#06B6D4' },
            { name: 'IBC', value: Math.floor(Math.random() * 20) + 5, fill: '#10B981' },
            { name: 'Stake', value: Math.floor(Math.random() * 15) + 5, fill: '#8B5CF6' }
        ];

        return {
            id: `Account-${i.toString().padStart(3, '0')}`,
            key: `v-${i}`,
            type: colorType,
            gradId,
            totalVol,
            avgTxSize: Math.floor(Math.random() * 1000),
            netBuyRatio: Math.random() * 2 - 1,
            txCount: Math.floor(Math.random() * 500),
            atomShare, atomOneShare: oneShare,
            ibcShare: Math.random() * 0.5,
            activeDays: Math.floor(Math.random() * 30),
            recentActiveDaysAgo: Math.floor(Math.random() * 10),
            aiiScore,
            timingType: ['Lead', 'Sync', 'Lag'][Math.floor(Math.random() * 3)],
            correlation: Math.random() * 2 - 1,
            scaleScore: aiiScore,
            timingScore: Math.floor(Math.random() * 100),
            xMetric,
            yMetric,
            baseR: Math.max(5, (aiiScore / 100) * 40),
            details: "Detailed analysis reveals high arbitrage activity.",
            history: historyData,
            transactionType
        };
    });
    setNodes(newNodes);

    // Mock Market Sparklines
    const spark = Array.from({length: 30}).map((_, i) => 8 + Math.random() * 4);
    setMarketStats(prev => ({ ...prev, atom: { ...prev.atom, sparkline: spark }, atomOne: { ...prev.atomOne, sparkline: spark.map(s => s * 0.3) } }));
  }, []);

  // Filter Logic
  const filteredNodes = useMemo(() => {
    const f = filters;
    return nodes.map(node => {
        let isMatch = true;
        if (node.totalVol < f.totalVolume) isMatch = false;
        if (node.netBuyRatio < f.netBuyRatio[0] || node.netBuyRatio > f.netBuyRatio[1]) isMatch = false;
        if (node.atomShare < f.atomShare) isMatch = false;
        return { ...node, isMatch };
    });
  }, [nodes, filters]);

  // Backtest Logic
  const runBacktest = () => {
    setIsSimulating(true);
    setTimeout(() => {
        const points = 90;
        const startVal = initInvestment;
        let currentVal = startVal;
        const timeline = [];
        
        for(let i=0; i<points; i++) {
            const change = (Math.random() - 0.45) * 0.05; 
            if (strategyMode === 'BUY_ONLY' && change < 0) {
                 // Protect downside partially
                 currentVal = currentVal * (1 + (change * 0.2));
            } else {
                 currentVal = currentVal * (1 + change);
            }
            timeline.push({ day: `Day ${i}`, value: currentVal });
        }
        
        setSimulationResult({
            roi: ((currentVal - startVal) / startVal) * 100,
            profit: currentVal - startVal,
            timeline
        });
        setIsSimulating(false);
    }, 2000);
  };

  const assignNodeToPortfolio = (slotId: string) => {
    if (selectedNode) setPortfolio(prev => prev.map(p => p.id === slotId ? { ...p, node: selectedNode } : p));
  };
  
  const clearPortfolioSlot = (slotId: string) => setPortfolio(prev => prev.map(p => p.id === slotId ? { ...p, node: null } : p));

  // Update weights based on slider split points
  useEffect(() => {
    const wA = weightSplit[0];
    const wB = weightSplit[1] - weightSplit[0];
    const wC = 100 - weightSplit[1];
    setPortfolio(prev => [
        { ...prev[0], weight: wA },
        { ...prev[1], weight: wB },
        { ...prev[2], weight: wC }
    ]);
  }, [weightSplit]);

  // Chart Scaling
  const CHART_PADDING = 50;
  const getX = (val: number) => CHART_PADDING + (val / 100) * (chartSize.width - CHART_PADDING * 2);
  const getY = (val: number) => (chartSize.height - CHART_PADDING) - (val / 100) * (chartSize.height - CHART_PADDING * 2);

  // Styling Helpers
  const textPrimary = isDarkMode ? 'text-slate-100' : 'text-slate-800';
  const textSecondary = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`w-full h-screen flex relative transition-colors duration-700 overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] dark' : 'bg-[#e0e0e0]'}`}>
      <GlobalStyles />
      
      {/* Background Noise Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <svg width="100%" height="100%">
            <defs>
                <pattern id="dottedGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)"} />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dottedGrid)" />
        </svg>
      </div>

      {/* Main Layout: Fixed 4-Panel Grid */}
      <div className="relative z-10 w-full h-full p-4 gap-4 grid grid-cols-12 grid-rows-[minmax(0,1fr)_320px]">
        
        {/* 1. LEFT PANEL: Filters (Full Height) */}
        <GlassCard className="col-span-2 row-span-2 flex flex-col h-full overflow-hidden z-20" noPadding>
            <div className="p-5 border-b border-white/20 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                    <Hexagon size={24} className="text-slate-600 dark:text-slate-300 fill-current opacity-20" />
                    <span className={`text-lg font-black tracking-tighter ${textPrimary}`}>AETHER</span>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {/* 1. Date Range Filter */}
                <div className="mb-6">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block ml-1 flex items-center gap-2"><Calendar size={10}/> Date Range</label>
                    <div className="flex gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-white/20 mb-2">
                        {['7D', '30D', '90D', '180D'].map(t => (
                            <button key={t} className="flex-1 py-1.5 text-[10px] font-bold rounded-lg text-slate-500 hover:bg-white hover:shadow-sm transition-all">{t}</button>
                        ))}
                    </div>
                </div>

                {/* 2. Transaction Volume */}
                <FilterSection title="Volume" icon={DollarSign} isOpenDefault={true} count={1} isDarkMode={isDarkMode}>
                    <div className="mb-2"><span className="text-[9px] uppercase font-bold text-slate-400">Total Volume</span><GlassSlider min={0} max={50000} value={tempFilters.totalVolume} onChange={(v:number) => updateTempFilter('totalVolume', v)} formatLabel={(v:number) => `${(v/1000).toFixed(0)}k`} /></div>
                    <div className="mb-2"><span className="text-[9px] uppercase font-bold text-slate-400">Avg Size</span><GlassSlider min={0} max={1000} value={tempFilters.avgTradeSize} onChange={(v:number) => updateTempFilter('avgTradeSize', v)} /></div>
                </FilterSection>

                {/* 3. Pattern / Behavior */}
                <FilterSection title="Patterns" icon={Activity} count={0} isDarkMode={isDarkMode}>
                     <div className="mb-2"><span className="text-[9px] uppercase font-bold text-slate-400">Net Buy/Sell</span><GlassSlider min={-1} max={1} isDual value={tempFilters.netBuyRatio} onChange={(v:any) => updateTempFilter('netBuyRatio', v)} /></div>
                     <div className="mb-2"><span className="text-[9px] uppercase font-bold text-slate-400">Frequency</span><GlassSlider min={0} max={500} value={tempFilters.txCount} onChange={(v:number) => updateTempFilter('txCount', v)} /></div>
                </FilterSection>

                {/* 4. Chain Bias */}
                <FilterSection title="Chain Bias" icon={Share2} count={0} isDarkMode={isDarkMode}>
                    <div className="mb-2"><span className="text-[9px] uppercase font-bold text-slate-400">Atom Share</span><GlassSlider min={0} max={1} value={tempFilters.atomShare} onChange={(v:number) => updateTempFilter('atomShare', v)} formatLabel={(v:number) => `${(v*100).toFixed(0)}%`} /></div>
                </FilterSection>
                
                {/* 5. Activity */}
                <FilterSection title="Activity" icon={Clock} count={0} isDarkMode={isDarkMode}>
                     <div className="mb-2"><span className="text-[9px] uppercase font-bold text-slate-400">Active Days</span><GlassSlider min={0} max={30} value={tempFilters.activeDays} onChange={(v:number) => updateTempFilter('activeDays', v)} /></div>
                </FilterSection>

                {/* 6. Impact */}
                <FilterSection title="AII Impact" icon={Target} count={0} isDarkMode={isDarkMode}>
                     <div className="mb-2"><span className="text-[9px] uppercase font-bold text-slate-400">Total Score</span><GlassSlider min={0} max={100} value={tempFilters.aiiScore} onChange={(v:number) => updateTempFilter('aiiScore', v)} /></div>
                     <div className="mb-2"><span className="text-[9px] uppercase font-bold text-slate-400">Correlation</span><GlassSlider min={-1} max={1} isDual value={tempFilters.correlation} onChange={(v:any) => updateTempFilter('correlation', v)} /></div>
                </FilterSection>
            </div>

            <div className="p-4 border-t border-white/20 bg-white/5 space-y-3">
                <RealisticButton onClick={() => setFilters(tempFilters)}>Apply Filters</RealisticButton>
                <div className="flex justify-center">
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        {isDarkMode ? <Sun size={18} className="text-amber-200"/> : <Moon size={18} className="text-slate-500"/>}
                    </button>
                </div>
            </div>
        </GlassCard>

        {/* 2. CENTER PANEL: Bubble Chart */}
        <GlassCard className="col-span-7 row-span-1 relative overflow-hidden flex flex-col" noPadding>
            {/* Chart Header */}
            <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start pointer-events-none">
                 <div className="glass-panel px-4 py-2 rounded-xl flex gap-6 pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>ATOM</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>ATOMONE</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>Mixed</span>
                    </div>
                 </div>
            </div>

            {/* D3/SVG Chart Area */}
            <div className="flex-1 w-full h-full cursor-crosshair" ref={chartRef}>
                {chartSize.width > 0 && (
                    <svg width="100%" height="100%" viewBox={`0 0 ${chartSize.width} ${chartSize.height}`} className="overflow-visible">
                         <defs>
                            <radialGradient id="grad-atom" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.1" />
                            </radialGradient>
                            <radialGradient id="grad-one" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
                            </radialGradient>
                            <radialGradient id="grad-mixed" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.1" />
                            </radialGradient>
                            {/* Realistic Shine for Bubble */}
                            <linearGradient id="bubble-shine" x1="0" x2="1" y1="0" y2="1">
                                <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
                                <stop offset="50%" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                        </defs>

                        {/* Grid Lines */}
                        {[0, 25, 50, 75, 100].map(val => (
                            <g key={`grid-${val}`}>
                                <line x1={getX(val)} y1={getY(0)} x2={getX(val)} y2={getY(100)} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeDasharray="4 4" />
                                <line x1={getX(0)} y1={getY(val)} x2={getX(100)} y2={getY(val)} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeDasharray="4 4" />
                                {val === 50 && (
                                    <>
                                        <text x={getX(50)} y={getY(0)+20} textAnchor="middle" className="text-[10px] fill-slate-400 font-bold uppercase tracking-widest">Atom Influence (X)</text>
                                        <text x={getX(0)-20} y={getY(50)} transform={`rotate(-90, ${getX(0)-20}, ${getY(50)})`} textAnchor="middle" className="text-[10px] fill-slate-400 font-bold uppercase tracking-widest">ONE Influence (Y)</text>
                                    </>
                                )}
                            </g>
                        ))}

                        {/* Bubbles */}
                        {filteredNodes.map((node) => {
                             if(!node.isMatch) return null;
                             const isSelected = selectedNode?.key === node.key;
                             return (
                                <g key={node.key} onClick={() => setSelectedNode(node)} className="transition-all duration-500 cursor-pointer hover:opacity-100">
                                    <circle 
                                        cx={getX(node.xMetric)} 
                                        cy={getY(node.yMetric)} 
                                        r={node.baseR * (isSelected ? 1.2 : 1)}
                                        fill={`url(#${node.gradId})`}
                                        className="transition-all duration-300"
                                        style={{ filter: isSelected ? 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 'none' }}
                                    />
                                    {/* Glass Shine Overlay on Bubble */}
                                    <circle 
                                        cx={getX(node.xMetric)} 
                                        cy={getY(node.yMetric)} 
                                        r={node.baseR * (isSelected ? 1.2 : 1)}
                                        fill="url(#bubble-shine)"
                                        className="pointer-events-none"
                                    />
                                    {isSelected && (
                                        <circle cx={getX(node.xMetric)} cy={getY(node.yMetric)} r={node.baseR * 1.5} fill="none" stroke={isDarkMode ? "white" : "black"} strokeOpacity={0.2} strokeDasharray="2 2" />
                                    )}
                                </g>
                             )
                        })}
                    </svg>
                )}
            </div>
        </GlassCard>

        {/* 3. RIGHT PANEL: Details */}
        <GlassCard className="col-span-3 row-span-1 flex flex-col h-full overflow-hidden" noPadding>
            {selectedNode ? (
                <div className="flex flex-col h-full animate-in slide-in-from-right duration-500">
                    <div className="p-5 border-b border-white/20">
                         <div className="flex items-center gap-2 mb-2">
                             <div className={`w-2 h-2 rounded-full`} style={{backgroundColor: selectedNode.type.includes('ATOM') ? '#F43F5E' : '#06B6D4'}}></div>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{selectedNode.type}</span>
                         </div>
                         <h2 className={`text-xl font-bold tracking-tight ${textPrimary} mb-4`}>{selectedNode.id}</h2>
                         
                         {/* Natural Language Summary (from PDF) */}
                         <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 mb-2">
                             <p className={`text-[10px] leading-relaxed opacity-80 ${textSecondary} font-medium`}>{selectedNode.details}</p>
                         </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                        
                        {/* 3.1 Top: Price + Net Buy Combined Chart */}
                        <div>
                            <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest flex items-center gap-1"><TrendingUp size={10}/> Market Context</h4>
                            <div className="h-32 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/5">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={selectedNode.history}>
                                        <XAxis dataKey="day" hide />
                                        <YAxis hide domain={['auto', 'auto']} />
                                        <Tooltip contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', fontSize:'10px', borderRadius: '8px', border:'none'}} itemStyle={{color:'white'}} />
                                        {/* Line for Price */}
                                        <Line type="monotone" dataKey="price" stroke="#06B6D4" strokeWidth={2} dot={false} />
                                        {/* Bar for Net Buy */}
                                        <Bar dataKey="netBuy" fill="#F43F5E" barSize={4} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 3.2 Middle: Transaction Types Donut */}
                        <div>
                            <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest flex items-center gap-1"><Layers size={10}/> Tx Distribution</h4>
                            <div className="flex items-center gap-4">
                                <div className="h-24 w-24 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie data={selectedNode.transactionType} innerRadius={25} outerRadius={35} paddingAngle={5} dataKey="value" stroke="none">
                                                {selectedNode.transactionType.map((entry:any, index:number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                        </RePieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-[9px] font-bold text-slate-400">MIX</span>
                                    </div>
                                </div>
                                <div className="space-y-1 flex-1">
                                    {selectedNode.transactionType.map((t:any) => (
                                        <div key={t.name} className="flex justify-between items-center text-[10px]">
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: t.fill}}/>
                                                <span className="text-slate-500">{t.name}</span>
                                            </div>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{t.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3.3 Bottom: AII Score Breakdown */}
                        <div>
                             <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest flex items-center gap-1"><Target size={10}/> AII Composition</h4>
                             <div className="space-y-3">
                                 {['Scale', 'Timing', 'Correlation'].map(metric => {
                                     const score = metric === 'Scale' ? selectedNode.scaleScore : metric === 'Timing' ? selectedNode.timingScore : (selectedNode.correlation + 1) * 50;
                                     return (
                                        <div key={metric}>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-[9px] font-bold text-slate-500 uppercase">{metric}</span>
                                                <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300">{score.toFixed(0)}</span>
                                            </div>
                                            <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-slate-500 dark:bg-slate-300" style={{width: `${score}%`}}></div>
                                            </div>
                                        </div>
                                     )
                                 })}
                             </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2">
                             <div className="space-y-2">
                                 {portfolio.map(slot => (
                                     <button key={slot.id} onClick={() => assignNodeToPortfolio(slot.id)} className="w-full flex items-center justify-between p-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                         <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 uppercase tracking-wide">Quick Add Slot {slot.id}</span>
                                         <div className="w-2 h-2 rounded-full shadow-sm" style={{backgroundColor: slot.color}}></div>
                                     </button>
                                 ))}
                             </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 opacity-40">
                    <MousePointer2 size={32} className="mb-4 text-slate-500" />
                    <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500">Select a Node<br/>to analyze</p>
                </div>
            )}
        </GlassCard>

        {/* 4. BOTTOM PANEL: Backtest Simulator (Full Width Grid) */}
        <GlassCard className="col-span-10 col-start-3 row-start-2 flex flex-col relative overflow-hidden" noPadding>
             <div className="flex h-full divide-x divide-slate-200/20">
                
                {/* 4.1 Configuration (Left, larger area for slots & strategy) */}
                <div className="w-[380px] p-5 flex flex-col gap-4 bg-white/30 dark:bg-black/20 backdrop-blur-sm shrink-0 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-1">
                        <PlayCircle className="text-slate-700 dark:text-slate-200" size={16} />
                        <span className={`text-sm font-bold uppercase tracking-wide ${textPrimary}`}>Strategy Lab</span>
                    </div>

                    {/* Section 1: Horizontal Slots */}
                    <div className="flex gap-2 w-full">
                         {portfolio.map(slot => (
                             <div key={slot.id} className="flex-1 glass-panel p-2 rounded-xl flex flex-col justify-between min-h-[70px] relative group">
                                 <div className="flex justify-between items-start">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: slot.color}}></div>
                                    {slot.node && <button onClick={() => clearPortfolioSlot(slot.id)}><Trash2 size={10} className="text-slate-400 hover:text-rose-500"/></button>}
                                 </div>
                                 <div className="mt-1">
                                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Slot {slot.id}</span>
                                    <span className={`text-[10px] font-bold truncate block w-full ${textPrimary}`}>{slot.node ? slot.node.id : 'Empty'}</span>
                                 </div>
                                 <div className="text-right">
                                    <span className="text-[9px] font-mono text-slate-500">{slot.weight.toFixed(0)}%</span>
                                 </div>
                             </div>
                         ))}
                    </div>

                    {/* Section 2: Multi-Thumb Slider */}
                    <div className="pt-2 pb-2">
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                            <span>Allocation Split</span>
                        </div>
                        <MultiSegmentSlider 
                            points={weightSplit} 
                            onChange={setWeightSplit} 
                            colors={portfolio.map(p => p.color)} 
                        />
                    </div>

                    {/* Section 3: Strategy & Action (Fixed at bottom to ensure no overlap) */}
                    <div className="mt-auto pt-3 border-t border-white/10 flex flex-col gap-3">
                         <div className="flex gap-2">
                             <div className="flex-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg flex">
                                 <button onClick={() => setStrategyMode('COPY_ALL')} className={`flex-1 py-2 text-[9px] font-bold uppercase rounded-md transition-all ${strategyMode === 'COPY_ALL' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}>Copy All</button>
                                 <button onClick={() => setStrategyMode('BUY_ONLY')} className={`flex-1 py-2 text-[9px] font-bold uppercase rounded-md transition-all ${strategyMode === 'BUY_ONLY' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}>Buy Only</button>
                             </div>
                             <div className="w-1/3 flex items-center gap-1 px-2 bg-black/5 dark:bg-white/5 rounded-lg border border-white/20">
                                 <span className="text-[9px] font-bold text-slate-500">$</span>
                                 <input type="number" value={initInvestment} onChange={(e) => setInitInvestment(Number(e.target.value))} className="bg-transparent w-full text-xs font-bold outline-none text-slate-700 dark:text-slate-200 font-mono text-center" />
                             </div>
                         </div>

                         <RealisticButton onClick={runBacktest}>
                             {isSimulating ? "Simulating..." : "Run Backtest"}
                         </RealisticButton>
                    </div>
                </div>

                {/* 4.2 Results & Chart (Center - Wide) */}
                <div className="flex-1 p-5 relative flex flex-col">
                    {simulationResult ? (
                        <div className="h-full flex flex-col animate-in fade-in duration-700">
                             <div className="flex items-end justify-between mb-2">
                                 <div className="flex gap-8">
                                     <div>
                                         <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total ROI</div>
                                         <div className={`text-3xl font-black tracking-tighter ${simulationResult.roi >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{simulationResult.roi >= 0 ? '+' : ''}{simulationResult.roi.toFixed(2)}%</div>
                                     </div>
                                     <div>
                                         <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Final Balance</div>
                                         <div className={`text-2xl font-bold font-mono ${textPrimary}`}>{Math.floor(initInvestment + simulationResult.profit).toLocaleString()} <span className="text-sm font-normal text-slate-400">{baseAsset}</span></div>
                                     </div>
                                 </div>
                                 {/* Disclaimer */}
                                 <div className="flex items-center gap-1 opacity-50">
                                     <ShieldAlert size={12} className="text-slate-500"/>
                                     <span className="text-[9px] text-slate-500 font-medium">Historical data only. Fees excluded.</span>
                                 </div>
                             </div>
                             
                             <div className="flex-1 rounded-2xl overflow-hidden glass-panel border border-white/20 relative">
                                 <div className="absolute top-4 right-4 z-10 flex gap-2">
                                     <span className="text-[9px] font-bold bg-white/50 px-2 py-1 rounded text-slate-500">Timeline: {filters.dateRange.start} - {filters.dateRange.end}</span>
                                 </div>
                                 <ResponsiveContainer width="100%" height="100%">
                                     <AreaChart data={simulationResult.timeline}>
                                         <defs>
                                             <linearGradient id="gradResult" x1="0" y1="0" x2="0" y2="1">
                                                 <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                                 <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                             </linearGradient>
                                         </defs>
                                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                         <Tooltip contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', color: '#fff'}} itemStyle={{color: '#fff'}} />
                                         <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill="url(#gradResult)" />
                                     </AreaChart>
                                 </ResponsiveContainer>
                             </div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                             <div className="text-center">
                                 <BarChart2 size={48} className="mx-auto mb-4 text-slate-500"/>
                                 <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Ready to simulate strategy</p>
                             </div>
                        </div>
                    )}
                    
                    {/* Bottom Bar: Market Overview Toggle */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                        <div className="flex gap-2">
                             <button onClick={() => setMarketOverviewAsset('ATOM')} className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${marketOverviewAsset === 'ATOM' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'text-slate-500 hover:bg-white/5'}`}>ATOM Market</button>
                             <button onClick={() => setMarketOverviewAsset('ATOMONE')} className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${marketOverviewAsset === 'ATOMONE' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-500 hover:bg-white/5'}`}>ATOMONE Market</button>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Price: <span className={textPrimary}>${marketOverviewAsset === 'ATOM' ? marketStats.atom.price.toFixed(2) : marketStats.atomOne.price.toFixed(2)}</span></span>
                            <span className={`text-[10px] font-bold uppercase ${marketOverviewAsset === 'ATOM' ? 'text-emerald-500' : 'text-rose-500'}`}>24h: {marketOverviewAsset === 'ATOM' ? '+2.4%' : '-1.2%'}</span>
                        </div>
                    </div>
                </div>
             </div>
        </GlassCard>

      </div>
    </div>
  );
}
