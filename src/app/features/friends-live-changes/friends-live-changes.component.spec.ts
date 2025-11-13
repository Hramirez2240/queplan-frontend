import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsLiveChangesComponent } from './friends-live-changes.component';

describe('FriendsLiveChangesComponent', () => {
  let component: FriendsLiveChangesComponent;
  let fixture: ComponentFixture<FriendsLiveChangesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendsLiveChangesComponent]
    });
    fixture = TestBed.createComponent(FriendsLiveChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
