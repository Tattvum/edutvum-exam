import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TreeTableComponent } from './treetable.component';

describe('TreeTableComponent', () => {
  let component: TreeTableComponent;
  // let fixture: ComponentFixture<TreeTableComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [TreeTableComponent]
  //   })
  //     .compileComponents();
  // }));

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(TreeTableComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  beforeEach(() => {
    component = new TreeTableComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should make zeros', () => {
  //   expect(component.makeArrZeros([23, null, 40])).toEqual([0, null, 0]);
  // });

  // it('noteMaxLen works', () => {
  //   expect(component.noteMaxLen(3)).toEqual(3);
  //   expect(component.noteMaxLen(2)).toEqual(3);
  //   expect(component.noteMaxLen(4)).toEqual(4);
  // });

});

//To run this test file alone
//npm run test -- --main src/app/common/treetable.component.spec.ts
