import { HttpErrorResponse } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { IAppConfig } from 'src/app-config.model';
import { AppConfig } from 'src/app.config';
import { LoginDetails } from '../models/login-detail';
import { UserDetail } from '../models/user-detail';

import { UserDetailsService } from './user-details.service';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

describe('UserDetailsService', () => {
  let service: UserDetailsService;
  let httpClientSpy: { get: jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
      ],
      providers:[
        AppConfig,
        {
          provide : APP_INITIALIZER,
          useFactory : initializeApp,
          deps:[AppConfig], multi:true
        }
      ]
    });

    AppConfig.settings = {
      apiServer:{
        serverUrl : "someUrl"
      },
      env:{
        name: "dev"
      }
    }
    //service = TestBed.inject(UserDetailsService);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new UserDetailsService(httpClientSpy as any);
    
  });

  it('should be created', () => {
    console.log("body",AppConfig.settings);
    expect(service).toBeTruthy();
  });

  it('should authenticated and return excepted userDetails', () => {
    const userDetail : UserDetail = {
      userName : "TestUser", userType : 1
    };
    const loginDetail : LoginDetails = {
      userName : "TestUser", password : "TestUser"
    };

    httpClientSpy.get.and.returnValue(of(userDetail));

    service.authenticateUser(loginDetail).subscribe(
      user => expect(user).toEqual(userDetail, "excepted user"), fail
    );

    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should return error when server return 404 error', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });
    const loginDetail : LoginDetails = {
      userName : "TestUser", password : "TestUser"
    };

    httpClientSpy.get.and.returnValue(of(errorResponse));

    service.authenticateUser(loginDetail).subscribe(
      data => expect(data).toBeInstanceOf(HttpErrorResponse),
      error  => expect(error.message).toContain('test 404 error')
    )
  });

  
});
