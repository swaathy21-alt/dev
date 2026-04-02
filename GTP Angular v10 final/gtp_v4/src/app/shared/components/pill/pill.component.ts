import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ttp-pill',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="pill" [ngClass]="'pill-' + variant"><ng-content></ng-content></span>`,
  styles: [`
    .pill { display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600; }
    .pill::before { content:'';width:5px;height:5px;border-radius:50%;flex-shrink:0;background:currentColor;opacity:.7; }
    .pill-green  { background:#E6F4F0;color:#007A5E; }
    .pill-red    { background:#FCE8EC;color:#C0143C; }
    .pill-yellow { background:#FFF3CD;color:#8A6000; }
    .pill-accent { background:#EBE6FF;color:#3200BE; }
    .pill-muted  { background:#F0ECF8;color:#5A4A7A; }
  `]
})
export class PillComponent {
  @Input() variant: 'green' | 'red' | 'yellow' | 'accent' | 'muted' = 'muted';
}
