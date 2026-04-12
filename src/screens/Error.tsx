import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Error = ({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) => {
  return (
    <SafeAreaView>
      <Text>Something went wrong</Text>
      <Text>{message ?? 'An unexpected error occurred.'}</Text>

      {onRetry && (
        <TouchableOpacity onPress={onRetry}>
          <Text>Try Again</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
