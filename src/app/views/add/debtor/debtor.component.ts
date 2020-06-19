import { Component, OnInit } from '@angular/core';
import { statuses } from '@app/models';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-debtor',
  templateUrl: './debtor.component.html',
  styleUrls: ['./debtor.component.css']
})
export class DebtorComponent implements OnInit {

  company_name: string;
  all_statuses: string[] = statuses;

  addDebtorForm: FormGroup = new FormGroup(
    {
      company: new FormControl(),
      reg_number: new FormControl(),
      debt: new FormControl(),

      legal_address: new FormControl(),
      city: new FormControl(),
      postal_code: new FormControl(),
      country: new FormControl(),
      phone: new FormControl(),
      fax: new FormControl(),
      email: new FormControl(),
      homepage: new FormControl(),
      bank_name: new FormControl(),
      bank_account_number: new FormControl(),
      status: new FormControl(),
      note: new FormControl(),
    }
  );

  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.addDebtorForm = this.formBuilder.group(
      {
        company: ['', [Validators.required]], // TODO min oder max length?
        reg_number: ['', [Validators.required]], // TODO min oder max length?
        debt: ['', [Validators.required]], // TODO min oder max length? number?
        legal_address: [],
        city: [],
        postal_code: [],
        country: [],
        phone: [],
        fax: [],
        email: [],
        homepage: [],
        bank_name: [],
        bank_account_number: [],
        status: [],
        note: [],
      }
    );
  }

  /**
   * set company name in cards
   */
  changedCompanyName() {
    this.company_name = this.addDebtorForm.controls['company'].value;
  }

  statusChanged(status) {
    console.log(status);
  }


  /**
   * submit
   */
  onSubmit() {

    console.log('submit');

    const company = this.addDebtorForm.controls['company'].value;
    console.log(company);


  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addDebtorForm.controls;
  }
}
