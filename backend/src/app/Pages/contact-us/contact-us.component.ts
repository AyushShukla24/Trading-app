import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactUsService } from '../../services/contact-us.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-form',
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ["./contact-us.component.css"]
})
export class ContactUsComponent{
  contactForm: FormGroup;
  private toast = inject(ToastrService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private contactAuth:ContactUsService
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/) 
    ]],    
      supportType: ['', Validators.required],
      message: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      urgentMatter: [false]
    });
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.contactAuth.contactUsForm(this.contactForm.value).subscribe({
        next:(response)=>this.toast.success("Saved Successfully"),
        error:(error)=> console.log(error)
      })
    } 
  }  
}