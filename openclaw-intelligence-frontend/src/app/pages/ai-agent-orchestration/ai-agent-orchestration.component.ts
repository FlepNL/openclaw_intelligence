import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-ai-agent-orchestration',
  templateUrl: './ai-agent-orchestration.component.html',
  styleUrls: ['./ai-agent-orchestration.component.css']
})
export class AiAgentOrchestrationComponent {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('AI Agent Orchestration: Complete Business Guide (2026)');
    this.meta.updateTag({ name: 'description', content: 'Master AI agent orchestration for business. Learn 4 core patterns (sequential, parallel, router, hierarchical)...' });
  }
}
