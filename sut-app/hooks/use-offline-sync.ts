import NetInfo from '@react-native-community/netinfo';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { clearQueue, getQueue, OfflineAction } from '@/services/offline-queue';

type SyncState = {
  isOnline: boolean;
  queueSize: number;
  lastSyncAt: string | null;
  syncError: string | null;
};

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? 'https://milkway-api.onrender.com';

export function useOfflineSync() {
  const [state, setState] = useState<SyncState>({
    isOnline: true,
    queueSize: 0,
    lastSyncAt: null,
    syncError: null,
  });

  const refreshQueueSize = useCallback(async () => {
    const queue = await getQueue();
    setState((prev) => ({ ...prev, queueSize: queue.length }));
  }, []);

  const syncQueue = useCallback(async () => {
    const queue = await getQueue();
    if (queue.length === 0) {
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/sync/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: queue }),
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
      }

      await clearQueue();
      setState((prev) => ({
        ...prev,
        queueSize: 0,
        syncError: null,
        lastSyncAt: new Date().toISOString(),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown sync error';
      setState((prev) => ({ ...prev, syncError: message }));
    }
  }, []);

  useEffect(() => {
    refreshQueueSize();

    const unsubscribe = NetInfo.addEventListener((netInfoState) => {
      const online = Boolean(netInfoState.isConnected && netInfoState.isInternetReachable !== false);
      setState((prev) => ({ ...prev, isOnline: online }));
      if (online) {
        void syncQueue();
      }
    });

    return unsubscribe;
  }, [refreshQueueSize, syncQueue]);

  return useMemo(
    () => ({
      ...state,
      refreshQueueSize,
      syncQueue,
      mapActionPayload(type: OfflineAction['type']) {
        const now = new Date().toLocaleString('tr-TR');
        return {
          source: 'admin-dashboard',
          actionAt: now,
          type,
        };
      },
    }),
    [refreshQueueSize, state, syncQueue],
  );
}
