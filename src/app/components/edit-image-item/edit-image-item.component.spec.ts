import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImageItemComponent } from './edit-image-item.component';

describe('EditImageItemComponent', () => {
  let component: EditImageItemComponent;
  let fixture: ComponentFixture<EditImageItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditImageItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditImageItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
