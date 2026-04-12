import { useNavigation } from '@react-navigation/native';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export const ParentList = <
  T extends {
    name: string;
  },
>({
  parents,
  getScreen,
  renderContent,
  onCreateNew,
}: {
  parents: Array<T>;
  getScreen: (parent: T) => string;
  renderContent: (props: T) => React.JSX.Element;
  onCreateNew?: () => void;
}) => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, gap: 8 }}>
      {onCreateNew && (
        <Button
          onPress={onCreateNew}
          mode="contained"
          buttonColor="teal"
          contentStyle={{ margin: 20 }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <Plus color={theme.colors.onSurface} />
            <Text style={{ fontSize: 18 }}>Create New</Text>
          </View>
        </Button>
      )}
      {parents.map((parent) => (
        <Button
          key={parent.name}
          onPress={() => {
            navigation.navigate(getScreen(parent) as never);
          }}
          mode="contained"
          buttonColor="teal"
          contentStyle={{ margin: 20 }}
        >
          {renderContent(parent)}
        </Button>
      ))}
    </View>
  );
};
