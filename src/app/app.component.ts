import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tip-calculator';
  tipAmount = signal(0);
  totalAmount = signal(0);

  form: FormGroup;
  isFormInvalid: boolean = false;

  tipPercentageArray = [
    5, 10, 15, 25, 50
  ]

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      bill_amount: ['', [Validators.required, Validators.min(0.01)]],
      no_of_people: ['', [Validators.required, Validators.min(1)]],
      tip_percentage: ['', [Validators.required, Validators.min(1)]],
    });
    this.form.valueChanges.subscribe(value => {
      const billAmount = value['bill_amount'] > 0 ? value['bill_amount'] : 0;
      if (billAmount> 0 && value['tip_percentage'] > 0) {
        let tipAmount = (value['bill_amount'] * value['tip_percentage']) / 100
        
        if (value['no_of_people'] > 0) {
          tipAmount = tipAmount/value['no_of_people'];
        }
        this.tipAmount.set(tipAmount);
      }
      
      const total = billAmount + this.tipAmount();
      if (value['no_of_people'] > 0 && value['bill_amount'] > 0) {
        this.totalAmount.set(total/value['no_of_people']);
      } else {
        this.totalAmount.set(total);
      }
    });
  }

  get bill_amount() {
    return this.form.get('bill_amount');
  }

  get no_of_people() {
    return this.form.get('no_of_people');
  }

  get tip_percentage() {
    return this.form.get('tip_percentage');
  }

  setTipPercentage(tip: number) {
    this.form.get('tip_percentage')?.setValue(tip);
  }

}
