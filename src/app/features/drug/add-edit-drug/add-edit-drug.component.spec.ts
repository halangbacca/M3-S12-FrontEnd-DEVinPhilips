import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDrugComponent } from './add-edit-drug.component';

describe('AddEditDrugComponent', () => {
  let component: AddEditDrugComponent;
  let fixture: ComponentFixture<AddEditDrugComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditDrugComponent]
    });
    fixture = TestBed.createComponent(AddEditDrugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
