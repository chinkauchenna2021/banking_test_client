'use client';

import { useMemo } from 'react';
import type { NavItem } from '@/types';

export function useFilteredNavItems(items: NavItem[]) {
  // Remove all authorization checks - just return all items
  const filteredItems = useMemo(() => {
    return items.map((item) => {
      // Recursively include all child items without filtering
      if (item.items && item.items.length > 0) {
        return {
          ...item,
          items: [...item.items] // Return all children unfiltered
        };
      }
      return item;
    });
  }, [items]);

  return filteredItems;
}