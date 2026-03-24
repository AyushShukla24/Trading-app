import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-security-feature',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './security-feature.component.html',
  styleUrls: ['./security-feature.component.css']
})
export class SecurityFeatureComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() moreInfo: string = '';
  isExpanded: boolean = false;

  toggleDetails() {
    this.isExpanded = !this.isExpanded;
  }
}
