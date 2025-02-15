// app/lib/runtime/mobile-message-parser.ts

import { type ActionCallbackData, type ArtifactCallbackData } from './message-parser';

export type MobilePlatform = 'ios' | 'android' | 'both';
export type MobileActionType = 'build' | 'run' | 'debug' | 'asset' | 'config';

interface MobileActionData extends ActionCallbackData {
  platform: MobilePlatform;
  actionType: MobileActionType;
  options?: {
    device?: string;
    mode?: 'development' | 'production';
    scheme?: string;
    configuration?: string;
  };
}

interface MobileArtifactData extends ArtifactCallbackData {
  platform: MobilePlatform;
  artifactType: 'component' | 'screen' | 'navigation' | 'style' | 'config';
  dependencies?: string[];
}

export function parseMobileAction(content: string): MobileActionData | null {
  // Look for mobile-specific patterns
  const platformMatch = content.match(/platform:\s*(ios|android|both)/i);
  const actionMatch = content.match(/action:\s*(build|run|debug|asset|config)/i);
  
  if (!platformMatch || !actionMatch) return null;

  const platform = platformMatch[1].toLowerCase() as MobilePlatform;
  const actionType = actionMatch[1].toLowerCase() as MobileActionType;

  // Parse additional options
  const options: MobileActionData['options'] = {};
  
  const deviceMatch = content.match(/device:\s*"([^"]+)"/);
  if (deviceMatch) options.device = deviceMatch[1];

  const modeMatch = content.match(/mode:\s*(development|production)/i);
  if (modeMatch) options.mode = modeMatch[1].toLowerCase() as 'development' | 'production';

  const schemeMatch = content.match(/scheme:\s*"([^"]+)"/);
  if (schemeMatch) options.scheme = schemeMatch[1];

  return {
    type: 'shell',
    platform,
    actionType,
    options,
    content: generateMobileCommand(platform, actionType, options)
  };
}

export function parseMobileArtifact(content: string): MobileArtifactData | null {
  // Look for mobile artifact patterns
  const platformMatch = content.match(/platform:\s*(ios|android|both)/i);
  const typeMatch = content.match(/type:\s*(component|screen|navigation|style|config)/i);
  
  if (!platformMatch || !typeMatch) return null;

  const platform = platformMatch[1].toLowerCase() as MobilePlatform;
  const artifactType = typeMatch[1].toLowerCase() as MobileArtifactData['artifactType'];

  // Parse dependencies
  const dependencies: string[] = [];
  const depRegex = /dependencies:\s*\[(.*?)\]/;
  const depMatch = content.match(depRegex);
  
  if (depMatch) {
    dependencies.push(...depMatch[1].split(',').map(d => d.trim()));
  }

  return {
    id: generateArtifactId(),
    title: extractTitle(content) || `Mobile ${artifactType} for ${platform}`,
    platform,
    artifactType,
    dependencies
  };
}

function generateMobileCommand(
  platform: MobilePlatform, 
  actionType: MobileActionType,
  options: MobileActionData['options'] = {}
): string {
  switch (actionType) {
    case 'build':
      return platform === 'ios' 
        ? `expo build:ios ${options.mode === 'production' ? '--release' : ''}`
        : `expo build:android ${options.mode === 'production' ? '--release' : ''}`;
    
    case 'run':
      return platform === 'ios'
        ? `expo run:ios ${options.device ? `--device "${options.device}"` : ''}`
        : `expo run:android ${options.device ? `--device "${options.device}"` : ''}`;
    
    case 'debug':
      return 'expo start --dev-client';
    
    case 'asset':
      return 'npx react-native-asset';
    
    case 'config':
      return platform === 'ios'
        ? `cd ios && pod install && cd ..`
        : `cd android && ./gradlew clean && cd ..`;
      
    default:
      throw new Error(`Unknown mobile action type: ${actionType}`);
  }
}

function generateArtifactId(): string {
  return `mobile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function extractTitle(content: string): string | null {
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  return titleMatch ? titleMatch[1] : null;
}

// Example usage in message parser:
/*
export function parseMessage(message: string) {
  // Try mobile-specific parsing first
  const mobileAction = parseMobileAction(message);
  if (mobileAction) return mobileAction;

  const mobileArtifact = parseMobileArtifact(message);
  if (mobileArtifact) return mobileArtifact;

  // Fall back to existing parsing...
}
*/
