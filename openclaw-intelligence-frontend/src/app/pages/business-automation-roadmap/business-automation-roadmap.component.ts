import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-business-automation-roadmap',
  templateUrl: './business-automation-roadmap.component.html',
  styleUrls: ['./business-automation-roadmap.component.css']
})
export class BusinessAutomationRoadmapComponent {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Business Automation Roadmap: Manual to Autonomous in 5 Phases');
    this.meta.updateTag({ name: 'description', content: 'Go from manual operations to autonomous AI workflows in 5 phases. Includes priority matrices, pilot strategies...' });
  }
}
