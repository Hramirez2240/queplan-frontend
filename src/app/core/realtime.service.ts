import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, map } from 'rxjs';
import { DbChangePayload, UiChangeRow } from './models/db-change-event.model';

// Ajusta si tu backend corre en otra URL/puerto:
const SOCKET_URL = 'http://localhost:3001';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private socket: Socket;

  constructor() {
    this.socket = io(SOCKET_URL, { transports: ['websocket'] });
  }

  onDbChange(): Observable<UiChangeRow[]> {
    return new Observable<DbChangePayload>((observer) => {
      this.socket.on('db-change', (payload: DbChangePayload) => observer.next(payload));
      return () => this.socket.off('db-change');
    }).pipe(
      map((payload) => {
        if (Array.isArray(payload?.changes) && payload.changes.length > 0) {
          return payload.changes.map((ch) => ({
            table: payload.table,
            column: ch.column,
            oldValue: stringifyValue(ch.old_value),
            newValue: stringifyValue(ch.new_value),
            changedAt: payload.changed_at,
          } satisfies UiChangeRow));
        }
        if (payload?.column) {
          return [
            {
              table: payload.table,
              column: payload.column,
              oldValue: stringifyValue(payload.old_value),
              newValue: stringifyValue(payload.new_value),
              changedAt: payload.changed_at,
            } satisfies UiChangeRow,
          ];
        }
        return [];
      })
    );
  }
}
function stringifyValue(v: any): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}
