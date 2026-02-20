import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-ai-dpa-compliance-guide',
  templateUrl: './ai-dpa-compliance-guide.component.html',
  styleUrls: ['./ai-dpa-compliance-guide.component.css']
})
export class AiDpaComplianceGuideComponent {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('AI DPA Compliance Guide 2026 — Compare 10 Providers');
    this.meta.updateTag({ name: 'description', content: 'AI DPA compliance made simple. Compare Data Processing Agreements from OpenAI, Anthropic, Google, AWS, Microsoft & 5 more...' });
  }
}
