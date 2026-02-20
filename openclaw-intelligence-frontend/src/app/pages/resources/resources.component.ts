import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('AI Automation Resources & Guides for Business');
    this.meta.updateTag({ name: 'description', content: 'Free guides, tools, and resources for businesses adopting AI agent automation...' });
  }
}
