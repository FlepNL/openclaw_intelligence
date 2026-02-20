
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
    const users: any[] = [];

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

    const token = localStorage.getItem('ociToken');
    if (token) {
      fetch('https://openclawintelligence.com/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()).then((data:any) => {
        if (data?.ok && Array.isArray(data.users)) {
          const mapped = data.users.map((u:any) => {
            const init = ((u.first_name||'')[0]||'') + ((u.last_name||'')[0]||'');
            return {
              init: init || 'U',
              name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
              email: u.email,
              company: u.company || '—',
              industry: u.industry || '—',
              color: 'linear-gradient(135deg,var(--coral),#ff8c6b)',
              services: [],
              status: 'active',
              joined: new Date(u.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }),
              mrr: '—',
              spent: u.total_spent ? `€${u.total_spent}` : '€0',
              activity: []
            };
          });
          (window as any).renderUsers(mapped);
        } else {
          (window as any).renderUsers(users);
        }
      }).catch(() => (window as any).renderUsers(users));

      fetch('https://openclawintelligence.com/api/admin/contacts', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()).then((data:any) => {
        const tbody = document.getElementById('contactsTable');
        if (!tbody) return;
        if (!data?.ok || !Array.isArray(data.contacts) || data.contacts.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--t3);padding:16px">No contacts yet.</td></tr>';
          return;
        }
        tbody.innerHTML = data.contacts.map((c:any) => `
          <tr>
            <td>${c.ticket_id || '—'}</td>
            <td>${c.first_name || ''} ${c.last_name || ''}</td>
            <td>${c.email || ''}</td>
            <td>${(c.message || '').slice(0,80)}</td>
            <td>${new Date(c.created_at).toLocaleString()}</td>
          </tr>`).join('');
      }).catch(()=>{});
    } else {
      (window as any).renderUsers(users);
    }
    (window as any).buildChart();
  }
}
