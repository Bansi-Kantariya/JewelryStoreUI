import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { GenerateDiscountPrintToScreenComponent } from './generate-discount-print-to-screen.component';

describe('GenerateDiscountPrintToScreenComponent', () => {
  let component: GenerateDiscountPrintToScreenComponent;
  let fixture: ComponentFixture<GenerateDiscountPrintToScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateDiscountPrintToScreenComponent ],
      providers:[NgbActiveModal]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateDiscountPrintToScreenComponent);
    component = fixture.componentInstance;
    component.calculationDetails = {
      goldPrice : 5467.8, units : 4, totalprice :  5467.8 * 4, discountRate : 2
    }

    component.isPreviledgeUser = false
    fixture.detectChanges();
  });

  it('should create', () => {
    
    expect(component).toBeTruthy();
  });
});
