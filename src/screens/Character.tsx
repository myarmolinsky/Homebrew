import React from 'react';
import { View, Text } from 'react-native';
import { RouteProps } from '../utils/types';
import { useQuery } from '@tanstack/react-query';
import { readFile } from '../utils/fs';
import { Loading } from './Loading';
import { Error } from './Error';

export const Character = ({ route }: RouteProps<'Character'>) => {
  const { name } = route.params;

  const {
    data: character,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['character', name],
    queryFn: async () => {
      const file = await readFile(`Characters/${name}`, 'main.json');
      return JSON.parse(file) as { name: string };
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!character || error) {
    return <Error message={error?.message ?? 'Failed to load character'} />;
  }

  return (
    <View>
      <Text>Character: {character.name}</Text>
    </View>
  );
};
