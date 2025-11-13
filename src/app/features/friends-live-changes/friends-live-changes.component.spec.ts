import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { FriendsLiveChangesComponent } from './friends-live-changes.component';
import { FriendsService } from 'src/app/core/services/friends.service';
import { RealtimeService } from 'src/app/core/services/realtime.service';
import { Friend } from 'src/app/core/models/friend.model';
import { UiChangeRow } from 'src/app/core/models/change-event.model';

describe('FriendsLiveChangesComponent', () => {
  let component: FriendsLiveChangesComponent;
  let fixture: ComponentFixture<FriendsLiveChangesComponent>;
  let friendsService: jasmine.SpyObj<FriendsService>;
  let realtimeService: jasmine.SpyObj<RealtimeService>;

  const mockFriends: Friend[] = [
    { id: '1', name: 'Juan', gender: 'M' },
    { id: '2', name: 'María', gender: 'F' }
  ];

  const mockChangeRow: UiChangeRow = {
    table: 'my_friends',
    oldName: 'Juan',
    newName: 'Johnny',
    oldGender: undefined,
    newGender: undefined,
    changedAt: '2025-11-13T07:00:00Z',
    friendId: '1'
  };

  beforeEach(() => {
    const friendsServiceSpy = jasmine.createSpyObj('FriendsService', ['getFriends', 'getFriendById']);
    const realtimeServiceSpy = jasmine.createSpyObj('RealtimeService', ['onDbChange']);

    TestBed.configureTestingModule({
      imports: [FriendsLiveChangesComponent],
      providers: [
        { provide: FriendsService, useValue: friendsServiceSpy },
        { provide: RealtimeService, useValue: realtimeServiceSpy }
      ]
    });

    friendsService = TestBed.inject(FriendsService) as jasmine.SpyObj<FriendsService>;
    realtimeService = TestBed.inject(RealtimeService) as jasmine.SpyObj<RealtimeService>;

    friendsService.getFriends.and.returnValue(of(mockFriends));
    realtimeService.onDbChange.and.returnValue(of([]));

    fixture = TestBed.createComponent(FriendsLiveChangesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load friends on initialization', () => {
      fixture.detectChanges();

      expect(friendsService.getFriends).toHaveBeenCalled();
      expect(component.friends).toEqual(mockFriends);
      expect(component.friends.length).toBe(2);
    });

    it('should initialize data with friends list', () => {
      fixture.detectChanges();

      expect(component.data.length).toBe(2);
      expect(component.data[0].newName).toBe('Juan');
      expect(component.data[0].newGender).toBe('M');
      expect(component.data[1].newName).toBe('María');
      expect(component.data[1].newGender).toBe('F');
    });

    it('should populate friendsMap from friends list', () => {
      fixture.detectChanges();

      expect(component['friendsMap'].size).toBe(2);
      expect(component['friendsMap'].get('1')).toEqual(mockFriends[0]);
      expect(component['friendsMap'].get('2')).toEqual(mockFriends[1]);
    });

    it('should set table name to my_friends for each row', () => {
      fixture.detectChanges();

      component.data.forEach((row) => {
        expect(row.table).toBe('my_friends');
      });
    });

    it('should subscribe to realtime changes', () => {
      fixture.detectChanges();

      expect(realtimeService.onDbChange).toHaveBeenCalled();
    });
  });

  describe('realtime changes handling', () => {
    it('should update existing friend row when change event arrives', () => {
      realtimeService.onDbChange.and.returnValue(of([mockChangeRow]));
      fixture.detectChanges();

      const firstRow = component.data[0];
      expect(firstRow.friendId).toBe('1');
      expect(firstRow.oldName).toBe('Juan');
      expect(firstRow.newName).toBe('Johnny');
    });

    it('should move new values to old values when updating same friend', () => {
      const changeRow1: UiChangeRow = {
        table: 'my_friends',
        newName: 'Johnny',
        changedAt: '2025-11-13T07:00:00Z',
        friendId: '1'
      };

      const changeRow2: UiChangeRow = {
        table: 'my_friends',
        newName: 'John Doe',
        changedAt: '2025-11-13T08:00:00Z',
        friendId: '1'
      };

      realtimeService.onDbChange.and.returnValue(of([changeRow1]));
      fixture.detectChanges();

      let firstRow = component.data[0];
      expect(firstRow.newName).toBe('Johnny');
      expect(firstRow.oldName).toBeUndefined();

      realtimeService.onDbChange.and.returnValue(of([changeRow2]));
      component.ngOnInit();

      firstRow = component.data[0];
      expect(firstRow.oldName).toBe('Johnny');
      expect(firstRow.newName).toBe('John Doe');
    });

    it('should handle gender changes', () => {
      const genderChangeRow: UiChangeRow = {
        table: 'my_friends',
        oldGender: 'M',
        newGender: 'F',
        changedAt: '2025-11-13T07:30:00Z',
        friendId: '1'
      };

      realtimeService.onDbChange.and.returnValue(of([genderChangeRow]));
      fixture.detectChanges();

      const firstRow = component.data[0];
      expect(firstRow.oldGender).toBe('M');
      expect(firstRow.newGender).toBe('F');
    });

    it('should add new change row if friendId not found', () => {
      const newChangeRow: UiChangeRow = {
        table: 'my_friends',
        newName: 'Pedro',
        newGender: 'M',
        changedAt: '2025-11-13T09:00:00Z',
        friendId: 'unknown-id'
      };

      realtimeService.onDbChange.and.returnValue(of([newChangeRow]));
      fixture.detectChanges();

      expect(component.data[0].friendId).toBe('unknown-id');
      expect(component.data[0].newName).toBe('Pedro');
    });

    it('should update friend in memory when change occurs', () => {
      const changeRow: UiChangeRow = {
        table: 'my_friends',
        newName: 'Juan Updated',
        changedAt: '2025-11-13T07:00:00Z',
        friendId: '1'
      };

      realtimeService.onDbChange.and.returnValue(of([changeRow]));
      fixture.detectChanges();

      const updatedFriend = component['friendsMap'].get('1');
      expect(updatedFriend?.name).toBe('Juan Updated');
    });
  });

  describe('error handling', () => {
    it('should handle friends loading error gracefully', () => {
      friendsService.getFriends.and.returnValue(
        new Observable((observer) => observer.error(new Error('Load failed')))
      );

      fixture.detectChanges();

      expect(component.friends.length).toBe(0);
      expect(component.data.length).toBe(0);
    });
  });

  describe('displayed columns', () => {
    it('should have correct displayed columns', () => {
      expect(component.displayedColumns).toEqual([
        'table',
        'oldName',
        'oldGender',
        'newName',
        'newGender',
        'when'
      ]);
    });
  });
});

