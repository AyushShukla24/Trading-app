import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SecurityFeatureComponent } from "../security-feature/security-feature.component";

interface StockData {
  name: string;
  lastPrice: number;
  priceChangePercentage: number;
}

@Component({
  selector: 'app-section-2',
  standalone: true,
  imports: [CommonModule, SecurityFeatureComponent],
  templateUrl: './section-2.component.html',
  styleUrls: ['./section-2.component.css'],
})
export class Section2Component {
  features = [
    {
      icon: 'fas fa-shield-alt',
      title: 'Safekeeping Your Digital Assets',
      description: 'We keep your digital assets safe with an extra layer of security.',
      moreInfo: 'Our advanced security protocols protect against unauthorized access, ensuring the highest safety for your assets.'
    },
    {
      icon: 'fas fa-lock',
      title: '2-Factor Authentication',
      description: 'Double your account security with 2-factor authentication.',
      moreInfo: 'Choose the setup that suits you best to prevent unauthorized logins and keep your assets safe.'
    },
    {
      icon: 'fas fa-user-shield',
      title: 'End-to-End Encryption',
      description: 'We use advanced encryption for worry-free crypto trading and investment.',
      moreInfo: 'Our encryption standards ensure that your data is fully protected from third parties.'
    },
    {
      icon: 'fas fa-eye',
      title: 'Transparency - Your Right to Know',
      description: 'Explore our transparency reports and proof of reserves for you.',
      moreInfo: 'We believe that informed users make better decisions. Transparency is at the core of our services.'
    }
  ];
}