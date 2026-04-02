import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';
import { ApiFailure, CustomerQuery, QueryStatus } from '../../core/models';
import { PillComponent } from '../../shared/components/pill/pill.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PillComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  readonly date = 'March 13, 2026';
  kpis: { label:string; value:number; sub:string; color:string; route:string }[] = [];
  recentFailures: ApiFailure[] = [];
  openQueries: CustomerQuery[] = [];

  constructor(private mock: MockDataService, private router: Router) {}

  ngOnInit(): void {
    this.mock.getAccounts().subscribe((accounts: any) => {
      this.kpis = [
        { label:'Active Accounts',   value: accounts.filter((a:any)=>a.status==='active').length,   sub:'2 programs',       color:'#007A5E', route:'/accounts' },
        { label:'Inactive Accounts', value: accounts.filter((a:any)=>a.status==='inactive').length, sub:'Out of date range',color:'#5A4A7A', route:'/accounts' },
        { label:'API Failures',      value:5, sub:'Last 24 hours',    color:'#C0143C', route:'/failures' },
        { label:'Active Campaigns',  value:2, sub:'1 scheduled',      color:'#3200BE', route:'/campaigns' },
        { label:'Open Queries',      value:3, sub:'2 open, 1 pending',color:'#8A6000', route:'/queries' },
        { label:'Pricing Records',   value:6, sub:'Across 3 accounts',color:'#CC44CC', route:'/pricing' },
      ];
    });
    this.mock.getApiFailures().subscribe((f: any) => this.recentFailures = f.slice(0, 3));
    this.mock.getQueries().subscribe((q: any) => this.openQueries = q.filter((x: any) => x.status !== QueryStatus.Resolved));
  }

  pillClass(status: number): 'green' | 'red' | 'yellow' | 'accent' | 'muted' {
    return status >= 500 ? 'red' : 'yellow';
  }

  queryPill(s: string): 'green' | 'red' | 'yellow' | 'accent' | 'muted' {
    return s === 'open' ? 'red' : 'yellow';
  }

  go(route: string): void { this.router.navigate([route]); }
}
