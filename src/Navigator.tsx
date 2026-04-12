import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CharacterList } from './screens/CharacterList';
import { ClassList } from './screens/ClassList';
import { Home } from './screens/Home';

const Stack = createNativeStackNavigator();

export const Navigator = () => (
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
  </Stack.Navigator>
);
