```
project-root/
├── app/
│   ├── components/
│   │   ├── human/                              # Human-specific UI components
│   │   │   ├── header/                         # Migrated from existing header/
│   │   │   │   ├── Header.tsx                  # (existing)
│   │   │   │   └── HeaderActionButtons.client.tsx
│   │   │   ├── sidebar/                        # Migrated from existing sidebar/
│   │   │   │   ├── HistoryItem.tsx
│   │   │   │   └── Menu.client.tsx
│   │   │   └── ui/                            # Migrated from existing ui/
│   │   │       ├── Dialog.tsx
│   │   │       └── [other UI components]
│   │   │
│   │   ├── ai/                                # AI-specific components
│   │   │   ├── chat/                          # Enhanced from existing chat/
│   │   │   │   ├── Artifact.tsx
│   │   │   │   ├── AssistantMessage.tsx
│   │   │   │   ├── BaseChat.tsx
│   │   │   │   └── [other chat components]
│   │   │   ├── editor/                        # Enhanced from existing editor/
│   │   │   │   ├── codemirror/
│   │   │   │   └── mobile/                    # New mobile editor features
│   │   │   └── workbench/                     # Enhanced from existing workbench/
│   │   │       ├── terminal/
│   │   │       └── mobile-preview/            # New mobile preview components
│   │   │
│   │   └── shared/                           # Shared components
│   │       ├── FileTree.tsx                   # Moved from workbench/
│   │       └── Preview.tsx                    # Moved from workbench/
│   │
│   ├── lib/
│   │   ├── runtime/                          # Enhanced runtime management
│   │   │   ├── human/
│   │   │   │   └── mobile-runtime.ts         # Mobile-specific runtime
│   │   │   ├── ai/
│   │   │   │   └── context-tracker.ts        # AI state management
│   │   │   └── message-parser.ts             # Moved from existing
│   │   │
│   │   ├── stores/                          # Enhanced state management
│   │   │   ├── human/
│   │   │   │   ├── preferences.ts           # User preferences
│   │   │   │   └── mobile-state.ts          # Mobile-specific state
│   │   │   ├── ai/
│   │   │   │   ├── chat.ts                  # Moved from existing
│   │   │   │   └── editor.ts                # Moved from existing
│   │   │   └── shared/
│   │   │       ├── files.ts                 # Moved from existing
│   │   │       └── settings.ts              # Moved from existing
│   │   │
│   │   ├── compute/                         # New compute management
│   │   │   ├── pool/
│   │   │   │   └── thread-manager.ts
│   │   │   └── contracts/
│   │   │       └── resource-agreement.ts
│   │   │
│   │   └── [existing lib structure]         # Maintain other lib folders
│   │
│   ├── routes/                              # Enhanced routing
│   │   ├── _index.tsx
│   │   ├── api.chat.ts
│   │   └── mobile/                          # New mobile routes
│   │       └── preview.tsx
│   │
│   └── [other existing app structure]       # Maintain other app folders
│
├── sharing/                                 # New sharing management
│   ├── policies/
│   │   ├── attribution/
│   │   │   └── policy.ts
│   │   └── privacy/
│   │       └── policy.ts
│   └── interfaces/
│       ├── human-ai/
│       │   └── boundaries.ts
│       └── compute/
│           └── agreements.ts
│
└── [existing project root files]            # Maintain existing config files
```

## Key Migration Steps:

1. **Component Reorganization**
   - Move existing components into human/ai/shared categories
   - Enhance chat components for mobile context
   - Add mobile-specific editor features
   - Create mobile preview system

2. **State Management Enhancement**
   - Split stores into human/ai/shared domains
   - Add mobile-specific state management
   - Implement compute resource tracking

3. **Runtime Adaptation**
   - Create mobile-specific runtime
   - Implement AI context tracking
   - Enhance message parsing for mobile

4. **New Features Integration**
   - Add compute pool management
   - Implement sharing policies
   - Create interface boundaries
   - Add mobile preview system

## File Migration Examples:

1. **Chat Components**
```typescript
// app/components/ai/chat/BaseChat.tsx
import { useComputePool } from '../../../lib/compute/pool';
import { useAIContext } from '../../../lib/runtime/ai';

export const BaseChat = () => {
  const computePool = useComputePool();
  const aiContext = useAIContext();
  // Enhanced implementation
};
```

2. **Store Management**
```typescript
// app/lib/stores/human/mobile-state.ts
import { create } from 'zustand';

interface MobileState {
  deviceType: 'ios' | 'android';
  orientation: 'portrait' | 'landscape';
  // Mobile-specific state
}

export const useMobileState = create<MobileState>()((set) => ({
  // Implementation
}));
```

3. **Compute Management**
```typescript
// app/lib/compute/pool/thread-manager.ts
export class ThreadManager {
  async createThread(resourceRequirements: ResourceRequirements) {
    const threadId = crypto.randomUUID();
    // Implementation
  }
  
  async negotiateResources(threadId: string) {
    // Resource negotiation
  }
}
```

Would you like me to:
1. Detail the implementation of any specific components?
2. Explain the compute pool management system?
3. Show how mobile preview integration works?

I'm particularly excited about how this structure maintains all existing functionality while adding clear spaces for mobile-specific features and AI/human interaction boundaries.