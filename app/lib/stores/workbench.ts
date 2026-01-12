// app/lib/stores/workbench.ts

import { atom, computed, map } from 'nanostores';
import type { Terminal } from '@xterm/xterm';
import type { FileMap } from './files';
import type { EditorDocument } from '~/components/editor/codemirror/CodeMirrorEditor';
import type { PreviewInfo } from './previews';

export type WorkbenchViewType = 'code' | 'preview' | 'mobile-preview';
export type PlatformType = 'web' | 'mobile';

interface WorkbenchStore {
  showWorkbench: boolean;
  showTerminal: boolean;
  currentView: WorkbenchViewType;
  platformType: PlatformType;
  selectedFile?: string;
  documents: Map<string, EditorDocument>;
  currentDocument?: EditorDocument;
  unsavedFiles: Set<string>;
  previews: PreviewInfo[];
  terminal?: Terminal;
}

const store = map<WorkbenchStore>({
  showWorkbench: false,
  showTerminal: false,
  currentView: 'code',
  platformType: 'web',
  selectedFile: undefined,
  documents: new Map(),
  currentDocument: undefined,
  unsavedFiles: new Set(),
  previews: [],
  terminal: undefined,
});

// Computed values
export const currentDocument = computed(store, (state) => state.currentDocument);
export const selectedFile = computed(store, (state) => state.selectedFile);
export const unsavedFiles = computed(store, (state) => state.unsavedFiles);
export const previews = computed(store, (state) => state.previews);

// Actions
export const showWorkbench = atom(false);
export const showTerminal = atom(false);
export const currentView = atom<WorkbenchViewType>('code');
export const platformType = atom<PlatformType>('web');

export const setDocuments = (files: FileMap) => {
  const documents = new Map<string, EditorDocument>();
  
  for (const [filePath, file] of Object.entries(files)) {
    if (file?.type === 'file') {
      documents.set(filePath, {
        filePath,
        content: file.content ?? '',
        scroll: { line: 0, ch: 0 },
      });
    }
  }
  
  store.setKey('documents', documents);
};

export const setSelectedFile = (filePath: string | undefined) => {
  store.setKey('selectedFile', filePath);
  
  if (filePath) {
    const document = store.get().documents.get(filePath);
    store.setKey('currentDocument', document);
  } else {
    store.setKey('currentDocument', undefined);
  }
};

export const setCurrentDocumentContent = (content: string) => {
  const state = store.get();
  const { currentDocument } = state;
  
  if (currentDocument) {
    const updatedDocument = { ...currentDocument, content };
    const documents = new Map(state.documents);
    documents.set(currentDocument.filePath, updatedDocument);
    
    store.setKey('documents', documents);
    store.setKey('currentDocument', updatedDocument);
    
    const unsavedFiles = new Set(state.unsavedFiles);
    unsavedFiles.add(currentDocument.filePath);
    store.setKey('unsavedFiles', unsavedFiles);
  }
};

export const setCurrentDocumentScrollPosition = (position: { line: number; ch: number }) => {
  const state = store.get();
  const { currentDocument } = state;
  
  if (currentDocument) {
    const updatedDocument = { ...currentDocument, scroll: position };
    const documents = new Map(state.documents);
    documents.set(currentDocument.filePath, updatedDocument);
    
    store.setKey('documents', documents);
    store.setKey('currentDocument', updatedDocument);
  }
};

export const saveCurrentDocument = async () => {
  const state = store.get();
  const { currentDocument, unsavedFiles: unsaved } = state;
  
  if (currentDocument && unsaved.has(currentDocument.filePath)) {
    // Simulate file save - in real implementation, this would call WebContainer API
    const unsavedFiles = new Set(unsaved);
    unsavedFiles.delete(currentDocument.filePath);
    store.setKey('unsavedFiles', unsavedFiles);
  }
};

export const setPlatformType = (platform: PlatformType) => {
  store.setKey('platformType', platform);
  if (platform === 'mobile') {
    currentView.set('mobile-preview');
  }
};

export const toggleWorkbench = (show?: boolean) => {
  showWorkbench.set(show ?? !showWorkbench.get());
};

export const toggleTerminal = (show?: boolean) => {
  showTerminal.set(show ?? !showTerminal.get());
};

// Create a files atom
export const files = atom<FileMap>({});

export const workbenchStore = {
  ...store,
  showWorkbench,
  showTerminal,
  currentView,
  platformType,
  files,
  previews,
  selectedFile,
  currentDocument,
  unsavedFiles,
  setDocuments,
  setSelectedFile,
  setCurrentDocumentContent,
  setCurrentDocumentScrollPosition,
  saveCurrentDocument,
  setPlatformType,
  toggleWorkbench,
  toggleTerminal,
};

export default workbenchStore;
