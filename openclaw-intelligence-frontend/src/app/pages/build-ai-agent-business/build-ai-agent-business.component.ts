import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-build-ai-agent-business',
  templateUrl: './build-ai-agent-business.component.html',
  styleUrls: ['./build-ai-agent-business.component.css']
})
export class BuildAiAgentBusinessComponent {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('How to Build Your First AI Agent for Business (2026)');
    this.meta.updateTag({ name: 'description', content: 'Build your first AI business agent step by step. Choose the right model, connect APIs, write system prompts...' });
  }
}
