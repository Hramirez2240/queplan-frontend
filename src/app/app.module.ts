import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FriendsLiveChangesComponent } from './features/friends-live-changes/friends-live-changes.component';
import { MaterialModule } from './shared/material/material.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    FriendsLiveChangesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
