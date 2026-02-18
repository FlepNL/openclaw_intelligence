
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => this.initAdmin());
  }

  private initAdmin(): void {
    const users = [
      {init:"PV",name:"Philippe V.",email:"philippe@flepholding.com",company:"Flep Holding B.V.",industry:"SaaS / Software",color:"linear-gradient(135deg,var(--coral),#ff8c6b)",services:["retainer","setup"],status:"active",joined:"Nov 20, 2025",mrr:"€2,997",spent:"€7,988",activity:[{dot:"coral",text:"Retainer renewed (€2,997)",time:"3 hours ago"},{dot:"blue",text:"Weekly Strategy completed",time:"Yesterday"}]},
      {init:"MW",name:"Marcus Weber",email:"marcus@weberdigital.de",company:"Weber Digital",industry:"Marketing / Agency",color:"linear-gradient(135deg,var(--blue),#7ba8ff)",services:["enterprise"],status:"active",joined:"Jan 8, 2026",mrr:"€8,500",spent:"€11,497",activity:[{dot:"phos",text:"Upgraded to Enterprise",time:"Feb 16"},{dot:"coral",text:"Payment captured €8,500",time:"Feb 16"}]},
      {init:"SC",name:"Sarah Chen",email:"sarah@nexuslabs.io",company:"Nexus Labs",industry:"E-commerce",color:"linear-gradient(135deg,var(--phos),#4deabc)",services:["retainer"],status:"active",joined:"Nov 28, 2025",mrr:"€2,997",spent:"€9,488",activity:[{dot:"warn",text:"Rescheduled meeting",time:"Yesterday"},{dot:"coral",text:"Retainer renewed",time:"Feb 1"}]},
      {init:"DK",name:"David Kim",email:"david@kineticai.co",company:"Kinetic AI",industry:"Consulting",color:"linear-gradient(135deg,var(--warn),#ffd280)",services:["strategy"],status:"active",joined:"Feb 3, 2026",mrr:"—",spent:"€497",activity:[{dot:"blue",text:"Strategy Session completed",time:"Yesterday"},{dot:"phos",text:"Account created",time:"Feb 3"}]},
      {init:"EM",name:"Elena Marchetti",email:"elena@marchetti.it",company:"Marchetti & Co",industry:"Finance / Fintech",color:"linear-gradient(135deg,var(--purple),#c4adfe)",services:["discovery"],status:"trial",joined:"Feb 18, 2026",mrr:"—",spent:"Free",activity:[{dot:"phos",text:"Signed up via Google",time:"2 min ago"},{dot:"blue",text:"Discovery Call booked",time:"2 min ago"}]},
      {init:"LS",name:"Lisa Strand",email:"lisa@nordicgroup.se",company:"Nordic Group",industry:"Manufacturing",color:"linear-gradient(135deg,#e879a8,#ff6b9d)",services:["workshop"],status:"active",joined:"Feb 10, 2026",mrr:"—",spent:"€1,997",activity:[{dot:"warn",text:"Workshop booked Feb 28",time:"Feb 14"},{dot:"coral",text:"Payment €1,997",time:"Feb 14"}]},
      {init:"TJ",name:"Tom Jensen",email:"tom@velocitysaas.com",company:"Velocity SaaS",industry:"SaaS / Software",color:"linear-gradient(135deg,#6bb8e0,#4d9ec8)",services:["setup"],status:"active",joined:"Feb 15, 2026",mrr:"—",spent:"€1,497",activity:[{dot:"blue",text:"Agent Setup in progress",time:"Feb 15"},{dot:"phos",text:"Account created",time:"Feb 15"}]},
      {init:"AR",name:"Anna Rossi",email:"anna@rossifreelance.com",company:"Freelance",industry:"Marketing / Agency",color:"linear-gradient(135deg,#7be09d,#52c87b)",services:["retainer"],status:"cancelled",joined:"Oct 15, 2025",mrr:"—",spent:"€14,985",activity:[{dot:"phos",text:"Cancelled retainer",time:"Feb 13"},{dot:"coral",text:"Last payment €2,997",time:"Feb 1"}]},
      {init:"JH",name:"Johan Hofer",email:"johan@alpinetech.ch",company:"Alpine Tech",industry:"Finance / Fintech",color:"linear-gradient(135deg,#8ca0c8,#6b82b0)",services:["retainer","strategy"],status:"active",joined:"Dec 5, 2025",mrr:"€2,997",spent:"€9,488",activity:[{dot:"coral",text:"Retainer renewed",time:"Feb 1"}]},
      {init:"RM",name:"Rachel Martinez",email:"rachel@brightspark.co",company:"BrightSpark",industry:"E-commerce",color:"linear-gradient(135deg,#f0a060,#e88838)",services:["setup"],status:"active",joined:"Feb 8, 2026",mrr:"—",spent:"€1,994",activity:[{dot:"blue",text:"Agent Setup completed",time:"Feb 15"}]},
    ];

    const tagMap: Record<string, string> = {retainer:'tag--retainer',setup:'tag--setup',strategy:'tag--strategy',discovery:'tag--discovery',workshop:'tag--workshop',enterprise:'tag--enterprise'};
    const tagLabel: Record<string, string> = {retainer:'Retainer',setup:'Agent Setup',strategy:'Strategy',discovery:'Discovery',workshop:'Workshop',enterprise:'Enterprise'};

    (window as any).renderUsers = (data: any[]) => {
      const tb = document.getElementById('userTable');
      if (!tb) return;
      tb.innerHTML = '';
      data.forEach((u, i) => {
        tb.innerHTML += `<tr data-i="${i}" data-status="${u.status}">
          <td><div class="user-cell"><div class="u-avatar" style="background:${u.color}">${u.init}</div><div><div class="u-name">${u.name}</div><div class="u-email">${u.email}</div></div></div></td>
          <td>${u.company}</td>
          <td>${u.services.map((s:any)=>`<span class="tag ${tagMap[s]}">${tagLabel[s]}</span>`).join(' ')}</td>
          <td><span class="status status--${u.status}">${u.status.charAt(0).toUpperCase()+u.status.slice(1)}</span></td>
          <td style="font-size:12px">${u.joined}</td>
          <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:${u.mrr!=='—'?'var(--coral)':'var(--t3)'}">${u.mrr}</td>
          <td><button class="btn-xs" onclick="openDrawer(${i})">View</button></td>
        </tr>`;
      });
    };

    let userFilter = 'all';
    (window as any).filterUsers = () => {
      const q = (document.getElementById('userSearch') as HTMLInputElement | null)?.value.toLowerCase() || '';
      document.querySelectorAll('#userTable tr').forEach(tr => {
        const row = tr as HTMLElement;
        const text = row.textContent?.toLowerCase() || '';
        const st = row.dataset['status'];
        const matchQ = !q || text.includes(q);
        const matchF = userFilter === 'all' || st === userFilter;
        row.style.display = matchQ && matchF ? '' : 'none';
      });
    };
    (window as any).setUserFilter = (el: HTMLElement, f: string) => {
      userFilter = f;
      document.querySelectorAll('.toolbar .filter-btn').forEach(b => b.classList.remove('on'));
      el.classList.add('on');
      (window as any).filterUsers();
    };

    (window as any).openDrawer = (i: number) => {
      const u = users[i];
      (document.getElementById('drawerName') as HTMLElement).textContent = u.name;
      (document.getElementById('drawerEmail') as HTMLElement).textContent = u.email;
      (document.getElementById('drawerStatus') as HTMLElement).innerHTML = `<span class="status status--${u.status}">${u.status.charAt(0).toUpperCase()+u.status.slice(1)}</span>`;
      (document.getElementById('drawerJoined') as HTMLElement).textContent = u.joined;
      (document.getElementById('drawerCompany') as HTMLElement).textContent = u.company;
      (document.getElementById('drawerIndustry') as HTMLElement).textContent = u.industry;
      (document.getElementById('drawerSpent') as HTMLElement).textContent = u.spent;
      (document.getElementById('drawerServices') as HTMLElement).innerHTML = u.services.map((s:any)=>`<span class="tag ${tagMap[s]}">${tagLabel[s]}</span>`).join(' ');
      (document.getElementById('drawerActivity') as HTMLElement).innerHTML = u.activity.map((a:any)=>`<div class="activity-item"><div class="activity-dot ${a.dot}"></div><div><div class="activity-text">${a.text}</div><div class="activity-time">${a.time}</div></div></div>`).join('');
      document.getElementById('drawerOverlay')?.classList.add('show');
      document.getElementById('drawer')?.classList.add('show');
    };
    (window as any).closeDrawer = () => {
      document.getElementById('drawerOverlay')?.classList.remove('show');
      document.getElementById('drawer')?.classList.remove('show');
    };

    (window as any).showTab = (el: HTMLElement | null, id: string) => {
      document.querySelectorAll('.tab-page').forEach(t => t.classList.remove('active'));
      document.getElementById('tab-' + id)?.classList.add('active');
      document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));
      if (el) el.classList.add('active');
      window.scrollTo({ top: 0 });
    };

    (window as any).buildChart = () => {
      const data = [{m:'Jul',v:18.2},{m:'Aug',v:21.5},{m:'Sep',v:24.1},{m:'Oct',v:26.8},{m:'Nov',v:30.4},{m:'Dec',v:33.2},{m:'Jan',v:34.5},{m:'Feb',v:38.4}];
      const max = Math.max(...data.map(d => d.v));
      const el = document.getElementById('revenueChart');
      if (!el) return;
      el.innerHTML = data.map(d => {
        const h = Math.round((d.v / max) * 160);
        const isLast = d.m === 'Feb';
        return `<div class="bar-group"><div class="bar-val">${d.v}K</div><div class="bar" style="height:${h}px;background:${isLast?'linear-gradient(180deg,var(--coral),var(--coral-h))':'linear-gradient(180deg,rgba(255,77,58,.4),rgba(255,77,58,.15))'}"></div><div class="bar-label">${d.m}</div></div>`;
      }).join('');
    };

    (window as any).renderUsers(users);
    (window as any).buildChart();
  }
}
