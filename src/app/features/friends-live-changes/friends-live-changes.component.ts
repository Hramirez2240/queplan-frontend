import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealtimeService } from 'src/app/core/services/realtime.service';
import { UiChangeRow } from 'src/app/core/models/change-event.model';
import { FriendsService } from 'src/app/core/services/friends.service';
import { Friend } from 'src/app/core/models/friend.model';
import { MaterialModule } from 'src/app/shared/material/material.module';

@Component({
  selector: 'app-friends-live-changes',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './friends-live-changes.component.html',
  styleUrls: ['./friends-live-changes.component.css'],
})
export class FriendsLiveChangesComponent implements OnInit {
  displayedColumns = ['table', 'oldName', 'oldGender', 'newName', 'newGender', 'when'];
  data: UiChangeRow[] = [];
  friends: Friend[] = [];
  private friendsMap: Map<string, Friend> = new Map();

  constructor(
    private readonly rt: RealtimeService,
    private readonly friendsService: FriendsService
  ) {}

  ngOnInit(): void {
    this.friendsService.getFriends().subscribe({
      next: (list) => {
        this.friends = list || [];
        this.friendsMap.clear();
        this.friends.forEach((f) => this.friendsMap.set(f.id, f));
        this.initializeDataFromFriends();
        console.log(this.friends);
      },
      error: (err) => {
        console.error('Error cargando friends', err);
        this.friends = [];
      },
    });

    this.rt.onDbChange().subscribe((rows) => {
      if (!rows || rows.length === 0) return;

      rows.forEach((changeRow) => {
        const existingRowIndex = this.data.findIndex((r) => r.friendId === changeRow.friendId);

        if (existingRowIndex !== -1) {
          const existingRow = this.data[existingRowIndex];
          if (changeRow.newName !== undefined) {
            existingRow.oldName = existingRow.newName;
            existingRow.newName = changeRow.newName;
          }
          if (changeRow.newGender !== undefined) {
            existingRow.oldGender = existingRow.newGender;
            existingRow.newGender = changeRow.newGender;
          }
          existingRow.changedAt = changeRow.changedAt;
        } else {
          this.data.unshift(changeRow);
        }

        if (changeRow.friendId && this.friendsMap.has(changeRow.friendId)) {
          const friend = this.friendsMap.get(changeRow.friendId)!;
          if (changeRow.newName !== undefined) friend.name = changeRow.newName;
          if (changeRow.newGender !== undefined) friend.gender = changeRow.newGender;
        }
      });
    });
  }

  private initializeDataFromFriends(): void {
    this.data = this.friends.map((friend) => ({
      table: 'my_friends',
      oldName: undefined,
      oldGender: undefined,
      newName: friend.name,
      newGender: friend.gender,
      changedAt: new Date().toISOString(),
      friendId: friend.id,
    }));
  }
}
