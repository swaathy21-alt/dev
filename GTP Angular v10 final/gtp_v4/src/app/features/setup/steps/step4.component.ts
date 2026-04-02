import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupFormService } from '../../../core/services/setup-form.service';
import { ChannelConfig } from '../../../core/constants';

@Component({
  selector: 'app-step4',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="fade-in">
  <div class="step-header">
    <h2 class="step-header-title">Review &amp; Submit</h2>
    <p class="step-header-desc">Check everything before creating the account. Click Edit on any section to go back and make changes.</p>
  </div>

  <!-- Program & Pricing -->
  <div class="review-card">
    <div class="review-card-header">
      <div>
        <div class="rc-tag tier-program-tag">PROGRAM LEVEL</div>
        <div class="rc-title">Program &amp; Pricing</div>
      </div>
      <button class="edit-btn" (click)="editStep(0)">✏ Edit</button>
    </div>
    <div class="rc-grid">
      <div class="rc-item"><span class="rc-label">Program</span><span class="rc-val">{{f.programMode==='existing'?f.existingProgram:f.newProgramName||'—'}}</span></div>
      <div class="rc-item"><span class="rc-label">Price Model</span><span class="rc-val">{{f.priceModel||'—'}}</span></div>
      <div class="rc-item"><span class="rc-label">Price Assessment Date</span><span class="rc-val">{{f.priceAsofDateType}}</span></div>
      <div class="rc-item"><span class="rc-label">Price Mismatch Action</span><span class="rc-val">{{f.priceMismatchAction||'—'}}</span></div>
      <div class="rc-item"><span class="rc-label">Popular Devices</span><span class="rc-val">{{f.popularDevices.length}} configured</span></div>
      <div class="rc-item"><span class="rc-label">Question Categories</span><span class="rc-val">{{f.questionCategoryEnabled ? f.questionCategories.length+' categories' : 'Inactive'}}</span></div>
      <div class="rc-item"><span class="rc-label">Grading Questions</span><span class="rc-val">{{totalQuestions > 0 ? totalQuestions+' questions' : 'None'}}</span></div>
      <div class="rc-item"><span class="rc-label">ID Verification</span><span class="rc-val" [class.val-on]="f.idVerificationEnabled" [class.val-off]="!f.idVerificationEnabled">{{f.idVerificationEnabled?'Enabled':'Disabled'}}</span></div>
      <div class="rc-item"><span class="rc-label">Store Inspection</span><span class="rc-val" [class.val-on]="f.storeInspectionEnabled" [class.val-off]="!f.storeInspectionEnabled">{{f.storeInspectionEnabled?'Enabled':'Disabled'}}</span></div>
    </div>
  </div>

  <!-- Account -->
  <div class="review-card">
    <div class="review-card-header">
      <div>
        <div class="rc-tag tier-account-tag">ACCOUNT LEVEL</div>
        <div class="rc-title">Account</div>
      </div>
      <button class="edit-btn" (click)="editStep(1)">✏ Edit</button>
    </div>
    <div class="rc-grid">
      <div class="rc-item"><span class="rc-label">Account Name</span><span class="rc-val">{{f.accountName||'—'}}</span></div>
      <div class="rc-item"><span class="rc-label">Status</span><span class="rc-val">{{f.status}}</span></div>
      <div class="rc-item"><span class="rc-label">Country</span><span class="rc-val">{{f.country||'—'}}</span></div>
      <div class="rc-item"><span class="rc-label">Currency</span><span class="rc-val">{{f.currency}}</span></div>
      <div class="rc-item"><span class="rc-label">Languages</span><span class="rc-val">{{f.languages.join(', ')}}</span></div>
      <div class="rc-item" *ngIf="f.urlDomain"><span class="rc-label">URL</span><span class="rc-val rc-mono">{{f.urlDomain}}/{{f.urlKey}}</span></div>
      <div class="rc-item" *ngIf="f.startDate"><span class="rc-label">Start Date</span><span class="rc-val">{{f.startDate}}</span></div>
      <div class="rc-item" *ngIf="f.endDate"><span class="rc-label">End Date</span><span class="rc-val">{{f.endDate}}</span></div>
    </div>
  </div>

  <!-- Channels -->
  <div class="review-card">
    <div class="review-card-header">
      <div>
        <div class="rc-tag tier-channel-tag">CHANNEL LEVEL</div>
        <div class="rc-title">Channels ({{f.channels.length}})</div>
      </div>
      <button class="edit-btn" (click)="editStep(2)">✏ Edit</button>
    </div>
    <div *ngIf="f.channels.length===0" class="empty-state">No channels configured.</div>
    <div *ngFor="let ch of f.channels" class="channel-review-row">
      <div class="crr-header">
        <span class="crr-icon">{{chIcon(ch.channelType)}}</span>
        <span class="crr-name">{{ch.channelType}}</span>
        <span class="crr-status" [class.cs-on]="ch.enabled" [class.cs-off]="!ch.enabled">{{ch.enabled?'● Active':'○ Disabled'}}</span>
        <span *ngIf="chFeatures(ch).length===0" class="crr-warning">⚠ Not configured</span>
        <span *ngIf="chFeatures(ch).length>0" class="crr-count">{{chFeatures(ch).length}} feature(s) set</span>
      </div>
      <div class="crr-badges">
        <ng-container *ngFor="let fb of chFeatures(ch)">
          <span class="feat-badge fb-on">{{fb.label}}: ON</span>
        </ng-container>
        <span *ngIf="chFeatures(ch).length===0" class="feat-none">No features configured — go back to Step 3 to configure</span>
      </div>
    </div>
  </div>

  <!-- Program Defaults — only show what's enabled -->
  <div class="review-card">
    <div class="review-card-header">
      <div>
        <div class="rc-tag tier-account-tag">ACCOUNT LEVEL</div>
        <div class="rc-title">Account Features</div>
      </div>
      <button class="edit-btn" (click)="editStep(3)">✏ Edit</button>
    </div>
    <div *ngIf="nothingEnabled" class="empty-state">No account features configured.</div>
    <div class="rc-grid">
      <div class="rc-item" *ngIf="f.paymentOptionsEnabled"><span class="rc-label">Payment Options</span><span class="rc-val">{{f.paymentTypes.length}} type(s) — Default: {{f.defaultPaymentType}}</span></div>
      <div class="rc-item" *ngIf="f.expiryEnabled"><span class="rc-label">Quote Expiry</span><span class="rc-val">{{f.quoteExpiryHours}}h</span></div>
      <div class="rc-item" *ngIf="f.expiryEnabled"><span class="rc-label">Trade Expiry</span><span class="rc-val">{{f.tradeExpiryDays}}d</span></div>
      <div class="rc-item" *ngIf="f.varianceResolutionEnabled"><span class="rc-label">Variance Resolution</span><span class="rc-val">{{f.varianceResolutionConfigs.length}} config(s)</span></div>
      <div class="rc-item" *ngIf="f.deviceRecycleEnabled"><span class="rc-label">Device Recycle</span><span class="rc-val">{{f.recycleProviders.length}} provider(s)</span></div>
      <div class="rc-item" *ngIf="f.deviceSearchLimitEnabled"><span class="rc-label">Device Search Limit</span><span class="rc-val val-on">Max {{f.deviceSearchMaxLimit}}</span></div>
      <div class="rc-item" *ngIf="f.deferredSubmissionEnabled"><span class="rc-label">Deferred Submission</span><span class="rc-val val-on">Enabled</span></div>
      <div class="rc-item" *ngIf="f.smsEnabled"><span class="rc-label">Transactional SMS</span><span class="rc-val val-on">Enabled</span></div>
      <div class="rc-item" *ngIf="f.charityEnabled"><span class="rc-label">Charity Donation</span><span class="rc-val val-on">Enabled</span></div>
      <div class="rc-item" *ngIf="f.externalPromoEnabled"><span class="rc-label">External Promo Verification</span><span class="rc-val val-on">Enabled</span></div>
      <div class="rc-item" *ngIf="f.tradeTermsEnabled"><span class="rc-label">Trade Terms URL</span><span class="rc-val rc-mono">{{f.tradeTermsUrl||'—'}}</span></div>
    </div>
  </div>
</div>`,
  styles: [`
    .step-header { margin-bottom:20px; }
    .step-header-title { font-size:20px; font-weight:700; margin-bottom:6px; }
    .step-header-desc { font-size:12px; color:var(--text-muted); line-height:1.6; }

    .review-card { background:#fff; border:1px solid var(--border); border-radius:12px; margin-bottom:14px; overflow:hidden; }
    .review-card-header { display:flex; justify-content:space-between; align-items:flex-start; padding:14px 18px; border-bottom:1px solid var(--border-light); background:#faf9ff; }
    .rc-tag { display:inline-block; font-size:9px; font-weight:700; letter-spacing:.8px; padding:2px 8px; border-radius:20px; margin-bottom:4px; }
    .tier-program-tag  { background:#fef9c3; color:#854d0e; border:1px solid #fde047; }
    .tier-account-tag  { background:#dbeafe; color:#1e40af; border:1px solid #93c5fd; }
    .tier-channel-tag  { background:#ede9fe; color:#5b21b6; border:1px solid #c4b5fd; }

    .rc-title { font-size:14px; font-weight:700; }
    .edit-btn { padding:5px 12px; background:#fff; color:var(--accent); border:1px solid var(--accent); border-radius:7px; font-size:11px; font-weight:600; cursor:pointer; font-family:inherit; white-space:nowrap; }
    .edit-btn:hover { background:var(--accent-glow); }

    .rc-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:0; padding:4px 18px; }
    .rc-item { display:flex; flex-direction:column; gap:2px; padding:10px 0; border-bottom:1px solid var(--border-light); }
    .rc-item:last-child { border-bottom:none; }
    .rc-label { font-size:11px; color:var(--text-faint); font-weight:500; }
    .rc-val { font-size:13px; font-weight:600; }
    .rc-mono { font-family:monospace; font-size:11px; }
    .val-on  { color:#059669; }
    .val-off { color:#9ca3af; }

    .channel-review-row { padding:12px 18px; border-bottom:1px solid var(--border-light); }
    .channel-review-row:last-child { border-bottom:none; }
    .crr-header { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
    .crr-icon { font-size:18px; }
    .crr-name { font-weight:700; font-size:13px; }
    .crr-status { font-size:11px; font-weight:600; }
    .cs-on  { color:#059669; }
    .cs-off { color:#9ca3af; }
    .crr-badges { display:flex; flex-wrap:wrap; gap:5px; }
    .feat-badge { display:inline-flex; align-items:center; padding:2px 9px; border-radius:12px; font-size:11px; font-weight:600; }
    .fb-on  { background:#f0fdf4; border:1px solid #a7f3d0; color:#065f46; }
    .fb-off { background:#f8fafc; border:1px solid #e2e8f0; color:#9ca3af; }
    .empty-state { padding:14px 18px; font-size:12px; color:var(--text-faint); font-style:italic; }
    .feat-none { font-size:11px; color:#9ca3af; font-style:italic; }
    .crr-warning { font-size:10px; font-weight:600; color:#d97706; background:#fef3c7; border:1px solid #fde68a; padding:2px 8px; border-radius:12px; }
    .crr-count { font-size:10px; font-weight:600; color:#059669; background:#f0fdf4; border:1px solid #a7f3d0; padding:2px 8px; border-radius:12px; }
  `]
})
export class Step4Component {
  constructor(public svc: SetupFormService) {}

  editStep(n: number): void {
    this.svc.goTo(n);
    const el = document.querySelector('.content') || document.documentElement;
    el.scrollTo({ top: 0, behavior: 'smooth' });
  }
  get f() { return this.svc.form; }
  get totalQuestions() { return this.f.gradingQuestions.reduce((s, d) => s + d.questions.length, 0); }
  get nothingEnabled() { const f = this.f; return !f.paymentOptionsEnabled&&!f.expiryEnabled&&!f.varianceResolutionEnabled&&!f.deviceRecycleEnabled&&!f.deviceSearchLimitEnabled&&!f.deferredSubmissionEnabled&&!f.smsEnabled&&!f.charityEnabled&&!f.externalPromoEnabled&&!f.tradeTermsEnabled; }

  chIcon(ch: string): string {
    const m: Record<string,string> = { Online:'🌐',Retail:'🏪',ContactCenter:'📞',MobileApp:'📱',API:'⚙' };
    return m[ch] || '📡';
  }

  chFeatures(ch: ChannelConfig): { label: string; on: boolean }[] {
    return [
      { label: 'FMIP',              on: ch.fmipEnabled },
      { label: 'Shipping Label',    on: ch.shippingLabelByGtpEnabled },
      { label: 'Shipping Method',   on: ch.shippingMethodEnabled && !!ch.shippingMethodType },
      { label: 'Barcode',           on: ch.barcodeEnabled },
      { label: 'Address Validation',on: ch.addressValidationEnabled },
      { label: 'Collect Address',   on: ch.collectShippingAddressEnabled },
      { label: 'Diagnostics',       on: ch.deviceDiagnosticsEnabled },
      { label: 'OTP Verification',  on: ch.tradeinVerificationEnabled },
      { label: 'Trade-In Methods',  on: ch.tradeinMethodEnabled },
    ].filter(fb => fb.on);
  }
}
