import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ttp-sparkline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg [attr.width]="width" [attr.height]="height" style="overflow:visible">
      <defs>
        <!-- FIX #9: gradient fill defined inside component, not relying on external #sg -->
        <linearGradient [attr.id]="gradId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#3200BE" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#3200BE" stop-opacity="0.02"/>
        </linearGradient>
      </defs>
      <path [attr.d]="areaPath" [attr.fill]="'url(#' + gradId + ')'"/>
      <polyline [attr.points]="linePath" fill="none" stroke="#3200BE" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round"/>
      <text *ngFor="let m of labelPoints"
            [attr.x]="m.x" [attr.y]="height + 14"
            text-anchor="middle" font-size="9" fill="#A090B8">{{ m.label }}</text>
    </svg>`,
})
export class SparklineComponent implements OnInit {
  @Input() data:   number[] = [];
  @Input() months: string[] = [];
  @Input() width  = 260;
  @Input() height = 80;

  readonly pad = 10;
  // Unique gradient ID so multiple instances don't conflict
  readonly gradId = 'spark-grad-' + Math.random().toString(36).slice(2, 7);

  linePath  = '';
  areaPath  = '';
  labelPoints: { x: number; label: string }[] = [];

  ngOnInit(): void {
    const { data: d, months: m, width: W, height: H, pad } = this;
    if (!d.length) return;
    const mn = Math.min(...d), mx = Math.max(...d);
    const sx = (i: number) => pad + (i / (d.length - 1)) * (W - 2 * pad);
    const sy = (v: number) => H - pad - ((v - mn) / (mx - mn)) * (H - 2 * pad);

    this.linePath = d.map((v, i) => `${sx(i)},${sy(v)}`).join(' ');
    const pts = d.map((v, i) => `L${sx(i)},${sy(v)}`).join(' ');
    this.areaPath = `M${sx(0)},${sy(d[0])} ${pts} L${sx(d.length - 1)},${H - pad} L${sx(0)},${H - pad} Z`;
    this.labelPoints = m.map((label, i) => ({ x: sx(i), label }));
  }
}
