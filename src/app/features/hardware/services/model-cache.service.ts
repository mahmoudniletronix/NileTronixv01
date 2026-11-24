import { Injectable } from '@angular/core';
import type * as ThreeNamespace from 'three';

export interface CachedModelEntry {
  readonly id: string;
  readonly root: ThreeNamespace.Group;
  readonly geometries: readonly ThreeNamespace.BufferGeometry[];
  readonly materials: readonly ThreeNamespace.Material[];
  readonly textures: readonly ThreeNamespace.Texture[];
  lastUsed: number;
}

/**
 * Bounded LRU cache for loaded 3D hardware models.
 * Protects active models from premature disposal while keeping GPU memory bounded.
 */
@Injectable({ providedIn: 'root' })
export class ModelCacheService {
  private readonly maxEntries = 6;
  private readonly entries = new Map<string, CachedModelEntry>();
  private activeId: string | null = null;

  setActiveId(id: string | null): void {
    this.activeId = id;
  }

  get(id: string): CachedModelEntry | undefined {
    const entry = this.entries.get(id);
    if (entry) {
      entry.lastUsed = performance.now();
    }
    return entry;
  }

  set(entry: CachedModelEntry): void {
    entry.lastUsed = performance.now();
    this.entries.set(entry.id, entry);
    this.evictIfNeeded();
  }

  clearAll(): void {
    for (const entry of this.entries.values()) {
      this.disposeEntry(entry);
    }
    this.entries.clear();
    this.activeId = null;
  }

  private evictIfNeeded(): void {
    while (this.entries.size > this.maxEntries) {
      let oldestKey: string | null = null;
      let oldestTime = Number.POSITIVE_INFINITY;

      for (const [key, entry] of this.entries.entries()) {
        if (key === this.activeId) continue;
        if (entry.lastUsed < oldestTime) {
          oldestTime = entry.lastUsed;
          oldestKey = key;
        }
      }

      if (!oldestKey) break;
      const evicted = this.entries.get(oldestKey);
      if (evicted) {
        this.disposeEntry(evicted);
      }
      this.entries.delete(oldestKey);
    }
  }

  private disposeEntry(entry: CachedModelEntry): void {
    entry.geometries.forEach((g) => g.dispose());
    entry.textures.forEach((t) => t.dispose());
    entry.materials.forEach((m) => m.dispose());
  }
}
