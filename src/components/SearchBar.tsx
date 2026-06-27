'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import { CATEGORIES } from '@/data/categories';
import { ElementPhase, ElementBlock } from '@/types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
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
  onFiltersChange: (filters: SearchBarProps['filters']) => void;
}

const GROUPS = Array.from({ length: 18 }, (_, i) => i + 1);
const PERIODS = Array.from({ length: 7 }, (_, i) => i + 1);
const PHASES: { value: ElementPhase; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'liquid', label: 'Liquid' },
  { value: 'gas', label: 'Gas' },
];
const BLOCKS: { value: ElementBlock; label: string }[] = [
  { value: 's', label: 'S-Block' },
  { value: 'p', label: 'P-Block' },
  { value: 'd', label: 'D-Block' },
  { value: 'f', label: 'F-Block' },
];

export default function SearchBar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    filters.group !== undefined ||
    filters.period !== undefined ||
    filters.category !== undefined ||
    filters.phase !== undefined ||
    filters.block !== undefined ||
    filters.radioactiveOnly ||
    filters.naturalOnly ||
    filters.syntheticOnly;

  const clearFilters = () => {
    onFiltersChange({});
    onSearchChange('');
  };

  const updateFilter = <K extends keyof SearchBarProps['filters']>(
    key: K,
    value: SearchBarProps['filters'][K],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <FiSearch
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, symbol, or atomic number..."
            className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-white/40 dark:focus:border-white/30 dark:focus:ring-white/20"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex h-10 items-center gap-1.5 rounded-lg border px-3 text-sm transition-colors',
            hasActiveFilters
              ? 'border-zinc-400 bg-zinc-100 text-zinc-700 dark:border-white/30 dark:bg-white/10 dark:text-white'
              : 'border-zinc-300 text-zinc-500 hover:bg-zinc-100 dark:border-white/10 dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white/80',
          )}
        >
          <FiFilter size={15} />
          <span className="hidden sm:inline">Filters</span>
          {showFilters ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex h-10 items-center gap-1 rounded-lg px-3 text-sm text-zinc-500 hover:bg-zinc-100 dark:text-white/50 dark:hover:bg-white/5"
          >
            <FiX size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="mt-3 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/5"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-white/50">
                  Group
                </label>
                <select
                  value={filters.group ?? ''}
                  onChange={(e) =>
                    updateFilter('group', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="">All</option>
                  {GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-white/50">
                  Period
                </label>
                <select
                  value={filters.period ?? ''}
                  onChange={(e) =>
                    updateFilter('period', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="">All</option>
                  {PERIODS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-white/50">
                  Category
                </label>
                <select
                  value={filters.category ?? ''}
                  onChange={(e) => updateFilter('category', e.target.value || undefined)}
                  className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="">All</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-white/50">
                  Phase
                </label>
                <select
                  value={filters.phase ?? ''}
                  onChange={(e) => updateFilter('phase', e.target.value || undefined)}
                  className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="">All</option>
                  {PHASES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-white/50">
                  Block
                </label>
                <select
                  value={filters.block ?? ''}
                  onChange={(e) => updateFilter('block', e.target.value || undefined)}
                  className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="">All</option>
                  {BLOCKS.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-white/60">
                <input
                  type="checkbox"
                  checked={filters.radioactiveOnly ?? false}
                  onChange={(e) => updateFilter('radioactiveOnly', e.target.checked || undefined)}
                  className="rounded border-zinc-300 text-zinc-600 focus:ring-zinc-500 dark:border-white/20 dark:bg-white/5 dark:text-purple-500 dark:focus:ring-purple-500/30"
                />
                Radioactive only
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-white/60">
                <input
                  type="checkbox"
                  checked={filters.naturalOnly ?? false}
                  onChange={(e) => updateFilter('naturalOnly', e.target.checked || undefined)}
                  className="rounded border-zinc-300 text-zinc-600 focus:ring-zinc-500 dark:border-white/20 dark:bg-white/5 dark:text-purple-500 dark:focus:ring-purple-500/30"
                />
                Natural only
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-white/60">
                <input
                  type="checkbox"
                  checked={filters.syntheticOnly ?? false}
                  onChange={(e) => updateFilter('syntheticOnly', e.target.checked || undefined)}
                  className="rounded border-zinc-300 text-zinc-600 focus:ring-zinc-500 dark:border-white/20 dark:bg-white/5 dark:text-purple-500 dark:focus:ring-purple-500/30"
                />
                Synthetic only
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
