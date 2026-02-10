import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  form = { firstName: '', lastName: '', email: '', company: '', size: '', message: '' };
  submitting = false;
  success = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  submit() {
    if (this.submitting) return;
    this.submitting = true;
    this.error = null;
    this.http.post('/api/contact', this.form).subscribe({
      next: () => {
        this.success = true;
        this.submitting = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to send. Please try again.';
        this.submitting = false;
      }
    });
  }
}
