import React from 'react';
import { ParentList } from '../components/ParentList';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { Loading } from './Loading';
import { Error as ErrorScreen } from './Error';
import {
  createFolder,
  getBaseFolder,
  listFiles,
  setupFolder,
} from '../utils/fs';
import { Welcome } from './Welcome';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // for debugging
import {
  Book,
  BookUser,
  Shapes,
  Stone,
  Users,
  WandSparkles,
} from 'lucide-react-native';

const baseFolders = [
  {
    name: 'Characters',
    icon: Users,
  },
  {
    name: 'Classes',
    icon: Shapes,
  },
  {
    name: 'Spells',
    icon: WandSparkles,
  },
  {
    name: 'Items',
    icon: Stone,
  },
  {
    name: 'Backgrounds',
    icon: Book,
  },
  {
    name: 'Races',
    icon: BookUser,
  },
];

export const Home = () => {
  const theme = useTheme();

  const {
    data: ready,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['init'],
    queryFn: async () => {
      // await AsyncStorage.clear(); // for debugging
      const baseFolder = await getBaseFolder();

      if (!baseFolder) {
        return false;
      }

      const existingFiles = await listFiles();
      for (const folder of baseFolders) {
        if (
          !existingFiles.some((ef) => ef.name === folder.name && ef.isDirectory)
        ) {
          await createFolder(baseFolder, folder.name);
        }
      }

      return true;
    },
  });

  const handleSelectFolder = async () => {
    await setupFolder();
    await refetch();
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!ready) {
    return <Welcome onContinue={handleSelectFolder} />;
  }

  if (error) {
    return <ErrorScreen message={error.message} onRetry={refetch} />;
  }

  return (
    <ParentList
      parents={baseFolders}
      getScreen={(baseFolder) => baseFolder.name}
      renderContent={(props) => (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'row',
            gap: 8,
          }}
        >
          <props.icon color={theme.colors.onSurface} />
          <Text style={{ fontSize: 18 }}>{props.name}</Text>
        </View>
      )}
    />
  );
};
