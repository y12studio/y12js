import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoonumComponent } from './foonum.component';

describe('FoonumComponent', () => {
  let component: FoonumComponent;
  let fixture: ComponentFixture<FoonumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoonumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoonumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.foo).toBeLessThan(89);
  });
});
