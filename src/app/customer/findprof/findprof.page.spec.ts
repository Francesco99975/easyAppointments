import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FindprofPage } from './findprof.page';

describe('FindprofPage', () => {
  let component: FindprofPage;
  let fixture: ComponentFixture<FindprofPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindprofPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FindprofPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
