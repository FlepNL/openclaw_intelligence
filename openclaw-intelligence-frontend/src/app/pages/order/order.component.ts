import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: []
})
export class OrderComponent implements AfterViewInit {
  private currentStep = 1;
  private selectedPlan: string | null = null;
  private planPrice = 0;
  private isAnnual = false;
  private agents: Record<string, number> = {};
  private orderSubmitted = false;
  private stripe: any;
  private elements: any;
  private clientSecret: string | null = null;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    const w = window as any;
    w.toggleBilling = this.toggleBilling.bind(this);
    w.selectPlan = this.selectPlan.bind(this);
    w.toggleAgent = this.toggleAgent.bind(this);
    w.selectPayment = this.selectPayment.bind(this);
    w.goToStep = this.goToStep.bind(this);
    w.completeOrder = this.completeOrder.bind(this);
    this.updateSummary();
  }

  private toggleBilling() {
    this.isAnnual = !this.isAnnual;
    const sw = document.getElementById('billingSwitch');
    const ml = document.getElementById('monthlyLabel');
    const al = document.getElementById('annualLabel');
    sw?.classList.toggle('annual', this.isAnnual);
    ml?.classList.toggle('active', !this.isAnnual);
    al?.classList.toggle('active', this.isAnnual);

    document.querySelectorAll('.plan__price').forEach((el) => {
      const m = (el as HTMLElement).dataset['monthly'];
      const a = (el as HTMLElement).dataset['annual'];
      const val = this.isAnnual ? a : m;
      if (val) {
        (el as HTMLElement).innerHTML = `€${Number(val).toLocaleString()}<span>/mo</span>`;
      }
    });
    this.updateSummary();
  }

  private selectPlan(el: HTMLElement, name: string, monthly: number, annual: number) {
    document.querySelectorAll('.plan').forEach((p) => p.classList.remove('selected'));
    el.classList.add('selected');
    this.selectedPlan = name;
    this.planPrice = this.isAnnual ? annual : monthly;
    const nextBtn = document.getElementById('step1Next') as HTMLButtonElement | null;
    if (nextBtn) nextBtn.disabled = false;
    this.updateSummary();
  }

  private toggleAgent(btn: HTMLElement, name: string, price: number) {
    const card = btn.closest('.agent-card');
    const isAdded = card?.classList.contains('added');
    if (isAdded) {
      card?.classList.remove('added');
      btn.className = 'agent__toggle agent__toggle--add';
      btn.textContent = `+ Add · €${price}/mo`;
      delete this.agents[name];
    } else {
      card?.classList.add('added');
      btn.className = 'agent__toggle agent__toggle--remove';
      btn.textContent = '✓ Added';
      this.agents[name] = price;
    }
    this.updateSummary();
  }

  private selectPayment(el: HTMLElement) {
    document.querySelectorAll('.payment-method').forEach((m) => m.classList.remove('active'));
    el.classList.add('active');
  }

  private updateSummary() {
    const price = this.isAnnual ? Math.round(this.planPrice * 0.8) : this.planPrice;
    const planLabel = this.selectedPlan
      ? this.selectedPlan.charAt(0).toUpperCase() + this.selectedPlan.slice(1) + ' Plan'
      : '—';

    const s = document.getElementById('orderSummary');
    if (s) {
      const planName = document.getElementById('summaryPlanName');
      const planPrice = document.getElementById('summaryPlanPrice');
      planName && (planName.textContent = planLabel);
      planPrice && (planPrice.textContent = `€${price}`);

      const agentsDiv = document.getElementById('summaryAgents');
      if (agentsDiv) {
        agentsDiv.innerHTML = '';
        let agentTotal = 0;
        Object.entries(this.agents).forEach(([name, p]) => {
          const ap = this.isAnnual ? Math.round(p * 0.8) : p;
          agentTotal += ap;
          agentsDiv.innerHTML += `<div class="summary__agent">${name} · €${ap}/mo</div>`;
        });
        const total = price + agentTotal;
        const totalEl = document.getElementById('summaryTotal');
        totalEl && (totalEl.textContent = `€${total.toLocaleString()}/mo`);
      }
    }

    const ps = document.getElementById('paymentSummary');
    if (ps) {
      const psPlanName = document.getElementById('psPlanName');
      const psPlanPrice = document.getElementById('psPlanPrice');
      psPlanName && (psPlanName.textContent = planLabel);
      psPlanPrice && (psPlanPrice.textContent = `€${price}`);

      const psAgents = document.getElementById('psAgents');
      let at = 0;
      if (psAgents) {
        psAgents.innerHTML = '';
        Object.entries(this.agents).forEach(([name, p]) => {
          const ap = this.isAnnual ? Math.round(p * 0.8) : p;
          at += ap;
          psAgents.innerHTML += `<div class="summary__agent">${name} · €${ap}/mo</div>`;
        });
      }

      const subtotal = price + at;
      const vat = Math.round(subtotal * 0.21);
      const psSubtotal = document.getElementById('psSubtotal');
      const psVat = document.getElementById('psVat');
      const psTotal = document.getElementById('psTotal');
      psSubtotal && (psSubtotal.textContent = `€${subtotal.toLocaleString()}`);
      psVat && (psVat.textContent = `€${vat.toLocaleString()}`);
      psTotal && (psTotal.textContent = `€${(subtotal + vat).toLocaleString()}/mo`);
    }
  }

  private async goToStep(step: number) {
    if (step === 2 && !this.selectedPlan) return;

    document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
    const page = document.getElementById('page' + step);
    page?.classList.add('active');

    document.querySelectorAll('.step').forEach((s, i) => {
      const n = i + 1;
      s.classList.remove('step--active', 'step--done');
      if (n < step) s.classList.add('step--done');
      else if (n === step) s.classList.add('step--active');
    });

    for (let i = 1; i <= 3; i++) {
      const conn = document.getElementById('conn' + i);
      conn?.classList.toggle('done', i < step);
    }

    this.currentStep = step;
    this.updateSummary();

    if (step === 3) {
      await this.preparePaymentElement();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private async completeOrder() {
    const messageEl = document.getElementById('payment-message');
    if (messageEl) messageEl.textContent = '';

    if (!this.selectedPlan) return;
    if (!this.stripe || !this.elements) {
      await this.preparePaymentElement();
    }

    if (!this.stripe || !this.elements) {
      if (messageEl) messageEl.textContent = 'Payment form not ready. Please try again.';
      return;
    }

    try {
      const result = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: window.location.href
        },
        redirect: 'if_required'
      });

      if (result.error) {
        if (messageEl) messageEl.textContent = result.error.message || 'Payment failed.';
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status !== 'succeeded') {
        if (messageEl) messageEl.textContent = `Payment status: ${result.paymentIntent.status}`;
        return;
      }

      await this.finalizeOrder();
    } catch (err) {
      console.error('Payment confirmation failed', err);
      if (messageEl) messageEl.textContent = 'Payment failed. Please try again.';
    }
  }

  private async finalizeOrder() {
    const cfPlan = document.getElementById('cfPlan');
    const cfAgents = document.getElementById('cfAgents');
    const cfTotal = document.getElementById('cfTotal');
    const cfOrderId = document.getElementById('cfOrderId');

    const price = this.isAnnual ? Math.round(this.planPrice * 0.8) : this.planPrice;
    let at = 0;
    Object.values(this.agents).forEach((p) => (at += this.isAnnual ? Math.round(p * 0.8) : p));
    const total = price + at;
    const vat = Math.round(total * 0.21);

    cfPlan && (cfPlan.textContent = this.selectedPlan ? this.selectedPlan.charAt(0).toUpperCase() + this.selectedPlan.slice(1) : '—');
    cfAgents && (cfAgents.textContent = Object.keys(this.agents).length ? Object.keys(this.agents).join(', ') : 'None selected');
    cfTotal && (cfTotal.textContent = `€${(total + vat).toLocaleString()}`);

    if (!this.orderSubmitted) {
      this.orderSubmitted = true;
      const orderId = await this.submitOrder();
      if (cfOrderId) cfOrderId.textContent = orderId ? orderId : '—';
    }

    await this.goToStep(4);
  }

  private async submitOrder(): Promise<string | null> {
    const payload = this.buildOrderPayload();
    try {
      const resp: any = await firstValueFrom(this.http.post('/api/order', payload));
      return resp?.orderId || null;
    } catch (err) {
      console.error('Order submit failed', err);
      return null;
    }
  }

  private async preparePaymentElement() {
    try {
      const config: any = await firstValueFrom(this.http.get('/api/stripe/config'));
      if (!config?.publishableKey) return;
      const stripeCtor = (window as any).Stripe;
      if (!stripeCtor) return;

      this.stripe = stripeCtor(config.publishableKey);

      const total = this.calculateTotal();
      const amount = Math.round(total * 100);

      const intentResp: any = await firstValueFrom(
        this.http.post('/api/stripe/payment-intent', {
          amount,
          currency: 'eur',
          receipt_email: (document.getElementById('billingEmail') as HTMLInputElement | null)?.value || undefined,
          metadata: {
            plan: this.selectedPlan,
            billingCycle: this.isAnnual ? 'annual' : 'monthly'
          }
        })
      );

      this.clientSecret = intentResp?.clientSecret;
      if (!this.clientSecret) return;

      const paymentElement = document.getElementById('payment-element');
      if (!paymentElement) return;
      paymentElement.innerHTML = '';

      this.elements = this.stripe.elements({ clientSecret: this.clientSecret });
      const paymentEl = this.elements.create('payment');
      paymentEl.mount('#payment-element');
    } catch (err) {
      console.error('Stripe init failed', err);
    }
  }

  private calculateTotal() {
    const price = this.isAnnual ? Math.round(this.planPrice * 0.8) : this.planPrice;
    let at = 0;
    Object.values(this.agents).forEach((p) => (at += this.isAnnual ? Math.round(p * 0.8) : p));
    const subtotal = price + at;
    const vat = Math.round(subtotal * 0.21);
    return subtotal + vat;
  }

  private buildOrderPayload() {
    const getValue = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.value?.trim();
    const paymentMethodEl = document.querySelector('.payment-method.active') as HTMLElement | null;
    const paymentMethod = paymentMethodEl?.innerText?.trim() || 'Card';

    const price = this.isAnnual ? Math.round(this.planPrice * 0.8) : this.planPrice;
    let at = 0;
    Object.values(this.agents).forEach((p) => (at += this.isAnnual ? Math.round(p * 0.8) : p));
    const subtotal = price + at;
    const vat = Math.round(subtotal * 0.21);
    const total = subtotal + vat;

    return {
      plan: this.selectedPlan,
      billingCycle: this.isAnnual ? 'annual' : 'monthly',
      agents: Object.entries(this.agents).map(([name, price]) => ({ name, price })),
      currency: 'EUR',
      subtotal,
      vat,
      total,
      paymentMethod,
      firstName: getValue('billingFirstName'),
      lastName: getValue('billingLastName'),
      company: getValue('billingCompany'),
      vatNumber: getValue('billingVat'),
      email: getValue('billingEmail'),
      country: (document.getElementById('billingCountry') as HTMLSelectElement | null)?.value || '',
      city: getValue('billingCity')
    };
  }
}
