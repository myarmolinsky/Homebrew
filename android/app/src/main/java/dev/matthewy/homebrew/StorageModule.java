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

    private DocumentFile resolvePath(DocumentFile root, String subPath) {
        if (subPath == null || subPath.isEmpty()) return root;

        String[] parts = subPath.split("/");
        DocumentFile current = root;

        for (String part : parts) {
            if (part.isEmpty()) continue;

            DocumentFile next = current.findFile(part);

            if (next == null || !next.isDirectory()) {
                return null;
            }

            current = next;
        }

        return current;
    }

    private DocumentFile ensurePathExists(DocumentFile baseDir, String subPath) {
        if (subPath == null || subPath.isEmpty()) return baseDir;

        String[] parts = subPath.split("/");
        DocumentFile current = baseDir;

        for (String part : parts) {
            if (part.isEmpty()) continue;

            DocumentFile next = current.findFile(part);

            if (next == null) {
                next = current.createDirectory(part);
            }

            if (next == null || !next.isDirectory()) {
                return null;
            }

            current = next;
        }

        return current;
    }

    private DocumentFile resolveFile(DocumentFile root, String subPath, String fileName) {
        DocumentFile dir = resolvePath(root, subPath);
        if (dir == null) return null;
        return dir.findFile(fileName);
    }

    private String getMimeType(String fileName) {
        if (fileName.endsWith(".json")) return "application/json";
        if (fileName.endsWith(".txt")) return "text/plain";
        if (fileName.endsWith(".md")) return "text/markdown";
        return "application/octet-stream";
    }

    @ReactMethod
    public void writeFile(String folderUri, String subPath, String fileName, String content, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            Uri treeUri = Uri.parse(folderUri);

            DocumentFile baseDir = DocumentFile.fromTreeUri(context, treeUri);

            if (baseDir == null || !baseDir.exists()) {
                promise.reject("ERR", "Base directory not found");
                return;
            }

            DocumentFile dir = ensurePathExists(baseDir, subPath);

            if (dir == null) {
                promise.reject("ERR", "Invalid directory path");
                return;
            }

            String mimeType = getMimeType(fileName);

            DocumentFile file = dir.findFile(fileName);

            if (file == null) {
                file = dir.createFile(mimeType, fileName);
            }

            OutputStream os = context.getContentResolver().openOutputStream(file.getUri());
            os.write(content.getBytes());
            os.close();

            promise.resolve(true);

        } catch (Exception e) {
            promise.reject("ERR_WRITE", e);
        }
    }

    @ReactMethod
    public void readFile(String folderUri, String subPath, String fileName, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            Uri treeUri = Uri.parse(folderUri);

            DocumentFile baseDir = DocumentFile.fromTreeUri(context, treeUri);

            if (baseDir == null || !baseDir.exists()) {
                promise.reject("ERR", "Base directory not found");
                return;
            }

            DocumentFile dir = ensurePathExists(baseDir, subPath);

            if (dir == null) {
                promise.reject("ERR", "Directory not found");
                return;
            }

            DocumentFile file = dir.findFile(fileName);

            if (file == null || !file.exists()) {
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
    public void createFolder(String folderUri, String subPath, String name, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            Uri treeUri = Uri.parse(folderUri);

            DocumentFile baseDir = DocumentFile.fromTreeUri(context, treeUri);

            if (baseDir == null || !baseDir.exists()) {
                promise.reject("ERR", "Base directory not found");
                return;
            }

            DocumentFile dir = ensurePathExists(baseDir, subPath);

            if (dir == null) {
                promise.reject("ERR", "Invalid path");
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

    private DocumentFile getDirectory(DocumentFile base, String path) {
        String[] parts = path.split("/");

        DocumentFile current = base;

        for (String part : parts) {
            if (part.isEmpty()) continue;

            DocumentFile next = current.findFile(part);
            if (next == null || !next.isDirectory()) {
                return null;
            }

            current = next;
        }

        return current;
    }

    @ReactMethod
    public void listFiles(String folderUri, String subPath, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            Uri treeUri = Uri.parse(folderUri);

            DocumentFile baseDir = DocumentFile.fromTreeUri(context, treeUri);

            if (baseDir == null || !baseDir.exists()) {
                promise.reject("ERR", "Base directory not found");
                return;
            }

            DocumentFile dir = ensurePathExists(baseDir, subPath);

            if (dir == null || !dir.exists() || !dir.isDirectory()) {
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
    public void delete(String folderUri, String subPath, String name, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            Uri treeUri = Uri.parse(folderUri);

            DocumentFile baseDir = DocumentFile.fromTreeUri(context, treeUri);

            if (baseDir == null || !baseDir.exists()) {
                promise.reject("ERR", "Base directory not found");
                return;
            }

            DocumentFile dir = ensurePathExists(baseDir, subPath);

            if (dir == null || !dir.exists()) {
                promise.reject("ERR", "Directory not found");
                return;
            }

            DocumentFile target = dir.findFile(name);

            if (target == null || !target.exists()) {
                promise.reject("ERR", "File or folder not found");
                return;
            }

            boolean deleted = target.delete();

            if (!deleted) {
                promise.reject("ERR_DELETE", "Failed to delete item");
                return;
            }

            promise.resolve(true);

        } catch (Exception e) {
            promise.reject("ERR_DELETE", e);
        }
    }
}