import { enqueueEvent } from './syncService';

export function initEventBridge() {
  if (typeof window === 'undefined') return;

  window.addEventListener('message', (event: any) => {
    if (event?.data?.type !== 'GAMI_EVENT') return;

    enqueueEvent({
      id: crypto.randomUUID(),
      source: 'chrome-extension',
      type: event.data.payload.type,
      payload: event.data.payload,
      createdAt: new Date().toISOString(),
    });
  });
}
