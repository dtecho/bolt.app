# Development Guide

## Getting Started

### Prerequisites

- Node.js v20.15.1 or later
- npm v9.4.0 or later
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dtecho/bolt.app.git
cd bolt.app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
- `ANTHROPIC_API_KEY`: Your Anthropic Claude API key
- `WEBCONTAINER_API_KEY`: Your WebContainer API key (if applicable)
- `EXPO_ACCESS_TOKEN`: Your Expo access token (for mobile features)

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Build the application for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run tests in UI mode:
```bash
npm run test:ui
```

### Code Quality

Run type checking:
```bash
npm run typecheck
```

Run linting:
```bash
npm run lint
```

Auto-fix linting issues:
```bash
npm run lint:fix
```

Format code:
```bash
npm run format
```

Check code formatting:
```bash
npm run format:check
```

## Project Structure

```
bolt.app/
├── app/                      # Application source code
│   ├── components/          # React components
│   │   ├── ai/             # AI-specific components
│   │   ├── human/          # Human interface components
│   │   ├── shared/         # Shared components
│   │   ├── ui/             # Base UI components
│   │   └── workbench/      # Workbench components
│   ├── lib/                # Libraries and utilities
│   │   └── stores/         # State management (nanostores)
│   ├── routes/             # Remix routes
│   ├── styles/             # Global styles
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── root.tsx            # Root layout
├── public/                 # Static assets
├── .github/               # GitHub configuration
│   └── workflows/         # GitHub Actions workflows
└── app/_disabled/         # Temporarily disabled features (Phase 2+)

```

## Development Phases

### Phase 1: Foundation & Infrastructure (Current)
- ✅ Project configuration and build system
- ✅ Basic routing and state management
- ✅ Core UI components
- ✅ TypeScript configuration
- ✅ CI/CD pipeline
- 🔄 Development documentation

### Phase 2: Core AI Integration (Next)
- Chat interface implementation
- Claude API integration
- Code generation engine
- Mobile-specific features

### Phase 3+: See DEVELOPMENT_ROADMAP.md

## Architecture

### State Management
We use [nanostores](https://github.com/nanostores/nanostores) for state management:
- Lightweight and fast
- Great TypeScript support
- Easy to test
- Separation of concerns (human/AI/shared state)

### Styling
- Tailwind CSS for utility-first styling
- CSS custom properties for theming
- Mobile-first responsive design

### Build System
- Vite for fast development and optimized builds
- Remix for full-stack React framework
- Hot Module Replacement (HMR) for instant updates

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Clear build cache:
```bash
rm -rf build/ node_modules/.cache
```

2. Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

3. Check Node version:
```bash
node --version  # Should be 20.15.1 or later
```

### Type Errors

If TypeScript shows errors:

1. Ensure you're using the correct TypeScript version:
```bash
npm ls typescript
```

2. Restart your IDE/editor's TypeScript server

3. Check for missing type definitions:
```bash
npm install --save-dev @types/[package-name]
```

## Support

For questions and support:
- Check the [GitHub Issues](https://github.com/dtecho/bolt.app/issues)
- Review the [Development Roadmap](DEVELOPMENT_ROADMAP.md)
- Read the [Contributing Guide](CONTRIBUTING.md)
