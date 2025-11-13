import { Routes } from '@angular/router';
import { FriendsLiveChangesComponent } from './features/friends-live-changes/friends-live-changes.component';

export const routes: Routes = [
  { path: '', component: FriendsLiveChangesComponent },
  { path: '**', redirectTo: '' }
];
