// Chrome storage wrapper for extension state

export interface StorageData {
  address?: string;
  userData?: {
    level: number;
    totalXP: number;
    xpToNextLevel: number;
    streak: number;
  };
  trackingEnabled?: boolean;
  lastSync?: string;
}

export const storage = {
  async get<K extends keyof StorageData>(keys: K[]): Promise<Pick<StorageData, K>> {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, (result) => {
        resolve(result as Pick<StorageData, K>);
      });
    });
  },

  async set(data: Partial<StorageData>): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(data, resolve);
    });
  },

  async remove(keys: (keyof StorageData)[]): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove(keys, resolve);
    });
  },

  async clear(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.clear(resolve);
    });
  },
};

export default storage;
