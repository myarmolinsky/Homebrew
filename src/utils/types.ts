import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: {};
  Characters: {};
  Classes: {};
};

export type RouteProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
