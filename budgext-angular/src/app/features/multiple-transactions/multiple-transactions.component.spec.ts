import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleTransactionsComponent } from './multiple-transactions.component';

describe('MultipleTransactionsComponent', () => {
  let component: MultipleTransactionsComponent;
  let fixture: ComponentFixture<MultipleTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
