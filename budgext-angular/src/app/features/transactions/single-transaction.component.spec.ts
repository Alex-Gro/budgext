import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTransactionComponent } from './single-transaction.component';

describe('SingleTransactionComponent', () => {
  let component: SingleTransactionComponent;
  let fixture: ComponentFixture<SingleTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
