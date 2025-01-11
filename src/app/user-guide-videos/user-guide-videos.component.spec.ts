import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGuideVideosComponent } from './user-guide-videos.component';

describe('UserGuideVideosComponent', () => {
  let component: UserGuideVideosComponent;
  let fixture: ComponentFixture<UserGuideVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserGuideVideosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserGuideVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
