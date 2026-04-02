import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  id: string; label: string; icon: string; badge?: number; badgeClass?: string;
}

const NAV: (NavItem | null)[] = [
  { id: 'dashboard', label: 'Dashboard',       icon: '⊞' },
  { id: 'accounts',  label: 'Accounts',        icon: '🏢', badge: 5,  badgeClass: 'neutral' },
  { id: 'setup',     label: 'Guided Setup',    icon: '⚙' },
  null,
  { id: 'campaigns', label: 'Campaigns',       icon: '📢', badge: 2,  badgeClass: 'green' },
  { id: 'pricing',   label: 'Pricing',         icon: '💷' },
  null,
  { id: 'failures',  label: 'API Failures',    icon: '⚠', badge: 5,  badgeClass: 'red' },
  { id: 'queries',   label: 'Open Queries',    icon: '❓', badge: 3,  badgeClass: 'red' },
  null,
  { id: 'comms',     label: 'Comms Dashboard', icon: '📨' },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  // FIX G: typed as (NavItem | null)[] — no 'as const' type narrowing issues in template
  readonly navItems: (NavItem | null)[] = NAV;
}
