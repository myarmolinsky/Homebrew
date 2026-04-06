import { ActivityIndicator, Text, View } from 'react-native';

export const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}
    >
      <ActivityIndicator size="large" />
      <Text>Loading…</Text>
    </View>
  );
};
