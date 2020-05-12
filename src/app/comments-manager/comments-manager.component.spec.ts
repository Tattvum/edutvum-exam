import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsManagerComponent } from './comments-manager.component';

xdescribe('CommentsManagerComponent', () => {
  let component: CommentsManagerComponent;
  let fixture: ComponentFixture<CommentsManagerComponent>;

  beforeEach(async(() => {
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
