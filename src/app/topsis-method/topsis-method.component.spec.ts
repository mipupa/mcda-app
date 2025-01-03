import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopsisMethodComponent } from './topsis-method.component';

describe('TopsisMethodComponent', () => {
  let component: TopsisMethodComponent;
  let fixture: ComponentFixture<TopsisMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopsisMethodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopsisMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
