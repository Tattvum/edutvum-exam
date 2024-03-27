import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommentsManagerComponent } from './comments-manager.component';

xdescribe('CommentsManagerComponent', () => {
  let component: CommentsManagerComponent;
  let fixture: ComponentFixture<CommentsManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [CommentsManagerComponent]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
