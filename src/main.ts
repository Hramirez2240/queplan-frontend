import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FriendsLiveChangesComponent } from './app/features/friends-live-changes/friends-live-changes.component';
import { routes } from './app/app-routing.module';

bootstrapApplication(FriendsLiveChangesComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(HttpClientModule)
  ]
})
  .catch(err => console.error(err));
