// app/components/workbench/EditorPanel.tsx

export interface EditorPanelProps {
  files?: any;
  selectedFile?: string;
  unsavedFiles?: Set<string>;
  onFileSelect?: (filePath: string | undefined) => void;
  onEditorChange?: (update: { content: string }) => void;
  onEditorScroll?: (position: { line: number; ch: number }) => void;
  onFileSave?: () => void;
  isStreaming?: boolean;
}

export function EditorPanel(props: EditorPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">Editor Panel - To be implemented</div>
    </div>
  );
}
