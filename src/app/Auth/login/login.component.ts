import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/service/dataService/data.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  shopName!: string;
  signInForm!: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.subscriptions.push(
      this.dataService.currentUser.subscribe((data: any) => {
        if (data == null) return;
        this.router.navigate(['profile']);
      })
    );
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.subscriptions.push(
      this.dataService.shopName.subscribe((data) => {
        if (data == null) return;
        this.shopName = data[0].shopName;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async onSubmitSignIn() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    try {
      this.spinner.show();
      const { email, password } = this.signInForm.value;
      const { error } = await this.authService.signInWithEmailAndPassword(email, password);
      if (error) throw error;

      this.toastr.success('Login Successfully');
      this.dataService.syncLocalStorageToSupabase();
      this.router.navigate(['home']);
    } catch (error: any) {
      this.toastr.warning(error?.message || '' + error);
    } finally {
      this.spinner.hide();
    }
  }

  navigateToSignUp() {
    this.router.navigate(['signUp']);
  }

  handleForgotPassword() {
    this.router.navigate(['forgot-password']);
  }
}
