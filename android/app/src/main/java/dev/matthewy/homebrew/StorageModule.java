package dev.matthewy.homebrew;

import android.net.Uri;
import android.content.Context;
import android.content.Intent;

import androidx.documentfile.provider.DocumentFile;

import com.facebook.react.bridge.*;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class StorageModule extends ReactContextBaseJavaModule {

    public StorageModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "StorageModule";
    }

    // ✅ Write file
    @ReactMethod
    public void writeFile(String folderUri, String fileName, String content, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            Uri treeUri = Uri.parse(folderUri);

            DocumentFile dir = DocumentFile.fromTreeUri(context, treeUri);
            if (dir == null || !dir.exists()) {
                promise.reject("ERR", "Directory not found");
                return;
            }

            DocumentFile file = dir.findFile(fileName);
            if (file == null) {
                file = dir.createFile("text/plain", fileName);
            }

            OutputStream os = context.getContentResolver().openOutputStream(file.getUri());
            os.write(content.getBytes());
            os.close();

            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERR_WRITE", e);
        }
    }

    // ✅ Read file
    @ReactMethod
    public void readFile(String folderUri, String fileName, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            Uri treeUri = Uri.parse(folderUri);

            DocumentFile dir = DocumentFile.fromTreeUri(context, treeUri);
            DocumentFile file = dir.findFile(fileName);

            if (file == null) {
                promise.reject("ERR", "File not found");
                return;
            }

            InputStream is = context.getContentResolver().openInputStream(file.getUri());
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));

            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            reader.close();
            promise.resolve(sb.toString());
        } catch (Exception e) {
            promise.reject("ERR_READ", e);
        }
    }

    @ReactMethod
    public void createFolder(String folderUri, String name, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            Uri treeUri = Uri.parse(folderUri);

            DocumentFile dir = DocumentFile.fromTreeUri(context, treeUri);

            if (dir == null || !dir.exists()) {
                promise.reject("ERR", "Directory not found");
                return;
            }

            DocumentFile newDir = dir.findFile(name);
            if (newDir == null) {
                newDir = dir.createDirectory(name);
            }

            promise.resolve(newDir != null);
        } catch (Exception e) {
            promise.reject("ERR_CREATE_DIR", e);
        }
    }

    @ReactMethod
    public void listFiles(String folderUri, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            Uri treeUri = Uri.parse(folderUri);

            DocumentFile dir = DocumentFile.fromTreeUri(context, treeUri);

            if (dir == null || !dir.exists()) {
                promise.reject("ERR", "Directory not found");
                return;
            }

            WritableArray result = Arguments.createArray();

            for (DocumentFile file : dir.listFiles()) {
                WritableMap item = Arguments.createMap();
                item.putString("name", file.getName());
                item.putString("uri", file.getUri().toString());
                item.putBoolean("isDirectory", file.isDirectory());
                result.pushMap(item);
            }

            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("ERR_LIST", e);
        }
    }

    @ReactMethod
    public void delete(String uriString, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            Uri uri = Uri.parse(uriString);

            DocumentFile file = DocumentFile.fromSingleUri(context, uri);

            if (file == null || !file.exists()) {
                promise.reject("ERR", "File not found");
                return;
            }

            boolean deleted = file.delete();
            promise.resolve(deleted);
        } catch (Exception e) {
            promise.reject("ERR_DELETE", e);
        }
    }
}