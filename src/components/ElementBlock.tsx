'use client';

import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { ElementProperties } from '@/types';
import { getCategoryInfo } from '@/data/categories';
import { cn } from '@/utils/cn';

interface ElementBlockProps {
  element: ElementProperties;
  onClick: (el: ElementProperties) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isBookmarked?: boolean;
}

const sizeConfig = {
  xs: {
    blockClass: 'p-[2px] min-w-[30px] min-h-[30px] text-[7px]',
    symbolClass: 'text-[9px] font-bold leading-none',
    numberClass: 'text-[5px] leading-none',
    showName: false,
    showMass: false,
  },
  sm: {
    blockClass: 'p-0.5 min-w-[48px] min-h-[48px] text-[10px]',
    symbolClass: 'text-sm font-bold leading-none',
    numberClass: 'text-[8px] leading-none',
    showName: false,
    showMass: false,
  },
  md: {
    blockClass: 'p-1 min-w-[64px] min-h-[64px] text-[11px]',
    symbolClass: 'text-base font-bold leading-none',
    numberClass: 'text-[9px] leading-none',
    showName: true,
    showMass: false,
  },
  lg: {
    blockClass: 'p-1.5 min-w-[80px] min-h-[80px] text-xs',
    symbolClass: 'text-lg font-bold leading-none',
    numberClass: 'text-[10px] leading-none',
    showName: true,
    showMass: true,
  },
};

export default function ElementBlock({
  element,
  onClick,
  size = 'md',
  isBookmarked = false,
}: ElementBlockProps) {
  const { color, textColor } = getCategoryInfo(element.category);
  const config = sizeConfig[size];

  return (
    <motion.button
      onClick={() => onClick(element)}
      whileHover={{ scale: 1.12, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative flex cursor-pointer flex-col rounded border border-zinc-200/50 text-left shadow-sm transition-shadow dark:border-white/10',
        'hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30',
        config.blockClass,
      )}
      style={{ backgroundColor: color, color: textColor }}
      title={`${element.atomicNumber}. ${element.name} (${element.symbol})`}
    >
      {isBookmarked && (
        <FiStar
          size={size === 'sm' ? 8 : 10}
          className="absolute right-0.5 top-0.5 text-yellow-300"
          style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' }}
        />
      )}

      <span
        className={cn(
          config.numberClass,
          'text-left opacity-80',
          size === 'sm' ? 'leading-none' : '',
        )}
      >
        {element.atomicNumber}
      </span>

      <span className={cn(config.symbolClass, 'mt-auto text-center leading-none')}>
        {element.symbol}
      </span>

      {config.showName && (
        <span className="mt-auto text-center text-[8px] leading-tight opacity-80 sm:text-[9px]">
          {element.name}
        </span>
      )}

      {config.showMass && element.atomicMass && (
        <span className="mt-0.5 text-center text-[7px] leading-none opacity-70">
          {element.atomicMass}
        </span>
      )}

      <span
        className="absolute bottom-0.5 right-0.5 h-1.5 w-1.5 rounded-full opacity-60"
        style={{ backgroundColor: textColor }}
      />
    </motion.button>
  );
}
