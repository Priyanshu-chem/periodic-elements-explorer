'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar, FiDownload } from 'react-icons/fi';
import { ElementProperties } from '@/types';
import { getCategoryInfo } from '@/data/categories';
import AtomicModel3D from './3d/AtomicModel3D';
import { exportElementToPdf } from '@/utils/pdfExport';

interface ElementDetailProps {
  element: ElementProperties | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}

function InfoRow({ label, value }: { label: string; value: string | number | undefined | null }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg transition-colors hover:bg-white/5">
      <span className="flex items-center gap-2 text-xs font-medium text-white/60">
        {label}
      </span>
      <span className="text-right text-sm font-semibold text-white/90">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const childArray = Array.isArray(children) ? children : [children];
  const hasContent = childArray.some((c) => c !== null && c !== false && c !== undefined);
  if (!hasContent) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2 px-3">
        <div className="h-1 w-1 rounded-full bg-white/40" />
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
          {title}
        </h3>
      </div>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}

export default function ElementDetail({
  element,
  onClose,
  isBookmarked,
  onToggleBookmark,
}: ElementDetailProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = element ? 'hidden' : '';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [element, handleKeyDown]);

  if (!element) return null;

  const categoryInfo = getCategoryInfo(element.category);
  const neutrons = element.atomicWeight ? Math.round(element.atomicWeight) - element.atomicNumber : 0;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-end bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative flex h-full w-full flex-col overflow-hidden shadow-2xl sm:max-w-[520px] md:w-[560px] sm:border-l border-white/10"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 pointer-events-none" />

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none" />

          <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center justify-between px-3 py-3 sm:px-5 sm:py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg"
                  style={{ backgroundColor: categoryInfo.color }}
                >
                  <span className="text-xl font-bold text-white">{element.symbol}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{element.name}</h2>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>#{element.atomicNumber}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>{categoryInfo.label}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleBookmark(element.atomicNumber)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  <FiStar
                    size={16}
                    className={isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''}
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => exportElementToPdf(element)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Export to PDF"
                >
                  <FiDownload size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <FiX size={18} />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="relative h-[240px] w-full sm:h-[340px]">
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="h-full w-full max-w-[400px]">
                    <AtomicModel3D
                      atomicNumber={element.atomicNumber}
                      atomicMass={element.atomicWeight}
                      shellModel={element.shellModel || []}
                    />
                  </div>
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-white/70">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span>{element.atomicNumber}p</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/70">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-300" />
                    <span>{neutrons}n</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/70">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                    <span>{element.atomicNumber}e</span>
                  </div>
                </div>
              </div>

              <div className="p-3 pt-2 space-y-3 sm:p-5 sm:pt-3 sm:space-y-5">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center">
                    <div className="text-2xl font-bold text-white">{element.atomicNumber}</div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-white/40 mt-1">Protons</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center">
                    <div className="text-2xl font-bold text-white">{neutrons}</div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-white/40 mt-1">Neutrons</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center">
                    <div className="text-2xl font-bold text-white">{element.atomicNumber}</div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-white/40 mt-1">Electrons</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center">
                    <div className="text-2xl font-bold text-white">{element.atomicMass || element.atomicWeight}</div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-white/40 mt-1">Atomic Mass</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 overflow-hidden">
                  <div className="p-4">
                    <Section title="Basic Properties">
                      <InfoRow label="Symbol" value={element.symbol} />
                      <InfoRow label="Atomic Mass" value={element.atomicMass} />
                      <InfoRow label="Group" value={element.group} />
                      <InfoRow label="Period" value={element.period} />
                      <InfoRow label="Block" value={element.block?.toUpperCase()} />
                      <InfoRow label="Electron Configuration" value={element.electronConfiguration} />
                      <InfoRow label="Semantic Config" value={element.electronConfigurationSemantic} />
                      <InfoRow label="Valence Electrons" value={element.valenceElectrons} />
                      <InfoRow label="Oxidation States" value={element.oxidationStates?.join(', ')} />
                    </Section>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 overflow-hidden">
                  <div className="p-4">
                    <Section title="Physical">
                      <InfoRow label="Density" value={element.density ? `${element.density} g/cm³` : undefined} />
                      <InfoRow label="Melting Point" value={element.meltingPoint ? `${element.meltingPoint} K` : undefined} />
                      <InfoRow label="Boiling Point" value={element.boilingPoint ? `${element.boilingPoint} K` : undefined} />
                      <InfoRow label="Phase" value={element.phase} />
                      <InfoRow label="Thermal Conductivity" value={element.thermalConductivity ? `${element.thermalConductivity} W/(m·K)` : undefined} />
                      <InfoRow label="Electrical Conductivity" value={element.electricalConductivity ? `${element.electricalConductivity} MS/m` : undefined} />
                      <InfoRow label="Heat Capacity" value={element.heatCapacity ? `${element.heatCapacity} J/(g·K)` : undefined} />
                    </Section>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 overflow-hidden">
                  <div className="p-4">
                    <Section title="Atomic">
                      <InfoRow label="Electronegativity" value={element.electronegativity} />
                      <InfoRow label="Electron Affinity" value={element.electronAffinity ? `${element.electronAffinity} kJ/mol` : undefined} />
                      <InfoRow label="Ionization Energy" value={element.ionizationEnergy ? `${element.ionizationEnergy} eV` : undefined} />
                      <InfoRow label="Atomic Radius" value={element.atomicRadius ? `${element.atomicRadius} pm` : undefined} />
                      <InfoRow label="Covalent Radius" value={element.covalentRadius ? `${element.covalentRadius} pm` : undefined} />
                      <InfoRow label="Ionic Radius" value={element.ionicRadius ? `${element.ionicRadius} pm` : undefined} />
                      <InfoRow label="Van der Waals Radius" value={element.vanDerWaalsRadius ? `${element.vanDerWaalsRadius} pm` : undefined} />
                    </Section>
                  </div>
                </div>

                {element.crystalStructure && (
                  <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 overflow-hidden">
                    <div className="p-4">
                      <Section title="Crystal">
                        <InfoRow label="Type" value={element.crystalStructure.type} />
                        <InfoRow label="Space Group" value={element.crystalStructure.spaceGroup} />
                        <InfoRow label="Coordination" value={element.crystalStructure.coordinationNumber} />
                        {element.crystalStructure.parameters && (
                          <InfoRow
                            label="Lattice"
                            value={[
                              element.crystalStructure.parameters.a ? `a=${element.crystalStructure.parameters.a}Å` : '',
                              element.crystalStructure.parameters.b ? `b=${element.crystalStructure.parameters.b}Å` : '',
                              element.crystalStructure.parameters.c ? `c=${element.crystalStructure.parameters.c}Å` : '',
                            ].filter(Boolean).join(', ')}
                          />
                        )}
                      </Section>
                    </div>
                  </div>
                )}

                {element.isotopes.length > 0 && (
                  <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 overflow-hidden">
                    <div className="p-4">
                      <Section title="Isotopes">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-white/10 text-white/40">
                                <th className="py-1.5 pr-2 font-medium">Mass</th>
                                <th className="py-1.5 pr-2 font-medium">Abundance</th>
                                <th className="py-1.5 font-medium">Half-Life</th>
                              </tr>
                            </thead>
                            <tbody>
                              {element.isotopes.slice(0, 8).map((iso) => (
                                <tr key={iso.massNumber} className="border-b border-white/5">
                                  <td className="py-1.5 pr-2 text-white/80">{iso.massNumber}</td>
                                  <td className="py-1.5 pr-2 text-white/60">
                                    {iso.abundance > 0 ? `${(iso.abundance * 100).toFixed(2)}%` : 'Trace'}
                                  </td>
                                  <td className="py-1.5 text-white/60">{iso.halfLife ?? '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Section>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 overflow-hidden">
                  <div className="p-4">
                    <Section title="History">
                      <InfoRow label="Discoverer" value={element.discoverer} />
                      <InfoRow label="Year" value={element.yearDiscovered} />
                      <InfoRow label="Name Origin" value={element.nameOrigin} />
                    </Section>
                  </div>
                </div>

                {element.commonCompounds && element.commonCompounds.length > 0 && (
                  <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 overflow-hidden">
                    <div className="p-4">
                      <Section title="Compounds">
                        <div className="flex flex-wrap gap-1.5 pt-1 px-3">
                          {element.commonCompounds.map((compound) => (
                            <span
                              key={compound}
                              className="rounded-lg bg-white/10 px-2.5 py-1 text-xs text-white/70 border border-white/5"
                            >
                              {compound}
                            </span>
                          ))}
                        </div>
                      </Section>
                    </div>
                  </div>
                )}

                {element.industrialApplications && element.industrialApplications.length > 0 && (
                  <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 overflow-hidden">
                    <div className="p-4">
                      <Section title="Applications">
                        <ul className="space-y-1.5 pt-1 px-3">
                          {element.industrialApplications.map((app) => (
                            <li key={app} className="flex items-start gap-2 text-xs text-white/70">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                              {app}
                            </li>
                          ))}
                        </ul>
                      </Section>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 overflow-hidden">
                  <div className="p-4">
                    <Section title="Safety">
                      <InfoRow label="Hazards" value={element.hazards} />
                      <InfoRow label="Safety" value={element.safetyInformation} />
                    </Section>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 overflow-hidden">
                  <div className="p-4">
                    <Section title="Abundance">
                      <InfoRow label="Crust (mg/kg)" value={element.abundanceCrust} />
                      <InfoRow label="Universe (ppb)" value={element.abundanceUniverse} />
                      <InfoRow label="Occurrence" value={element.naturalOccurrence} />
                    </Section>
                  </div>
                </div>

                {element.facts.length > 0 && (
                  <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 overflow-hidden">
                    <div className="p-4">
                      <Section title="Facts">
                        <ul className="space-y-2 pt-1 px-3">
                          {element.facts.map((fact, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-white/80 leading-relaxed">
                              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] text-white/50">
                                {i + 1}
                              </span>
                              {fact}
                            </li>
                          ))}
                        </ul>
                      </Section>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
