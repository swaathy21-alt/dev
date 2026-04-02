import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { ApiFailure } from '../../core/models';
import { PillComponent } from '../../shared/components/pill/pill.component';

@Component({ selector:'app-failures', standalone:true, imports:[CommonModule,PillComponent], templateUrl:'./failures.component.html' })
export class FailuresComponent implements OnInit {
  failures: ApiFailure[] = [];
  expandedId: number | null = null;
  constructor(private mock: MockDataService) {}
  ngOnInit() { this.mock.getApiFailures().subscribe((f: any) => this.failures = f); }
  toggle(id: number) { this.expandedId = this.expandedId === id ? null : id; }
  isExpanded(id: number) { return this.expandedId === id; }
  pillVariant(s: number): 'red'|'yellow' { return s >= 500 ? 'red' : 'yellow'; }
  reqJson(f: ApiFailure) { return JSON.stringify({ device:'***REDACTED***', imei:'***REDACTED***', account:f.account, timestamp:f.timestamp }, null, 2); }
  errJson(f: ApiFailure) { return JSON.stringify({ error:f.error, status:f.status, vendor:f.vendor }, null, 2); }
}
