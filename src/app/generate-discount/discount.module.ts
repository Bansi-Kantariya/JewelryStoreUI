import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { GenerateDiscountComponent } from './generate-discount.component';
import { GenerateDiscountPrintToScreenComponent } from './generate-discount-print-to-screen.component'

@NgModule({
  declarations: [
    GenerateDiscountComponent,
    GenerateDiscountPrintToScreenComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forChild([
      {path: 'generateDiscount', component: GenerateDiscountComponent}
    ]),
  ]
})
export class DiscountModule { }
