import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizUIComponentComponent } from './quiz-uicomponent.component';

describe('QuizUIComponentComponent', () => {
  let component: QuizUIComponentComponent;
  let fixture: ComponentFixture<QuizUIComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizUIComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizUIComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
