import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ttp-expiry-block',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card-sm">
      <div style="font-weight:700;margin-bottom:12px">{{ label }}</div>
      <ng-container *ngIf="perChannel; else singleDay">
        <div *ngIf="!channels.length" style="color:var(--text-faint);font-size:12px;margin-bottom:10px">No channels selected.</div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px">
          <div *ngFor="let ch of channels" style="display:flex;align-items:center;gap:6px">
            <span style="color:var(--text-muted);font-size:12px">{{ ch }}:</span>
            <input type="number" class="form-input" style="width:62px" [ngModel]="channelDays[ch] ?? 30" (ngModelChange)="onChannelChange(ch, $event)"/>
            <span style="font-size:11px;color:var(--text-faint)">days</span>
          </div>
        </div>
      </ng-container>
      <ng-template #singleDay>
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:12px">
          <input type="number" class="form-input" style="width:70px" [(ngModel)]="days" (ngModelChange)="daysChange.emit($event)"/>
          <span style="font-size:11px;color:var(--text-faint)">days</span>
        </div>
      </ng-template>
      <div style="font-weight:600;font-size:12px;color:var(--text-muted);margin-bottom:6px">Reminders</div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:12px;color:var(--text-muted)">Count (0–10):</span>
        <input type="number" min="0" max="10" class="form-input" style="width:54px" [(ngModel)]="reminderCount" (ngModelChange)="onCountChange($event)"/>
      </div>
      <div class="rem-row">
        <div *ngFor="let rv of reminderIntervals; let ri=index" class="rem-int">
          <span style="font-size:11px;color:var(--text-faint)">#{{ ri+1 }}</span>
          <input type="number" min="1" class="form-input" style="width:50px" [(ngModel)]="reminderIntervals[ri]" (ngModelChange)="intervalsChange.emit(reminderIntervals)"/>
          <span style="font-size:11px;color:var(--text-faint)">days</span>
        </div>
      </div>
    </div>`,
})
export class ExpiryBlockComponent {
  @Input() label = ''; @Input() perChannel = false;
  @Input() channels: string[] = []; @Input() channelDays: Record<string, number> = {};
  @Output() channelDaysChange = new EventEmitter<Record<string, number>>();
  @Input() days = 30; @Output() daysChange = new EventEmitter<number>();
  @Input() reminderCount = 0; @Output() reminderCountChange = new EventEmitter<number>();
  @Input() reminderIntervals: number[] = []; @Output() intervalsChange = new EventEmitter<number[]>();

  onChannelChange(ch: string, v: number): void { this.channelDaysChange.emit({ ...this.channelDays, [ch]: v }); }
  onCountChange(n: number): void {
    this.reminderCountChange.emit(n);
    const arr = [...this.reminderIntervals];
    while (arr.length < n) arr.push(7);
    while (arr.length > n) arr.pop();
    this.reminderIntervals = arr;
    this.intervalsChange.emit(arr);
  }
}
