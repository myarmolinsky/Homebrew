import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

export const ParentList = <
  T extends {
    name: string;
    screen: string;
  },
>({
  parents,
  renderContent,
}: {
  parents: Array<T>;
  renderContent: (props: T) => React.JSX.Element;
}) => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, gap: 8 }}>
      {parents.map(parent => (
        <Button
          key={parent.name}
          onPress={() => {
            navigation.navigate(parent.screen as never);
          }}
          style={{
            backgroundColor: 'teal',
            padding: 20,
          }}
        >
          {renderContent(parent)}
        </Button>
      ))}
    </View>
  );
};
