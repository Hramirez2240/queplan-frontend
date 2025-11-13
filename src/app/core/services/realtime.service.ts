import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, map } from 'rxjs';
import { DbChangePayload, UiChangeRow } from '../models/change-event.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiBaseUrl, { transports: ['websocket'] });
  }

  onDbChange(): Observable<UiChangeRow[]> {
    return new Observable<DbChangePayload>((observer) => {
      this.socket.on('db-change', (payload: DbChangePayload) => observer.next(payload));
      return () => this.socket.off('db-change');
    }).pipe(
      map((payload) => {
        const uiRows: UiChangeRow[] = [];
        const friendId = payload.primary_key?.id as string | undefined;

        if (Array.isArray(payload?.changes) && payload.changes.length > 0) {
          const changeMap = new Map<string, UiChangeRow>();

          payload.changes.forEach((ch) => {
            const key = `${payload.table}_${friendId || 'unknown'}`;

            if (!changeMap.has(key)) {
              changeMap.set(key, {
                table: payload.table,
                changedAt: payload.changed_at,
                friendId: friendId,
              });
            }

            const row = changeMap.get(key)!;
            if (ch.column === 'name') {
              row.oldName = stringifyValue(ch.old_value);
              row.newName = stringifyValue(ch.new_value);
            } else if (ch.column === 'gender') {
              row.oldGender = stringifyValue(ch.old_value);
              row.newGender = stringifyValue(ch.new_value);
            }
          });

          changeMap.forEach((row) => uiRows.push(row));
        } else if (payload?.column) {
          const row: UiChangeRow = {
            table: payload.table,
            changedAt: payload.changed_at,
            friendId: friendId,
          };

          if (payload.column === 'name') {
            row.oldName = stringifyValue(payload.old_value);
            row.newName = stringifyValue(payload.new_value);
          } else if (payload.column === 'gender') {
            row.oldGender = stringifyValue(payload.old_value);
            row.newGender = stringifyValue(payload.new_value);
          }

          uiRows.push(row);
        }

        return uiRows;
      })
    );
  }
}

function stringifyValue(v: any): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}
