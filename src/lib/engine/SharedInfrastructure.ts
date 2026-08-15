import { createBrowserStorageEngine } from "./BrowserStorageEngine";

let sharedStorageEngine: ReturnType<typeof createBrowserStorageEngine> | null = null;

export function getSharedStorageEngine() {
    if (!sharedStorageEngine) {
        sharedStorageEngine = createBrowserStorageEngine();
    }
    return sharedStorageEngine;
}
