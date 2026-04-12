import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Welcome = ({ onContinue }: { onContinue?: () => void }) => {
  return (
    <SafeAreaView>
      <Text>Welcome</Text>

      {onContinue && (
        <TouchableOpacity onPress={onContinue}>
          <Text>Continue</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
