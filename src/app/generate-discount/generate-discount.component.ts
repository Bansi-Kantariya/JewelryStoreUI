import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalcculationDetails } from '../models/calculation-detail';
import { GenerateDiscountPrintToScreenComponent } from './generate-discount-print-to-screen.component';

import { jsPDF } from 'jspdf';
import html2canvas  from 'html2canvas';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-generate-discount',
  templateUrl: './generate-discount.component.html',
  styleUrls: ['./generate-discount.component.css']
})

export class GenerateDiscountComponent implements OnInit {
  @ViewChildren(FormControlName, {read : ElementRef}) formInputElements: ElementRef[] = []
  @ViewChild('pdfhtml') pdfhtmldata : ElementRef | undefined ;

  pageTitle : string | undefined;
  userName : string | null | undefined;
  userType : Number | null | undefined;

  isPriviledgeUser : boolean = false;
  calculationDetails : CalcculationDetails = {
    goldPrice : 0,
    units : 0,
    totalprice : 0,
    discountRate : 0
  };

  priceCalculationForm : FormGroup  = this.fb.group({})

  showPdfHtml : boolean = true;
  constructor(private fb : FormBuilder,
              private modalService : NgbModal,
              private router : Router) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') ? localStorage.getItem('userName') : '';
    this.userType = localStorage.getItem('userType') ? Number(localStorage.getItem('userType')) : 0

    this.pageTitle = `Welcome ${this.userName}`;

    if(this.userType === 2){
      this.isPriviledgeUser = true;
    }
    else{
      this.isPriviledgeUser = false;
    }

    this.priceCalculationForm = this.fb.group({
      goldPrice : [0, [Validators.required]],
      units : [0, [Validators.required]],
      totalprice : [{value: 0, disabled: true}],
      discountRate : [2]
    });

    this.showPdfHtml = false;
  }
    
  ngAfterViewInit() {
    this.priceCalculationForm.valueChanges.subscribe(value => {
      this.calculationDetails = {...this.calculationDetails, ...this.priceCalculationForm.value};
    })
  }

  getTotalPrice() : void{
      var totalPriceWithoutDiscount  = this.priceCalculationForm?.controls["goldPrice"].value
            * this.priceCalculationForm?.controls["units"].value

      var finalPrice = totalPriceWithoutDiscount
      if(this.isPriviledgeUser){
        finalPrice = totalPriceWithoutDiscount 
          * (1 - (this.priceCalculationForm?.controls["discountRate"].value / 100))
      }

      // this.priceCalculationForm?.patchValue({
      //   totalprice: finalPrice
      // })
      this.priceCalculationForm.controls["totalprice"].setValue(finalPrice);
      this.calculationDetails.totalprice = finalPrice;
    }

  printToScreen() : void{
      const modalRef = this.modalService.open(GenerateDiscountPrintToScreenComponent);
      const d = {...this.calculationDetails, ...this.priceCalculationForm.value}
      modalRef.componentInstance.calculationDetails = d;
      modalRef.componentInstance.isPreviledgeUser = this.isPriviledgeUser;
   }

  printToFile() : void {
      this.showPdfHtml = true;
      let pdfHtmlData = document.getElementById('pdfhtml');
      
      if(pdfHtmlData)
      {
        html2canvas(pdfHtmlData).then(canvas => {
        
        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;
        
        const FILEURI = canvas.toDataURL('')
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 10;
        PDF.addImage(FILEURI, 'PNG', position, position, fileWidth, fileHeight)
        
        PDF.save(`${this.userName}-goldpriceCalculation.pdf`);
      });
      this.showPdfHtml = false;
    }
  }

  printToPaper() : void {
      console.log("print to paper");
  }

  cancel() : void {
      this.priceCalculationForm.patchValue({
        goldPrice : 0,
        units : 0,
        totalprice : 0,
        discountRate : 2
      });
      localStorage.setItem('userName', '');
      localStorage.setItem('userType', '');
      this.router.navigate(["/"]);
    }
  }
