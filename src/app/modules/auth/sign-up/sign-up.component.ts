import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { EnumUtil } from '../../../core/utils/enum.util';
import { Gender } from '../../../core/user/user.model';

@Component({
  selector: 'auth-sign-up',
  templateUrl: './sign-up.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AuthSignUpComponent implements OnInit {
  @ViewChild('signUpNgForm') signUpNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  genderOptions = EnumUtil.enumToOptions<Gender>(Gender);
  signUpForm: FormGroup;
  showAlert: boolean = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      birthday: [new Date('1980/1/1'), Validators.required],
      password: ['', Validators.required],
      agreements: ['', Validators.requiredTrue]
    });
  }

  async signUp() {
    if (this.signUpForm.invalid) {
      return;
    }
    this.signUpForm.disable();
    this.showAlert = false;
    try {
      await this.authService.signUp(this.signUpForm.value).toPromise();
      this.router.navigateByUrl('/complete-profile');
    } catch (e) {
      this.signUpForm.enable();
      this.alert = { type: 'error', message: e.error.message || 'Something went wrong, please try again.' };
      this.showAlert = true;
    }
  }
}
