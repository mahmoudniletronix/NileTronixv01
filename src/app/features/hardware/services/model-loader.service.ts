import { Injectable, inject } from '@angular/core';
import type * as ThreeNamespace from 'three';
import { Hardware3DConfig } from '../models/hardware-product.model';
import { CachedModelEntry, ModelCacheService } from './model-cache.service';

export interface LoadedModelResult {
  readonly entry: CachedModelEntry;
  readonly source: 'glb' | 'procedural-reference';
}

/**
 * Lazy-loads Three.js, GLTFLoader, and procedural hardware geometry on demand.
 * Supports future manufacturer GLB assets with automatic fallback to reference-based 3D geometry.
 */
@Injectable({ providedIn: 'root' })
export class ModelLoaderService {
  private readonly cache = inject(ModelCacheService);
  private threePromise: Promise<typeof ThreeNamespace> | null = null;

  async getThree(): Promise<typeof ThreeNamespace> {
    if (!this.threePromise) {
      this.threePromise = import('three');
    }
    return this.threePromise;
  }

  async loadProductModel(
    productId: string,
    config: Hardware3DConfig,
    onProgress?: (percent: number) => void
  ): Promise<LoadedModelResult> {
    const cached = this.cache.get(productId);
    if (cached) {
      onProgress?.(100);
      return {
        entry: cached,
        source: config.glbUrl ? 'glb' : 'procedural-reference',
      };
    }

    onProgress?.(15);
    const T = await this.getThree();
    onProgress?.(40);

    // If a verified manufacturer GLB URL is configured, load via GLTFLoader first
    if (config.glbUrl) {
      try {
        const loaded = await this.loadGlb(T, productId, config.glbUrl, onProgress);
        this.cache.set(loaded);
        return { entry: loaded, source: 'glb' };
      } catch (err) {
        console.warn(
          `[NileTronix 3D] Failed to load GLB "${config.glbUrl}", falling back to procedural geometry.`,
          err
        );
      }
    }

    // Build reference-accurate procedural 3D hardware geometry
    const { createProceduralHardwareModel } = await import('./procedural-hardware-factory');
    onProgress?.(75);
    const built = createProceduralHardwareModel(T, config.proceduralId);

    const entry: CachedModelEntry = {
      id: productId,
      root: built.root,
      geometries: built.disposables.geometries,
      materials: built.disposables.materials,
      textures: built.disposables.textures,
      lastUsed: performance.now(),
    };

    this.cache.set(entry);
    onProgress?.(100);
    return { entry, source: 'procedural-reference' };
  }

  private async loadGlb(
    T: typeof ThreeNamespace,
    productId: string,
    url: string,
    onProgress?: (percent: number) => void
  ): Promise<CachedModelEntry> {
    const [{ GLTFLoader }, { normalizeHardwareRoot }] = await Promise.all([
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('./procedural-hardware-factory'),
    ]);

    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url, (evt) => {
      if (evt.total > 0) {
        const pct = Math.min(95, Math.round(40 + (evt.loaded / evt.total) * 55));
        onProgress?.(pct);
      }
    });

    const wrapper = new T.Group();
    wrapper.name = `hardware-glb-${productId}`;
    wrapper.add(gltf.scene);

    const geometries: ThreeNamespace.BufferGeometry[] = [];
    const materials: ThreeNamespace.Material[] = [];
    const textures: ThreeNamespace.Texture[] = [];

    gltf.scene.traverse((obj) => {
      if (obj instanceof T.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.geometry) geometries.push(obj.geometry);
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of mats) {
          if (!m) continue;
          materials.push(m);
          const std = m as ThreeNamespace.MeshStandardMaterial;
          if (std.map) textures.push(std.map);
          if (std.normalMap) textures.push(std.normalMap);
          if (std.roughnessMap) textures.push(std.roughnessMap);
          if (std.metalnessMap) textures.push(std.metalnessMap);
        }
      }
    });

    normalizeHardwareRoot(T, wrapper, 1.55);

    return {
      id: productId,
      root: wrapper,
      geometries,
      materials,
      textures,
      lastUsed: performance.now(),
    };
  }
}
