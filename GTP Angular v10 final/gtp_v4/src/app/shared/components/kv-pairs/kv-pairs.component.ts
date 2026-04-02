import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KvPair } from '../../../core/models';

@Component({
  selector: 'ttp-kv-pairs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wh-box">
      <div class="wh-box-title">
        <span>{{ label }}</span>
        <button class="btn btn-ghost btn-xs" type="button" (click)="pairs.push({key:'',value:''})">+ Add</button>
      </div>
      <div class="kv-row" *ngFor="let p of pairs; let i=index">
        <input class="form-input"
               placeholder="Key"
               [(ngModel)]="p.key"
               [name]="'kv_key_' + label.replace(' ','_') + '_' + i"/>
        <input class="form-input"
               placeholder="Value"
               [(ngModel)]="p.value"
               [name]="'kv_val_' + label.replace(' ','_') + '_' + i"
               style="flex:2"/>
        <button type="button" class="rm-btn" (click)="pairs.splice(i,1)">&#215;</button>
      </div>
    </div>`
})
export class KvPairsComponent {
  @Input() label = '';
  @Input() pairs: KvPair[] = [];
}
