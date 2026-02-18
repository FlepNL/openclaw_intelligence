
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
        const orderId = document.getElementById('orderId');
        if (orderId) orderId.textContent = String(Math.floor(1000 + Math.random() * 9000));
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
