import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassthroughComponent } from './passthrough.component';

describe('PassthroughComponent', () => {
  let component: PassthroughComponent;
  let fixture: ComponentFixture<PassthroughComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassthroughComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassthroughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
