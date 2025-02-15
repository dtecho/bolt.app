```
project-root/
├── app/                             # Main application code
│   ├── components/                  # UI Components
│   │   ├── human/                  # Human interface components
│   │   │   ├── header/            # Navigation and controls
│   │   │   ├── sidebar/           # Project navigation
│   │   │   └── ui/               # Shared UI components
│   │   │
│   │   ├── ai/                    # AI interface components
│   │   │   ├── chat/             # Chat interface
│   │   │   ├── editor/           # Code editor
│   │   │   │   └── codemirror/   # Editor implementation
│   │   │   └── workbench/        # AI workspace
│   │   │       └── terminal/     # Terminal interface
│   │   │
│   │   └── shared/               # Shared components
│   │
│   ├── lib/                        # Core libraries
│   │   ├── runtime/               # Runtime environments
│   │   │   ├── human/            # Human runtime context
│   │   │   └── ai/              # AI runtime context
│   │   │
│   │   ├── hooks/                # React hooks
│   │   │   ├── human/           # Human-specific hooks
│   │   │   └── ai/             # AI-specific hooks
│   │   │
│   │   ├── persistence/          # Data persistence
│   │   │   ├── private/         # Private storage
│   │   │   └── shared/          # Shared storage
│   │   │
│   │   ├── stores/               # State management
│   │   │   ├── human/           # Human state
│   │   │   ├── ai/             # AI state
│   │   │   └── shared/         # Shared state
│   │   │
│   │   └── webcontainer/         # WebContainer integration
│   │
│   ├── compute/                    # Compute resource management
│   │   ├── pool/                  # Resource pooling
│   │   │   └── thread-${guid}/    # Active sessions
│   │   └── contracts/             # Resource agreements
│   │
│   ├── routes/                     # Application routing
│   ├── styles/                     # Styling
│   ├── types/                      # TypeScript types
│   └── utils/                      # Utilities
│
├── functions/                       # Serverless functions
│   ├── human/                      # Human-triggered functions
│   └── ai/                         # AI-triggered functions
│
├── public/                         # Static assets
│   ├── human/                     # Human-specific assets
│   └── ai/                       # AI-specific assets
│
└── sharing/                        # Sharing configurations
    ├── policies/                   # Access policies
    │   ├── attribution/           # Attribution rules
    │   └── privacy/              # Privacy rules
    │
    └── interfaces/                # Interface boundaries
        ├── human-ai/             # Human-AI interaction
        └── compute/              # Resource sharing
```

Key changes from original structure:

1. **Maintained Core Structure**
   - Preserved the main app/components/lib organization
   - Kept existing tooling integration points

2. **Added Separation**
   - Split components into human/ai/shared
   - Separated runtime contexts
   - Isolated state management

3. **New Features**
   - Added compute resource management
   - Implemented sharing policies
   - Created clear interface boundaries

4. **Mobile Adaptations**
   - Mobile-specific components can be added within existing structure
   - Platform-specific code can be organized in relevant sections

Would you like me to:
1. Detail the contents of specific new directories?
2. Explain how existing functionality maps to new structure?
3. Show how mobile-specific features would fit in?

I find this merged structure particularly effective as it maintains compatibility while implementing our new organizational principles.