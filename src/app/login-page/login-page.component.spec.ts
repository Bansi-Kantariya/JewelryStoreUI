import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from '../app-routing.module';
import { LoginDetails } from '../models/login-detail';
import { UserDetail } from '../models/user-detail';
import { UserDetailsService } from '../user-details/user-details.service';

import { LoginPageComponent } from './login-page.component';

export class MockUserServiceData {
 
  public authenticateUser(loginDetail: LoginDetails): Observable<UserDetail> {
    const  testData : UserDetail = {
      userName : "testuser", userType : 1
    }
    return of(testData);
  }

}

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let router: Router;
  let mockUserServiceData : MockUserServiceData;

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  function updateForm(userName : string, password : string){
    component.loginForm.controls["userName"].setValue(userName);
    component.loginForm.controls["password"].setValue(password);
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginPageComponent ],
      providers: [
        FormBuilder, 
        { provide: UserDetailsService, useClass: MockUserServiceData }
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule.withRoutes([
          {path: '', component: LoginPageComponent},
        {path: 'welcome', redirectTo: '', pathMatch: 'full'}
        ])
      ],
    })
    .compileComponents()

    router = TestBed.get(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockUserServiceData = fixture.debugElement.injector.get(UserDetailsService)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default logindetail', () => {
    expect(component.loginDetail.userName).toEqual('');
    expect(component.loginDetail.password).toEqual('');
  });

  it('form value should update from form changes', () => {
    const validLoginDetail : LoginDetails = {
      userName : "testUser", password : "testUser"
    }
    updateForm(validLoginDetail.userName, validLoginDetail.password);
    expect(component.loginForm.value).toEqual(validLoginDetail);
  });

  it('isValid should be false when form is invalid', () => {
    const inValidLoginDetail : LoginDetails = {
      userName : '', password : "testUser"
    }
    updateForm(inValidLoginDetail.userName, inValidLoginDetail.password);
    expect(component.loginForm.valid).toBeFalse;
    expect(component.loginForm.controls["userName"].valid).toBeFalse;
    expect(component.loginForm.controls["password"].valid).toBeTrue;
  });

  it('reset value on calling reset()', () => {
    component.resetForm();
    expect(component.loginForm.controls["userName"].value).toBe(null)
    expect(component.loginForm.controls["password"].value).toBe(null)
  })

  it('login should authenticate data and navigate to discount page', () => {
    const testUserData : UserDetail = {
      userName : "TestUser", userType: 2 
    }
    const spy = spyOn(mockUserServiceData, 'authenticateUser').and.returnValue(
      of(testUserData)
    );

    const navigateSpy = spyOn(router, 'navigate');

    component.login();

    expect(spy.calls.any()).toEqual(true);
    expect(navigateSpy).toHaveBeenCalledWith(['/generateDiscount']);
  })
 
});
