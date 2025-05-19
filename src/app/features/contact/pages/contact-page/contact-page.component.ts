import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';

interface ContactInfo {
  icon: string;
  title: string;
  detail: string;
}
@Component({
  selector: 'app-contact-page',
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css'],
})
export class ContactPageComponent {
  contactImage = '/image.png';

  formData = {
    name: '',
    email: '',
    phone: '',
    message: '',
  };

  successMessage = '';

  // Cards data
  contacts: ContactInfo[] = [
    {
      icon: 'phone',
      title: 'Phone',
      detail: '0000 - 123 - 456789\n0000 - 123 - 456789',
    },
    {
      icon: 'envelope',
      title: 'Email',
      detail: 'info@example.com\nsupport@example.com',
    },
    {
      icon: 'map-marker',
      title: 'Address',
      detail: 'No: 58 A, East Madison Street,\nBaltimore, MD, USA 4508',
    },
  ];

  // Safe URL for embedding Google Map
  mapUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    const rawUrl = 'https://www.google.com/maps/embed?pb=…YOUR_PARAMS_HERE…';
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  onSubmit() {
    this.successMessage = 'Your message has been sent successfully!';
    // Clear form data
    this.formData = {
      name: '',
      email: '',
      phone: '',
      message: '',
    };
    setTimeout(() => {
      this.successMessage = '';
    }, 2000);
  }
}
