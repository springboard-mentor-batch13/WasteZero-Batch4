import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSuggestions } from './match-suggestions';

describe('MatchSuggestions', () => {
  let component: MatchSuggestions;
  let fixture: ComponentFixture<MatchSuggestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchSuggestions],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchSuggestions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
