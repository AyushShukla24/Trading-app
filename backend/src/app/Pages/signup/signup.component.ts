import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule,MatProgressSpinnerModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  message: string | null = null;
  isLoading: boolean = false;
  private toast = inject(ToastrService);

  constructor(private authService: AuthService, private router: Router) {
    this.signupForm = new FormGroup({
      username: new FormControl("", [Validators.required, Validators.minLength(3)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl("", [Validators.required])
    });
  }

  passwordsMatchValidator(): boolean {
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  changeLogin() {
    this.router.navigateByUrl('/login');
  }

  onSubmit() {
    if (!this.passwordsMatchValidator()) {
      this.toast.error("Passwords do not match.");
      return;
    }
  
    if (this.signupForm.valid) {
      this.isLoading = true; 

      const { username, email, password } = this.signupForm.value;
      this.authService.signup(username, email, password).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.toast.success('Please check your email for verification.');
          this.router.navigate(['/verify-otp'], { queryParams: { email } });
        },
        error: (error) => {
          this.isLoading = false;
          this.toast.error(error.error.message);
        }
      });
    } else {
      this.message = "Please fill out the form correctly.";
      this.toast.error("Please fill out all required fields correctly.");
    }
  }

  goHome(){
    this.router.navigateByUrl('/')
  }
}
