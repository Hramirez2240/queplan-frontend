import { Component, OnInit } from '@angular/core';
import { RealtimeService } from 'src/app/core/realtime.service';
import { UiChangeRow } from 'src/app/core/models/db-change-event.model';

@Component({
  selector: 'app-friends-live-changes',
  templateUrl: './friends-live-changes.component.html',
  styleUrls: ['./friends-live-changes.component.css'],
})
export class FriendsLiveChangesComponent implements OnInit {
  displayedColumns = ['table', 'column', 'old', 'new', 'when'];
  data: UiChangeRow[] = [];

  constructor(private readonly rt: RealtimeService) {}

  ngOnInit(): void {
    this.rt.onDbChange().subscribe((rows) => {
      if (!rows || rows.length === 0) return;
      this.data = [...rows, ...this.data];
    });
  }
}
