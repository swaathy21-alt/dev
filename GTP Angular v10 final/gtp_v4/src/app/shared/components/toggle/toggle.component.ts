import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ttp-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toggle" [class.on]="value" [class.off]="!value" [class.readonly]="readonly" (click)="!readonly && toggle()">
      <div class="thumb"></div>
    </div>`,
  styles: [`
    .toggle { width:32px;height:18px;border-radius:9px;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;display:inline-block;vertical-align:middle; }
    .toggle.on  { background:#3200BE; }
    .toggle.off { background:#D0C4E8; }
    .toggle.readonly { pointer-events:none;cursor:default; }
    .thumb { position:absolute;top:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.2); }
    .toggle.on  .thumb { left:16px; }
    .toggle.off .thumb { left:2px; }
  `]
})
export class ToggleComponent {
  @Input() value    = false;
  @Input() readonly = false;
  @Output() valueChange = new EventEmitter<boolean>();
  toggle(): void { this.value = !this.value; this.valueChange.emit(this.value); }
}
