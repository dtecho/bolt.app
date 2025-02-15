# Contributing to Mobile Bolt

Welcome to the Mobile Bolt open-source project! This guide will help you set up your development environment and understand our contribution process.

## Development Environment Setup

### System Requirements
- Node.js v20.15.1 or later
- pnpm v9.4.0 or later
- A modern web browser (Chrome, Firefox, or Edge recommended)
- An Anthropic API key for Claude integration

### Initial Setup

1. Fork and clone the repository:
```bash
git clone https://github.com/your-username/mobile-bolt.git
cd mobile-bolt
```

2. Install dependencies:
```bash
pnpm install
```

3. Environment configuration:
```bash
cp .env.example .env.local
```
Add your Anthropic API key to `.env.local`:
```
ANTHROPIC_API_KEY=your-key-here
VITE_LOG_LEVEL=debug  # Optional for development
```

### Core Components

Mobile Bolt consists of four main interfaces that work together:

1. **Chat Interface**
   - Built with React and Vercel's AI SDK
   - Handles AI message streaming and state management
   - Located in `app/components/chat`

2. **Code Editor**
   - Uses CodeMirror with React Native extensions
   - Supports mobile framework syntax
   - Located in `app/components/editor`

3. **Terminal/Shell**
   - Integrates with Expo CLI
   - Handles command execution and output streaming
   - Located in `app/components/terminal`

4. **File Tree**
   - Manages project structure visualization
   - Handles file operations
   - Located in `app/components/filetree`

### Available Scripts

- `pnpm run dev`: Start development server
- `pnpm run build`: Build for production
- `pnpm run test`: Run test suite
- `pnpm run lint`: Run linting
- `pnpm run typecheck`: Run type checking
- `pnpm run preview`: Preview production build

## Contributing Process

### 1. Finding Issues to Work On
- Check our [Issues](https://github.com/your-org/mobile-bolt/issues) page
- Look for `good first issue` and `help wanted` tags
- Comment on an issue before starting work

### 2. Making Changes
1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Follow our coding standards:
   - Use TypeScript for all new code
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

3. Commit your changes:
   - Use conventional commit messages
   - Reference issue numbers in commits

### 3. Testing
- Run the test suite: `pnpm test`
- Add new tests for your changes
- Ensure all tests pass before submitting

### 4. Submitting Changes
1. Push your changes to your fork
2. Create a Pull Request (PR)
3. Fill out the PR template
4. Wait for review

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow [Prettier](https://prettier.io/) formatting
- Use ESLint with our configuration
- Follow React Hooks best practices

### Testing
- Write unit tests using Vitest
- Add integration tests for new features
- Test mobile-specific functionality
- Test cross-platform compatibility

### Documentation
- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update API documentation as needed
- Include example usage where appropriate

### Mobile-Specific Considerations
- Test on both iOS and Android configurations
- Consider different screen sizes
- Handle platform-specific features appropriately
- Test with Expo's development tools

## Troubleshooting

### Common Issues

1. Build Failures
```bash
# Clear build cache
pnpm clean
pnpm install
```

2. Environment Issues
```bash
# Verify environment
node -v
pnpm -v
```

3. AI Integration Issues
- Verify your API key is correctly set
- Check the debug logs
- Ensure proper streaming setup

### Getting Help
- Join our [Discord](https://discord.gg/your-community)
- Check the [FAQ](./FAQ.md)
- File an issue with detailed information

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Claude API Documentation](https://docs.anthropic.com/)
- [WebContainer API Documentation](https://webcontainers.io/)