import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuestionsManagerComponent } from './questions-manager.component';

xdescribe('QuestionsManagerComponent', () => {
  let component: QuestionsManagerComponent;
  let fixture: ComponentFixture<QuestionsManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionsManagerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
