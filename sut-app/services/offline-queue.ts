import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'milkway.offline.queue.v1';

export type OfflineActionType = 'create_route' | 'assign_driver' | 'open_acceptance';

export type OfflineAction = {
  id: string;
  type: OfflineActionType;
  payload: Record<string, string>;
  createdAt: string;
};

export async function getQueue(): Promise<OfflineAction[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as OfflineAction[];
  } catch {
    return [];
  }
}

async function saveQueue(queue: OfflineAction[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export async function enqueueAction(action: Omit<OfflineAction, 'id' | 'createdAt'>): Promise<void> {
  const queue = await getQueue();
  const entry: OfflineAction = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...action,
  };

  queue.push(entry);
  await saveQueue(queue);
}

export async function clearQueue(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
