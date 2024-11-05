import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizUIComponent } from './quiz-ui.component';

describe('QuizUIComponent', () => {
  let component: QuizUIComponent;
  let fixture: ComponentFixture<QuizUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizUIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
