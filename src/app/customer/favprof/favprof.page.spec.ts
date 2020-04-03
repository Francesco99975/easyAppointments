import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FavprofPage } from './favprof.page';

describe('FavprofPage', () => {
  let component: FavprofPage;
  let fixture: ComponentFixture<FavprofPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavprofPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FavprofPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
