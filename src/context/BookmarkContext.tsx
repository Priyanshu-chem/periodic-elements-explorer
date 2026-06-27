'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface BookmarkContextValue {
  bookmarks: Set<number>;
  toggleBookmark: (id: number) => void;
  isBookmarked: (id: number) => boolean;
}

const BookmarkContext = createContext<BookmarkContextValue | undefined>(undefined);

function loadBookmarks(): Set<number> {
  if (typeof window === 'undefined') return new Set<number>();
  try {
    const stored = localStorage.getItem('bookmarks');
    if (!stored) return new Set<number>();
    return new Set<number>(JSON.parse(stored) as number[]);
  } catch {
    return new Set<number>();
  }
}

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Set<number>>(() => loadBookmarks());

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(Array.from(bookmarks)));
  }, [bookmarks]);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: number) => bookmarks.has(id),
    [bookmarks],
  );

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks(): BookmarkContextValue {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be used within BookmarkProvider');
  return ctx;
}
