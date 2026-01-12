// app/lib/runtime/mobile-action-runner.ts

import type { WebContainer } from '@webcontainer/api';
import type { MobilePlatform, MobileActionType } from './mobile-message-parser';

export interface DeviceInfo {
  id: string;
  name: string;
  platform: MobilePlatform;
  state: 'booting' | 'ready' | 'running' | 'shutdown';
  type: 'simulator' | 'emulator' | 'physical';
}

export interface BuildConfig {
  platform: MobilePlatform;
  mode: 'development' | 'production';
  scheme?: string;
  configuration?: string;
  targetDevice?: string;
}

export interface MobileActionData {
  actionType: MobileActionType;
  platform?: MobilePlatform;
  target?: string;
  options?: Record<string, any>;
}

type ActionState = 'pending' | 'running' | 'complete' | 'failed' | 'aborted';

class MobileActionRunner {
  private webcontainer: WebContainer;
  private activeDevices: Map<string, DeviceInfo> = new Map();
  private currentBuild: BuildConfig | null = null;
  private actionStates: Map<string, ActionState> = new Map();

  constructor(webcontainer: WebContainer) {
    this.webcontainer = webcontainer;
  }

  /**
   * Process a mobile action
   */
  async runAction(action: MobileActionData): Promise<void> {
    const actionId = `mobile-${Date.now()}`;
    this.actionStates.set(actionId, 'pending');

    try {
      this.actionStates.set(actionId, 'running');

      switch (action.actionType) {
        case 'build':
          await this.handleBuildAction(action);
          break;
        case 'run':
          await this.handleRunAction(action);
          break;
        case 'debug':
          await this.handleDebugAction(action);
          break;
        case 'asset':
          await this.handleAssetAction(action);
          break;
        case 'config':
          await this.handleConfigAction(action);
          break;
      }

      this.actionStates.set(actionId, 'complete');
    } catch (error) {
      this.actionStates.set(actionId, 'failed');
      throw error;
    }
  }

  /**
   * Handle build process for iOS/Android
   */
  private async handleBuildAction(action: MobileActionData): Promise<void> {
    const { platform, options = {} } = action;
    
    this.currentBuild = {
      platform,
      mode: options.mode || 'development',
      scheme: options.scheme,
      configuration: options.configuration
    };

    // Ensure environment is ready
    await this.prepareEnvironment(platform);

    // Execute platform-specific build
    if (platform === 'ios' || platform === 'both') {
      await this.buildIOS(this.currentBuild);
    }
    
    if (platform === 'android' || platform === 'both') {
      await this.buildAndroid(this.currentBuild);
    }
  }

  /**
   * Handle running on device/simulator
   */
  private async handleRunAction(action: MobileActionData): Promise<void> {
    const { platform, options = {} } = action;
    
    // Get or start device
    const device = await this.getTargetDevice(platform, options.device);
    
    if (!device) {
      throw new Error(`No suitable ${platform} device found`);
    }

    // Ensure device is ready
    if (device.state !== 'ready' && device.state !== 'running') {
      await this.bootDevice(device);
    }

    // Install and launch
    await this.deployToDevice(device);
  }

  /**
   * Handle debug mode setup
   */
  private async handleDebugAction(action: MobileActionData): Promise<void> {
    const { platform } = action;

    // Start dev server with debugging enabled
    await this.webcontainer.spawn('expo', ['start', '--dev-client']);

    // Setup platform-specific debugging
    if (platform === 'ios' || platform === 'both') {
      await this.setupIOSDebugging();
    }
    
    if (platform === 'android' || platform === 'both') {
      await this.setupAndroidDebugging();
    }
  }

  /**
   * Handle asset generation and linking
   */
  private async handleAssetAction(action: MobileActionData): Promise<void> {
    const { platform } = action;

    // Link assets for platform
    if (platform === 'ios' || platform === 'both') {
      await this.linkIOSAssets();
    }
    
    if (platform === 'android' || platform === 'both') {
      await this.linkAndroidAssets();
    }
  }

  /**
   * Handle platform configuration
   */
  private async handleConfigAction(action: MobileActionData): Promise<void> {
    const { platform } = action;

    if (platform === 'ios' || platform === 'both') {
      await this.webcontainer.spawn('pod', ['install'], { cwd: './ios' });
    }
    
    if (platform === 'android' || platform === 'both') {
      await this.webcontainer.spawn('./gradlew', ['clean'], { cwd: './android' });
    }
  }

  // Helper methods for device management
  
  private async getTargetDevice(platform: MobilePlatform, deviceName?: string): Promise<DeviceInfo | null> {
    // First check if requested device exists
    if (deviceName) {
      const device = Array.from(this.activeDevices.values())
        .find(d => d.name === deviceName && d.platform === platform);
      if (device) return device;
    }

    // Otherwise get default device for platform
    const defaultDevice = Array.from(this.activeDevices.values())
      .find(d => d.platform === platform && d.type === 'simulator');
    
    if (defaultDevice) return defaultDevice;

    // Create new simulator if none exists
    return this.createSimulator(platform);
  }

  private async bootDevice(device: DeviceInfo): Promise<void> {
    device.state = 'booting';
    
    if (device.platform === 'ios') {
      await this.webcontainer.spawn('xcrun', ['simctl', 'boot', device.id]);
    } else {
      await this.webcontainer.spawn('emulator', ['-avd', device.id]);
    }

    device.state = 'ready';
  }

  private async createSimulator(platform: MobilePlatform): Promise<DeviceInfo> {
    if (platform === 'ios') {
      // Create iOS simulator
      const result = await this.webcontainer.spawn('xcrun', ['simctl', 'create', 'iPhone 14', 'iPhone 14']);
      const deviceId = result.output.trim();
      
      const device: DeviceInfo = {
        id: deviceId,
        name: 'iPhone 14',
        platform: 'ios',
        state: 'shutdown',
        type: 'simulator'
      };

      this.activeDevices.set(deviceId, device);
      return device;
    } else {
      // Create Android emulator
      const result = await this.webcontainer.spawn('avdmanager', ['create', 'avd', '-n', 'Pixel_7', '-k', 'system-images;android-31;google_apis;x86_64']);
      const deviceId = 'Pixel_7';
      
      const device: DeviceInfo = {
        id: deviceId,
        name: 'Pixel 7',
        platform: 'android',
        state: 'shutdown',
        type: 'emulator'
      };

      this.activeDevices.set(deviceId, device);
      return device;
    }
  }

  // Platform-specific build methods

  private async buildIOS(config: BuildConfig): Promise<void> {
    const buildArgs = ['build:ios'];
    
    if (config.mode === 'production') {
      buildArgs.push('--release');
    }
    
    if (config.scheme) {
      buildArgs.push('--scheme', config.scheme);
    }

    await this.webcontainer.spawn('expo', buildArgs);
  }

  private async buildAndroid(config: BuildConfig): Promise<void> {
    const buildArgs = ['build:android'];
    
    if (config.mode === 'production') {
      buildArgs.push('--release');
    }

    await this.webcontainer.spawn('expo', buildArgs);
  }

  // Debug setup methods

  private async setupIOSDebugging(): Promise<void> {
    // Setup iOS debugging
    await this.webcontainer.spawn('defaults', ['write', 'com.apple.CoreSimulator.IndigoFramebufferServices', 'RetinaSupport', '-bool', 'YES']);
  }

  private async setupAndroidDebugging(): Promise<void> {
    // Setup Android debugging
    await this.webcontainer.spawn('adb', ['reverse', 'tcp:8081', 'tcp:8081']);
  }

  // Asset management methods

  private async linkIOSAssets(): Promise<void> {
    await this.webcontainer.spawn('npx', ['react-native-asset', '-p', 'ios']);
  }

  private async linkAndroidAssets(): Promise<void> {
    await this.webcontainer.spawn('npx', ['react-native-asset', '-p', 'android']);
  }

  // Environment preparation

  private async prepareEnvironment(platform: MobilePlatform): Promise<void> {
    // Ensure required tools are available
    if (platform === 'ios' || platform === 'both') {
      await this.ensureIOSTools();
    }
    
    if (platform === 'android' || platform === 'both') {
      await this.ensureAndroidTools();
    }
  }

  private async ensureIOSTools(): Promise<void> {
    // Check for required iOS development tools
    try {
      await this.webcontainer.spawn('xcodebuild', ['-version']);
    } catch {
      throw new Error('Xcode tools not available');
    }
  }

  private async ensureAndroidTools(): Promise<void> {
    // Check for required Android development tools
    try {
      await this.webcontainer.spawn('adb', ['version']);
    } catch {
      throw new Error('Android tools not available');
    }
  }
}

export default MobileActionRunner;
