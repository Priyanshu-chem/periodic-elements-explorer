'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiTrendingUp, FiColumns, FiBookmark, FiMenu } from 'react-icons/fi';
import { ElementProperties } from '@/types';
import { ELEMENTS } from '@/data/elements';
import { CATEGORIES } from '@/data/categories';
import { useBookmarks } from '@/context/BookmarkContext';
import SearchBar from '@/components/SearchBar';
import PeriodicTable from '@/components/PeriodicTable';
import ElementDetail from '@/components/ElementDetail';
import ElementComparison from '@/components/ElementComparison';
import PeriodicTrends from '@/components/PeriodicTrends';
import SpaceBackground from '@/components/SpaceBackground';

type View = 'table' | 'trends' | 'compare';

interface Filters {
  group?: number;
  period?: number;
  category?: string;
  phase?: string;
  block?: string;
  radioactiveOnly?: boolean;
  naturalOnly?: boolean;
  syntheticOnly?: boolean;
}

const NAV_ITEMS: { id: View; label: string; icon: typeof FiGrid }[] = [
  { id: 'table', label: 'Periodic Table', icon: FiGrid },
  { id: 'trends', label: 'Trends', icon: FiTrendingUp },
  { id: 'compare', label: 'Compare', icon: FiColumns },
];

function CategoryLegend({
  activeCategory,
  onCategorySelect,
}: {
  activeCategory?: string;
  onCategorySelect: (cat: string | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-2 py-3">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={(e) => {
              e.stopPropagation();
              onCategorySelect(isActive ? undefined : cat.id);
            }}
            className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all ${
              isActive
                ? 'ring-1 ring-offset-1 ring-offset-transparent'
                : 'opacity-60 hover:opacity-100 text-zinc-400'
            }`}
            style={{
              backgroundColor: isActive ? cat.color + '20' : 'transparent',
              color: isActive ? cat.color : undefined,
            }}
          >
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-xs leading-none">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [highlightCategory, setHighlightCategory] = useState<string | undefined>(undefined);
  const [selectedElement, setSelectedElement] = useState<ElementProperties | null>(null);
  const [activeView, setActiveView] = useState<View>('table');
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const { bookmarks, toggleBookmark } = useBookmarks();

  const handleElementSelect = useCallback((element: ElementProperties) => {
    setSelectedElement(element);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedElement(null);
  }, []);

  const bookmarkedElements = Array.from(bookmarks).sort((a, b) => a - b);

  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950">
      <SpaceBackground />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-sm font-bold text-white shadow-lg shadow-purple-500/20">
              Pe
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-white">
              Periodic Elements Explorer
            </h1>
          </div>

          <nav className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveView(id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  activeView === id
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                <Icon size={16} />
                {label}
              </motion.button>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowBookmarks(!showBookmarks)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Bookmarks"
            >
              <FiBookmark size={18} />
              {bookmarks.size > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[9px] text-white shadow-lg">
                  {bookmarks.size}
                </span>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white sm:hidden"
              aria-label="Menu"
            >
              <FiMenu size={18} />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showMobileNav && (
            <motion.div
              className="border-t border-white/10 bg-zinc-950 px-4 py-2 sm:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="flex flex-wrap gap-1">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => { setActiveView(id); setShowMobileNav(false); }}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeView === id ? 'bg-white/10 text-white' : 'text-white/50'
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeView === 'table' && (
          <motion.div
            className="border-t border-white/10 px-4 py-3 sm:px-6"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mx-auto max-w-7xl">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </motion.div>
        )}
      </header>

      <main className="relative z-10 flex-1" onClick={() => setHighlightCategory(undefined)}>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
          <AnimatePresence mode="wait">
            {activeView === 'table' && (
              <motion.section
                key="table"
                aria-label="Periodic Table"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 backdrop-blur-sm shadow-2xl sm:p-6">
                  <PeriodicTable
                    searchQuery={searchQuery}
                    filters={filters}
                    onElementSelect={handleElementSelect}
                    bookmarks={bookmarks}
                    onToggleBookmark={toggleBookmark}
                    highlightCategory={highlightCategory}
                  />
                  <div className="border-t border-white/5 mt-4 pt-2">
                    <CategoryLegend
                      activeCategory={highlightCategory}
                      onCategorySelect={setHighlightCategory}
                    />
                  </div>
                </div>
              </motion.section>
            )}

            {activeView === 'trends' && (
              <motion.section
                key="trends"
                aria-label="Periodic Trends"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 backdrop-blur-sm shadow-2xl sm:p-6">
                  <PeriodicTrends />
                </div>
              </motion.section>
            )}

            {activeView === 'compare' && (
              <motion.section
                key="compare"
                aria-label="Element Comparison"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 backdrop-blur-sm shadow-2xl sm:p-6">
                  <ElementComparison />
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      <ElementDetail
        element={selectedElement}
        onClose={handleCloseDetail}
        isBookmarked={selectedElement ? bookmarks.has(selectedElement.atomicNumber) : false}
        onToggleBookmark={toggleBookmark}
      />

      <AnimatePresence>
        {showBookmarks && (
          <motion.div
            className="fixed inset-0 z-40 flex items-start justify-end bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBookmarks(false)}
          >
            <motion.div
              className="h-full w-full border-l border-white/10 bg-zinc-900 shadow-2xl sm:w-80"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <h2 className="text-lg font-semibold text-white">
                  Bookmarks
                </h2>
                <span className="text-sm text-white/50">
                  {bookmarks.size} elements
                </span>
              </div>
              <div className="overflow-y-auto p-4">
                {bookmarkedElements.length === 0 ? (
                  <p className="text-center text-sm text-white/40">
                    No bookmarked elements
                  </p>
                ) : (
                  <div className="space-y-1">
                    {bookmarkedElements.map((atomicNumber) => {
                      const el = ELEMENTS.find((e: ElementProperties) => e.atomicNumber === atomicNumber);
                      if (!el) return null;
                      return (
                        <motion.button
                          key={atomicNumber}
                          whileHover={{ scale: 1.02, x: 4 }}
                          onClick={() => { setSelectedElement(el); setShowBookmarks(false); }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                        >
                          <span className="w-8 text-right text-xs text-white/40">
                            {el.atomicNumber}
                          </span>
                          <span className="font-semibold text-white">
                            {el.symbol}
                          </span>
                          <span className="text-white/50">
                            {el.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-white/10 py-4 text-center text-xs text-white/30">
        Periodic Elements Explorer &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
