import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Characters: undefined;
  Classes: undefined;
  Character: { name: string };
};

export type RouteProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type NavProp = NativeStackNavigationProp<RootStackParamList>;
