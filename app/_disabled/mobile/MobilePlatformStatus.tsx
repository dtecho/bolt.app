// app/components/workbench/mobile/MobilePlatformStatus.tsx

import { useStore } from '@nanostores/react';
import { memo, useState, useEffect } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { workbenchStore } from '~/lib/stores/workbench';

interface DeviceStatus {
  id: string;
  name: string;
  type: 'simulator' | 'physical';
  platform: 'ios' | 'android';
  status: 'connected' | 'disconnected' | 'building' | 'running';
  version: string;
}

interface BuildStatus {
  platform: 'ios' | 'android' | 'both';
  mode: 'development' | 'production';
  status: 'idle' | 'building' | 'running' | 'error';
  lastBuild?: Date;
  error?: string;
}

export const MobilePlatformStatus = memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'devices' | 'builds'>('devices');
  
  // Mock data - would come from store in real implementation
  const [connectedDevices, setConnectedDevices] = useState<DeviceStatus[]>([
    {
      id: 'iphone-14-sim',
      name: 'iPhone 14 Simulator',
      type: 'simulator',
      platform: 'ios',
      status: 'connected',
      version: '16.0'
    },
    {
      id: 'pixel-7-emu',
      name: 'Pixel 7 Emulator',
      type: 'simulator',
      platform: 'android',
      status: 'running',
      version: '13.0'
    }
  ]);

  const [buildStatus, setBuildStatus] = useState<BuildStatus>({
    platform: 'both',
    mode: 'development',
    status: 'running',
    lastBuild: new Date()
  });

  return (
    <div className="border-t border-bolt-elements-borderColor">
      {/* Status Bar */}
      <div 
        className="flex items-center px-3 py-2 bg-bolt-elements-background-depth-1 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {/* iOS Status */}
            <div className="flex items-center gap-1">
              <div className="i-ph:device-mobile text-lg" />
              <div className={`w-2 h-2 rounded-full ${
                connectedDevices.some(d => d.platform === 'ios' && d.status === 'running')
                  ? 'bg-green-500'
                  : 'bg-gray-400'
              }`} />
            </div>
            
            {/* Android Status */}
            <div className="flex items-center gap-1">
              <div className="i-ph:android-logo text-lg" />
              <div className={`w-2 h-2 rounded-full ${
                connectedDevices.some(d => d.platform === 'android' && d.status === 'running')
                  ? 'bg-green-500'
                  : 'bg-gray-400'
              }`} />
            </div>
          </div>
          
          <div className="text-sm text-bolt-elements-textSecondary">
            {buildStatus.status === 'running' ? 'Development Server Running' : 'Server Stopped'}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="text-xs text-bolt-elements-textTertiary">
            {connectedDevices.length} device{connectedDevices.length !== 1 ? 's' : ''}
          </div>
          <div className={`i-ph:caret-${isExpanded ? 'up' : 'down'} text-bolt-elements-textSecondary`} />
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-bolt-elements-borderColor">
          {/* Tabs */}
          <div className="flex border-b border-bolt-elements-borderColor">
            <button
              className={`px-4 py-2 text-sm ${
                activeTab === 'devices'
                  ? 'text-bolt-elements-textPrimary border-b-2 border-bolt-elements-borderColorActive'
                  : 'text-bolt-elements-textSecondary'
              }`}
              onClick={() => setActiveTab('devices')}
            >
              Devices
            </button>
            <button
              className={`px-4 py-2 text-sm ${
                activeTab === 'builds'
                  ? 'text-bolt-elements-textPrimary border-b-2 border-bolt-elements-borderColorActive'
                  : 'text-bolt-elements-textSecondary'
              }`}
              onClick={() => setActiveTab('builds')}
            >
              Builds
            </button>
          </div>

          {/* Content */}
          <div className="p-3 max-h-[300px] overflow-y-auto">
            {activeTab === 'devices' ? (
              <div className="space-y-2">
                {connectedDevices.map(device => (
                  <div 
                    key={device.id}
                    className="flex items-center p-2 bg-bolt-elements-background-depth-2 rounded"
                  >
                    <div className={`i-ph:${device.platform === 'ios' ? 'device-mobile' : 'android-logo'} text-lg`} />
                    <div className="ml-3">
                      <div className="text-sm">{device.name}</div>
                      <div className="text-xs text-bolt-elements-textTertiary">
                        {device.type} • {device.version}
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <div className={`px-2 py-0.5 text-xs rounded ${
                        device.status === 'running'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {device.status}
                      </div>
                      <IconButton
                        icon="i-ph:x-circle"
                        size="sm"
                        onClick={() => {
                          // Handle device disconnect
                        }}
                      />
                    </div>
                  </div>
                ))}
                
                <button className="flex items-center gap-2 w-full p-2 text-sm text-bolt-elements-textSecondary hover:bg-bolt-elements-background-depth-2 rounded">
                  <div className="i-ph:plus-circle" />
                  Add Device
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Current Build</div>
                  <div className="text-xs text-bolt-elements-textTertiary">
                    {buildStatus.lastBuild?.toLocaleString()}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1 p-2 bg-bolt-elements-background-depth-2 rounded">
                    <div className="text-xs text-bolt-elements-textTertiary">Mode</div>
                    <div className="text-sm">{buildStatus.mode}</div>
                  </div>
                  <div className="flex-1 p-2 bg-bolt-elements-background-depth-2 rounded">
                    <div className="text-xs text-bolt-elements-textTertiary">Platform</div>
                    <div className="text-sm">{buildStatus.platform}</div>
                  </div>
                  <div className="flex-1 p-2 bg-bolt-elements-background-depth-2 rounded">
                    <div className="text-xs text-bolt-elements-textTertiary">Status</div>
                    <div className="text-sm">{buildStatus.status}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default MobilePlatformStatus;
