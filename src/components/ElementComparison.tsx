'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiColumns } from 'react-icons/fi';
import { ElementProperties } from '@/types';
import { ELEMENTS } from '@/data/elements';
import { getCategoryInfo } from '@/data/categories';
import { cn } from '@/utils/cn';

const COMPARISON_ROWS: { label: string; getValue: (el: ElementProperties) => string | number | undefined }[] = [
  { label: 'Atomic Number', getValue: (el) => el.atomicNumber },
  { label: 'Symbol', getValue: (el) => el.symbol },
  { label: 'Name', getValue: (el) => el.name },
  { label: 'Atomic Weight', getValue: (el) => el.atomicMass },
  { label: 'Group', getValue: (el) => el.group ?? 'N/A' },
  { label: 'Period', getValue: (el) => el.period },
  { label: 'Block', getValue: (el) => el.block?.toUpperCase() },
  { label: 'Category', getValue: (el) => el.categoryName },
  { label: 'Electronegativity', getValue: (el) => el.electronegativity ?? 'N/A' },
  { label: 'Ionization Energy (eV)', getValue: (el) => el.ionizationEnergy ?? 'N/A' },
  { label: 'Electron Affinity (kJ/mol)', getValue: (el) => el.electronAffinity ?? 'N/A' },
  { label: 'Density (g/cm³)', getValue: (el) => el.density ?? 'N/A' },
  { label: 'Melting Point (K)', getValue: (el) => el.meltingPoint ?? 'N/A' },
  { label: 'Boiling Point (K)', getValue: (el) => el.boilingPoint ?? 'N/A' },
  { label: 'Phase', getValue: (el) => el.phase },
  { label: 'Atomic Radius (pm)', getValue: (el) => el.atomicRadius ?? 'N/A' },
  { label: 'Covalent Radius (pm)', getValue: (el) => el.covalentRadius ?? 'N/A' },
  { label: 'Electron Configuration', getValue: (el) => el.electronConfiguration },
  { label: 'Valence Electrons', getValue: (el) => el.valenceElectrons },
];

export default function ElementComparison() {
  const [selectedElements, setSelectedElements] = useState<ElementProperties[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!searchInput) return ELEMENTS.slice(0, 20);
    const q = searchInput.toLowerCase();
    return ELEMENTS.filter(
      (el) =>
        !selectedElements.find((s) => s.atomicNumber === el.atomicNumber) &&
        (el.name.toLowerCase().includes(q) ||
          el.symbol.toLowerCase().includes(q) ||
          el.atomicNumber.toString().includes(q)),
    ).slice(0, 20);
  }, [searchInput, selectedElements]);

  const addElement = (element: ElementProperties) => {
    if (selectedElements.length < 4 && !selectedElements.find((e) => e.atomicNumber === element.atomicNumber)) {
      setSelectedElements([...selectedElements, element]);
    }
    setSearchInput('');
    setShowDropdown(false);
  };

  const removeElement = (atomicNumber: number) => {
    setSelectedElements(selectedElements.filter((e) => e.atomicNumber !== atomicNumber));
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <FiColumns className="text-zinc-500 dark:text-white/50" size={18} />
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Element Comparison</h2>
      </div>

      <div className="relative mb-4">
        <div className="flex flex-wrap gap-2">
          {selectedElements.map((el) => (
            <span
              key={el.atomicNumber}
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
              style={{
                backgroundColor: getCategoryInfo(el.category).color + '30',
                color: getCategoryInfo(el.category).color,
              }}
            >
              {el.symbol} - {el.name}
              <button onClick={() => removeElement(el.atomicNumber)} className="ml-0.5 hover:opacity-70">
                <FiX size={14} />
              </button>
            </span>
          ))}
          {selectedElements.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 rounded-full border border-dashed border-zinc-300 px-3 py-1 text-sm text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-700 dark:border-white/20 dark:text-white/50 dark:hover:border-white/40 dark:hover:text-white/80"
              >
                <FiPlus size={14} /> Add element
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    className="absolute left-0 top-full z-20 mt-1 w-64 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-white/10 dark:bg-zinc-900 dark:shadow-2xl"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <div className="p-2">
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search elements..."
                        className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredOptions.map((el) => (
                        <button
                          key={el.atomicNumber}
                          onClick={() => addElement(el)}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-white/10"
                        >
                          <span className="w-6 text-right text-xs text-zinc-400 dark:text-white/40">{el.atomicNumber}</span>
                          <span className="font-medium text-zinc-900 dark:text-white">{el.symbol}</span>
                          <span className="text-zinc-500 dark:text-white/50">{el.name}</span>
                        </button>
                      ))}
                      {filteredOptions.length === 0 && (
                        <div className="px-3 py-4 text-center text-sm text-zinc-400 dark:text-white/40">No elements found</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {selectedElements.length >= 2 && (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/5">
                <th className="sticky left-0 z-10 bg-zinc-50 px-3 py-2 text-xs font-medium uppercase text-zinc-500 dark:bg-zinc-900 dark:text-white/50">
                  Property
                </th>
                {selectedElements.map((el) => {
                  const { color } = getCategoryInfo(el.category);
                  return (
                    <th
                      key={el.atomicNumber}
                      className="min-w-[120px] px-3 py-2 text-center text-xs font-medium"
                      style={{ backgroundColor: color + '20', color }}
                    >
                      {el.symbol}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label} className="hover:bg-zinc-50 dark:hover:bg-white/5">
                  <td className="sticky left-0 z-10 bg-white px-3 py-2 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-white/60">
                    {row.label}
                  </td>
                  {selectedElements.map((el) => {
                    const value = row.getValue(el);
                    const isNumeric = typeof value === 'number';
                    return (
                      <td
                        key={el.atomicNumber}
                        className={cn(
                          'px-3 py-2 text-center',
                          isNumeric ? 'font-mono text-zinc-800 dark:text-white/80' : 'text-zinc-700 dark:text-white/70',
                        )}
                      >
                        {value ?? 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedElements.length < 2 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-12 text-zinc-400 dark:border-white/20 dark:text-white/40">
          <FiColumns size={32} className="mb-2" />
          <p className="text-sm">Add at least 2 elements to compare</p>
        </div>
      )}
    </div>
  );
}
