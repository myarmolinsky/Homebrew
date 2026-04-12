import React from 'react';
import { baseFolders } from '../utils/common';
import { ParentList } from '../components/ParentList';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export const Home = () => {
  return (
    <ParentList
      parents={baseFolders}
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
          <props.icon size={18} color="white" />
          <Text style={{ color: 'white', fontSize: 18 }}>{props.name}</Text>
        </View>
      )}
    />
  );
};
