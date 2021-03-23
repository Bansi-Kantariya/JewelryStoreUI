import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalcculationDetails } from '../models/calculation-detail';

@Component({
  selector: 'app-generate-discount-print-to-screen',
  templateUrl: './generate-discount-print-to-screen.component.html',
  styleUrls: ['./generate-discount-print-to-screen.component.css']
})
export class GenerateDiscountPrintToScreenComponent implements OnInit {
  @Input() calculationDetails!: CalcculationDetails;
  @Input() isPreviledgeUser!: boolean;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }

}
