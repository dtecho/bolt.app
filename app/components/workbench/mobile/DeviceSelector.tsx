// app/components/workbench/mobile/DeviceSelector.tsx

import { memo, useRef, useState } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import type { DeviceSpec, DevicePlatform } from './MobilePreview';

const defaultDevices: DeviceSpec[] = [
  // iOS Devices
  {
    name: 'iPhone 14 Pro Max',
    width: 430,
    height: 932,
    platform: 'ios',
    devicePixelRatio: 3
  },
  {
    name: 'iPhone 14 / 13',
    width: 390,
    height: 844,
    platform: 'ios',
    devicePixelRatio: 3
  },
  {
    name: 'iPhone SE',
    width: 375,
    height: 667,
    platform: 'ios',
    devicePixelRatio: 2
  },
  {
    name: 'iPad Pro 11"',
    width: 834,
    height: 1194,
    platform: 'ios',
    devicePixelRatio: 2
  },
  // Android Devices
  {
    name: 'Pixel 7 Pro',
    width: 412,
    height: 915,
    platform: 'android',
    devicePixelRatio: 3.5
  },
  {
    name: 'Samsung S22 Ultra',
    width: 390,
    height: 844,
    platform: 'android',
    devicePixelRatio: 3
  },
  {
    name: 'Pixel Tablet',
    width: 834,
    height: 1194,
    platform: 'android',
    devicePixelRatio: 2
  }
];

interface DeviceSelectorProps {
  selectedDevice: DeviceSpec;
  onDeviceSelect: (device: DeviceSpec) => void;
}

export const DeviceSelector = memo(({ selectedDevice, onDeviceSelect }: DeviceSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<DevicePlatform | 'all'>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter devices based on platform selection
  const filteredDevices = defaultDevices.filter(device => 
    filter === 'all' || device.platform === filter
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-bolt-elements-item-backgroundActive"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={selectedDevice.platform === 'ios' ? 'i-ph:device-mobile-camera' : 'i-ph:device-mobile-speaker'} />
        <span>{selectedDevice.name}</span>
        <div className="i-ph:caret-down text-bolt-elements-textSecondary" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-lg shadow-lg min-w-[240px] py-1 z-10">
          {/* Platform Filter */}
          <div className="flex gap-1 px-2 pb-2 border-b border-bolt-elements-borderColor">
            <button
              className={`px-2 py-1 text-xs rounded ${
                filter === 'all' ? 'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent' : 'hover:bg-bolt-elements-item-backgroundActive'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-2 py-1 text-xs rounded ${
                filter === 'ios' ? 'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent' : 'hover:bg-bolt-elements-item-backgroundActive'
              }`}
              onClick={() => setFilter('ios')}
            >
              iOS
            </button>
            <button
              className={`px-2 py-1 text-xs rounded ${
                filter === 'android' ? 'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent' : 'hover:bg-bolt-elements-item-backgroundActive'
              }`}
              onClick={() => setFilter('android')}
            >
              Android
            </button>
          </div>

          {/* Device List */}
          <div className="max-h-[300px] overflow-y-auto">
            {filteredDevices.map((device) => (
              <button
                key={`${device.platform}-${device.name}`}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-bolt-elements-item-backgroundActive"
                onClick={() => {
                  onDeviceSelect(device);
                  setIsOpen(false);
                }}
              >
                <div className={device.platform === 'ios' ? 'i-ph:device-mobile-camera' : 'i-ph:device-mobile-speaker'} />
                <div className="flex flex-col items-start">
                  <span>{device.name}</span>
                  <span className="text-xs text-bolt-elements-textTertiary">
                    {device.width}×{device.height} • {device.devicePixelRatio}x
                  </span>
                </div>
                {device.name === selectedDevice.name && (
                  <div className="i-ph:check ml-auto text-bolt-elements-textAccent" />
                )}
              </button>
            ))}
          </div>

          {/* Custom Device Option */}
          <div className="border-t border-bolt-elements-borderColor mt-1">
            <button
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-textSecondary"
              onClick={() => {
                // TODO: Implement custom device dialog
                setIsOpen(false);
              }}
            >
              <div className="i-ph:plus-circle" />
              <span>Add Custom Device...</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default DeviceSelector;
