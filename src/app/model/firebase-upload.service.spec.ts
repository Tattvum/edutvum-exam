import {
  TestBed, async, inject, fakeAsync,
  discardPeriodicTasks, tick, getTestBed,
} from '@angular/core/testing';

import { FirebaseUpload } from './firebase-upload.service';

import { DataService } from './data.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

const AngularFireAuthMock = {
}
const AngularFireDatabaseMock = {
}
const DataServiceMock = {
}

function makeSpy(cls: any, method: string) {
  return spyOn(getTestBed().get(cls), method).and.callThrough()
}

describe('FirebaseUpload tests:', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useValue: AngularFireAuthMock },
        { provide: AngularFireDatabase, useValue: AngularFireDatabaseMock },
        { provide: DataService, useValue: DataServiceMock },
        { provide: FirebaseUpload, useClass: FirebaseUpload },
      ]
    })
  })

  it('creation and dummy works', inject([FirebaseUpload], (service: FirebaseUpload) => {
    expect(service).toBeTruthy();
  }))

  it('oldpath works', inject([FirebaseUpload], (service: FirebaseUpload) => {
    expect(service.oldpath('e23', 'q2', 'bingo')).toBe('exams/e23/questions/q2/files/bingo');
    expect(service.oldpath('e23', '', 'bingo')).toBe('exams/e23/questions//files/bingo');
  }))

  it('nowFileFullPath works', inject([FirebaseUpload], (service: FirebaseUpload) => {
    const dt = new Date(2020, 4, 29, 19, 15, 51, 357)//IST +5:30, month zero based
    expect(service.dtFileFullPath(dt, 'bingo.jpx')).toBe('2020/05/29/20200529T134551-bingo.jpx');
  }))

})

//npm run test (only all tests togather will work!)
