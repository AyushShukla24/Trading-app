import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink,NgClass,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  username: string | null = localStorage.getItem('username'); 
  isMenuOpen = false;
  isDropdownOpen = false;
  private toast = inject(ToastrService); 

  constructor(private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goToProfile(){
    this.router.navigateByUrl('/profile')
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    localStorage.removeItem('username'); 
    localStorage.removeItem('email'); 
    localStorage.removeItem('eKYC status')
    this.username = null; 
    this.isDropdownOpen = false;
    this.toast.success("Logout Successfully");
    this.router.navigate(['/login']);  
  }
}
