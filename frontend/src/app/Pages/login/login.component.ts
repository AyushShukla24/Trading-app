import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formData: FormGroup;
  message: string | null = null;
  isLoading = false;
  private toast = inject(ToastrService);

  constructor(private authService: AuthService, private router: Router) {
    this.formData = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  changeSignup() {
    this.router.navigateByUrl('/signup');
  }

  onSubmit() {
    if (this.formData.valid) {
      this.isLoading = true; 
      const { email, password } = this.formData.value;

      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          // console.log('Login successful', response);
          this.toast.success('Login successful');
          const { username } = response;

          localStorage.setItem('email', email);
          localStorage.setItem('username', username);
          this.router.navigate(['/']);
          this.isLoading = false; 
        },
        error: (error) => {
          console.error('Login error', error);
          this.toast.error(error.error.message);
          this.isLoading = false; 
        },
      });
    } else {
      this.message = 'Please fill in the form correctly.';
      this.toast.warning(this.message);
      console.error('Form is invalid', this.formData.errors);
    }
  }

  goHome() {
    this.router.navigateByUrl('/');
  }  
}