import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ttp-chip-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chips">
      <div *ngFor="let opt of options" class="chip" [class.on]="isSelected(opt)" (click)="toggle(opt)">
        {{ opt }}
      </div>
    </div>`,
  styles: [`
    .chips { display:flex;flex-wrap:wrap;gap:6px; }
    .chip  { padding:4px 11px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;border:1.5px solid #D0C4E8;background:#fff;color:#5A4A7A;user-select:none;transition:all .1s; }
    .chip.on { border-color:#3200BE;background:rgba(50,0,190,.08);color:#3200BE; }
  `]
})
export class ChipGroupComponent {
  @Input()  options:  string[] = [];
  @Input()  selected: string[] = [];
  @Output() selectedChange = new EventEmitter<string[]>();

  isSelected(opt: string): boolean { return this.selected.includes(opt); }
  toggle(opt: string): void {
    const next = this.isSelected(opt) ? this.selected.filter(s => s !== opt) : [...this.selected, opt];
    this.selectedChange.emit(next);
  }
}
