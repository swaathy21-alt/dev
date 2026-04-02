import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

const PAGE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',   accounts: 'Accounts',      setup: 'Guided Setup',
  campaigns: 'Campaigns',   pricing:  'Pricing',        failures: 'API Failures',
  queries:   'Open Queries', comms:   'Comms Dashboard'
};

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <span class="breadcrumb">TTP Console &rsaquo; <strong>{{ pageLabel }}</strong></span>
      <div class="tb-space"></div>
      <input class="tb-search" placeholder="Search accounts, trades, devices..."/>
      <div class="online-dot"></div>
      <span class="online-lbl">Online</span>
      <div class="av">SK</div>
    </header>`,
  styles: [`
    .topbar { height:52px; background:var(--topbar); display:flex; align-items:center; padding:0 24px; gap:16px; border-bottom:1px solid var(--topbar-border); flex-shrink:0; }
    .breadcrumb { color:var(--text-muted); font-size:13px; white-space:nowrap; }
    .breadcrumb strong { color:var(--text); }
    .tb-space { flex:1; }
    .tb-search { width:260px; padding:6px 12px; border:1px solid var(--topbar-border); border-radius:7px; background:rgba(255,255,255,.6); font-size:12px; outline:none; }
    .online-dot { width:8px; height:8px; border-radius:50%; background:var(--green); flex-shrink:0; }
    .online-lbl { font-size:11px; color:var(--text-muted); }
    .av { width:30px; height:30px; border-radius:50%; background:var(--accent); color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; }
  `]
})
export class TopbarComponent {
  pageLabel = 'Dashboard';

  constructor(private router: Router) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const seg = (event.urlAfterRedirects as string).split('/')[1]?.split('?')[0] || 'dashboard';
        this.pageLabel = PAGE_LABELS[seg] ?? 'TTP Admin';
      }
    });
  }
}
