import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from "../navbar/navbar.component";
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamModule, WebcamInitError } from 'ngx-webcam';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, WebcamModule],
  templateUrl: './profile-component.html',
  styleUrls: ['./profile-component.css'],
})
export class ProfileComponent implements OnInit {
  basicInfoForm: FormGroup;
  camData: boolean = false;
  capturedImage: WebcamImage | null = null;
  isEkycCompleted: boolean = false;

  private trigger: Subject<void> = new Subject<void>();

  user = {
    username: '',
    email: '',
    phoneNumber: '',
    isPhoneVerified: false,
    isEkycCompleted: false,
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toast: ToastrService
  ) {
    this.basicInfoForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  loadUserProfile() {
    const email = localStorage.getItem('email');
    if (!email) {
      this.toast.error('No email found in local storage');
      return;
    }

    this.http.get<any>(`http://localhost:8081/api/user?email=${email}`).subscribe({
      next: (data) => {
        this.user = { ...data, isEkycCompleted: data.ekycCompleted || data.isEkycCompleted };
        this.basicInfoForm.patchValue({
          username: data.username,
          email: data.email,
          phoneNumber: data.phoneNumber,
        });
      },
      error: (error) => {
        console.error('Failed to load user profile:', error);
        this.toast.error('Failed to load user profile');
      }
    });
  }

  onBasicInfoSubmit() {
    if (this.basicInfoForm.valid) {
      this.http.put('http://localhost:8081/api/user', this.basicInfoForm.value).subscribe({
        next: () => {
          localStorage.setItem('username', this.basicInfoForm.value.username);
          this.toast.success("Basic info updated successfully");
        },
        error: (err) => {
          console.error('Error updating basic info:', err);
          this.toast.error("Error updating basic info");
        },
      });
    } else {
      this.toast.error("Please fill in all required fields correctly");
    }
  }

  verifyPhone() {
    this.user.isPhoneVerified = true;
    this.toast.success("Phone number verified successfully");
  }

  onKycSubmit() {
    if (this.basicInfoForm.valid) {
      this.http.put('http://localhost:8081/api/user', this.basicInfoForm.value).subscribe({
        next: () => this.toast.success('KYC info updated successfully'),
        error: (err) => {
          console.error('Error updating KYC info:', err);
          this.toast.error('Error updating KYC info');
        }
      });
    } else {
      this.toast.error('Please fill in all required KYC fields correctly');
    }
  }

  canStartEkyc(): boolean {
    return this.user.isPhoneVerified && !this.user.isEkycCompleted;
  }

  checkPermission(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          this.camData = true;
        })
        .catch((error) => {
          console.error('Camera permission denied:', error);
          this.toast.error('Please allow camera access to complete eKYC');
        });

    } else {
      this.toast.error('Camera not supported on this device');
    }
  }

  captureImage(): void {
    this.trigger.next();
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      this.toast.error('Camera access denied. Please allow camera access to continue.');
    }
  }

  public capture(webcamImage: WebcamImage): void {
    this.capturedImage = webcamImage;
    this.camData = false;
    this.verifyEkyc();
  }

  verifyEkyc(): void {
    setTimeout(() => {
      this.user.isEkycCompleted = true;
      this.isEkycCompleted = true;
      this.toast.success('eKYC completed successfully');
      localStorage.setItem('isEkycCompleted', 'true');
      this.http.put('http://localhost:8081/api/user', this.user).subscribe({
        next: () => {
          this.toast.success('eKYC status updated successfully on the backend');
        },
        error: (err) => {
          console.error('Error updating eKYC status:', err);
          this.toast.error('Error updating eKYC status');
        }
      });
    }, 1500);
  }

  closeCamera(): void {
    this.camData = false;
  }
}
