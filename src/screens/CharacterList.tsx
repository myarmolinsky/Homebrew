import React from 'react';
import { listFiles } from '../utils/fs';
import { useQuery } from '@tanstack/react-query';
import { ParentList } from '../components/ParentList';
import { Text } from 'react-native-paper';

export const CharacterList = () => {
  const { data: characters } = useQuery({
    queryKey: ['characters'],
    queryFn: async () => {
      return listFiles('Characters');
    },
  });

  return (
    <ParentList
      parents={characters ?? []}
      getScreen={() => 'Character'}
      renderContent={(character) => (
        <Text style={{ fontSize: 18 }}>{character.name}</Text>
      )}
      onCreateNew={() => {
        // TODO: implement character creation flow
      }}
    />
  );
};
