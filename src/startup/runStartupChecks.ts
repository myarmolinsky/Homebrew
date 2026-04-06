import { PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';

// Root of shared storage (e.g., /storage/emulated/0)
const ROOT = RNFS.ExternalStorageDirectoryPath;
const HOMEBREW_PATH = `${ROOT}/Homebrew`;

// The top-level folders we want to always ensure exist
const TOP_LEVEL_FOLDERS = [
  'Characters',
  'Classes',
  'Species',
  'Spells',
  'Items',
  'Backgrounds',
];

const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message:
          'This app stores your characters and homebrew content in shared storage.',
        buttonPositive: 'OK',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    return false;
  }
};

const ensureHomebrewFolder = async () => {
  try {
    const exists = await RNFS.exists(HOMEBREW_PATH);

    if (!exists) {
      await RNFS.mkdir(HOMEBREW_PATH);
    }

    return true;
  } catch (err) {
    return false;
  }
};

const ensureTopLevelFolders = async () => {
  try {
    for (const folder of TOP_LEVEL_FOLDERS) {
      const path = `${HOMEBREW_PATH}/${folder}`;
      const exists = await RNFS.exists(path);

      if (!exists) {
        await RNFS.mkdir(path);
      }
    }

    return true;
  } catch (err) {
    return false;
  }
};

export const runStartupChecks = async () => {
  // 1. Request permission
  const hasPermission = await requestStoragePermission();
  if (!hasPermission) {
    return 'permission_denied';
  }

  // 2. Ensure Homebrew folder exists
  const homebrewOk = await ensureHomebrewFolder();
  if (!homebrewOk) {
    return 'error_creating_folders';
  }

  // 3. Ensure top-level folders exist
  const topLevelOk = await ensureTopLevelFolders();
  if (!topLevelOk) {
    return 'error_creating_folders';
  }

  // 4. All good
  return 'ok';
};
