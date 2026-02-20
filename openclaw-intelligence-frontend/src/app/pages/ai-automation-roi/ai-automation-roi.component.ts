import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-ai-automation-roi',
  templateUrl: './ai-automation-roi.component.html',
  styleUrls: ['./ai-automation-roi.component.css']
})
export class AiAutomationRoiComponent {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('AI Automation ROI: Calculate Your Business Case (2026)');
    this.meta.updateTag({ name: 'description', content: 'Calculate AI automation ROI with our 4-layer framework. Includes cost breakdowns, time savings formulas, payback period benchmarks...' });
  }
}
