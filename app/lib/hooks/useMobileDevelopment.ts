// app/lib/hooks/useMobileDevelopment.ts

import { useStore } from '@nanostores/react';
import { useCallback, useEffect, useMemo } from 'react';
import { mobileStore } from '../stores/mobile';
import type { MobilePlatform } from '../runtime/mobile-message-parser';
import type { DeviceInfo, BuildConfig } from '../runtime/mobile-action-runner';

export function useMobilePlatform() {
  const platform = useStore(mobileStore.platform);
  
  const setPlatform = useCallback((newPlatform: MobilePlatform) => {
    mobileStore.switchPlatform(newPlatform);
  }, []);

  const addCapability = useCallback((capability: string) => {
    mobileStore.addIOSCapability(capability);
  }, []);

  const addPermission = useCallback((permission: string) => {
    mobileStore.addAndroidPermission(permission);
  }, []);

  return {
    ...platform,
    setPlatform,
    addCapability,
    addPermission
  };
}

export function useMobileDevices() {
  const devices = useStore(mobileStore.devices);
  const platform = useStore(mobileStore.platform);

  const activeDevices = useMemo(() => 
    mobileStore.getActiveDevices(platform.activePlatform),
    [devices, platform.activePlatform]
  );

  const registerDevice = useCallback((device: DeviceInfo) => {
    mobileStore.registerDevice(device);
  }, []);

  const updateDeviceState = useCallback((deviceId: string, state: DeviceInfo['state']) => {
    mobileStore.updateDeviceState(deviceId, state);
  }, []);

  return {
    devices,
    activeDevices,
    registerDevice,
    updateDeviceState
  };
}

export function useMobileDevelopment() {
  const development = useStore(mobileStore.development);
  const platform = useStore(mobileStore.platform);

  const startTask = useCallback(async (
    task: 'building' | 'running' | 'debugging' | 'idle',
    config?: BuildConfig,
    device?: DeviceInfo
  ) => {
    await mobileStore.startDevelopmentTask(task, config, device);
  }, []);

  const completeTask = useCallback(async (success: boolean) => {
    await mobileStore.completeDevelopmentTask(success);
  }, []);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      if (development.currentTask !== 'idle') {
        mobileStore.completeDevelopmentTask(false);
      }
    };
  }, []);

  return {
    ...development,
    startTask,
    completeTask,
    targetPlatform: platform.activePlatform
  };
}

export function useMobileProject() {
  const project = useStore(mobileStore.project);
  const platform = useStore(mobileStore.platform);

  const addDependency = useCallback(async (
    name: string, 
    version: string, 
    targetPlatform: MobilePlatform = platform.activePlatform
  ) => {
    await mobileStore.addDependency(name, version, targetPlatform);
  }, [platform.activePlatform]);

  const trackAsset = useCallback(async (
    path: string,
    type: 'image' | 'font' | 'other',
    platforms: MobilePlatform[] = [platform.activePlatform]
  ) => {
    await mobileStore.trackAsset(path, type, platforms);
  }, [platform.activePlatform]);

  const linkNativeModule = useCallback(async (
    name: string,
    platforms: MobilePlatform[] = [platform.activePlatform]
  ) => {
    await mobileStore.linkNativeModule(name, platforms);
  }, [platform.activePlatform]);

  const platformDependencies = useMemo(() => 
    mobileStore.getDependenciesForPlatform(platform.activePlatform),
    [project.dependencies, platform.activePlatform]
  );

  const compatibleAssets = useMemo(() => 
    project.assets.filter(asset => 
      mobileStore.getPlatformSupport(asset)
    ),
    [project.assets, platform.activePlatform]
  );

  return {
    ...project,
    platformDependencies,
    compatibleAssets,
    addDependency,
    trackAsset,
    linkNativeModule
  };
}

// Higher-level hooks for common tasks

export function useMobilePreview() {
  const { activeDevices } = useMobileDevices();
  const { currentTask, startTask, completeTask } = useMobileDevelopment();
  const platform = useStore(mobileStore.platform);

  const runOnDevice = useCallback(async (device: DeviceInfo) => {
    await startTask('running', undefined, device);
    try {
      // Implementation for running on device
      await completeTask(true);
    } catch (error) {
      await completeTask(false);
      throw error;
    }
  }, []);

  return {
    activeDevices,
    currentTask,
    platform: platform.activePlatform,
    runOnDevice
  };
}

export function useMobileBuild() {
  const { currentTask, startTask, completeTask } = useMobileDevelopment();
  const platform = useStore(mobileStore.platform);

  const startBuild = useCallback(async (config: BuildConfig) => {
    await startTask('building', config);
    try {
      // Implementation for build process
      await completeTask(true);
    } catch (error) {
      await completeTask(false);
      throw error;
    }
  }, []);

  return {
    currentTask,
    platform: platform.activePlatform,
    startBuild
  };
}

export function useMobileDebug() {
  const { currentTask, startTask, completeTask } = useMobileDevelopment();
  const { activeDevices } = useMobileDevices();
  const platform = useStore(mobileStore.platform);

  const startDebugging = useCallback(async (device: DeviceInfo) => {
    await startTask('debugging', undefined, device);
    try {
      // Implementation for debug setup
      await completeTask(true);
    } catch (error) {
      await completeTask(false);
      throw error;
    }
  }, []);

  return {
    currentTask,
    platform: platform.activePlatform,
    activeDevices,
    startDebugging
  };
    }
