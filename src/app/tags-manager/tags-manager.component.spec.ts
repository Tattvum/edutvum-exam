import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagsManagerComponent } from './tags-manager.component';

xdescribe('TagsManagerComponent', () => {
  let component: TagsManagerComponent;
  let fixture: ComponentFixture<TagsManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [TagsManagerComponent]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
