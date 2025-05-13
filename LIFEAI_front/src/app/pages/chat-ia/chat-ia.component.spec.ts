import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatIaComponent } from './chat-ia.component';

describe('ChatIaComponent', () => {
  let component: ChatIaComponent;
  let fixture: ComponentFixture<ChatIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatIaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
