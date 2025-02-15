// app/components/workbench/mobile/MobilePreview.tsx

import { useStore } from '@nanostores/react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { workbenchStore } from '~/lib/stores/workbench';

export type DevicePlatform = 'ios' | 'android';
export type DeviceOrientation = 'portrait' | 'landscape';

interface DeviceSpec {
  name: string;
  width: number;
  height: number;
  platform: DevicePlatform;
  devicePixelRatio: number;
}

const defaultDevices: DeviceSpec[] = [
  {
    name: 'iPhone 14',
    width: 390,
    height: 844,
    platform: 'ios',
    devicePixelRatio: 3
  },
  {
    name: 'Pixel 7',
    width: 412,
    height: 915,
    platform: 'android',
    devicePixelRatio: 2.625
  }
];

export const MobilePreview = memo(() => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previews = useStore(workbenchStore.previews);
  const [selectedDevice, setSelectedDevice] = useState<DeviceSpec>(defaultDevices[0]);
  const [orientation, setOrientation] = useState<DeviceOrientation>('portrait');
  const [scale, setScale] = useState(0.75);
  
  const activePreview = previews[0]; // Using first preview for now
  const [url, setUrl] = useState(activePreview?.baseUrl ?? '');

  useEffect(() => {
    if (activePreview) {
      setUrl(activePreview.baseUrl);
    }
  }, [activePreview]);

  const rotateDevice = useCallback(() => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  }, []);

  const reloadPreview = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  }, []);

  const deviceWidth = orientation === 'portrait' ? selectedDevice.width : selectedDevice.height;
  const deviceHeight = orientation === 'portrait' ? selectedDevice.height : selectedDevice.width;

  const containerStyle = {
    width: `${deviceWidth * scale}px`,
    height: `${deviceHeight * scale}px`
  };

  const frameStyle = {
    width: `${deviceWidth}px`,
    height: `${deviceHeight}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'top left'
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-bolt-elements-background-depth-2 p-2 flex items-center gap-1.5">
        <IconButton 
          icon="i-ph:arrow-clockwise" 
          onClick={reloadPreview} 
        />
        <button
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-bolt-elements-item-backgroundActive"
          onClick={() => {
            const nextDevice = selectedDevice.platform === 'ios' ? defaultDevices[1] : defaultDevices[0];
            setSelectedDevice(nextDevice);
          }}
        >
          <div className={selectedDevice.platform === 'ios' ? 'i-ph:device-mobile-camera' : 'i-ph:device-mobile-speaker'} />
          <span>{selectedDevice.name}</span>
        </button>
        <IconButton
          icon={orientation === 'portrait' ? 'i-ph:device-mobile' : 'i-ph:device-mobile-horizontal'}
          onClick={rotateDevice}
        />
        <div className="flex items-center ml-4 gap-2">
          <span className="text-sm text-bolt-elements-textSecondary">Scale</span>
          <input
            type="range"
            min="0.25"
            max="1"
            step="0.05"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-bolt-elements-textSecondary">
            {Math.round(scale * 100)}%
          </span>
        </div>
      </div>
      
      <div className="flex-1 border-t border-bolt-elements-borderColor overflow-auto p-4">
        <div className="flex items-center justify-center min-h-full">
          <div 
            className={`relative bg-white rounded-[3rem] border-8 ${
              selectedDevice.platform === 'ios' ? 'border-gray-400' : 'border-gray-700'
            }`}
            style={containerStyle}
          >
            {/* Device Frame */}
            <div className="absolute inset-0 overflow-hidden">
              {url ? (
                <iframe
                  ref={iframeRef}
                  style={frameStyle}
                  src={url}
                  className="border-none bg-white"
                />
              ) : (
                <div className="flex w-full h-full justify-center items-center bg-white">
                  No preview available
                </div>
              )}
            </div>
            
            {/* Device UI Elements */}
            {selectedDevice.platform === 'ios' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-400 rounded-b-2xl" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default MobilePreview;
