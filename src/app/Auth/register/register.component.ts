import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/dataService/data.service';
import { ApiService } from 'src/app/service/api/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  shopName = '';
  signUpForm!: FormGroup;
  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private authService: AuthService,
    private api: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      country: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      password: ['', Validators.required],
      birthday: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator.bind(this) });

    this.dataService.shopName.subscribe((data) => {
      if (data == null) return;
      this.shopName = data[0].shopName;
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    }
  }

  async onSubmitSignUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, phone, country, address1, address2, city, state, postalCode, birthday, password } = this.signUpForm.value;

    try {
      this.spinner.show();
      const { data, error } = await this.authService.createUserWithEmailAndPassword(email, password);
      if (error) throw error;

      await firstValueFrom(this.api.updateProfile({
        firstName, lastName, email, phone, country, address1, address2, city, state, postalCode, birthday
      }));

      this.toastr.success('Sign Up Successful!');
      this.router.navigate(['home']);
    } catch (error) {
      this.toastr.error('Sign Up Failed. Please try again.');
    } finally {
      this.spinner.hide();
    }
  }
}
