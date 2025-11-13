import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendsLiveChangesComponent } from './features/friends-live-changes/friends-live-changes.component';

const routes: Routes = [
  { path: '', component: FriendsLiveChangesComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
