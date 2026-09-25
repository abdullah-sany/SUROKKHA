import { useState, useEffect, useCallback } from 'react';
import { AnalysisResponse, RecentSearchItem } from '../types';

const STORAGE_KEY = 'surokkha_recent_searches_v1';
const MAX_SEARCHES = 3;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, MAX_SEARCHES);
        }
      }
    } catch (err) {
      console.warn('Could not read recent searches from localStorage:', err);
    }
    return [];
  });

  // Save to localStorage whenever recentSearches changes
  const saveToStorage = useCallback((items: RecentSearchItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Could not write recent searches to localStorage:', err);
    }
  }, []);

  const addRecentSearch = useCallback((query: string, result: AnalysisResponse) => {
    if (!query.trim() || !result) return;

    setRecentSearches((prev) => {
      // Filter out any existing item with the exact same query
      const trimmedQuery = query.trim();
      const filtered = prev.filter(
        (item) => item.query.trim().toLowerCase() !== trimmedQuery.toLowerCase()
      );

      const newItem: RecentSearchItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        query: trimmedQuery,
        timestamp: Date.now(),
        result,
      };

      const updated = [newItem, ...filtered].slice(0, MAX_SEARCHES);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const removeRecentSearch = useCallback((id: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Could not clear recent searches from localStorage:', err);
    }
  }, []);

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
}
