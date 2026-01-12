// app/components/workbench/mobile/MobileEditorToolbar.tsx

import { useStore } from '@nanostores/react';
import { memo, useState, useCallback } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { workbenchStore } from '~/lib/stores/workbench';

interface SnippetGroup {
  name: string;
  icon: string;
  items: Snippet[];
}

interface Snippet {
  name: string;
  description: string;
  code: string;
  platform?: 'ios' | 'android' | 'both';
  tags?: string[];
}

const mobileSnippets: SnippetGroup[] = [
  {
    name: 'Components',
    icon: 'i-ph:squares-four',
    items: [
      {
        name: 'Screen Component',
        description: 'Basic screen with SafeAreaView',
        code: `import { SafeAreaView, StyleSheet, View } from 'react-native';

export const ScreenName = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Screen content */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});`
      },
      {
        name: 'List Component',
        description: 'FlatList with refresh and loading',
        code: `import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';

export const ListComponent = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Fetch data
    setRefreshing(false);
  }, []);

  const onEndReached = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    // Load more data
    setLoading(false);
  }, []);

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        // Render item
      )}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator /> : null}
    />
  );
};`
      }
    ]
  },
  {
    name: 'Navigation',
    icon: 'i-ph:navigation',
    items: [
      {
        name: 'Stack Navigator',
        description: 'Basic stack navigation setup',
        code: `import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};`
      }
    ]
  },
  {
    name: 'Hooks',
    icon: 'i-ph:hook',
    items: [
      {
        name: 'useDevice',
        description: 'Device info and platform checks',
        code: `import { Platform, Dimensions, StatusBar } from 'react-native';

export const useDevice = () => {
  const window = Dimensions.get('window');
  const screen = Dimensions.get('screen');

  return {
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    window,
    screen,
    statusBarHeight: StatusBar.currentHeight || 0,
    hasNotch: Platform.OS === 'ios' && window.height >= 812,
  };
};`
      }
    ]
  },
  {
    name: 'Styles',
    icon: 'i-ph:paint-brush',
    items: [
      {
        name: 'Shadow Styles',
        description: 'Cross-platform shadow styles',
        code: `import { Platform, StyleSheet } from 'react-native';

export const shadowStyles = StyleSheet.create({
  default: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});`
      }
    ]
  }
];

export const MobileEditorToolbar = memo(() => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const currentDocument = useStore(workbenchStore.currentDocument);

  const insertCode = useCallback((code: string) => {
    if (!currentDocument) return;
    
    // TODO: Implement code insertion through editor
    console.log('Insert code:', code);
  }, [currentDocument]);

  return (
    <div className="flex items-center gap-2 p-2 bg-bolt-elements-background-depth-1 border-b border-bolt-elements-borderColor">
      {mobileSnippets.map((group) => (
        <div key={group.name} className="relative">
          <IconButton
            icon={group.icon}
            title={group.name}
            onClick={() => setActiveGroup(activeGroup === group.name ? null : group.name)}
            className={activeGroup === group.name ? 'bg-bolt-elements-item-backgroundActive' : ''}
          />
          
          {/* Snippet Dropdown */}
          {activeGroup === group.name && (
            <div className="absolute top-full mt-2 left-0 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-lg shadow-lg min-w-[300px] py-1 z-10">
              <div className="px-3 py-1.5 text-sm font-medium border-b border-bolt-elements-borderColor">
                {group.name}
              </div>
              {group.items.map((item) => (
                <button
                  key={item.name}
                  className="flex flex-col w-full px-3 py-2 text-sm hover:bg-bolt-elements-item-backgroundActive"
                  onClick={() => insertCode(item.code)}
                >
                  <span>{item.name}</span>
                  <span className="text-xs text-bolt-elements-textTertiary">
                    {item.description}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
      
      <div className="h-4 w-px bg-bolt-elements-borderColor mx-2" />
      
      {/* Platform-specific tools */}
      <IconButton
        icon="i-ph:device-mobile"
        title="iOS Specific"
        onClick={() => {/* TODO */}}
      />
      <IconButton
        icon="i-ph:android-logo"
        title="Android Specific"
        onClick={() => {/* TODO */}}
      />
    </div>
  );
});

export default MobileEditorToolbar;
