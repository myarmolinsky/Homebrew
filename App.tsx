import React from 'react';
import { Loading } from './src/screens/Loading';
import { Error as ErrorScreen } from './src/screens/Error';
import {
  createFolder,
  getBaseFolder,
  listFiles,
  setupFolder,
} from './src/utils/fs';
import { Welcome } from './src/screens/Welcome';
import { Navigator } from './src/Navigator';
import { NavigationContainer } from '@react-navigation/native';
import { baseFolders } from './src/utils/common';
import { PaperProvider } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // for debugging

type Status = 'loading' | 'no_folder' | 'ready' | 'error';

function App() {
  const [status, setStatus] = React.useState<Status>('loading');
  const [errorMessage, setErrorMessage] = React.useState<string>();

  const init = React.useCallback(async () => {
    try {
      // await AsyncStorage.clear(); // for debugging
      const uri = await getBaseFolder();

      if (!uri) {
        setStatus('no_folder');
        return;
      }

      const existingFiles = await listFiles(uri);
      for (const folder of baseFolders) {
        if (
          !existingFiles.some((ef) => ef.name === folder.name && ef.isDirectory)
        ) {
          await createFolder(uri, folder.name);
        }
      }

      setStatus('ready');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setStatus('error');
    }
  }, []);

  React.useEffect(() => {
    if (status === 'loading') {
      init();
    }
  }, [status, init]);

  const handleSelectFolder = async () => {
    try {
      setStatus('loading');
      await setupFolder();
      setStatus('ready');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setStatus('error');
    }
  };

  const handleRetry = () => {
    setErrorMessage(undefined);
    setStatus('loading');
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'no_folder') {
    return <Welcome onContinue={handleSelectFolder} />;
  }

  if (status === 'error') {
    return <ErrorScreen message={errorMessage} onRetry={handleRetry} />;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
