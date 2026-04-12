import { pickDirectory } from '@react-native-documents/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';

const { StorageModule } = NativeModules;

const KEY = 'APP_FOLDER_URI';

export const getBaseFolder = async () => {
  return AsyncStorage.getItem(KEY);
};

export const setupFolder = async () => {
  const res = await pickDirectory();

  if (!res?.uri) {
    throw new Error('No base folder selected');
  }

  await AsyncStorage.setItem(KEY, res.uri);

  return res.uri;
};

export const writeFile = async (
  parentUri: string,
  name: string,
  content: string,
) => {
  return StorageModule.writeFile(parentUri, name, content);
};

export const readFile = async (parentUri: string, name: string) => {
  return StorageModule.readFile(parentUri, name);
};

export const createFolder = async (parentUri: string, name: string) => {
  StorageModule.createFolder(parentUri, name);
};

export const listFiles = async (
  subpath: string = '',
): Promise<{ name: string; uri: string; isDirectory: boolean }[]> => {
  const baseFolder = await getBaseFolder();
  return StorageModule.listFiles(baseFolder, subpath);
};

export const deleteItem = async (uri: string) => {
  return StorageModule.delete(uri);
};
