import { GamiAPI } from './apiClient';
import type { DashboardSyncEvent } from './types';

const QUEUE: DashboardSyncEvent[] = [];

export function enqueueEvent(event: DashboardSyncEvent) {
  QUEUE.push(event);
}

export async function flushSyncQueue() {
  while (QUEUE.length > 0) {
    const event = QUEUE.shift();
    if (!event) continue;

    try {
      await GamiAPI.syncEvent(event);
    } catch (err) {
      // retry later
      QUEUE.unshift(event);
      break;
    }
  }
}

export async function pollSyncEvents(userId: string) {
  return GamiAPI.getSyncEvents(userId);
}
