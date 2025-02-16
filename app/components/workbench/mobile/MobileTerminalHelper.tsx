// app/components/workbench/mobile/MobileTerminalHelper.tsx

import { memo, useCallback, useState } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { 
  useMobileDevelopment,
  useMobilePlatform,
  useMobileBuild,
  useMobileProject
} from '~/lib/hooks/useMobileDevelopment';
import type { MobileActionType } from '~/lib/runtime/mobile-message-parser';

interface CommandGroup {
  id: string;
  name: string;
  icon: string;
  description: string;
  platformSpecific?: boolean;
  commands: Command[];
}

interface Command {
  id: string;
  name: string;
  command: string;
  description: string;
  type: MobileActionType;
  requiresDevice?: boolean;
  platform?: 'ios' | 'android' | 'both';
}

const commandGroups: CommandGroup[] = [
  {
    id: 'dev',
    name: 'Development',
    icon: 'i-ph:code-duotone',
    description: 'Development server and environment commands',
    commands: [
      {
        id: 'start-dev',
        name: 'Start Dev Server',
        command: 'expo start --dev-client',
        description: 'Start the development server with native client support',
        type: 'run'
      },
      {
        id: 'clear-cache',
        name: 'Clear Cache',
        command: 'expo start -c',
        description: 'Clear development cache and restart',
        type: 'run'
      }
    ]
  },
  {
    id: 'build',
    name: 'Build',
    icon: 'i-ph:package-duotone',
    description: 'Build commands for iOS and Android',
    platformSpecific: true,
    commands: [
      {
        id: 'build-ios',
        name: 'Build iOS',
        command: 'expo build:ios',
        description: 'Build iOS application',
        type: 'build',
        platform: 'ios'
      },
      {
        id: 'build-android',
        name: 'Build Android',
        command: 'expo build:android',
        description: 'Build Android application',
        type: 'build',
        platform: 'android'
      }
    ]
  },
  {
    id: 'dependencies',
    name: 'Dependencies',
    icon: 'i-ph:tree-structure-duotone',
    description: 'Manage project dependencies and assets',
    commands: [
      {
        id: 'install-deps',
        name: 'Install Dependencies',
        command: 'npm install',
        description: 'Install project dependencies',
        type: 'config'
      },
      {
        id: 'link-assets',
        name: 'Link Assets',
        command: 'npx react-native-asset',
        description: 'Link project assets',
        type: 'asset'
      }
    ]
  }
];

export const MobileTerminalHelper = memo(() => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const { activePlatform } = useMobilePlatform();
  const { currentTask } = useMobileDevelopment();
  const { startBuild } = useMobileBuild();
  const { addDependency, linkNativeModule } = useMobileProject();

  const executeCommand = useCallback(async (command: Command) => {
    try {
      switch (command.type) {
        case 'build':
          await startBuild({
            platform: command.platform || activePlatform,
            mode: 'development'
          });
          break;
        
        case 'asset':
          // Track asset in project state
          break;
        
        case 'config':
          if (command.id === 'install-deps') {
            // Parse package.json and track dependencies
            const deps = await parsePackageJson();
            for (const dep of deps) {
              await addDependency(dep.name, dep.version, dep.platform);
            }
          }
          break;
      }

      // Send command to terminal
      await window.webcontainer.terminal.write(command.command + '\n');
    } catch (error) {
      console.error('Failed to execute command:', error);
    }
  }, [activePlatform, startBuild, addDependency]);

  const isCommandAvailable = useCallback((command: Command) => {
    if (currentTask !== 'idle') return false;
    if (command.platform && command.platform !== 'both' && command.platform !== activePlatform) return false;
    return true;
  }, [currentTask, activePlatform]);

  return (
    <div className="p-2 bg-bolt-elements-background-depth-1 border-t border-bolt-elements-borderColor">
      {/* Command Groups */}
      <div className="flex flex-wrap gap-2">
        {commandGroups.map((group) => (
          <div key={group.id} className="relative">
            <IconButton
              icon={group.icon}
              title={group.name}
              onClick={() => setActiveGroup(activeGroup === group.id ? null : group.id)}
              className={activeGroup === group.id ? 'bg-bolt-elements-item-backgroundActive' : ''}
            />
            
            {/* Command Dropdown */}
            {activeGroup === group.id && (
              <div className="absolute bottom-full mb-2 left-0 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-lg shadow-lg min-w-[200px] py-1 z-10">
                <div className="px-3 py-1.5 text-sm font-medium border-b border-bolt-elements-borderColor">
                  {group.name}
                  <div className="text-xs text-bolt-elements-textTertiary">
                    {group.description}
                  </div>
                </div>
                
                {group.commands.map((cmd) => (
                  <button
                    key={cmd.id}
                    className={`flex flex-col w-full px-3 py-2 text-sm ${
                      isCommandAvailable(cmd)
                        ? 'hover:bg-bolt-elements-item-backgroundActive'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => isCommandAvailable(cmd) && executeCommand(cmd)}
                    disabled={!isCommandAvailable(cmd)}
                  >
                    <span>{cmd.name}</span>
                    <span className="text-xs text-bolt-elements-textTertiary">
                      {cmd.description}
                    </span>
                    {cmd.platform && cmd.platform !== 'both' && (
                      <span className="text-xs text-bolt-elements-textSecondary mt-1">
                        {cmd.platform === 'ios' ? 'iOS Only' : 'Android Only'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Current Task Indicator */}
        {currentTask !== 'idle' && (
          <div className="ml-2 flex items-center text-sm text-bolt-elements-textSecondary">
            <div className="i-svg-spinners:90-ring-with-bg mr-2" />
            {currentTask === 'building' ? 'Building...' : 
             currentTask === 'running' ? 'Running...' : 
             'Processing...'}
          </div>
        )}
      </div>
    </div>
  );
});

async function parsePackageJson() {
  // Implementation for parsing package.json
  return [];
}

export default MobileTerminalHelper;
