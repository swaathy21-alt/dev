import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { ToggleComponent } from '../../shared/components/toggle/toggle.component';

@Component({
  selector: 'app-comms',
  standalone: true,
  imports: [CommonModule, ToggleComponent],
  templateUrl: './comms.component.html'
})
export class CommsComponent implements OnInit {
  readonly accounts = ['Samsung UK Online', 'EE Retail UK', 'EE Online Portal'];
  readonly events   = ['Trade Confirmation', 'Trade Cancellation', 'On Hold – Variance',
                       'Quote Expiration', 'Trade Expiration', 'Acceptance/Rejection'];
  // FIX D: pre-computed once — not a getter so Angular CD doesn't rebuild array every cycle
  rows: { ev: string; cells: boolean[] }[] = [];

  constructor(private mock: MockDataService) {}

  ngOnInit(): void {
    const data = this.mock.commsData;
    this.rows = this.events.map(ev => ({
      ev,
      cells: this.accounts.flatMap(a => [data[a][ev][0], data[a][ev][1]])
    }));
  }
}
