// app/components/workbench/mobile/DeviceSelector.tsx

import { memo, useRef, useState } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import type { DeviceSpec } from './MobilePreview';

interface DeviceSelectorProps {
  devices: DeviceSpec[];
  selectedDevice: DeviceSpec;
  onDeviceSelect: (device: DeviceSpec) => void;
}

export const DeviceSelector = memo(({ 
  devices, 
  selectedDevice, 
  onDeviceSelect 
}: DeviceSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const platformIcon = selectedDevice.platform === 'ios' 
    ? 'i-ph:device-mobile-camera' 
    : 'i-ph:device-mobile-speaker';

  return (
    <div ref={containerRef} className="relative">
      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-bolt-elements-item-backgroundActive"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={platformIcon} />
        <span>{selectedDevice.name}</span>
        <div className="i-ph:caret-down text-bolt-elements-textSecondary" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-lg shadow-lg min-w-[200px] py-1">
          {devices.map((device) => (
            <button
              key={device.name}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-bolt-elements-item-backgroundActive"
              onClick={() => {
                onDeviceSelect(device);
                setIsOpen(false);
              }}
            >
              <div className={device.platform === 'ios' ? 'i-ph:device-mobile-camera' : 'i-ph:device-mobile-speaker'} />
              <span>{device.name}</span>
              {device.name === selectedDevice.name && (
                <div className="i-ph:check ml-auto text-bolt-elements-textAccent" />
              )}
            </button>
          ))}
          
          <div className="border-t border-bolt-elements-borderColor my-1" />
          
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
      )}
    </div>
  );
});

export default DeviceSelector;
