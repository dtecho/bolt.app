// app/lib/stores/mobile.ts

import { atom, map } from 'nanostores';
import type { MobilePlatform } from '../runtime/mobile-message-parser';
import type { DeviceInfo, BuildConfig } from '../runtime/mobile-action-runner';

// Types that model how I think about mobile development
interface PlatformContext {
  activePlatform: MobilePlatform;
  iosConfig: {
    version: string;
    deploymentTarget: string;
    capabilities: string[];
  };
  androidConfig: {
    minSdkVersion: number;
    targetSdkVersion: number;
    permissions: string[];
  };
}

interface DevelopmentContext {
  currentTask: 'building' | 'running' | 'debugging' | 'idle';
  targetDevice?: DeviceInfo;
  buildConfig?: BuildConfig;
  lastAction?: {
    type: string;
    timestamp: number;
    result: 'success' | 'failure';
  };
}

interface ProjectContext {
  dependencies: {
    name: string;
    version: string;
    platform: MobilePlatform;
  }[];
  assets: {
    type: 'image' | 'font' | 'other';
    path: string;
    platforms: MobilePlatform[];
  }[];
  nativeModules: {
    name: string;
    status: 'linked' | 'unlinked';
    platforms: MobilePlatform[];
  }[];
}

// Store implementation
export class MobileStore {
  // Platform state
  platform = atom<PlatformContext>({
    activePlatform: 'both',
    iosConfig: {
      version: '16.0',
      deploymentTarget: '13.0',
      capabilities: []
    },
    androidConfig: {
      minSdkVersion: 21,
      targetSdkVersion: 33,
      permissions: []
    }
  });

  // Development state
  development = atom<DevelopmentContext>({
    currentTask: 'idle'
  });

  // Project state
  project = map<ProjectContext>({
    dependencies: [],
    assets: [],
    nativeModules: []
  });

  // Device Management
  devices = map<Record<string, DeviceInfo>>({});

  // High-level actions that match how I think about tasks
  async switchPlatform(platform: MobilePlatform) {
    this.platform.set({
      ...this.platform.get(),
      activePlatform: platform
    });
  }

  async addDependency(name: string, version: string, platform: MobilePlatform) {
    const currentProject = this.project.get();
    this.project.setKey('dependencies', [
      ...currentProject.dependencies,
      { name, version, platform }
    ]);
  }

  async registerDevice(device: DeviceInfo) {
    this.devices.set({
      ...this.devices.get(),
      [device.id]: device
    });
  }

  async updateDeviceState(deviceId: string, state: DeviceInfo['state']) {
    const device = this.devices.get()[deviceId];
    if (device) {
      this.devices.setKey(deviceId, {
        ...device,
        state
      });
    }
  }

  async startDevelopmentTask(
    task: DevelopmentContext['currentTask'],
    config?: BuildConfig,
    device?: DeviceInfo
  ) {
    this.development.set({
      currentTask: task,
      targetDevice: device,
      buildConfig: config
    });
  }

  async completeDevelopmentTask(success: boolean) {
    const current = this.development.get();
    this.development.set({
      ...current,
      currentTask: 'idle',
      lastAction: {
        type: current.currentTask,
        timestamp: Date.now(),
        result: success ? 'success' : 'failure'
      }
    });
  }

  // Convenience methods for common tasks
  async addIOSCapability(capability: string) {
    const current = this.platform.get();
    this.platform.set({
      ...current,
      iosConfig: {
        ...current.iosConfig,
        capabilities: [...current.iosConfig.capabilities, capability]
      }
    });
  }

  async addAndroidPermission(permission: string) {
    const current = this.platform.get();
    this.platform.set({
      ...current,
      androidConfig: {
        ...current.androidConfig,
        permissions: [...current.androidConfig.permissions, permission]
      }
    });
  }

  async trackAsset(path: string, type: 'image' | 'font' | 'other', platforms: MobilePlatform[]) {
    const current = this.project.get();
    this.project.setKey('assets', [
      ...current.assets,
      { path, type, platforms }
    ]);
  }

  async linkNativeModule(name: string, platforms: MobilePlatform[]) {
    const current = this.project.get();
    this.project.setKey('nativeModules', [
      ...current.nativeModules,
      { name, status: 'linked', platforms }
    ]);
  }

  // Status checks that help me understand the current state
  getPlatformSupport(item: { platforms: MobilePlatform[] }) {
    const current = this.platform.get().activePlatform;
    if (current === 'both') return true;
    return item.platforms.includes(current);
  }

  getActiveDevices(platform?: MobilePlatform) {
    return Object.values(this.devices.get())
      .filter(d => !platform || d.platform === platform)
      .filter(d => d.state === 'ready' || d.state === 'running');
  }

  getDependenciesForPlatform(platform: MobilePlatform) {
    return this.project.get().dependencies
      .filter(d => d.platform === platform || d.platform === 'both');
  }
}

export const mobileStore = new MobileStore();
