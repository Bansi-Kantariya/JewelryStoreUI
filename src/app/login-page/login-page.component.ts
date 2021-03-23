import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { fromEvent, merge, Observable } from 'rxjs';
import { GenericValidator } from '../helper/generic-validator';

import { debounceTime, tap } from 'rxjs/operators';
import { LoginDetails } from '../models/login-detail';
import { UserDetailsService } from '../user-details/user-details.service';
import { UserDetail } from '../models/user-detail';
import { Router } from '@angular/router';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];

  pageTitle = 'Welcome to xxx Jewelary store';
  errorMessage: string = '';
  loginForm : FormGroup = this.fb.group({});
  isCredentialInValid : boolean = false;

  displayMessage: { [key: string]: string } = {};
  validationMessages: { [key: string]: { [key: string]: string } };
  genericValidator: GenericValidator;

  loginDetail : LoginDetails 



  constructor(
    private fb : FormBuilder,
    private userService : UserDetailsService,
    private router: Router,
  ) { 
    this.validationMessages = {
      userName: {
        required: 'UserName is required'
      },
      password: {
        required: 'password is required'
      }
    }

    this.genericValidator = new GenericValidator(this.validationMessages);

    this.loginDetail = {
      userName : '',
      password : ''
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName : ['', [Validators.required]],
      password : ['', [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.loginForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.loginForm);
    });
  }

  login() : void {
    this.isCredentialInValid = false;
    const login = {...this.loginDetail, ...this.loginForm.value}
    this.userService.authenticateUser(login)
      .subscribe({
        next: (ud => this.openDiscountPage(ud)),
        error: (err => {console.log(err) ; this.isCredentialInValid = true})
      });
  }

  openDiscountPage(userDetail : UserDetail) : void{
    localStorage.setItem('userName', userDetail.userName);
    localStorage.setItem('userType', userDetail.userType.toString());

    this.router.navigate(['/generateDiscount']);
  }

  resetForm() : void{
    this.loginForm.reset();
  }
}


