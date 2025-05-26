import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesempComponent } from './exercicios.component';

describe('DesempComponent', () => {
  let component: DesempComponent;
  let fixture: ComponentFixture<DesempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesempComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
