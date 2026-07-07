import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  message: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  async onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    const email = this.forgotPasswordForm.value.email;

    try {
      const { error } = await this.authService.resetPassword(email);
      if (error) throw error;
      this.message = 'Password reset email sent. Please check your inbox.';
    } catch (error: any) {
      this.message = 'Error: ' + error.message;
    }
  }
}
