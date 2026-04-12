import { Plus } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Button } from './Button';

export const ParentList = <
  T extends {
    name: string;
  },
>({
  parents,
  navigate,
  renderContent,
  onCreateNew,
}: {
  parents: Array<T>;
  navigate: (parent: T) => void;
  renderContent: (props: T) => React.JSX.Element;
  onCreateNew?: () => void;
}) => {
  const theme = useTheme();

  return (
    <View style={{ gap: 8 }}>
      {onCreateNew && (
        <Button onPress={onCreateNew}>
          <Plus color={theme.colors.onSurface} />
          <Text style={{ fontSize: 18, color: theme.colors.onSurface }}>
            Create New
          </Text>
        </Button>
      )}
      {parents.map((parent) => (
        <Button
          key={parent.name}
          onPress={() => {
            navigate(parent);
          }}
        >
          {renderContent(parent)}
        </Button>
      ))}
    </View>
  );
};
