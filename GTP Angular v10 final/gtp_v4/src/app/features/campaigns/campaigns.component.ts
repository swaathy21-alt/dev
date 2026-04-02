import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { Campaign, ApiPromotion, CampaignStatus } from '../../core/models';
import { PillComponent } from '../../shared/components/pill/pill.component';

@Component({ selector:'app-campaigns', standalone:true, imports:[CommonModule,PillComponent], templateUrl:'./campaigns.component.html' })
export class CampaignsComponent implements OnInit {
  campaigns: Campaign[] = [];
  promos: ApiPromotion[] = [];
  constructor(private mock: MockDataService) {}
  ngOnInit() {
    this.mock.getCampaigns().subscribe((c: any) => this.campaigns = c);
    this.mock.getApiPromotions().subscribe((p: any) => this.promos = p);
  }
  typePill(t: string): 'accent'|'muted'  { return t === 'Automatic' ? 'accent' : 'muted'; }
  statusPill(s: string): 'green'|'accent'|'muted' { return s==='active'?'green':s==='scheduled'?'accent':'muted'; }
}
