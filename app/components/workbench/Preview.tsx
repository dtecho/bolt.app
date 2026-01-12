// app/components/workbench/Preview.tsx

export interface PreviewProps {
  className?: string;
}

export function Preview({ className }: PreviewProps) {
  return (
    <div className={className}>
      <div className="h-full flex items-center justify-center">
        Web Preview - To be implemented
      </div>
    </div>
  );
}
