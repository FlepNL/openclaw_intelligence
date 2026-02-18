import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: []
})
export class SignupComponent implements AfterViewInit {
  private currentStep = 1;
  private connectedTools = new Set<string>();
  private signupSubmitted = false;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    const w = window as any;
    w.signupGoTo = this.signupGoTo.bind(this);
    w.checkPwStrength = this.checkPwStrength.bind(this);
    w.connectTool = this.connectTool.bind(this);
  }

  private signupGoTo(step: number) {
    document.querySelectorAll('.form-page').forEach((p) => p.classList.remove('active'));
    const page = document.getElementById('signupPage' + step);
    page?.classList.add('active');

    const steps = document.querySelectorAll('.mini-step');
    steps.forEach((s, i) => {
      s.classList.remove('active', 'done');
      if (i + 1 < step) s.classList.add('done');
      else if (i + 1 === step) s.classList.add('active');
    });

    this.currentStep = step;

    if (step === 4 && !this.signupSubmitted) {
      this.signupSubmitted = true;
      this.submitSignup();
    }
  }

  private checkPwStrength(val: string) {
    const bars = [
      document.getElementById('pw1'),
      document.getElementById('pw2'),
      document.getElementById('pw3'),
      document.getElementById('pw4')
    ];
    const label = document.getElementById('pwLabel');

    bars.forEach((b) => b && (b.className = 'pw-bar'));

    let score = 0;
    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = ['', 'weak', 'medium', 'strong', 'strong'];
    const labels = [
      'Use 12+ characters with uppercase, numbers, and symbols',
      'Weak — add more characters',
      'Getting there — add a symbol',
      'Strong password',
      'Excellent!'
    ];

    for (let i = 0; i < score; i++) {
      const bar = bars[i] as HTMLElement | null;
      bar?.classList.add(levels[score]);
    }
    if (label) {
      label.textContent = labels[score];
      (label as HTMLElement).style.color = score >= 3 ? 'var(--phosphor)' : score >= 2 ? '#ffb800' : 'var(--text-muted)';
    }
  }

  private connectTool(card: HTMLElement) {
    const isConnected = card.classList.contains('connected');
    const tool = card.dataset['tool'] || card.querySelector('.tool-card__name')?.textContent || 'unknown';
    if (isConnected) {
      card.classList.remove('connected');
      card.querySelector('.tool-card__status')!.textContent = 'not connected';
      this.connectedTools.delete(tool);
    } else {
      card.classList.add('connected');
      card.querySelector('.tool-card__status')!.textContent = '✓ connected';
      this.connectedTools.add(tool);
    }
  }

  private async submitSignup() {
    const payload = this.buildSignupPayload();
    try {
      await firstValueFrom(this.http.post('/api/signup', payload));
    } catch (err) {
      console.error('Signup submit failed', err);
    }
  }

  private buildSignupPayload() {
    const getValue = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null)?.value?.trim();

    return {
      firstName: getValue('firstName'),
      lastName: getValue('lastName'),
      email: getValue('email'),
      company: getValue('companyName'),
      website: getValue('companyWebsite'),
      industry: (document.getElementById('companyIndustry') as HTMLSelectElement | null)?.value || '',
      companySize: (document.getElementById('companySize') as HTMLSelectElement | null)?.value || '',
      automationGoal: getValue('automationGoal'),
      toolsConnected: Array.from(this.connectedTools),
      termsAccepted: (document.getElementById('termsAgree') as HTMLInputElement | null)?.checked || false
    };
  }
}
