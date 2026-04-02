import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { CustomerQuery } from '../../core/models';
import { PillComponent } from '../../shared/components/pill/pill.component';

@Component({ selector:'app-queries', standalone:true, imports:[CommonModule,PillComponent], templateUrl:'./queries.component.html' })
export class QueriesComponent implements OnInit {
  queries: CustomerQuery[] = [];
  constructor(private mock: MockDataService) {}
  ngOnInit() { this.mock.getQueries().subscribe((q: any) => this.queries = q); }
  pill(s: string): 'red'|'yellow'|'green' { return s==='open'?'red':s==='pending'?'yellow':'green'; }
}
