import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-gdpr-ai-compliance-checklist',
  templateUrl: './gdpr-ai-compliance-checklist.component.html',
  styleUrls: ['./gdpr-ai-compliance-checklist.component.css']
})
export class GdprAiComplianceChecklistComponent {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('GDPR AI Compliance Checklist for European Businesses');
    this.meta.updateTag({ name: 'description', content: 'GDPR compliance checklist built for AI-powered businesses. 25+ actionable items covering DPAs, DPIAs, lawful bases...' });
  }
}
