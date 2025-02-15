// app/components/workbench/mobile/MobileTerminalHelper.tsx

import { useStore } from '@nanostores/react';
import { memo, useCallback, useEffect, useState } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { workbenchStore } from '~/lib/stores/workbench';
import type { Terminal } from '@xterm/xterm';

interface CommandGroup {
  name: string;
  icon: string;
  commands: Command[];
}

interface Command {
  name: string;
  command: string;
  description: string;
  platform?: 'ios' | 'android' | 'both';
}

const mobileCommands: CommandGroup[] = [
  {
    name: 'Development',
    icon: 'i-ph:code-duotone',
    commands: [
      {
        name: 'Start Dev Server',
        command: 'npm run start',
        description: 'Start the Expo development server'
      },
      {
        name: 'Start iOS',
        command: 'npm run ios',
        description: 'Start iOS simulator',
        platform: 'ios'
      },
      {
        name: 'Start Android',
        command: 'npm run android',
        description: 'Start Android emulator',
        platform: 'android'
      }
    ]
  },
  {
    name: 'Build',
    icon: 'i-ph:package-duotone',
    commands: [
      {
        name: 'Build iOS',
        command: 'expo build:ios',
        description: 'Build iOS binary',
        platform: 'ios'
      },
      {
        name: 'Build Android',
        command: 'expo build:android',
        description: 'Build Android APK/AAB',
        platform: 'android'
      },
      {
        name: 'Build Web',
        command: 'expo build:web',
        description: 'Build web version'
      }
    ]
  },
  {
    name: 'Dependencies',
    icon: 'i-ph:tree-structure-duotone',
    commands: [
      {
        name: 'Add Dependency',
        command: 'expo install ',
        description: 'Add a new dependency'
      },
      {
        name: 'Link Assets',
        command: 'npx react-native-asset',
        description: 'Link project assets'
      },
      {
        name: 'Pod Install',
        command: 'cd ios && pod install',
        description: 'Install iOS pods',
        platform: 'ios'
      }
    ]
  },
  {
    name: 'Debug',
    icon: 'i-ph:bug-duotone',
    commands: [
      {
        name: 'Clear Cache',
        command: 'expo start -c',
        description: 'Clear project cache'
      },
      {
        name: 'Debug Menu',
        command: 'press d',
        description: 'Open debug menu'
      },
      {
        name: 'Reload',
        command: 'press r',
        description: 'Reload application'
      }
    ]
  }
];

export const MobileTerminalHelper = memo(() => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const terminal = useStore(workbenchStore.terminal);

  const executeCommand = useCallback((command: string, terminal: Terminal) => {
    terminal.write(command);
    terminal.write('\r');
  }, []);

  // Filter commands based on search query and platform
  const filteredCommands = mobileCommands
    .map(group => ({
      ...group,
      commands: group.commands.filter(cmd => 
        (cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         cmd.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!cmd.platform || cmd.platform === 'both')
      )
    }))
    .filter(group => group.commands.length > 0);

  return (
    <div className="p-2 bg-bolt-elements-background-depth-1 border-t border-bolt-elements-borderColor">
      {/* Search Bar */}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Search commands..."
          className="flex-1 px-3 py-1.5 text-sm bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Command Groups */}
      <div className="flex flex-wrap gap-2">
        {filteredCommands.map((group) => (
          <div key={group.name} className="relative">
            <IconButton
              icon={group.icon}
              title={group.name}
              onClick={() => setActiveGroup(activeGroup === group.name ? null : group.name)}
              className={activeGroup === group.name ? 'bg-bolt-elements-item-backgroundActive' : ''}
            />
            
            {/* Command Dropdown */}
            {activeGroup === group.name && (
              <div className="absolute bottom-full mb-2 left-0 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-lg shadow-lg min-w-[200px] py-1 z-10">
                <div className="px-3 py-1.5 text-sm font-medium border-b border-bolt-elements-borderColor">
                  {group.name}
                </div>
                {group.commands.map((cmd) => (
                  <button
                    key={cmd.name}
                    className="flex flex-col w-full px-3 py-2 text-sm hover:bg-bolt-elements-item-backgroundActive"
                    onClick={() => terminal && executeCommand(cmd.command, terminal)}
                  >
                    <span>{cmd.name}</span>
                    <span className="text-xs text-bolt-elements-textTertiary">
                      {cmd.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default MobileTerminalHelper;
