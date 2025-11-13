import { TestBed } from '@angular/core/testing';
import { RealtimeService } from './realtime.service';
import { DbChangePayload, UiChangeRow } from '../models/change-event.model';

describe('RealtimeService', () => {
  let service: RealtimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RealtimeService]
    });

    service = TestBed.inject(RealtimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('onDbChange', () => {
    it('should transform single column change to UiChangeRow', (done) => {
      const mockPayload: DbChangePayload = {
        table: 'my_friends',
        operation: 'UPDATE',
        primary_key: { id: 'friend-123' },
        changed_at: '2025-11-13T07:00:00Z',
        column: 'name',
        old_value: 'John',
        new_value: 'Johnny'
      };

      service.onDbChange().subscribe((rows) => {
        expect(rows).toBeDefined();
        expect(rows.length).toBe(1);
        expect(rows[0].table).toBe('my_friends');
        expect(rows[0].oldName).toBe('John');
        expect(rows[0].newName).toBe('Johnny');
        expect(rows[0].friendId).toBe('friend-123');
        done();
      });

      service['socket'].emit('db-change', mockPayload);
    });

    it('should transform multiple column changes into single row', (done) => {
      const mockPayload: DbChangePayload = {
        table: 'my_friends',
        operation: 'UPDATE',
        primary_key: { id: 'friend-456' },
        changed_at: '2025-11-13T08:00:00Z',
        changes: [
          { column: 'name', old_value: 'Maria', new_value: 'Mar' },
          { column: 'gender', old_value: 'F', new_value: 'F' }
        ]
      };

      service.onDbChange().subscribe((rows) => {
        expect(rows).toBeDefined();
        expect(rows.length).toBe(1);
        expect(rows[0].table).toBe('my_friends');
        expect(rows[0].oldName).toBe('Maria');
        expect(rows[0].newName).toBe('Mar');
        expect(rows[0].oldGender).toBe('F');
        expect(rows[0].newGender).toBe('F');
        expect(rows[0].friendId).toBe('friend-456');
        done();
      });

      service['socket'].emit('db-change', mockPayload);
    });

    it('should handle gender column change', (done) => {
      const mockPayload: DbChangePayload = {
        table: 'my_friends',
        operation: 'UPDATE',
        primary_key: { id: 'friend-789' },
        changed_at: '2025-11-13T09:00:00Z',
        column: 'gender',
        old_value: 'M',
        new_value: 'F'
      };

      service.onDbChange().subscribe((rows) => {
        expect(rows).toBeDefined();
        expect(rows.length).toBe(1);
        expect(rows[0].oldGender).toBe('M');
        expect(rows[0].newGender).toBe('F');
        done();
      });

      service['socket'].emit('db-change', mockPayload);
    });

    it('should stringify object values', (done) => {
      const mockPayload: DbChangePayload = {
        table: 'my_friends',
        operation: 'UPDATE',
        primary_key: { id: 'friend-999' },
        changed_at: '2025-11-13T10:00:00Z',
        column: 'name',
        old_value: { firstName: 'John' },
        new_value: { firstName: 'Johnny' }
      };

      service.onDbChange().subscribe((rows) => {
        expect(rows).toBeDefined();
        expect(rows.length).toBe(1);
        expect(typeof rows[0].oldName).toBe('string');
        expect(typeof rows[0].newName).toBe('string');
        expect(rows[0].oldName).toContain('firstName');
        done();
      });

      service['socket'].emit('db-change', mockPayload);
    });

    it('should return empty array for empty payload', (done) => {
      const mockPayload: DbChangePayload = {
        table: 'my_friends',
        operation: 'UPDATE'
      };

      service.onDbChange().subscribe((rows) => {
        expect(rows).toBeDefined();
        expect(rows.length).toBe(0);
        done();
      });

      service['socket'].emit('db-change', mockPayload);
    });

    it('should handle null/undefined values', (done) => {
      const mockPayload: DbChangePayload = {
        table: 'my_friends',
        operation: 'UPDATE',
        primary_key: { id: 'friend-000' },
        changed_at: '2025-11-13T11:00:00Z',
        column: 'name',
        old_value: null,
        new_value: undefined
      };

      service.onDbChange().subscribe((rows) => {
        expect(rows).toBeDefined();
        expect(rows.length).toBe(1);
        expect(rows[0].oldName).toBe('');
        expect(rows[0].newName).toBe('');
        done();
      });

      service['socket'].emit('db-change', mockPayload);
    });
  });
});
