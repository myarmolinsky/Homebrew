import React from 'react';
import { Navigator } from './src/Navigator';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={{ colors: { onSurface: 'white' } }}>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}

export default App;
