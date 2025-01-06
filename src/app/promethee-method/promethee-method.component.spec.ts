import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheeMethodComponent } from './promethee-method.component';

describe('PrometheeMethodComponent', () => {
  let component: PrometheeMethodComponent;
  let fixture: ComponentFixture<PrometheeMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrometheeMethodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrometheeMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
