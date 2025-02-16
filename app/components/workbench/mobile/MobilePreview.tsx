// app/components/workbench/mobile/MobilePreview.tsx

import { memo, useCallback, useRef } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { useMobilePreview, useMobileDevices, useMobilePlatform } from '~/lib/hooks/useMobileDevelopment';
import { DeviceSelector } from './DeviceSelector';
import type { DeviceSpec, DevicePlatform } from './types';

export const MobilePreview = memo(() => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const {
    platform: activePlatform,
    setPlatform
  } = useMobilePlatform();

  const {
    activeDevices,
    currentTask,
    runOnDevice
  } = useMobilePreview();

  const {
    updateDeviceState
  } = useMobileDevices();

  const selectedDevice = activeDevices[0]; // For now, using first active device

  const handleDeviceSelect = useCallback(async (device: DeviceSpec) => {
    try {
      await runOnDevice(device);
    } catch (error) {
      console.error('Failed to run on device:', error);
      updateDeviceState(device.id, 'failed');
    }
  }, [runOnDevice, updateDeviceState]);

  const rotateDevice = useCallback(() => {
    if (selectedDevice) {
      // Update device orientation in state
      updateDeviceState(selectedDevice.id, selectedDevice.state);
    }
  }, [selectedDevice, updateDeviceState]);

  const reloadPreview = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-bolt-elements-background-depth-2 p-2 flex items-center gap-1.5">
        {/* Platform Toggle */}
        <div className="flex rounded-lg bg-bolt-elements-background-depth-1 p-1">
          <IconButton
            icon="i-ph:device-mobile"
            title="iOS"
            onClick={() => setPlatform('ios')}
            className={activePlatform === 'ios' ? 'bg-bolt-elements-item-backgroundAccent' : ''}
          />
          <IconButton
            icon="i-ph:android-logo"
            title="Android"
            onClick={() => setPlatform('android')}
            className={activePlatform === 'android' ? 'bg-bolt-elements-item-backgroundAccent' : ''}
          />
        </div>

        {/* Device Selection */}
        <DeviceSelector
          devices={activeDevices}
          selectedDevice={selectedDevice}
          onDeviceSelect={handleDeviceSelect}
        />

        {/* Device Controls */}
        <IconButton
          icon="i-ph:arrow-clockwise"
          title="Reload Preview"
          onClick={reloadPreview}
          disabled={currentTask !== 'running'}
        />
        <IconButton
          icon={selectedDevice?.orientation === 'portrait' ? 'i-ph:device-mobile' : 'i-ph:device-mobile-horizontal'}
          title="Rotate Device"
          onClick={rotateDevice}
          disabled={!selectedDevice || currentTask !== 'running'}
        />

        {/* Build Status */}
        {currentTask !== 'idle' && (
          <div className="ml-auto flex items-center gap-2 text-sm text-bolt-elements-textSecondary">
            <div className="i-svg-spinners:90-ring-with-bg" />
            {currentTask === 'building' && 'Building...'}
            {currentTask === 'running' && 'Running on device...'}
            {currentTask === 'debugging' && 'Setting up debug...'}
          </div>
        )}
      </div>

      {/* Device Preview */}
      <div className="flex-1 border-t border-bolt-elements-borderColor overflow-auto p-4">
        <div className="flex items-center justify-center min-h-full">
          {selectedDevice ? (
            <div className={`relative bg-white rounded-[3rem] border-8 ${
              selectedDevice.platform === 'ios' ? 'border-gray-400' : 'border-gray-700'
            }`}>
              <div className="absolute inset-0 overflow-hidden">
                <iframe
                  ref={iframeRef}
                  src={selectedDevice.previewUrl}
                  className="border-none bg-white w-full h-full"
                />
              </div>
              
              {/* Device UI Elements */}
              {selectedDevice.platform === 'ios' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-400 rounded-b-2xl" />
              )}
            </div>
          ) : (
            <div className="text-bolt-elements-textSecondary">
              No device selected. Start a simulator or connect a device.
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default MobilePreview;
