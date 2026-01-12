// app/lib/runtime/message-parser.ts

export interface ActionCallbackData {
  type: string;
  content: string;
}

export interface ArtifactCallbackData {
  id: string;
  title: string;
}
