import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnotifyService } from 'ng-snotify';

import { User } from '@app/models';
import { environment } from '@environments/environment';
import { ObjectsService } from '@shared/services';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class SettingComponent implements OnInit {
  submitted: boolean = false;
  loading: boolean = false;

  settingForm: FormGroup = new FormGroup({
    password_old: new FormControl(),
    password_new: new FormControl(),
    password_new_confirmation: new FormControl(),
  });

  constructor(
    private title: Title,
    private objectsService: ObjectsService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private router: Router,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit(): void {
    // set browser title
    this.title.setTitle('edit my setting');
    // set bread crumb menu
    this.objectsService.setBreadCrumb([
      { route: '/', name: 'Home', active: false },
      { route: '/user', name: 'User', active: true },
      { route: '/user/setting', name: 'Setting', active: true },
    ]);

    // init validators
    this.settingForm = this.formBuilder.group({
      password_old: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
        ],
      ],
      password_new: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
        ],
      ],
      password_confirmation: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
        ],
      ],
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.settingForm.invalid) {
      this.translate
        .get('toast.error.signup_form')
        .subscribe((error: string) => {
          this.snotifyService.error(error);
        });

      return;
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.settingForm.controls;
  }
}
