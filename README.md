

- **AI-Powered Mobile Development**: The environment gives Claude complete control over:
  - Project structure and files
  - Dependencies and configurations
  - Build and deployment processes
  - Platform-specific code generation


## Development Environment


Mobile Bolt provides four main interfaces that work together seamlessly:


1. **Chat Interface**
   - Natural language interaction with Claude
   - Mobile-specific development guidance
   - UI/UX planning and refinement
   - Error resolution and debugging assistance


2. **Code Editor**
   - Full-featured CodeMirror instance
   - React Native and Expo support
   - Platform-specific syntax highlighting
   - Component preview integration


3. **Terminal/Shell**
   - Expo and React Native CLI commands
   - Real-time build output
   - Device simulation controls
   - Package management


4. **File Tree**
   - Mobile project structure visualization
   - Platform-specific resource management
   - Quick navigation and file creation
   - Asset organization


## Getting Started


1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/mobile-bolt.git
   ```


2. Install dependencies:
   ```bash
   pnpm install
   ```


3. Set up your environment:
   ```bash
   cp .env.example .env.local
   ```
   Add your Anthropic API key to `.env.local`


4. Start the development server:
   ```bash
   pnpm run dev
   ```


## Prerequisites


- Node.js (v20.15.1 or later)
- pnpm (v9.4.0 or later)
- An Anthropic API key for Claude


## Features


- React Native with Expo for cross-platform development
- Real-time preview on physical devices
- AI-assisted component creation
- Platform-specific code generation
- Integrated debugging tools
- One-click deployment to Expo


## Contributing


We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:


- Setting up your development environment
- Our coding standards
- The pull request process
- Bug reporting guidelines


## Architecture


Mobile Bolt builds on the original Bolt architecture with specific adaptations for mobile development:


1. **Frontend**
   - React Native/Expo integration
   - Mobile-specific UI components
   - Device preview system
   - Platform-specific editors


2. **AI Integration**
   - Claude 3.5 Sonnet integration
   - Mobile development context awareness
   - Platform-specific code generation
   - Component optimization


3. **Build System**
   - Expo build pipeline
   - Platform-specific compilation
   - Asset optimization
   - Deployment automation


## License


This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Support


For help and feedback:
- File an issue on our [GitHub Issues](https://github.com/your-org/mobile-bolt/issues)
- Join our [Discord community](https://discord.gg/your-community)
- Email us at support@your-org.com
