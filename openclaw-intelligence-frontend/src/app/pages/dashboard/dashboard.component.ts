
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    (window as any).showTab = (id: string) => {
      document.querySelectorAll('.tab-page').forEach(t => t.classList.remove('active'));
      document.getElementById('tab-' + id)?.classList.add('active');
      document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));
      const evt = (window as any).event as Event | undefined;
      const target = evt?.currentTarget as HTMLElement | undefined;
      if (target) target.classList.add('active');
      window.scrollTo({ top: 0 });
    };
  }
}
