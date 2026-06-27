'use client';

import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { ELEMENTS } from '@/data/elements';
import { ElementProperties } from '@/types';
import ElementBlock from './ElementBlock';
import { useIsMobile } from '@/utils/useIsMobile';

interface PeriodicTableProps {
  searchQuery: string;
  filters: {
    group?: number;
    period?: number;
    category?: string;
    phase?: string;
    block?: string;
    radioactiveOnly?: boolean;
    naturalOnly?: boolean;
    syntheticOnly?: boolean;
  };
  onElementSelect: (element: ElementProperties) => void;
  bookmarks: Set<number>;
  onToggleBookmark: (id: number) => void;
}

const LANTHANIDE_RANGE = [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71] as const;
const ACTINIDE_RANGE = [89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103] as const;

function matchesFilters(element: ElementProperties, filters: PeriodicTableProps['filters']): boolean {
  if (filters.group !== undefined && filters.group !== null && element.group !== filters.group) return false;
  if (filters.period !== undefined && filters.period !== null && element.period !== filters.period) return false;
  if (filters.category && element.category !== filters.category) return false;
  if (filters.phase && element.phase !== filters.phase) return false;
  if (filters.block && element.block !== filters.block) return false;
  if (filters.radioactiveOnly && !element.isotopes.some((i) => i.isRadioactive)) return false;
  if (filters.naturalOnly && element.naturalOccurrence !== 'natural') return false;
  if (filters.syntheticOnly && element.naturalOccurrence !== 'synthetic') return false;
  return true;
}

function matchesSearch(element: ElementProperties, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    element.name.toLowerCase().includes(q) ||
    element.symbol.toLowerCase().includes(q) ||
    element.atomicNumber.toString().includes(q)
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.003, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
};

function renderElementGrid(
  elements: ElementProperties[],
  excludeFBlock: boolean,
  onElementSelect: (el: ElementProperties) => void,
  bookmarks: Set<number>,
  blockSize: 'xs' | 'sm' | 'md' | 'lg' = 'md',
) {
  const filtered = elements.filter((el) => {
    if (excludeFBlock && (el.block === 'f')) return false;
    return true;
  });

  const grid = new Map<string, ElementProperties>();
  filtered.forEach((el) => {
    const col = el.group ?? 0;
    grid.set(`${el.period}-${col}`, el);
  });

  const rows: { period: number; group: number; element: ElementProperties | null }[] = [];
  for (let period = 1; period <= 7; period++) {
    for (let group = 1; group <= 18; group++) {
      const key = `${period}-${group}`;
      const element = grid.get(key) ?? null;
      rows.push({ period, group, element });
    }
  }

  return (
    <div className="grid grid-cols-18 gap-0.5 sm:gap-1">
      {rows.map(({ period, group, element }) => (
        <div key={`${period}-${group}`} className="flex items-center justify-center">
          {element && (
            <motion.div variants={itemVariants}>
              <ElementBlock
                element={element}
                onClick={onElementSelect}
                size={blockSize}
                isBookmarked={bookmarks.has(element.atomicNumber)}
              />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

function renderFBlockRow(
  elements: ElementProperties[],
  range: readonly number[],
  label: string,
  onElementSelect: (el: ElementProperties) => void,
  bookmarks: Set<number>,
  blockSize: 'xs' | 'sm' | 'md' | 'lg' = 'md',
) {
  const fElements = range
    .map((num) => elements.find((el) => el.atomicNumber === num))
    .filter((el): el is ElementProperties => el !== undefined);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      <span className="w-6 text-right text-[8px] font-medium text-zinc-400 dark:text-zinc-500 sm:w-8 sm:text-[10px] md:w-10 md:text-xs">
        {label}
      </span>
      <div className="grid grid-cols-15 gap-0.5 sm:gap-1">
        {fElements.map((element) => (
          <motion.div key={element.atomicNumber} variants={itemVariants}>
            <ElementBlock
              element={element}
              onClick={onElementSelect}
              size={blockSize}
              isBookmarked={bookmarks.has(element.atomicNumber)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function PeriodicTable({
  searchQuery,
  filters,
  onElementSelect,
  bookmarks,
}: PeriodicTableProps) {
  const isMobile = useIsMobile(640);
  const scrollRef = useRef<HTMLDivElement>(null);
  const visibleElements = useMemo(() => {
    return ELEMENTS.filter((el) => matchesSearch(el, searchQuery) && matchesFilters(el, filters));
  }, [searchQuery, filters]);

  const blockSize = isMobile ? 'sm' : 'md';

  return (
    <motion.div
      ref={scrollRef}
      className="w-full overflow-x-auto pb-4 scrollbar-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={isMobile ? 'min-w-[680px]' : ''}>
        {renderElementGrid(visibleElements, true, onElementSelect, bookmarks, blockSize)}

        <div className="mt-3 space-y-1">
          {renderFBlockRow(visibleElements, LANTHANIDE_RANGE, '57-71', onElementSelect, bookmarks, blockSize)}
          {renderFBlockRow(visibleElements, ACTINIDE_RANGE, '89-103', onElementSelect, bookmarks, blockSize)}
        </div>
      </div>
    </motion.div>
  );
}
