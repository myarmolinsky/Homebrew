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
  subPath: string,
  fileName: string,
  content: string,
) => {
  const baseFolder = await getBaseFolder();
  return StorageModule.writeFile(baseFolder, subPath, fileName, content);
};

export const readFile = async (subPath: string, fileName: string) => {
  const baseFolder = await getBaseFolder();
  return StorageModule.readFile(baseFolder, subPath, fileName);
};

export const createFolder = async (subPath: string, name: string) => {
  const baseFolder = await getBaseFolder();
  StorageModule.createFolder(baseFolder, subPath, name);
};

export const listFiles = async (
  subPath: string = '',
): Promise<{ name: string; uri: string; isDirectory: boolean }[]> => {
  const baseFolder = await getBaseFolder();
  return StorageModule.listFiles(baseFolder, subPath);
};

export const deleteItem = async (subPath: string, name: string) => {
  const baseFolder = await getBaseFolder();
  return StorageModule.delete(baseFolder, subPath, name);
};
