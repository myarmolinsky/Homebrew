import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContent } from './src/components/AppContent';
import { runStartupChecks } from './src/startup/runStartupChecks';
import { Loading } from './src/components/Loading';
import { Error as ErrorComponent } from './src/components/Error';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>(
    'loading',
  );

  React.useEffect(() => {
    async function init() {
      const result = await runStartupChecks();

      if (result === 'ok') {
        setStatus('ready');
      } else {
        setStatus('error');
      }
    }

    init();
  }, []);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return <ErrorComponent />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

export default App;
