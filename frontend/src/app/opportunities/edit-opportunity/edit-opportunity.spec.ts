import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOpportunity } from './edit-opportunity';

describe('EditOpportunity', () => {
  let component: EditOpportunity;
  let fixture: ComponentFixture<EditOpportunity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOpportunity],
    }).compileComponents();

    fixture = TestBed.createComponent(EditOpportunity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
