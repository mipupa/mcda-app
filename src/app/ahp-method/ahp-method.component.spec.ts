import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhpMethodComponent } from './ahp-method.component';

describe('AhpMethodComponent', () => {
  let component: AhpMethodComponent;
  let fixture: ComponentFixture<AhpMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AhpMethodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AhpMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
