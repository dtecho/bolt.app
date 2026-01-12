// app/lib/stores/previews.ts

import { atom } from 'nanostores';

export interface PreviewInfo {
  id: string;
  url: string;
  title?: string;
  port?: number;
}

export const previewsStore = atom<PreviewInfo[]>([]);

export function addPreview(preview: PreviewInfo) {
  const previews = previewsStore.get();
  previewsStore.set([...previews, preview]);
}

export function removePreview(id: string) {
  const previews = previewsStore.get();
  previewsStore.set(previews.filter((p) => p.id !== id));
}

export function clearPreviews() {
  previewsStore.set([]);
}
