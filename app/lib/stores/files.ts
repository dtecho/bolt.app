// app/lib/stores/files.ts

import { atom } from 'nanostores';

export interface FileNode {
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, FileNode>;
}

export type FileMap = Record<string, FileNode>;

export const filesStore = atom<FileMap>({});

export function setFiles(files: FileMap) {
  filesStore.set(files);
}

export function getFile(path: string): FileNode | undefined {
  const files = filesStore.get();
  return files[path];
}

export function updateFile(path: string, content: string) {
  const files = filesStore.get();
  if (files[path] && files[path].type === 'file') {
    filesStore.set({
      ...files,
      [path]: {
        ...files[path],
        content,
      },
    });
  }
}
