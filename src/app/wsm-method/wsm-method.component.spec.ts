import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WsmMethodComponent } from './wsm-method.component';

describe('WsmMethodComponent', () => {
  let component: WsmMethodComponent;
  let fixture: ComponentFixture<WsmMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WsmMethodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WsmMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
