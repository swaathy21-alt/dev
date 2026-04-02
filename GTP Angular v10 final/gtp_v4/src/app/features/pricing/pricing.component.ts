import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { PricingRecord } from '../../core/models';
import { SparklineComponent } from '../../shared/components/sparkline/sparkline.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule, SparklineComponent],
  templateUrl: './pricing.component.html'
})
export class PricingComponent implements OnInit {
  all:      PricingRecord[] = [];
  filtered: PricingRecord[] = [];
  search    = '';
  showTrend = false;

  // FIX H: assigned in constructor from mock — available immediately, no timing gap with child ngOnInit
  readonly trendData:   number[];
  readonly trendMonths: string[];

  constructor(private mock: MockDataService) {
    this.trendData   = this.mock.trendData;
    this.trendMonths = this.mock.trendMonths;
  }

  ngOnInit(): void {
    this.mock.getPricing().subscribe((p: any) => { this.all = p; this.filtered = p; });
  }

  filterPricing(): void {
    const q = this.search.toLowerCase();
    this.filtered = !q ? this.all : this.all.filter((p: any) =>
      p.make.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }
}
