import React from 'react';
import { Navigator } from './src/Navigator';
import { NavigationContainer } from '@react-navigation/native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from './src/utils/theme';

const queryClient = new QueryClient();

function App() {
  const colorScheme = useColorScheme();

  console.log('*** colorScheme', colorScheme);

  const paperTheme =
    colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: darkTheme.colors }
      : { ...MD3LightTheme, colors: lightTheme.colors };

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}

export default App;
