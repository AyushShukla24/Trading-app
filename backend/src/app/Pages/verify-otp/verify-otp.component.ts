import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OtpVerificationService } from '../../services/otp-verification.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent {
  otpForm!: FormGroup;
  email!: string; // Make it optional initially

  private toast = inject(ToastrService); 

  constructor(
    private fb: FormBuilder,
    private authService: OtpVerificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.sendOtpAutomatically()
    });

    this.otpForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.pattern('[0-9]{1}')]],
      otp2: ['', [Validators.required, Validators.pattern('[0-9]{1}')]],
      otp3: ['', [Validators.required, Validators.pattern('[0-9]{1}')]],
      otp4: ['', [Validators.required, Validators.pattern('[0-9]{1}')]],
      otp5: ['', [Validators.required, Validators.pattern('[0-9]{1}')]],
      otp6: ['', [Validators.required, Validators.pattern('[0-9]{1}')]],
    });
  }

  private sendOtpAutomatically() {
    this.authService.sendOtp(this.email).subscribe({
      next: () => {
        this.toast.success('OTP sent successfully to your email.');
      },
      error: (err) => {
        // this.toast.error('Failed to send OTP. Please try again.');
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.otpForm.invalid) {
      this.toast.error('Please fill in all 6 digits of the OTP.');
      return;
    }

    const otp = `${this.otpForm.value.otp1}${this.otpForm.value.otp2}${this.otpForm.value.otp3}${this.otpForm.value.otp4}${this.otpForm.value.otp5}${this.otpForm.value.otp6}`;

    this.authService.verifyOtp(this.email, otp).subscribe({
      next: () => {
        this.toast.success('Verified Successfully!');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toast.error('Invalid OTP');
      }
    });
  }

  moveToNext(event: KeyboardEvent, currentControl: string) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && input.nextElementSibling) {
      (input.nextElementSibling as HTMLInputElement).focus();
    } else if (input.value.length === 0 && input.previousElementSibling) {
      (input.previousElementSibling as HTMLInputElement).focus();
    }
  }
}
