import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotinaComponent } from './rotina.component';

describe('RotinaComponent', () => {
  let component: RotinaComponent;
  let fixture: ComponentFixture<RotinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RotinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RotinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
