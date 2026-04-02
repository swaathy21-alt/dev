import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SetupFormService } from '../../../core/services/setup-form.service';
import {
  PAYMENT_TYPES, TRADE_OWNERSHIP_TYPES, VARIANCE_OWN_BY,
  VARIANCE_RISK_METHODS, PAID_BY_OPTS, POST_INSPECTION_VARIANCE_ACTIONS,
  POST_INSPECTION_LOCK_ACTIONS, ASSET_TYPES, VARIANCE_RESOLUTION_TYPES,
  RECYCLE_RULES, PaymentTypeConfig
} from '../../../core/constants';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="fade-in">
  <div class="step-header">
    <div class="step-header-label tier-account-tag">ACCOUNT LEVEL</div>
    <h2 class="step-header-title">Account Features</h2>
    <p class="step-header-desc">These features are configured at account level and inherited by all channels under this account. Each channel can override individual fields where its journey requires a different value. Configure the account-level defaults here — channels only need to specify what differs from this baseline.</p>
  </div>

  <!-- ── Feature Toggles ──────────────────────────────── -->
  <div class="wizard-section" [class.wsec-configured]="anySimpleToggle">
    <div class="wsec-header">
      <div>
        <span class="wsec-title">Feature Toggles</span>
        <span class="wsec-count" *ngIf="anySimpleToggle">{{simpleToggleCount}} enabled</span>
      </div>
      <span class="wsec-badge" [class.badge-set]="anySimpleToggle">{{anySimpleToggle ? simpleToggleCount+' enabled' : 'None enabled'}}</span>
    </div>
    <div class="wsec-body">
      <p class="wsec-guide">Simple on/off features — no additional sub-configuration. Inherited by all channels.</p>
      <div class="toggle-list" style="margin-top:12px">
        <div class="tl-item" [class.tli-on]="f.deferredSubmissionEnabled">
          <div><div class="tli-name">Deferred Trade Submission</div><div class="tli-key">enable_deferred_submission</div></div>
          <label class="toggle-switch"><input type="checkbox" [(ngModel)]="f.deferredSubmissionEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label>
        </div>
        <div class="tl-item" [class.tli-on]="f.smsEnabled">
          <div><div class="tli-name">Transactional SMS Notifications</div><div class="tli-key">transactional_sms_enabled</div></div>
          <label class="toggle-switch"><input type="checkbox" [(ngModel)]="f.smsEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label>
        </div>
        <div class="tl-item" [class.tli-on]="f.charityEnabled">
          <div><div class="tli-name">Charity Donation</div><div class="tli-key">charity</div></div>
          <label class="toggle-switch"><input type="checkbox" [(ngModel)]="f.charityEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label>
        </div>
        <div class="tl-item" [class.tli-on]="f.externalPromoEnabled">
          <div><div class="tli-name">External Promotion Verification</div><div class="tli-key">external_promotion_verification_enabled</div></div>
          <label class="toggle-switch"><input type="checkbox" [(ngModel)]="f.externalPromoEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label>
        </div>
        <div class="tl-item" [class.tli-on]="f.deviceSearchLimitEnabled">
          <div>
            <div class="tli-name">Device Search Result Limit</div>
            <div class="tli-key">device_search_result_max_limit</div>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <input *ngIf="f.deviceSearchLimitEnabled" type="number" class="form-input" [(ngModel)]="f.deviceSearchMaxLimit" style="width:90px;font-size:12px" placeholder="50"/>
            <label class="toggle-switch"><input type="checkbox" [(ngModel)]="f.deviceSearchLimitEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Payment Options ──────────────────────────────── -->
  <div class="wizard-section" [class.wsec-configured]="f.paymentOptionsEnabled">
    <div class="wsec-header">
      <div><span class="wsec-title">Payment Options</span><span class="wsec-key">payment_options</span></div>
      <label class="toggle-switch"><input type="checkbox" [(ngModel)]="f.paymentOptionsEnabled"><span class="ts-track"><span class="ts-thumb"></span></span><span class="ts-label">{{f.paymentOptionsEnabled?'Active':'Inactive'}}</span></label>
    </div>
    <div class="wsec-body" *ngIf="f.paymentOptionsEnabled">
      <p class="wsec-guide">Master list of payment methods for this account. Channels can restrict to a subset via allowed payment types.</p>
      <div class="form-group" style="max-width:280px;margin-top:12px">
        <label class="form-label">Default Payment Type</label>
        <select class="form-select" [(ngModel)]="f.defaultPaymentType">
          <option *ngFor="let p of paymentTypes" [value]="p">{{p}}</option>
        </select>
      </div>
      <!-- Configured types as pills -->
      <div *ngIf="f.paymentTypes.length===0" class="pay-empty-hint">
        No payment types added yet. Use the button below to add payment methods and configure payout settings.
      </div>
      <div *ngIf="f.paymentTypes.length>0" style="margin-bottom:12px">
        <label class="form-label">Configured Payment Types</label>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px">
          <span *ngFor="let pt of f.paymentTypes; let pi=index"
                class="pay-pill" [class.pay-open]="openPay===pi"
                (click)="openPay = openPay===pi ? -1 : pi">
            {{pt.paymentType||'New'}} {{openPay===pi?'▲':'▼'}}
          </span>
        </div>
      </div>
      <!-- Expanded config -->
      <div *ngFor="let pt of f.paymentTypes; let pi=index">
        <div *ngIf="openPay===pi" class="pay-config-card">
          <div class="pay-config-header">
            <select class="form-select" [(ngModel)]="pt.paymentType" style="max-width:240px;font-size:12px">
              <option value="">-- Select Payment Type --</option>
              <option *ngFor="let p of paymentTypes" [value]="p">{{p}}</option>
            </select>
            <div style="display:flex;align-items:center;gap:10px">
              <label style="font-size:11px;display:flex;align-items:center;gap:4px;cursor:pointer"><input type="checkbox" [(ngModel)]="pt.vendorIntegrationAvailable"> Vendor Integration Available</label>
              <button class="text-btn text-btn-danger" (click)="svc.removePaymentType(pi);openPay=-1">Remove</button>
            </div>
          </div>
          <div class="pay-payout-label">Payout Configurations</div>
          <div *ngFor="let po of pt.payoutConfigurations; let poi=index" class="payout-card">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <label style="font-size:11px;display:flex;align-items:center;gap:5px;cursor:pointer"><input type="checkbox" [(ngModel)]="po.payUpfront"> Pay Upfront</label>
              <button class="icon-btn icon-btn-danger" (click)="svc.removePayoutConfig(pt,poi)">✕</button>
            </div>
            <div class="grid-cols-2">
              <div class="form-group" style="margin:0"><label class="form-label" style="font-size:10px">Trade Ownership Type <span class="req">*</span></label><select class="form-select" [(ngModel)]="po.tradeOwnershipType" style="font-size:11px"><option value="">--</option><option *ngFor="let t of ownershipTypes" [value]="t">{{t}}</option></select></div>
              <div class="form-group" style="margin:0"><label class="form-label" style="font-size:10px">Variance Owned By <span class="req">*</span></label><select class="form-select" [(ngModel)]="po.varianceOwnBy" style="font-size:11px"><option value="">--</option><option *ngFor="let v of varianceOwnBy" [value]="v">{{v}}</option></select></div>
              <div class="form-group" style="margin:0"><label class="form-label" style="font-size:10px">Variance Risk Mitigation <span class="req">*</span></label><select class="form-select" [(ngModel)]="po.varianceRiskMitigationMethod" style="font-size:11px"><option value="">--</option><option *ngFor="let r of varianceRiskMethods" [value]="r">{{r}}</option></select></div>
              <div class="form-group" style="margin:0"><label class="form-label" style="font-size:10px">Paid By <span class="req">*</span></label><select class="form-select" [(ngModel)]="po.paidBy" style="font-size:11px"><option value="">--</option><option *ngFor="let p of paidByOpts" [value]="p">{{p}}</option></select></div>
            </div>
          </div>
          <button class="add-btn" (click)="svc.addPayoutConfig(pt)">+ Add Payout Configuration</button>
          <p class="req-note">* = required fields</p>
        </div>
      </div>
      <button class="add-btn" (click)="svc.addPaymentType();openPay=f.paymentTypes.length-1">+ Add Payment Type</button>
    </div>
  </div>

  <!-- ── Expiry Configuration ──────────────────────────── -->
  <div class="wizard-section" [class.wsec-configured]="f.expiryEnabled">
    <div class="wsec-header">
      <div><span class="wsec-title">Expiry Configuration</span><span class="wsec-key">expiry</span></div>
      <label class="toggle-switch"><input type="checkbox" [(ngModel)]="f.expiryEnabled"><span class="ts-track"><span class="ts-thumb"></span></span><span class="ts-label">{{f.expiryEnabled?'Active':'Inactive'}}</span></label>
    </div>
    <div class="wsec-body" *ngIf="f.expiryEnabled">
      <p class="wsec-guide">Expiry windows and post-inspection timings. Channels can override Quote Expiry and Trade Expiry individually if their SLA differs.</p>

      <div class="expiry-group" style="margin-top:14px">
        <div class="eg-title">Quote &amp; Trade</div>
        <div class="grid-cols-3">
          <div class="form-group"><label class="form-label">Store Drop-Off Expiry (days) <span class="req">*</span></label><input type="number" class="form-input" [(ngModel)]="f.storeDropOffExpiryDays"/></div>
          <div class="form-group"><label class="form-label">Quote Expiry (hours) <span class="req">*</span></label><input type="number" class="form-input" [(ngModel)]="f.quoteExpiryHours"/></div>
          <div class="form-group"><label class="form-label">Trade Expiry (days) <span class="req">*</span></label><input type="number" class="form-input" [(ngModel)]="f.tradeExpiryDays"/></div>
        </div>
      </div>

      <div class="expiry-group">
        <div class="eg-title">Reminder Notifications</div>
        <div class="grid-cols-3">
          <div class="form-group"><label class="form-label">Trade Expiry Reminder (days) <span class="req">*</span></label><input type="number" class="form-input" [(ngModel)]="f.tradeExpiryReminderDays"/></div>
          <div class="form-group"><label class="form-label">Post-Inspection Variance Reminder (days) <span class="req">*</span></label><input type="number" class="form-input" [(ngModel)]="f.postInspVarianceReminderDays"/></div>
          <div class="form-group"><label class="form-label">Post-Inspection Lock Notification (days) <span class="req">*</span></label><input type="number" class="form-input" [(ngModel)]="f.postInspLockNotificationDays"/></div>
        </div>
      </div>

      <div class="expiry-group">
        <div class="eg-title">Post-Inspection Actions</div>
        <div class="grid-cols-2">
          <div class="form-group"><label class="form-label">Variance Expiry (days) <span class="req">*</span></label><input type="number" class="form-input" [(ngModel)]="f.postInspVarianceExpiryDays"/></div>
          <div class="form-group"><label class="form-label">Variance Action <span class="req">*</span></label><select class="form-select" [(ngModel)]="f.postInspVarianceAction"><option *ngFor="let a of postInspVarActions" [value]="a">{{a}}</option></select></div>
          <div class="form-group"><label class="form-label">Lock Expiry (days) <span class="req">*</span></label><input type="number" class="form-input" [(ngModel)]="f.postInspLockExpiryDays"/></div>
          <div class="form-group"><label class="form-label">Lock Action <span class="req">*</span></label><select class="form-select" [(ngModel)]="f.postInspLockAction"><option *ngFor="let a of postInspLockActions" [value]="a">{{a}}</option></select></div>
        </div>
      </div>

      <div class="expiry-group">
        <div class="eg-title">Other</div>
        <div class="grid-cols-3">
          <div class="form-group"><label class="form-label">Box Kit Grace Period (days) <span class="req">*</span></label><input type="number" class="form-input" [(ngModel)]="f.boxkitGracePeriodDays"/></div>
          <div class="form-group"><label class="form-label">Extend Quote Expiry (days) <span class="req">*</span></label><input type="number" class="form-input" [(ngModel)]="f.extendQuoteExpiryDays"/></div>
          <div class="form-group"><label class="form-label">Workflow Name</label><input class="form-input" [(ngModel)]="f.workflowName" placeholder="optional"/></div>
        </div>
      </div>
      <p class="req-note">* = required fields</p>
    </div>
  </div>

  <!-- ── Variance Resolution Options ──────────────────── -->
  <div class="wizard-section" [class.wsec-configured]="f.varianceResolutionEnabled">
    <div class="wsec-header">
      <div><span class="wsec-title">Variance Resolution Options</span><span class="wsec-key">variance_resolution_options</span></div>
      <label class="toggle-switch"><input type="checkbox" [(ngModel)]="f.varianceResolutionEnabled"><span class="ts-track"><span class="ts-thumb"></span></span><span class="ts-label">{{f.varianceResolutionEnabled?'Active':'Inactive'}}</span></label>
    </div>
    <div class="wsec-body" *ngIf="f.varianceResolutionEnabled">
      <div *ngFor="let vc of f.varianceResolutionConfigs; let vi=index" class="entry-card">
        <div style="display:flex;justify-content:space-between;margin-bottom:10px">
          <span class="entry-num">Config {{vi+1}}</span>
          <button class="text-btn text-btn-danger" (click)="svc.removeVarianceConfig(vi)">Remove</button>
        </div>
        <div class="form-group"><label class="form-label">Asset Types <span class="req">*</span></label><div class="chip-row"><label *ngFor="let a of assetTypes" class="check-chip" [class.checked]="vc.assetTypes.includes(a)" (click)="toggle(vc.assetTypes,a)">{{a}}</label></div></div>
        <div class="form-group"><label class="form-label">Resolution Types <span class="req">*</span></label><div class="chip-row"><label *ngFor="let r of varianceResTypes" class="check-chip" [class.checked]="vc.resolutionTypes.includes(r)" (click)="toggle(vc.resolutionTypes,r)">{{r}}</label></div></div>
        <div class="form-group" style="max-width:280px"><label class="form-label">Default Resolution Type <span class="req">*</span></label><select class="form-select" [(ngModel)]="vc.defaultResolutionType"><option value="">-- Select --</option><option *ngFor="let r of varianceResTypes" [value]="r">{{r}}</option></select></div>
        <p class="req-note">* = required fields</p>
      </div>
      <button class="add-btn" (click)="svc.addVarianceConfig()">+ Add to Variance Resolution Options</button>
    </div>
  </div>

  <!-- ── Device Recycle ────────────────────────────────── -->
  <div class="wizard-section" [class.wsec-configured]="f.deviceRecycleEnabled">
    <div class="wsec-header">
      <div><span class="wsec-title">Device Recycle</span><span class="wsec-key">device_recycle_enabled</span></div>
      <label class="toggle-switch"><input type="checkbox" [(ngModel)]="f.deviceRecycleEnabled"><span class="ts-track"><span class="ts-thumb"></span></span><span class="ts-label">{{f.deviceRecycleEnabled?'Active':'Inactive'}}</span></label>
    </div>
    <div class="wsec-body" *ngIf="f.deviceRecycleEnabled">
      <div *ngFor="let rp of f.recycleProviders; let ri=index" class="entry-card">
        <div class="form-row-gap">
          <div class="form-group" style="margin:0;flex:1"><label class="form-label" style="font-size:10px">Name</label><input class="form-input" [(ngModel)]="rp.name" placeholder="e.g. Carrier Recycle Partner"/></div>
          <div class="form-group" style="margin:0;flex:2"><label class="form-label" style="font-size:10px">Redirect URL</label><input class="form-input" [(ngModel)]="rp.redirectUrl" placeholder="https://..."/></div>
          <div class="form-group" style="margin:0;width:180px"><label class="form-label" style="font-size:10px">Rule <span class="req">*</span></label><select class="form-select" [(ngModel)]="rp.rule"><option value="">-- Select --</option><option *ngFor="let r of recycleRules" [value]="r">{{r}}</option></select></div>
          <button class="icon-btn icon-btn-danger" style="align-self:flex-end" (click)="svc.removeRecycleProvider(ri)">✕</button>
        </div>
      </div>
      <button class="add-btn" (click)="svc.addRecycleProvider()">+ Add to Recycle Providers</button>
      <p class="req-note">* = required fields</p>
    </div>
  </div>

  <!-- ── Trade Terms & Conditions ─────────────────────── -->
  <div class="wizard-section" [class.wsec-configured]="f.tradeTermsEnabled">
    <div class="wsec-header">
      <div><span class="wsec-title">Trade Terms &amp; Conditions</span><span class="wsec-key">trade_terms_conditions</span></div>
      <label class="toggle-switch"><input type="checkbox" [(ngModel)]="f.tradeTermsEnabled"><span class="ts-track"><span class="ts-thumb"></span></span><span class="ts-label">{{f.tradeTermsEnabled?'Active':'Inactive'}}</span></label>
    </div>
    <div class="wsec-body" *ngIf="f.tradeTermsEnabled">
      <div class="grid-cols-2" style="max-width:640px">
        <div class="form-group"><label class="form-label">Terms Description Key <span class="req">*</span></label><input class="form-input" [(ngModel)]="f.tradeTermsDesc" placeholder="e.g. TRADE_TERMS_CONDITIONS_DESC"/></div>
        <div class="form-group"><label class="form-label">Terms &amp; Conditions URL <span class="req">*</span></label><input class="form-input" [(ngModel)]="f.tradeTermsUrl" placeholder="https://..."/></div>
      </div>
      <p class="req-note">* = required fields</p>
    </div>
  </div>

</div>`,
  styles: [`
    .step-header { margin-bottom:20px; }
    .step-header-label { display:inline-block; font-size:10px; font-weight:700; letter-spacing:1px; padding:3px 10px; border-radius:20px; margin-bottom:8px; }
    .tier-account-tag { background:#dbeafe; color:#1e40af; border:1px solid #93c5fd; }
    .step-header-title { font-size:20px; font-weight:700; margin-bottom:6px; }
    .step-header-desc { font-size:12px; color:var(--text-muted); line-height:1.6; max-width:680px; }

    .wizard-section { background:#fff; border:1px solid var(--border); border-radius:12px; margin-bottom:12px; overflow:hidden; transition:border-color .2s; }
    .wizard-section.wsec-configured { border-color:var(--accent); }
    .wsec-header { display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid var(--border-light); gap:12px; }
    .wsec-title { font-weight:700; font-size:13px; }
    .wsec-key { display:inline-block; font-family:monospace; font-size:10px; color:var(--text-faint); background:#f1f5f9; padding:1px 6px; border-radius:4px; margin-left:8px; }
    .wsec-count { font-size:11px; font-weight:600; color:var(--accent); background:var(--accent-glow); padding:1px 8px; border-radius:20px; margin-left:8px; }
    .wsec-badge { font-size:11px; font-weight:600; color:var(--text-faint); padding:3px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; white-space:nowrap; }
    .wsec-badge.badge-set { background:var(--accent-glow); border-color:var(--accent); color:var(--accent); }
    .wsec-body { padding:14px 18px; }
    .wsec-guide { font-size:12px; color:var(--text-muted); line-height:1.6; }

    .toggle-list { border:1px solid var(--border); border-radius:10px; overflow:hidden; }
    .tl-item { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:1px solid var(--border-light); background:#fff; transition:background .15s; }
    .tl-item:last-child { border-bottom:none; }
    .tl-item.tli-on { background:#f0fdf4; }
    .tli-name { font-size:13px; font-weight:600; }
    .tli-key { font-family:monospace; font-size:10px; color:var(--text-faint); margin-top:2px; }

    .toggle-switch { display:inline-flex; align-items:center; gap:6px; cursor:pointer; }
    .ts-track { width:36px; height:20px; border-radius:10px; background:#e2e8f0; position:relative; transition:background .2s; display:block; }
    input:checked + .ts-track { background:var(--accent); }
    .ts-thumb { width:14px; height:14px; border-radius:50%; background:#fff; position:absolute; top:3px; left:3px; transition:left .2s; display:block; box-shadow:0 1px 3px rgba(0,0,0,.2); }
    input:checked + .ts-track .ts-thumb { left:19px; }
    .ts-label { font-size:12px; font-weight:600; color:var(--text-muted); }

    .pay-pill { display:inline-flex; align-items:center; padding:5px 12px; background:#f1f5f9; border:1px solid var(--border); border-radius:20px; font-size:12px; cursor:pointer; user-select:none; transition:all .15s; }
    .pay-pill.pay-open { background:var(--accent-glow); border-color:var(--accent); color:var(--accent); font-weight:600; }
    .pay-config-card { background:#faf9ff; border:1px solid var(--border); border-radius:10px; padding:14px; margin-bottom:10px; }
    .pay-empty-hint { font-size:12px; color:var(--text-faint); font-style:italic; padding:8px 0 12px; }
    .pay-config-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px; }
    .pay-payout-label { font-size:10px; font-weight:700; color:var(--text-faint); text-transform:uppercase; letter-spacing:.5px; margin-bottom:8px; }
    .payout-card { background:#fff; border:1px solid var(--border); border-radius:8px; padding:12px; margin-bottom:8px; }

    .expiry-group { background:#faf9ff; border:1px solid var(--border-light); border-radius:8px; padding:14px; margin-bottom:10px; }
    .eg-title { font-size:10px; font-weight:700; color:var(--text-faint); text-transform:uppercase; letter-spacing:.5px; margin-bottom:12px; }

    .entry-card { background:#faf9ff; border:1px solid var(--border); border-radius:8px; padding:12px; margin-bottom:8px; }
    .entry-num { font-size:11px; font-weight:700; color:var(--accent); }

    .grid-cols-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .grid-cols-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
    .chip-row { display:flex; flex-wrap:wrap; gap:6px; margin-top:4px; }
    .check-chip { display:inline-flex; align-items:center; padding:4px 11px; border:1px solid var(--border); border-radius:12px; font-size:11px; cursor:pointer; user-select:none; transition:all .15s; }
    .check-chip.checked { border-color:var(--accent); background:var(--accent-glow); color:var(--accent); font-weight:600; }
    .form-row-gap { display:flex; gap:10px; align-items:flex-end; flex-wrap:wrap; }
    .add-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 14px; background:#f0fdf4; color:#0a7a4b; border:1px solid #a7f3d0; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; margin-top:6px; }
    .add-btn:hover { background:#dcfce7; }
    .icon-btn { width:28px; height:28px; border-radius:6px; border:none; cursor:pointer; font-size:13px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
    .icon-btn-danger { background:#fdecea; color:#c0182c; }
    .text-btn { background:none; border:none; cursor:pointer; font-family:inherit; }
    .text-btn-danger { color:#c0182c; font-size:12px; }
    .req { color:#c0182c; }
    .req-note { font-size:10px; color:var(--text-faint); margin-top:10px; }
  `]
})
export class Step3Component {
  readonly paymentTypes      = [...PAYMENT_TYPES];
  readonly ownershipTypes    = [...TRADE_OWNERSHIP_TYPES];
  readonly varianceOwnBy     = [...VARIANCE_OWN_BY];
  readonly varianceRiskMethods = [...VARIANCE_RISK_METHODS];
  readonly paidByOpts        = [...PAID_BY_OPTS];
  readonly postInspVarActions = [...POST_INSPECTION_VARIANCE_ACTIONS];
  readonly postInspLockActions = [...POST_INSPECTION_LOCK_ACTIONS];
  readonly assetTypes        = [...ASSET_TYPES];
  readonly varianceResTypes  = [...VARIANCE_RESOLUTION_TYPES];
  readonly recycleRules      = [...RECYCLE_RULES];
  openPay = -1;

  constructor(public svc: SetupFormService) {}
  get f() { return this.svc.form; }
  get anySimpleToggle() { return this.f.deferredSubmissionEnabled||this.f.smsEnabled||this.f.charityEnabled||this.f.externalPromoEnabled||this.f.deviceSearchLimitEnabled; }
  get simpleToggleCount() { return [this.f.deferredSubmissionEnabled,this.f.smsEnabled,this.f.charityEnabled,this.f.externalPromoEnabled,this.f.deviceSearchLimitEnabled].filter(Boolean).length; }
  toggle(arr: string[], item: string): void { const i = arr.indexOf(item); if (i >= 0) arr.splice(i, 1); else arr.push(item); }
}
