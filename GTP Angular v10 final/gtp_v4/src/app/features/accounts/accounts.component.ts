import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { Account, AccountStatus } from '../../core/models';
import { PillComponent } from '../../shared/components/pill/pill.component';

@Component({ selector:'app-accounts', standalone:true, imports:[CommonModule,FormsModule,PillComponent], templateUrl:'./accounts.component.html', styleUrls:['./accounts.component.scss'] })
export class AccountsComponent implements OnInit {
  all: Account[] = [];
  filtered: Account[] = [];
  filter: 'all'|'active'|'inactive' = 'all';
  search = '';
  get activeCount()   { return this.all.filter(a=>a.status===AccountStatus.Active).length; }
  get inactiveCount() { return this.all.filter(a=>a.status===AccountStatus.Inactive).length; }
  constructor(private mock: MockDataService) {}
  ngOnInit() { this.mock.getAccounts().subscribe((a: any) => { this.all = a; this.apply(); }); }
  setFilter(f: 'all'|'active'|'inactive') { this.filter = f; this.apply(); }
  apply() {
    this.filtered = this.all.filter((a: any) => {
      if (this.filter !== 'all' && a.status !== this.filter) return false;
      const q = this.search.toLowerCase();
      return !q || a.account.toLowerCase().includes(q) || a.program.toLowerCase().includes(q);
    });
  }
  statusPill(s: string): 'green'|'muted' { return s === 'active' ? 'green' : 'muted'; }
}
