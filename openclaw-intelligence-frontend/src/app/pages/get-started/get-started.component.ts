
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.css']
})
export class GetStartedComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const sel: any = { svc: null, svcName: '', svcPrice: '', time: null };
    (window as any).selSvc = (el: HTMLElement, id: string, name: string, price: string) => {
      document.querySelectorAll('.svc').forEach(s => s.classList.remove('sel'));
      el.classList.add('sel');
      sel.svc = id; sel.svcName = name; sel.svcPrice = price;
      (window as any).checkStep1();
    };
    (window as any).selTime = (el: HTMLElement) => {
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('sel'));
      el.classList.add('sel');
      sel.time = el.textContent;
      (window as any).checkStep1();
    };
    (window as any).checkStep1 = () => {
      const btn = document.getElementById('btn1') as HTMLButtonElement | null;
      if (btn) btn.disabled = !(sel.svc && sel.time);
    };
    (window as any).selPM = (el: HTMLElement) => {
      document.querySelectorAll('.pm').forEach(p => p.classList.remove('sel'));
      el.classList.add('sel');
    };
    const parsePrice = (val: string) => {
      if (!val) return 0;
      const n = Number(String(val).replace(/[^0-9.]/g, ''));
      return isNaN(n) ? 0 : Math.round(n * 100);
    };

    (window as any).completeOrder = async () => {
      const btn = document.querySelector('#p3 .btn.btn--coral') as HTMLButtonElement | null;
      const errEl = document.getElementById('orderError');
      const showError = (msg: string) => {
        if (errEl) {
          errEl.textContent = msg;
          errEl.style.display = 'block';
        }
      };
      if (errEl) {
        errEl.textContent = '';
        errEl.style.display = 'none';
      }
      if (btn) btn.disabled = true;
      try {
        const firstName = (document.getElementById('fname') as HTMLInputElement | null)?.value || '';
        const lastName = (document.getElementById('lname') as HTMLInputElement | null)?.value || '';
        const email = (document.getElementById('email') as HTMLInputElement | null)?.value || '';
        const password = (document.getElementById('pw') as HTMLInputElement | null)?.value || '';
        const password2 = (document.getElementById('pw2') as HTMLInputElement | null)?.value || '';
        const phone = (document.getElementById('phone') as HTMLInputElement | null)?.value || '';
        const company = (document.getElementById('company') as HTMLInputElement | null)?.value || '';
        const website = (document.getElementById('website') as HTMLInputElement | null)?.value || '';
        const industry = (document.getElementById('industry') as HTMLSelectElement | null)?.value || '';
        const companySize = (document.getElementById('csize') as HTMLSelectElement | null)?.value || '';
        const goals = (document.getElementById('goals') as HTMLTextAreaElement | null)?.value || '';
        const termsAccepted = (document.getElementById('terms') as HTMLInputElement | null)?.checked || false;
        const meetingDate = (document.getElementById('consultDate') as HTMLInputElement | null)?.value || '';
        const meetingTime = (sel.time || '').trim();
        const vatNumber = (document.getElementById('vat') as HTMLInputElement | null)?.value || '';
        const country = (document.getElementById('country') as HTMLSelectElement | null)?.value || '';
        const city = (document.getElementById('city') as HTMLInputElement | null)?.value || '';

        if (!firstName || !lastName || !email || !password || !termsAccepted) {
          showError('Please complete all required fields and accept the terms.');
          if (btn) btn.disabled = false;
          return;
        }
        if (password !== password2) {
          showError('Passwords do not match.');
          if (btn) btn.disabled = false;
          return;
        }

        const signupResp = await fetch('https://openclawintelligence.com/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            phone,
            company,
            website,
            industry,
            companySize,
            automationGoal: goals,
            toolsConnected: [],
            termsAccepted
          })
        });
        const signupData = await signupResp.json().catch(() => ({}));
        if (!signupResp.ok || signupData?.ok === false) {
          showError(signupData?.message || 'Signup failed. Please try again.');
          if (btn) btn.disabled = false;
          return;
        }

        const orderResp = await fetch('https://openclawintelligence.com/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan: sel.svcName,
            billingCycle: sel.svc === 'monthly' ? 'monthly' : 'one-time',
            agents: [],
            currency: 'eur',
            subtotal: parsePrice(sel.svcPrice) / 100,
            vat: 0,
            total: parsePrice(sel.svcPrice) / 100,
            paymentMethod: 'card',
            firstName,
            lastName,
            email,
            company,
            vatNumber,
            country,
            city,
            meetingDate,
            meetingTime
          })
        });
        const orderData = await orderResp.json().catch(() => ({}));
        if (!orderResp.ok || orderData?.ok === false) {
          showError(orderData?.message || 'Order failed. Please try again.');
          if (btn) btn.disabled = false;
          return;
        }

        const loginResp = await fetch('https://openclawintelligence.com/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const loginData = await loginResp.json().catch(() => ({}));
        if (!loginResp.ok || loginData?.ok === false) {
          showError(loginData?.message || 'Account created, but login failed. Please log in from the login page.');
          if (btn) btn.disabled = false;
          return;
        }
        localStorage.setItem('ociToken', loginData.token);
        localStorage.setItem('ociLoggedIn', 'true');
        localStorage.setItem('ociRole', loginData.user?.role || 'user');
        localStorage.setItem('ociUserEmail', loginData.user?.email || email);

        const orderIdEl = document.getElementById('orderId');
        if (orderIdEl && orderData?.orderId) orderIdEl.textContent = String(orderData.orderId);
        (window as any).goTo(4);
      } catch (err) {
        console.error(err);
        showError('Something went wrong. Please try again.');
      } finally {
        if (btn) btn.disabled = false;
      }
    };

    (window as any).goTo = (n: number) => {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById('p' + n)?.classList.add('active');
      document.querySelectorAll('.step').forEach((s, i) => {
        const sn = i + 1;
        s.classList.remove('active', 'done');
        if (sn < n) s.classList.add('done');
        if (sn === n) s.classList.add('active');
      });
      for (let i = 1; i <= 3; i++) {
        const c = document.getElementById('c' + i);
        if (c) c.classList.toggle('done', i < n);
      }
      if (n === 3) {
        const d = (document.getElementById('consultDate') as HTMLInputElement | null)?.value;
        const email = (document.getElementById('email') as HTMLInputElement | null)?.value;
        const dateTxt = (d || 'TBD') + ' at ' + (sel.time || 'TBD');
        const sumSvc = document.getElementById('sumSvc');
        const sumDate = document.getElementById('sumDate');
        const sumEmail = document.getElementById('sumEmail');
        const sumTotal = document.getElementById('sumTotal');
        if (sumSvc) sumSvc.textContent = sel.svcName;
        if (sumDate) sumDate.textContent = dateTxt;
        if (sumEmail) sumEmail.textContent = email || '—';
        if (sumTotal) sumTotal.textContent = sel.svcPrice;

        const isFree = sel.svc === 'discovery' || String(sel.svcPrice).toLowerCase() === 'free';
        const paymentMethods = document.getElementById('paymentMethods');
        const cardFields = document.getElementById('cardFields');
        const billingSection = document.getElementById('billingSection');
        if (paymentMethods) paymentMethods.style.display = isFree ? 'none' : '';
        if (cardFields) cardFields.style.display = isFree ? 'none' : '';
        if (billingSection) billingSection.style.display = isFree ? 'none' : '';
      }
      if (n === 4) {
        const d = (document.getElementById('consultDate') as HTMLInputElement | null)?.value;
        const email = (document.getElementById('email') as HTMLInputElement | null)?.value;
        const dateTxt = (d || 'TBD') + ' at ' + (sel.time || 'TBD');
        const cfSvc = document.getElementById('cfSvc');
        const cfDate = document.getElementById('cfDate');
        const cfEmail = document.getElementById('cfEmail');
        const cfTotal = document.getElementById('cfTotal');
        if (cfSvc) cfSvc.textContent = sel.svcName;
        if (cfDate) cfDate.textContent = dateTxt;
        if (cfEmail) cfEmail.textContent = email || '—';
        if (cfTotal) cfTotal.textContent = sel.svcPrice;

        const isFree = sel.svc === 'discovery' || String(sel.svcPrice).toLowerCase() === 'free';
        const invoice = document.getElementById('invoiceDownload');
        if (invoice) invoice.style.display = isFree ? 'none' : '';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }
}
