import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Welcome = ({ onContinue }: { onContinue: () => void }) => {
  return (
    <SafeAreaView>
      <Text style={{ color: 'black' }}>Welcome</Text>

      <Button onPress={onContinue} buttonColor="teal" textColor="white">
        Continue
      </Button>
    </SafeAreaView>
  );
};
