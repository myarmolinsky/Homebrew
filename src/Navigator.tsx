import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CharacterList } from './screens/CharacterList';
import { ClassList } from './screens/ClassList';
import { Home } from './screens/Home';
import { Character } from './screens/Character';
import { RootStackParamList } from './utils/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        contentStyle: { padding: 8 },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: 'Homebrew' }}
      />
      <Stack.Screen name="Characters" component={CharacterList} />
      <Stack.Screen name="Classes" component={ClassList} />
      <Stack.Screen name="Character" component={Character} />
    </Stack.Navigator>
  );
};
