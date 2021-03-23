import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GenerateDiscountComponent } from './generate-discount.component';

describe('GenerateDiscountComponent', () => {
  let component: GenerateDiscountComponent;
  let fixture: ComponentFixture<GenerateDiscountComponent>;
  
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateDiscountComponent ],
      imports: [
        NgbModule,
        RouterTestingModule.withRoutes([
          {path: 'generateDiscount', component: GenerateDiscountComponent}
        ])
      ],
      providers:[
        NgbActiveModal,
        FormBuilder
      ]
    })
    .compileComponents();

    router = TestBed.get(Router);

    let store : {[key : string] : any} = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      }
    };

    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should be initialize correctly', () => {
    localStorage.setItem('userName', 'TestUser');
    localStorage.setItem('userType', '2');

    component.ngOnInit();

    expect(component.userName).toBe('TestUser');
    expect(component.userType).toBe(2);

    expect(component.pageTitle).toBe('Welcome TestUser');
    expect(component.isPriviledgeUser).toBeTrue;

    expect(component.priceCalculationForm.controls["discountRate"].value).toBe(2);
  })

  it("should calculate total price with discount for previlidge user", () => {
    localStorage.setItem('userName', 'TestUser');
    localStorage.setItem('userType', '2');

    component.ngOnInit();

    const goldPrice = 5558.77;
    const unit = 2
    component.priceCalculationForm.controls["goldPrice"].setValue(goldPrice);
    component.priceCalculationForm.controls["units"].setValue(unit);

    component.getTotalPrice()

    const total = (goldPrice * unit) * (1-(component.priceCalculationForm.controls["discountRate"].value/100)) 

    expect(component.priceCalculationForm.controls["totalprice"].value).toBe(total);
  })

  it("should calculate total price without discount for Normal user", () => {
    localStorage.setItem('userName', 'TestUser');
    localStorage.setItem('userType', '1');

    component.ngOnInit();

    const goldPrice = 5558.77;
    const unit = 2
    component.priceCalculationForm.controls["goldPrice"].setValue(goldPrice);
    component.priceCalculationForm.controls["units"].setValue(unit);

    component.getTotalPrice()

    const total = (goldPrice * unit) 

    expect(component.priceCalculationForm.controls["totalprice"].value).toBe(total);
  })

  it("should cancel and navigate to login page on cancel click", () => {
    localStorage.setItem('userName', 'TestUser');
    localStorage.setItem('userType', '1');
    const navigateSpy = spyOn(router, 'navigate');
    component.ngOnInit();

    const goldPrice = 5558.77;
    const unit = 2
    component.priceCalculationForm.controls["goldPrice"].setValue(goldPrice);
    component.priceCalculationForm.controls["units"].setValue(unit);

    component.getTotalPrice();

    component.cancel();

    expect(component.priceCalculationForm.controls["goldPrice"].value).toBe(0);
    expect(component.priceCalculationForm.controls["units"].value).toBe(0);
    expect(component.priceCalculationForm.controls["totalprice"].value).toBe(0);
    expect(component.priceCalculationForm.controls["discountRate"].value).toBe(2);

    expect(navigateSpy).toHaveBeenCalledWith(['/'])
  });

  it('should set "calculationDetails" on valuechange', () => {
    const goldPrice = 5558.77;
    const unit = 2
    component.priceCalculationForm.controls["goldPrice"].setValue(goldPrice);
    component.priceCalculationForm.controls["units"].setValue(unit);

    expect(component.calculationDetails.units).toBe(unit);
    expect(component.calculationDetails.goldPrice).toBe(goldPrice);

  })
});
