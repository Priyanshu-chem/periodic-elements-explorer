'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';
import { ELEMENTS } from '@/data/elements';
import { useIsMobile } from '@/utils/useIsMobile';
import { ElementProperties, TrendType, TrendConfig } from '@/types';

const TREND_CONFIGS: TrendConfig[] = [
  {
    type: 'atomicRadius',
    label: 'Atomic Radius',
    unit: 'pm',
    getValue: (el: ElementProperties) => el.atomicRadius,
    color: '#4ecdc4',
  },
  {
    type: 'electronegativity',
    label: 'Electronegativity',
    unit: '',
    getValue: (el: ElementProperties) => el.electronegativity,
    color: '#ff6b6b',
  },
  {
    type: 'ionizationEnergy',
    label: 'Ionization Energy',
    unit: 'eV',
    getValue: (el: ElementProperties) => el.ionizationEnergy,
    color: '#45b7d1',
  },
  {
    type: 'density',
    label: 'Density',
    unit: 'g/cm³',
    getValue: (el: ElementProperties) => el.density,
    color: '#f9ca24',
  },
  {
    type: 'meltingPoint',
    label: 'Melting Point',
    unit: 'K',
    getValue: (el: ElementProperties) => el.meltingPoint,
    color: '#e056a0',
  },
];

function getHeatmapColor(value: number, min: number, max: number, baseColor: string): { bg: string; text: string } {
  if (max === min) return { bg: baseColor, text: '#ffffff' };
  const ratio = (value - min) / (max - min);

  const baseR = parseInt(baseColor.slice(1, 3), 16);
  const baseG = parseInt(baseColor.slice(3, 5), 16);
  const baseB = parseInt(baseColor.slice(5, 7), 16);

  const bgR = Math.round(baseR + (255 - baseR) * (1 - ratio));
  const bgG = Math.round(baseG + (255 - baseG) * (1 - ratio));
  const bgB = Math.round(baseB + (255 - baseB) * (1 - ratio));

  const bg = `rgb(${bgR}, ${bgG}, ${bgB})`;

  const luminance = (0.299 * bgR + 0.587 * bgG + 0.114 * bgB) / 255;
  const text = luminance > 0.6 ? '#1a1a2e' : '#ffffff';

  return { bg, text };
}

export default function PeriodicTrends() {
  const [selectedTrend, setSelectedTrend] = useState<TrendType>('atomicRadius');

  const activeConfig = TREND_CONFIGS.find((t) => t.type === selectedTrend)!;

  const { min, max, valueMap } = useMemo(() => {
    const values: number[] = [];
    const map = new Map<number, number>();

    ELEMENTS.forEach((el) => {
      const v = activeConfig.getValue(el);
      if (v !== undefined) {
        values.push(v);
        map.set(el.atomicNumber, v);
      }
    });

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      valueMap: map,
    };
  }, [activeConfig]);

  const isMobile = useIsMobile(640);
  const heatmapElements = useMemo(() => {
    return ELEMENTS.filter((el) => el.block !== 'f').slice(0, 89);
  }, []);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <FiTrendingUp className="text-zinc-500 dark:text-white/50" size={18} />
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Periodic Trends</h2>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {TREND_CONFIGS.map((config) => (
          <button
            key={config.type}
            onClick={() => setSelectedTrend(config.type)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              selectedTrend === config.type
                ? 'text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white/80'
            }`}
            style={
              selectedTrend === config.type
                ? { backgroundColor: config.color }
                : undefined
            }
          >
            {config.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTrend}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-full overflow-x-auto pb-2">
            <div className={isMobile ? 'min-w-[640px]' : ''}>
              <div className="grid grid-cols-18 gap-[1px] sm:gap-0.5">
                {heatmapElements.map((el) => {
                  const value = valueMap.get(el.atomicNumber);
                  const hasValue = value !== undefined;

                  const { bg: bgColor, text: textColor } = hasValue
                    ? getHeatmapColor(value!, min, max, activeConfig.color)
                    : { bg: '#e5e7eb', text: '#9ca3af' };

                  return (
                    <div
                      key={el.atomicNumber}
                      className="flex min-h-[28px] min-w-[28px] flex-col items-center justify-center rounded p-[1px] text-[7px] leading-tight sm:min-h-[40px] sm:min-w-[40px] sm:p-0.5 sm:text-[9px] md:min-h-[52px] md:min-w-[52px] md:text-[10px]"
                      style={{ backgroundColor: bgColor, color: textColor }}
                      title={`${el.symbol} - ${el.name}: ${hasValue ? `${value}${activeConfig.unit}` : 'N/A'}`}
                    >
                      <span className="font-bold">{el.symbol}</span>
                      {hasValue && (
                        <span className="opacity-80 hidden sm:block">{value}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-zinc-500 dark:text-white/50">{min}{activeConfig.unit}</span>
            <div className="flex h-3 flex-1 overflow-hidden rounded-full">
              {Array.from({ length: 20 }, (_, i) => {
                const ratio = i / 19;
                const value = min + (max - min) * ratio;
                const { bg } = getHeatmapColor(value, min, max, activeConfig.color);
                return (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ backgroundColor: bg }}
                  />
                );
              })}
            </div>
            <span className="text-xs text-zinc-500 dark:text-white/50">
              {max}{activeConfig.unit}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
