import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({ selector:'ttp-lang-tabs', standalone:true, imports:[CommonModule],
  template:`<div class="lang-tabs"><div *ngFor="let l of langs" class="ltab" [class.active]="active===l" [class.inactive]="active!==l" (click)="activeChange.emit(l)">{{l}}</div></div>`,
  styles:[`.lang-tabs{display:flex;gap:2px;margin-bottom:10px}.ltab{padding:3px 10px;border-radius:6px 6px 0 0;font-size:11px;font-weight:600;cursor:pointer;user-select:none}.ltab.active{background:#3200BE;color:#fff}.ltab.inactive{background:#EDE8F8;color:#5A4A7A}`]
})
export class LangTabsComponent {
  @Input() langs:string[]=['EN']; @Input() active='EN';
  @Output() activeChange=new EventEmitter<string>();
}
