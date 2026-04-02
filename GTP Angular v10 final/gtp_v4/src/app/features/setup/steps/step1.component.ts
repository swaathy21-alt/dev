import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SetupFormService } from '../../../core/services/setup-form.service';
import { CURRENCIES, LANGUAGES } from '../../../core/constants';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="fade-in">
  <div class="step-header">
    <div class="step-header-label tier-account-tag">ACCOUNT LEVEL</div>
    <h2 class="step-header-title">Account</h2>
    <p class="step-header-desc">One carrier or brand instance under the program. Inherits all program-level pricing rules. Defines branding, URL customisation, country and currency. Multiple accounts can exist under one program — each with its own branding but sharing the same pricing engine.</p>
  </div>

  <div class="level-guide">
    <div class="lg-item">
      <span class="lg-icon">✓</span>
      <div><strong>Configure here</strong> if the value differs between carrier brands (e.g. carrier A vs carrier B use different URLs, languages, or T&C links)</div>
    </div>
    <div class="lg-item">
      <span class="lg-icon">↑</span>
      <div><strong>Already set at Program level</strong> — pricing model, grading questions, question categories</div>
    </div>
    <div class="lg-item">
      <span class="lg-icon">↓</span>
      <div><strong>Configured at Channel level (Step 3)</strong> — features that differ between Online, Retail and Care journeys</div>
    </div>
  </div>

  <!-- ── Account Details ─────────────────────────────── -->
  <div class="wizard-section wsec-configured">
    <div class="wsec-header">
      <span class="wsec-title">Account Details</span>
    </div>
    <div class="wsec-body">
      <div class="grid-cols-2" style="max-width:640px">
        <div class="form-group">
          <label class="form-label">Account Name <span class="req">*</span></label>
          <input class="form-input" [(ngModel)]="f.accountName" (ngModelChange)="svc.autoSlugKey()" placeholder="e.g. Carrier Brand UK"/>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" [(ngModel)]="f.status">
            <option>In Progress</option><option>Approved</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Country <span class="req">*</span></label>
          <input class="form-input" [(ngModel)]="f.country" placeholder="e.g. United Kingdom"/>
        </div>
        <div class="form-group">
          <label class="form-label">Currency <span class="req">*</span></label>
          <select class="form-select" [(ngModel)]="f.currency">
            <option *ngFor="let c of currencies" [value]="c">{{c}}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Start Date</label>
          <input type="date" class="form-input" [(ngModel)]="f.startDate"/>
        </div>
        <div class="form-group">
          <label class="form-label">End Date</label>
          <input type="date" class="form-input" [(ngModel)]="f.endDate" title="Leave blank for open-ended accounts"/>
        </div>
      </div>
      <div class="form-group" style="max-width:400px">
        <label class="form-label">Measurement Unit</label>
        <div class="radio-row">
          <label class="radio-pill" [class.sel]="f.measurementUnit==='Miles'" (click)="f.measurementUnit='Miles'">Miles</label>
          <label class="radio-pill" [class.sel]="f.measurementUnit==='Kilometres'" (click)="f.measurementUnit='Kilometres'">Kilometres</label>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Languages</label>
        <div class="chip-row">
          <label *ngFor="let l of languages" class="check-chip" [class.checked]="f.languages.includes(l)" (click)="svc.toggle(f.languages, l)">{{l}}</label>
        </div>
      </div>
      <p class="req-note">* = required fields</p>
    </div>
  </div>

  <!-- ── URL Generator ─────────────────────────────────── -->
  <div class="wizard-section" [class.wsec-configured]="f.generatedUrls.length>0">
    <div class="wsec-header">
      <div>
        <span class="wsec-title">URL Generator</span>
        <span class="wsec-key">customisation_key</span>
      </div>
      <span class="wsec-badge" [class.badge-set]="f.generatedUrls.length>0">{{f.generatedUrls.length>0 ? '✓ Generated' : 'Not generated'}}</span>
    </div>
    <div class="wsec-body">
      <p class="wsec-guide">Generate channel URLs based on your domain and customisation key. The key becomes the URL slug that distinguishes this account's trade-in portal.</p>
      <div class="form-row-gap" style="margin-top:12px">
        <div class="form-group" style="flex:2;margin:0"><label class="form-label">Base Domain</label><input class="form-input" placeholder="e.g. trade.carrier.com" [(ngModel)]="f.urlDomain"/></div>
        <div class="form-group" style="flex:1;margin:0">
        <label class="form-label">
          Customisation Key
          <span *ngIf="f.urlKey && !urlKeyManual" style="font-size:9px;color:#059669;font-weight:600;margin-left:6px;background:#f0fdf4;border:1px solid #a7f3d0;padding:1px 6px;border-radius:10px;">auto-generated</span>
        </label>
        <input class="form-input" placeholder="auto-generated from account name"
               [(ngModel)]="f.urlKey"
               (input)="urlKeyManual=true"/>
      </div>
        <button class="add-btn" style="margin-top:22px" (click)="svc.generateUrls()">Generate URLs</button>
      </div>
      <div *ngIf="f.generatedUrls.length" style="margin-top:14px">
        <div *ngFor="let u of f.generatedUrls" class="url-row">
          <span class="url-label">{{u.label}}</span>
          <span class="url-val">{{u.url}}</span>
          <button class="icon-btn icon-btn-copy" (click)="copy(u.url)" title="Copy">⧉</button>
        </div>
      </div>
    </div>
  </div>
</div>`,
  styles: [`
    .step-header { margin-bottom:20px; }
    .step-header-label { display:inline-block; font-size:10px; font-weight:700; letter-spacing:1px; padding:3px 10px; border-radius:20px; margin-bottom:8px; }
    .tier-account-tag { background:#dbeafe; color:#1e40af; border:1px solid #93c5fd; }
    .step-header-title { font-size:20px; font-weight:700; color:var(--text); margin-bottom:6px; }
    .step-header-desc { font-size:12px; color:var(--text-muted); line-height:1.6; max-width:680px; }

    .level-guide { background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:14px 16px; margin-bottom:16px; }
    .lg-item { display:flex; gap:10px; align-items:flex-start; font-size:12px; color:var(--text-muted); margin-bottom:8px; line-height:1.5; }
    .lg-item:last-child { margin-bottom:0; }
    .lg-icon { width:18px; height:18px; border-radius:50%; background:var(--accent); color:#fff; font-size:10px; font-weight:700; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }

    .wizard-section { background:#fff; border:1px solid var(--border); border-radius:12px; margin-bottom:12px; overflow:hidden; transition:border-color .2s; }
    .wizard-section.wsec-configured { border-color:var(--accent); }
    .wsec-header { display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid var(--border-light); gap:12px; }
    .wsec-title { font-weight:700; font-size:13px; }
    .wsec-key { display:inline-block; font-family:monospace; font-size:10px; color:var(--text-faint); background:#f1f5f9; padding:1px 6px; border-radius:4px; margin-left:8px; }
    .wsec-badge { font-size:11px; font-weight:600; color:var(--text-faint); padding:3px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; white-space:nowrap; }
    .wsec-badge.badge-set { background:var(--accent-glow); border-color:var(--accent); color:var(--accent); }
    .wsec-body { padding:14px 18px; }
    .wsec-guide { font-size:12px; color:var(--text-muted); line-height:1.6; }

    .grid-cols-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .radio-row { display:flex; gap:8px; }
    .radio-pill { display:inline-flex; align-items:center; padding:7px 16px; border:1px solid var(--border); border-radius:20px; font-size:12px; cursor:pointer; user-select:none; transition:all .15s; }
    .radio-pill.sel { border-color:var(--accent); background:var(--accent-glow); color:var(--accent); font-weight:700; }
    .chip-row { display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
    .check-chip { display:inline-flex; align-items:center; padding:4px 11px; border:1px solid var(--border); border-radius:12px; font-size:11px; cursor:pointer; user-select:none; transition:all .15s; }
    .check-chip.checked { border-color:var(--accent); background:var(--accent-glow); color:var(--accent); font-weight:600; }
    .form-row-gap { display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap; }
    .add-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 14px; background:#f0fdf4; color:#0a7a4b; border:1px solid #a7f3d0; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; }
    .add-btn:hover { background:#dcfce7; }
    .icon-btn { width:28px; height:28px; border-radius:6px; border:none; cursor:pointer; font-size:13px; display:inline-flex; align-items:center; justify-content:center; }
    .icon-btn-copy { background:#e0f2fe; color:#0369a1; }

    .url-row { display:flex; align-items:center; gap:10px; padding:7px 0; border-bottom:1px solid var(--border-light); }
    .url-row:last-child { border-bottom:none; }
    .url-label { width:160px; font-size:11px; color:var(--text-muted); flex-shrink:0; font-weight:500; }
    .url-val { flex:1; font-family:monospace; font-size:11px; color:var(--accent); background:var(--accent-glow); padding:3px 8px; border-radius:5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .req { color:#c0182c; }
    .req-note { font-size:10px; color:var(--text-faint); margin-top:10px; }
  `]
})
export class Step1Component {
  readonly currencies = [...CURRENCIES];
  readonly languages  = [...LANGUAGES];
  urlKeyManual = false;
  constructor(public svc: SetupFormService) {}
  get f() { return this.svc.form; }
  copy(url: string) { navigator.clipboard?.writeText(url).catch(() => {}); }
}
