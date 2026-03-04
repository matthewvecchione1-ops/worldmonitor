import { useEffect, useRef } from 'react';
import { WS_URL } from '../lib/constants';
import type { WSEventType } from '../types/api';

type WSHandler<T = unknown> = (data: T) => void;

const handlers = new Map<WSEventType, WSHandler[]>();

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    function connect() {
      try {
        ws.current = new WebSocket(WS_URL);

        ws.current.onmessage = (event) => {
          try {
            const { event: type, data } = JSON.parse(event.data);
            const typeHandlers = handlers.get(type as WSEventType) ?? [];
            typeHandlers.forEach((h) => h(data));
          } catch {
            // ignore malformed messages
          }
        };

        ws.current.onclose = () => {
          setTimeout(connect, 3000);
        };
      } catch {
        setTimeout(connect, 3000);
      }
    }

    connect();

    return () => {
      ws.current?.close();
    };
  }, []);

  function subscribe<T>(event: WSEventType, handler: WSHandler<T>) {
    const existing = handlers.get(event) ?? [];
    handlers.set(event, [...existing, handler as WSHandler]);

    return () => {
      const updated = (handlers.get(event) ?? []).filter((h) => h !== handler);
      handlers.set(event, updated);
    };
  }

  return { subscribe };
}
