import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmockComponent } from './amock.component';

describe('AmockComponent', () => {
  let component: AmockComponent;
  let fixture: ComponentFixture<AmockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
