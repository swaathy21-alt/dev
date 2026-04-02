import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SetupFormService } from '../../../core/services/setup-form.service';
import {
  ALL_CHANNEL_TYPES, ASSET_TYPES, IDENTIFIER_FIELDS, BARCODE_TYPES,
  TRADE_OWNERSHIP_TYPES, BANK_VALIDATION_TYPES, DIAG_CATEGORY_NAMES,
  DIAG_TESTS, ChannelConfig, DiagTestConfig
} from '../../../core/constants';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="fade-in">
  <div class="step-header">
    <div class="step-header-label tier-channel-tag">CHANNEL LEVEL</div>
    <h2 class="step-header-title">Channels &amp; Features</h2>
    <p class="step-header-desc">Channels are the operational contexts through which trade-in happens under this account. Each channel inherits account defaults but can configure its own features. A channel that handles walk-in customers at a store has fundamentally different requirements from one that handles online self-serve or phone agent journeys.</p>
  </div>

  <div class="level-guide">
    <div class="lg-row">
      <div class="lg-col">
        <span class="lg-tag lg-tag-retail">🏪 Retail / In-store</span>
        <span class="lg-hint">Barcode ON · Address OFF · FMIP ON · No shipping label</span>
      </div>
      <div class="lg-col">
        <span class="lg-tag lg-tag-online">🌐 Online / Self-serve</span>
        <span class="lg-hint">Address ON · Shipping label ON · OTP ON · FMIP ON</span>
      </div>
      <div class="lg-col">
        <span class="lg-tag lg-tag-care">📞 Contact Centre</span>
        <span class="lg-hint">Address ON · Shipping label ON · FMIP OFF · No OTP</span>
      </div>
    </div>
  </div>

  <!-- Channel picker -->
  <div class="wizard-section wsec-configured">
    <div class="wsec-header">
      <span class="wsec-title">Select Active Channels</span>
      <span class="wsec-badge" [class.badge-set]="f.channels.length>0">{{f.channels.length>0 ? f.channels.length+' channel(s) selected' : 'None selected'}}</span>
    </div>
    <div class="wsec-body">
      <p class="wsec-guide">Select all channels that will be active under this account. Start with the primary ones — you can configure each channel's features below.</p>
      <div class="ch-picker" style="margin-top:12px">
        <div *ngFor="let ch of primaryChannels" class="ch-tile" [class.sel]="svc.hasChannel(ch)" (click)="onChannelToggle(ch)">
          <span class="ch-tile-icon">{{channelIcon(ch)}}</span>
          <span class="ch-tile-name">{{ch}}</span>
          <span class="ch-tile-check" *ngIf="svc.hasChannel(ch)">✓</span>
        </div>
      </div>
      <button class="text-btn" style="margin-top:8px;font-size:12px;color:var(--text-muted)" (click)="showMore=!showMore">
        {{showMore ? '▲ Show fewer channels' : '▼ More channel types ('+extraChannels.length+')'}}
      </button>
      <div class="ch-picker" *ngIf="showMore" style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--border)">
        <div *ngFor="let ch of extraChannels" class="ch-tile ch-tile-sm" [class.sel]="svc.hasChannel(ch)" (click)="onChannelToggle(ch)">
          <span class="ch-tile-icon">{{channelIcon(ch)}}</span>
          <span class="ch-tile-name">{{ch}}</span>
          <span class="ch-tile-check" *ngIf="svc.hasChannel(ch)">✓</span>
        </div>
      </div>
      <div *ngIf="f.channels.length===0" class="empty-state">Select at least one channel to configure its features.</div>
    </div>
  </div>

  <!-- Channel config — two-column layout -->
  <div *ngIf="f.channels.length>0" class="ch-layout">

    <!-- Left nav -->
    <div class="ch-nav">
      <div class="ch-nav-header">Channels</div>
      <div *ngFor="let ch of f.channels; let i=index"
           class="ch-nav-item" [class.active]="activeIdx===i" (click)="activeIdx=i">
        <span class="ch-nav-icon">{{channelIcon(ch.channelType)}}</span>
        <div class="ch-nav-info">
          <div class="ch-nav-name">{{ch.channelType}}</div>
          <div class="ch-nav-status">{{channelStatus(ch)}}</div>
        </div>
        <span class="ch-nav-active-dot"
          [class.dot-on]="ch.enabled && channelConfigured(ch)"
          [class.dot-warn]="ch.enabled && !channelConfigured(ch)"
          [title]="channelConfigured(ch) ? 'Configured' : 'Not yet configured'">
        </span>
      </div>
    </div>

    <!-- Right panel -->
    <div class="ch-panel">
      <ng-container *ngFor="let ch of f.channels; let i=index">
      <div *ngIf="activeIdx===i" class="fade-in">

        <div *ngIf="expandHint && i===activeIdx" class="expand-hint-banner">
          💡 Click any section below to expand and configure features for this channel.
        </div>
        <div class="ch-panel-top">
          <div class="ch-panel-identity">
            <span class="ch-panel-icon">{{channelIcon(ch.channelType)}}</span>
            <div>
              <div class="ch-panel-name">{{ch.channelType}}</div>
              <div class="ch-panel-desc">{{channelHint(ch.channelType)}}</div>
            </div>
          </div>
          <div class="ch-panel-actions">
            <label class="toggle-switch">
              <input type="checkbox" [(ngModel)]="ch.enabled">
              <span class="ts-track"><span class="ts-thumb"></span></span>
              <span class="ts-label">{{ch.enabled ? 'Active' : 'Inactive'}}</span>
            </label>
            <button class="text-btn text-btn-danger" (click)="removeChannel(ch.channelType, i)">Remove</button>
          </div>
        </div>

        <!-- SECTION: Feature Toggles -->
        <div class="ch-section">
          <div class="ch-sec-header">
            <span class="ch-sec-title">Feature Toggles</span>
            <span class="ch-sec-badge" [class.badge-on]="hasAnyToggle(ch)">{{hasAnyToggle(ch)?'● Configured':'○ None enabled'}}</span>
          </div>
          <div class="toggle-grid">
            <label class="tg-item" [class.tgi-on]="ch.fmipEnabled">
              <div class="tgi-text"><div class="tgi-name">Find My iPhone / Activation Lock</div><div class="tgi-key">FMIP_Plugin</div></div>
              <label class="toggle-switch"><input type="checkbox" [(ngModel)]="ch.fmipEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label>
            </label>
            <label class="tg-item" [class.tgi-on]="ch.shippingLabelByGtpEnabled">
              <div class="tgi-text"><div class="tgi-name">GTP Shipping Label Generation</div><div class="tgi-key">shipping_label_generate_by_gtp</div></div>
              <label class="toggle-switch"><input type="checkbox" [(ngModel)]="ch.shippingLabelByGtpEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label>
            </label>
            <label class="tg-item" [class.tgi-on]="ch.manufactureCareEnabled">
              <div class="tgi-text"><div class="tgi-name">Manufacturer Care Eligibility</div><div class="tgi-key">manufacture_care_eligibility</div></div>
              <label class="toggle-switch"><input type="checkbox" [(ngModel)]="ch.manufactureCareEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label>
            </label>
          </div>
          <div *ngIf="ch.manufactureCareEnabled" class="sub-form" style="margin-top:8px">
            <div class="form-group" style="max-width:400px;margin:0"><label class="form-label">Manufacturer Care Plus URL <span class="req">*</span></label><input class="form-input" [(ngModel)]="ch.manufactureCareUrl" placeholder="https://..."/></div>
          </div>
        </div>

        <!-- SECTION: Trade-In Setup -->
        <div class="ch-section">
          <div class="ch-sec-header" (click)="toggle2('ti'+i)">
            <div><span class="ch-sec-title">Trade-In Setup</span><span class="ch-sec-key">tradein_method · tradein_verification</span></div>
            <div class="ch-sec-right">
              <span class="ch-sec-badge" [class.badge-on]="ch.tradeinMethodEnabled||ch.tradeinVerificationEnabled">{{tradeStatus(ch)}}</span>
              <span class="expand-arrow">{{open['ti'+i]?'▲':'▼'}}</span>
            </div>
          </div>
          <div *ngIf="open['ti'+i]" class="ch-sec-body">
            <div class="sub-feat">
              <div class="sf-header">
                <div><div class="sf-name">Trade-In Methods</div><div class="sf-key">tradein_method</div></div>
                <label class="toggle-switch"><input type="checkbox" [(ngModel)]="ch.tradeinMethodEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label>
              </div>
              <div *ngIf="ch.tradeinMethodEnabled">
                <div *ngFor="let m of ch.tradeinMethods; let mi=index" class="entry-card">
                  <div class="entry-card-header"><span class="entry-num">Method {{mi+1}}</span><button class="icon-btn icon-btn-danger" (click)="svc.removeTradeinMethod(ch,mi)">✕</button></div>
                  <div class="form-group"><label class="form-label">Image URL / Resource Key <span class="req">*</span></label><input class="form-input" [(ngModel)]="m.imageUrl" placeholder="e.g. tradeinstore"/></div>
                  <div class="form-group"><label class="form-label">Method Resource Name <span class="req">*</span></label><input class="form-input" [(ngModel)]="m.resourceName" placeholder="e.g. TRADEIN_AT_STORE"/></div>
                  <div class="form-group"><label class="form-label">Method Description Resource Name <span class="req">*</span></label><input class="form-input" [(ngModel)]="m.descResourceName" placeholder="e.g. TRADEIN_AT_STORE_DESC"/></div>
                </div>
                <button class="add-btn" (click)="svc.addTradeinMethod(ch)">+ Add Trade-In Method</button>
              </div>
            </div>
            <div class="sub-feat" style="margin-top:12px">
              <div class="sf-header">
                <div><div class="sf-name">Trade-In Verification (OTP)</div><div class="sf-key">tradein_verification</div></div>
                <label class="toggle-switch"><input type="checkbox" [(ngModel)]="ch.tradeinVerificationEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label>
              </div>
              <div *ngIf="ch.tradeinVerificationEnabled">
                <div *ngFor="let e of ch.tivEntries; let ei=index" class="entry-card">
                  <div class="form-row-gap">
                    <div class="form-group" style="margin:0;flex:1"><label class="form-label" style="font-size:10px">Field Name <span class="req">*</span></label><select class="form-select" [(ngModel)]="e.fieldName"><option>Email</option><option>PhoneNumber</option></select></div>
                    <div class="form-group" style="margin:0;flex:1"><label class="form-label" style="font-size:10px">Verification Type <span class="req">*</span></label><select class="form-select"><option>OTP</option></select></div>
                    <div class="form-group" style="margin:0;width:120px"><label class="form-label" style="font-size:10px">Expires (mins) <span class="req">*</span></label><input type="number" class="form-input" [(ngModel)]="e.expiresInMins"/></div>
                    <button class="icon-btn icon-btn-danger" style="align-self:flex-end;margin-bottom:0" (click)="svc.removeTivEntry(ch,ei)">✕</button>
                  </div>
                </div>
                <button class="add-btn" (click)="svc.addTivEntry(ch)">+ Add to Trade-In Verification</button>
              </div>
            </div>
            <p class="req-note">* = required fields</p>
          </div>
        </div>

        <!-- SECTION: Device & Diagnostics -->
        <div class="ch-section">
          <div class="ch-sec-header" (click)="toggle2('dd'+i)">
            <div><span class="ch-sec-title">Device &amp; Diagnostics</span><span class="ch-sec-key">asset_details · device_diagnostics</span></div>
            <div class="ch-sec-right">
              <span class="ch-sec-badge" [class.badge-on]="ch.assetDetailConfigs.length>0||ch.deviceDiagnosticsEnabled">{{deviceStatus(ch)}}</span>
              <span class="expand-arrow">{{open['dd'+i]?'▲':'▼'}}</span>
            </div>
          </div>
          <div *ngIf="open['dd'+i]" class="ch-sec-body">
            <div class="sub-feat">
              <div class="sf-header"><div><div class="sf-name">Asset Details</div><div class="sf-key">asset_details</div></div></div>
              <div *ngFor="let ad of ch.assetDetailConfigs; let ai=index" class="entry-card">
                <div class="entry-card-header"><span class="entry-num">Config {{ai+1}}</span><button class="icon-btn icon-btn-danger" (click)="svc.removeAssetDetailConfig(ch,ai)">✕</button></div>
                <div class="form-group"><label class="form-label">Asset Types <span class="req">*</span></label><div class="chip-row"><label *ngFor="let a of assetTypes" class="check-chip" [class.checked]="ad.assetTypes.includes(a)" (click)="toggle(ad.assetTypes,a)">{{a}}</label></div></div>
                <div class="grid-cols-2">
                  <div class="form-group"><label class="form-label">Required Fields</label><div class="chip-row"><label *ngFor="let f of identifierFields" class="check-chip" [class.checked]="ad.requiredFields.includes(f)" (click)="toggle(ad.requiredFields,f)">{{f}}</label></div></div>
                  <div class="form-group"><label class="form-label">Optional Fields</label><div class="chip-row"><label *ngFor="let f of identifierFields" class="check-chip" [class.checked]="ad.optionalFields.includes(f)" (click)="toggle(ad.optionalFields,f)">{{f}}</label></div></div>
                </div>
              </div>
              <button class="add-btn" (click)="svc.addAssetDetailConfig(ch)">+ Add to Asset Details</button>
            </div>
            <div class="sub-feat" style="margin-top:12px">
              <div class="sf-header">
                <div><div class="sf-name">Device Diagnostics</div><div class="sf-key">device_diagnostics</div></div>
                <label class="toggle-switch"><input type="checkbox" [(ngModel)]="ch.deviceDiagnosticsEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label>
              </div>
              <div *ngIf="ch.deviceDiagnosticsEnabled">
                <div class="grid-cols-2" style="margin-bottom:12px">
                  <div class="form-group"><label class="form-label">Code Expiry (minutes) <span class="req">*</span></label><input type="number" class="form-input" [(ngModel)]="ch.diagnosticsCodeExpiryMins"/></div>
                  <div class="form-group"><label class="form-label">Poll Interval (minutes) <span class="req">*</span></label><input type="number" class="form-input" [(ngModel)]="ch.diagnosticsPollIntervalMins"/></div>
                  <div class="form-group"><label class="form-label">App Store URL</label><input class="form-input" [(ngModel)]="ch.diagnosticsAppStoreUrl" placeholder="www.apple.com"/></div>
                  <div class="form-group"><label class="form-label">Play Store URL</label><input class="form-input" [(ngModel)]="ch.diagnosticsPlayStoreUrl" placeholder="play.google.com"/></div>
                  <div class="form-group"><label class="form-label">Redirection URL</label><input class="form-input" [(ngModel)]="ch.diagnosticsAppRedirectionUrl"/></div>
                </div>
                <div *ngFor="let tc of ch.diagTestConfigs; let ti=index" class="entry-card">
                  <div class="entry-card-header">
                    <button class="text-btn" style="font-size:11px;font-weight:600" (click)="toggle2('dt'+i+ti)">Diagnostics Test Config {{ti+1}} {{open['dt'+i+ti]?'▲':'▼'}}</button>
                    <button class="icon-btn icon-btn-danger" (click)="svc.removeDiagTestConfig(ch,ti)">✕</button>
                  </div>
                  <div *ngIf="open['dt'+i+ti]">
                    <div class="form-group"><label class="form-label">Asset Types <span class="req">*</span></label><div class="chip-row"><label *ngFor="let a of assetTypes" class="check-chip" [class.checked]="tc.assetTypes.includes(a)" (click)="toggle(tc.assetTypes,a)">{{a}}</label></div></div>
                    <div style="font-size:11px;font-weight:600;margin:8px 0 6px;color:var(--text-muted)">Channel Types</div>
                    <div *ngFor="let dct of tc.channelTypes; let dci=index" class="form-row-gap" style="margin-bottom:8px">
                      <div class="form-group" style="margin:0;flex:2"><label class="form-label" style="font-size:10px">Channel Type <span class="req">*</span></label><select class="form-select" [(ngModel)]="dct.channelType"><option value="">-- Select --</option><option *ngFor="let ct of allChannels" [value]="ct">{{ct}}</option></select></div>
                      <div class="form-group" style="margin:0;flex:1"><label class="form-label" style="font-size:10px">Priority <span class="req">*</span></label><input class="form-input" [(ngModel)]="dct.diagnosticsPriority" placeholder="e.g. ON"/></div>
                      <button class="icon-btn icon-btn-danger" style="align-self:flex-end" (click)="svc.removeDiagChannelType(tc,dci)">✕</button>
                    </div>
                    <button class="add-btn add-btn-sm" (click)="svc.addDiagChannelType(tc)">+ Add Channel Type</button>
                    <div style="font-size:11px;font-weight:600;margin:10px 0 6px;color:var(--text-muted)">Diagnostics Categories</div>
                    <div *ngFor="let cat of tc.categories; let cati=index" class="entry-card" style="background:#fff">
                      <div class="form-row-gap" style="margin-bottom:6px">
                        <div class="form-group" style="margin:0"><label class="form-label" style="font-size:10px">Category</label><select class="form-select" [(ngModel)]="cat.categoryName" style="min-width:150px"><option value="">-- Select --</option><option *ngFor="let c of diagCatNames" [value]="c">{{c}}</option></select></div>
                        <button class="icon-btn icon-btn-danger" style="align-self:flex-end" (click)="svc.removeDiagCategory(tc,cati)">✕</button>
                      </div>
                      <div *ngIf="cat.categoryName" class="chip-row"><label *ngFor="let t of getTests(cat.categoryName)" class="check-chip check-chip-sm" [class.checked]="cat.enabledTests.includes(t)" (click)="toggle(cat.enabledTests,t)">{{t}}</label></div>
                    </div>
                    <button class="add-btn add-btn-sm" (click)="svc.addDiagCategory(tc)">+ Add Category</button>
                  </div>
                </div>
                <button class="add-btn" (click)="addDiagConfig(ch, i)">+ Add Test Configuration</button>
              </div>
            </div>
            <p class="req-note">* = required fields</p>
          </div>
        </div>

        <!-- SECTION: Checkout & Shipping -->
        <div class="ch-section">
          <div class="ch-sec-header" (click)="toggle2('cs'+i)">
            <div><span class="ch-sec-title">Checkout &amp; Shipping</span><span class="ch-sec-key">address_validation · collect_shipping_address · store_radius · barcode</span></div>
            <div class="ch-sec-right">
              <span class="ch-sec-badge" [class.badge-on]="checkoutOn(ch)">{{checkoutOn(ch)?'● Configured':'○ Not configured'}}</span>
              <span class="expand-arrow">{{open['cs'+i]?'▲':'▼'}}</span>
            </div>
          </div>
          <div *ngIf="open['cs'+i]" class="ch-sec-body">
            <div class="sub-feat">
              <div class="sf-header"><div><div class="sf-name">Address Validation</div><div class="sf-key">address_validation</div></div><label class="toggle-switch"><input type="checkbox" [(ngModel)]="ch.addressValidationEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label></div>
              <div *ngIf="ch.addressValidationEnabled" style="margin-top:8px"><label class="form-label" style="font-size:11px">Disable Address Validation for Channel Types</label><div class="chip-row chip-row-sm"><label *ngFor="let ct of allChannels" class="check-chip check-chip-sm" [class.checked]="ch.addressValidationDisabledChannels.includes(ct)" (click)="toggle(ch.addressValidationDisabledChannels,ct)">{{ct}}</label></div></div>
            </div>
            <div class="sub-feat" style="margin-top:10px">
              <div class="sf-header"><div><div class="sf-name">Collect Shipping Address</div><div class="sf-key">collect_shipping_address</div></div><label class="toggle-switch"><input type="checkbox" [(ngModel)]="ch.collectShippingAddressEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label></div>
              <div *ngIf="ch.collectShippingAddressEnabled" style="margin-top:8px"><label class="form-label" style="font-size:11px">Trade Ownership Types <span class="req">*</span></label><div class="chip-row"><label *ngFor="let t of ownershipTypes" class="check-chip" [class.checked]="ch.collectShippingAddressOwnershipTypes.includes(t)" (click)="toggle(ch.collectShippingAddressOwnershipTypes,t)">{{t}}</label></div></div>
            </div>
            <div class="sub-feat" style="margin-top:10px">
              <div class="sf-header"><div><div class="sf-name">Store Search Radius</div><div class="sf-key">store_radius</div></div><label class="toggle-switch"><input type="checkbox" [(ngModel)]="ch.storeRadiusEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label></div>
              <div *ngIf="ch.storeRadiusEnabled" style="margin-top:8px;display:flex;align-items:center;gap:8px"><input type="number" class="form-input" [(ngModel)]="ch.storeRadius" placeholder="75" style="width:120px"/><span class="form-label" style="margin:0">miles / km</span></div>
            </div>
            <div class="sub-feat" style="margin-top:10px">
              <div class="sf-header"><div><div class="sf-name">Barcode Scanning</div><div class="sf-key">barcode</div></div><label class="toggle-switch"><input type="checkbox" [(ngModel)]="ch.barcodeEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label></div>
              <div *ngIf="ch.barcodeEnabled" style="margin-top:8px"><label class="form-label" style="font-size:11px">Barcode Type</label><select class="form-select" [(ngModel)]="ch.barcodeType" style="max-width:180px"><option value="">-- Select --</option><option *ngFor="let b of barcodeTypes" [value]="b">{{b}}</option></select></div>
            </div>
            <div class="sub-feat" style="margin-top:10px">
              <div class="sf-header"><div><div class="sf-name">Shipping Method</div><div class="sf-key">shipping_method</div></div><label class="toggle-switch"><input type="checkbox" [(ngModel)]="ch.shippingMethodEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label></div>
              <div *ngIf="ch.shippingMethodEnabled" style="margin-top:8px">
                <div class="form-group"><label class="form-label" style="font-size:11px">Shipping Method Type</label><div class="chip-row"><label *ngFor="let t of shippingMethodTypes" class="check-chip" [class.checked]="ch.shippingMethodType===t" (click)="ch.shippingMethodType=t">{{t}}</label></div></div>
                <div *ngIf="ch.shippingMethodType==='BoxKit'" class="inset-card" style="margin-top:10px">
                  <div class="inset-card-title">BoxKit Settings</div>
                  <label class="check-label"><input type="checkbox" [(ngModel)]="ch.additionalBoxKitRequest"> Additional Box Kit Request</label>
                  <div *ngIf="ch.additionalBoxKitRequest" class="form-row-gap" style="margin-top:10px">
                    <div class="form-group" style="margin:0;width:170px"><label class="form-label">Request Interval</label><input type="number" class="form-input" [(ngModel)]="ch.additionalBoxKitRequestInterval"/></div>
                    <div class="form-group" style="margin:0;width:170px"><label class="form-label">Request Count</label><input type="number" class="form-input" [(ngModel)]="ch.additionalBoxKitRequestCount"/></div>
                  </div>
                </div>
              </div>
            </div>
            <p class="req-note">* = required fields</p>
          </div>
        </div>

        <!-- SECTION: Security & Compliance -->
        <div class="ch-section">
          <div class="ch-sec-header" (click)="toggle2('sc'+i)">
            <div><span class="ch-sec-title">Security &amp; Compliance</span><span class="ch-sec-key">bank_account_validation · iban_validation</span></div>
            <div class="ch-sec-right">
              <span class="ch-sec-badge" [class.badge-on]="securityOn(ch)">{{securityOn(ch)?'● Configured':'○ Not configured'}}</span>
              <span class="expand-arrow">{{open['sc'+i]?'▲':'▼'}}</span>
            </div>
          </div>
          <div *ngIf="open['sc'+i]" class="ch-sec-body">
            <div class="sub-feat">
              <div class="sf-header"><div><div class="sf-name">Bank Account Validation</div><div class="sf-key">bank_account_validation</div></div><label class="toggle-switch"><input type="checkbox" [(ngModel)]="ch.bankAccountValidationEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label></div>
              <div *ngIf="ch.bankAccountValidationEnabled" style="margin-top:8px"><label class="form-label" style="font-size:11px">Validation Provider <span class="req">*</span></label><select class="form-select" [(ngModel)]="ch.bankAccountValidationType" style="max-width:220px"><option value="">-- Select --</option><option *ngFor="let t of bankValidationTypes" [value]="t">{{t}}</option></select></div>
            </div>
            <div class="sub-feat" style="margin-top:10px">
              <div class="sf-header"><div><div class="sf-name">IBAN Validation</div><div class="sf-key">iban_validation</div></div><label class="toggle-switch"><input type="checkbox" [(ngModel)]="ch.ibanValidationEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label></div>
              <div *ngIf="ch.ibanValidationEnabled" style="margin-top:8px">
                <div class="grid-cols-3">
                  <div class="form-group"><label class="form-label">IBAN Validation Type <span class="req">*</span></label><input class="form-input" [(ngModel)]="ch.ibanValidationType" placeholder="e.g. IBAN validation type"/></div>
                  <div class="form-group"><label class="form-label">Currency Code <span class="req">*</span></label><input class="form-input" [(ngModel)]="ch.ibanCurrencyCode" placeholder="e.g. GBP"/></div>
                  <div class="form-group"><label class="form-label">Country Code <span class="req">*</span></label><input class="form-input" [(ngModel)]="ch.ibanCountryCode" placeholder="e.g. GB"/></div>
                </div>
              </div>
            </div>
            <p class="req-note">* = required fields</p>
          </div>
        </div>

      </div>
      </ng-container>
    </div>
  </div>
</div>`,
  styles: [`
    .step-header { margin-bottom:20px; }
    .step-header-label { display:inline-block; font-size:10px; font-weight:700; letter-spacing:1px; padding:3px 10px; border-radius:20px; margin-bottom:8px; }
    .tier-channel-tag { background:#ede9fe; color:#5b21b6; border:1px solid #c4b5fd; }
    .step-header-title { font-size:20px; font-weight:700; margin-bottom:6px; }
    .step-header-desc { font-size:12px; color:var(--text-muted); line-height:1.6; max-width:680px; }

    .level-guide { background:#f5f3ff; border:1px solid #c4b5fd; border-radius:10px; padding:12px 16px; margin-bottom:16px; }
    .lg-row { display:flex; gap:12px; flex-wrap:wrap; }
    .lg-col { display:flex; flex-direction:column; gap:4px; flex:1; min-width:180px; }
    .lg-tag { display:inline-block; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; }
    .lg-tag-retail { background:#fef3c7; color:#92400e; }
    .lg-tag-online { background:#dbeafe; color:#1e40af; }
    .lg-tag-care   { background:#d1fae5; color:#065f46; }
    .lg-hint { font-size:11px; color:var(--text-muted); line-height:1.4; }

    .wizard-section { background:#fff; border:1px solid var(--border); border-radius:12px; margin-bottom:12px; overflow:hidden; }
    .wizard-section.wsec-configured { border-color:var(--accent); }
    .wsec-header { display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid var(--border-light); }
    .wsec-title { font-weight:700; font-size:13px; }
    .wsec-badge { font-size:11px; font-weight:600; color:var(--text-faint); padding:3px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; white-space:nowrap; }
    .wsec-badge.badge-set { background:var(--accent-glow); border-color:var(--accent); color:var(--accent); }
    .wsec-body { padding:14px 18px; }
    .wsec-guide { font-size:12px; color:var(--text-muted); line-height:1.6; }

    .ch-picker { display:flex; flex-wrap:wrap; gap:8px; }
    .ch-tile { display:flex; align-items:center; gap:6px; padding:9px 16px; border:2px solid var(--border); border-radius:10px; cursor:pointer; user-select:none; transition:all .15s; font-size:13px; }
    .ch-tile:hover { border-color:#c4b5fd; background:#faf5ff; }
    .ch-tile.sel { border-color:#5b21b6; background:#ede9fe; color:#5b21b6; font-weight:600; }
    .ch-tile-sm { padding:6px 12px; font-size:12px; }
    .ch-tile-icon { font-size:16px; }
    .ch-tile-name { }
    .ch-tile-check { color:#059669; font-weight:700; }

    .ch-layout { display:grid; grid-template-columns:210px 1fr; gap:14px; align-items:start; }
    .ch-nav { background:#fff; border:1px solid var(--border); border-radius:12px; overflow:hidden; position:sticky; top:20px; }
    .ch-nav-header { padding:10px 14px; font-size:10px; font-weight:700; color:var(--text-faint); text-transform:uppercase; letter-spacing:.5px; border-bottom:1px solid var(--border-light); background:#faf9ff; }
    .ch-nav-item { display:flex; align-items:center; gap:10px; padding:11px 14px; cursor:pointer; border-bottom:1px solid var(--border-light); transition:all .15s; }
    .ch-nav-item:last-child { border-bottom:none; }
    .ch-nav-item:hover { background:#faf5ff; }
    .ch-nav-item.active { background:#ede9fe; border-left:3px solid #5b21b6; }
    .ch-nav-icon { font-size:18px; flex-shrink:0; }
    .ch-nav-info { flex:1; min-width:0; }
    .ch-nav-name { font-size:12px; font-weight:600; }
    .ch-nav-status { font-size:10px; color:var(--text-faint); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .ch-nav-active-dot { width:8px; height:8px; border-radius:50%; background:#e2e8f0; flex-shrink:0; }
    .ch-nav-active-dot.dot-on { background:#059669; }
    .ch-nav-active-dot.dot-warn { background:#f59e0b; }

    .ch-panel { background:#fff; border:1px solid var(--border); border-radius:12px; padding:18px; }
    .ch-panel-top { display:flex; justify-content:space-between; align-items:flex-start; padding-bottom:14px; border-bottom:1px solid var(--border-light); margin-bottom:14px; }
    .ch-panel-identity { display:flex; align-items:center; gap:12px; }
    .ch-panel-icon { font-size:28px; }
    .ch-panel-name { font-size:15px; font-weight:700; }
    .ch-panel-desc { font-size:11px; color:var(--text-muted); margin-top:2px; max-width:340px; }
    .ch-panel-actions { display:flex; align-items:center; gap:12px; }

    .ch-section { border:1px solid var(--border-light); border-radius:10px; margin-bottom:10px; overflow:hidden; }
    .ch-sec-header { display:flex; justify-content:space-between; align-items:center; padding:12px 14px; cursor:pointer; background:#faf9ff; transition:background .15s; }
    .ch-sec-header:hover { background:#f5f3ff; }
    .ch-sec-title { font-size:13px; font-weight:700; }
    .ch-sec-key { font-family:monospace; font-size:10px; color:var(--text-faint); background:#f1f5f9; padding:1px 5px; border-radius:3px; margin-left:8px; }
    .ch-sec-right { display:flex; align-items:center; gap:8px; }
    .ch-sec-badge { font-size:11px; font-weight:600; color:var(--text-faint); }
    .ch-sec-badge.badge-on { color:#059669; }
    .expand-arrow { font-size:11px; color:var(--text-faint); }
    .ch-sec-body { padding:14px; border-top:1px solid var(--border-light); }

    .toggle-grid { display:flex; flex-direction:column; gap:6px; margin-top:10px; }
    .tg-item { display:flex; justify-content:space-between; align-items:center; padding:11px 14px; border:1px solid var(--border-light); border-radius:8px; cursor:pointer; transition:all .15s; }
    .tg-item.tgi-on { background:#f0fdf4; border-color:#a7f3d0; }
    .tgi-text { }
    .tgi-name { font-size:12px; font-weight:600; }
    .tgi-key { font-family:monospace; font-size:10px; color:var(--text-faint); margin-top:2px; }

    .sub-feat { background:#faf9ff; border:1px solid var(--border-light); border-radius:8px; padding:12px; }
    .sf-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; }
    .sf-name { font-size:12px; font-weight:700; }
    .sf-key { font-family:monospace; font-size:10px; color:var(--text-faint); margin-top:2px; }
    .sub-form { background:#fff; border:1px solid var(--border-light); border-radius:6px; padding:10px; margin-top:6px; }

    .entry-card { background:#fff; border:1px solid var(--border); border-radius:8px; padding:12px; margin-bottom:8px; }
    .entry-card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
    .entry-num { font-size:11px; font-weight:700; color:var(--accent); }

    .toggle-switch { display:inline-flex; align-items:center; gap:6px; cursor:pointer; }
    .ts-track { width:36px; height:20px; border-radius:10px; background:#e2e8f0; position:relative; transition:background .2s; display:block; }
    input:checked ~ .ts-track, input:checked + .ts-track { background:var(--accent); }
    .ts-thumb { width:14px; height:14px; border-radius:50%; background:#fff; position:absolute; top:3px; left:3px; transition:left .2s; display:block; box-shadow:0 1px 3px rgba(0,0,0,.2); }
    input:checked ~ .ts-track .ts-thumb, input:checked + .ts-track .ts-thumb { left:19px; }
    .ts-label { font-size:12px; font-weight:600; color:var(--text-muted); }

    .chip-row { display:flex; flex-wrap:wrap; gap:6px; margin-top:4px; }
    .chip-row-sm { }
    .check-chip { display:inline-flex; align-items:center; padding:4px 11px; border:1px solid var(--border); border-radius:12px; font-size:11px; cursor:pointer; user-select:none; transition:all .15s; }
    .check-chip.checked { border-color:var(--accent); background:var(--accent-glow); color:var(--accent); font-weight:600; }
    .check-chip-sm { font-size:10px; padding:3px 8px; }
    .grid-cols-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .grid-cols-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
    .form-row-gap { display:flex; gap:10px; align-items:flex-end; flex-wrap:wrap; }
    .add-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 14px; background:#f0fdf4; color:#0a7a4b; border:1px solid #a7f3d0; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; margin-top:6px; }
    .add-btn:hover { background:#dcfce7; }
    .add-btn-sm { padding:4px 10px; font-size:11px; }
    .icon-btn { width:28px; height:28px; border-radius:6px; border:none; cursor:pointer; font-size:13px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
    .icon-btn-danger { background:#fdecea; color:#c0182c; }
    .text-btn { background:none; border:none; cursor:pointer; font-family:inherit; }
    .text-btn-danger { color:#c0182c; font-size:12px; }
    .empty-state { font-size:12px; color:var(--text-faint); font-style:italic; padding:12px 0; }
    .expand-hint-banner { font-size:11px; color:#5b21b6; background:#ede9fe; border:1px solid #c4b5fd; border-radius:8px; padding:8px 12px; margin-bottom:12px; }
    .proposed-notice { display:flex; gap:12px; padding:12px 16px; background:#fff7ed; border:1px solid #fed7aa; border-radius:10px; margin-bottom:12px; font-size:12px; color:#92400e; line-height:1.6; }
    .pn-icon { font-size:16px; flex-shrink:0; margin-top:1px; }
    .req { color:#c0182c; }
    .req-note { font-size:10px; color:var(--text-faint); margin-top:10px; }
  `]
})
export class Step2Component {
  readonly primaryChannels  = ['Online','Retail','ContactCenter','MobileApp','API'];
  readonly extraChannels    = [...ALL_CHANNEL_TYPES].filter(c => !['Online','Retail','ContactCenter','MobileApp','API'].includes(c));
  readonly allChannels      = [...ALL_CHANNEL_TYPES];
  readonly assetTypes       = [...ASSET_TYPES];
  readonly identifierFields = [...IDENTIFIER_FIELDS];
  readonly barcodeTypes     = [...BARCODE_TYPES];
  readonly shippingMethodTypes = ['ShippingLabel','BoxKit','None','Store'];
  readonly ownershipTypes   = [...TRADE_OWNERSHIP_TYPES];
  readonly bankValidationTypes = [...BANK_VALIDATION_TYPES];
  readonly diagCatNames     = [...DIAG_CATEGORY_NAMES];

  activeIdx  = 0;
  showMore   = false;
  expandHint = true;
  open: Record<string, boolean> = {};

  constructor(public svc: SetupFormService) {}
  get f() { return this.svc.form; }

  toggle(arr: string[], item: string): void { const i = arr.indexOf(item); if (i >= 0) arr.splice(i, 1); else arr.push(item); }
  toggle2(key: string): void { this.open[key] = !this.open[key]; }

  onChannelToggle(ch: string): void {
    const wasSelected = this.svc.hasChannel(ch);
    this.svc.toggleChannel(ch);
    if (!wasSelected) {
      // Auto-select newly added channel and open first section
      const idx = this.svc.form.channels.findIndex(c => c.channelType === ch);
      if (idx >= 0) {
        this.activeIdx = idx;
        this.open['ti' + idx] = true; // auto-open Trade-In Setup
        this.expandHint = false;
      }
    }
  }

  removeChannel(type: string, removedIdx: number): void {
    this.svc.toggleChannel(type);
    // Reset activeIdx safely after removal
    const len = this.svc.form.channels.length;
    if (len === 0) {
      this.activeIdx = 0;
    } else if (this.activeIdx >= len) {
      this.activeIdx = len - 1;
    } else if (removedIdx < this.activeIdx) {
      this.activeIdx = this.activeIdx - 1;
    }
    // If we removed the active channel, stay at same index (now points to next channel)
  }

  addDiagConfig(ch: any, chIdx: number): void {
    this.svc.addDiagTestConfig(ch);
    const newIdx = ch.diagTestConfigs.length - 1;
    this.open['dt' + chIdx + newIdx] = true;
  }
  getTests(cat: string): string[] { return DIAG_TESTS[cat] || []; }

  channelIcon(ch: string): string {
    const m: Record<string,string> = { Online:'🌐',Retail:'🏪',ContactCenter:'📞',MobileApp:'📱',API:'⚙',PSS:'🖥',WebService:'🔌',RetailWeb:'🛒',RetailMobile:'📲',EnrollmentService:'📋',IVR:'☎',PointofSale:'💳',CallCenter:'🎧',ChatBot:'🤖',Alexa:'🔊',EnrollmentPortal:'📄',Migration:'🔄',RedemptionService:'🎁',EquipmentOwnerDataFeed:'📡',Unknown:'❓',Website:'🌍',SelfService:'👤' };
    return m[ch] || '📡';
  }
  channelHint(ch: string): string {
    const m: Record<string,string> = { Online:'Self-serve web portal — collects address, mail-in trade, OTP verification', Retail:'In-store agent — barcode scan, store inspection, device handed in', ContactCenter:'Agent-assisted phone/chat — provisional quote, mail-in via carrier shipping', MobileApp:'Carrier mobile app — app-based diagnostics, self-serve', API:'Headless B2B or third-party system integration' };
    return m[ch] || '';
  }
  channelStatus(ch: ChannelConfig): string {
    const n = [
      ch.fmipEnabled, ch.shippingLabelByGtpEnabled, ch.manufactureCareEnabled,
      ch.shippingMethodEnabled,
      ch.tradeinMethodEnabled, ch.tradeinVerificationEnabled,
      ch.assetDetailConfigs.length > 0, ch.deviceDiagnosticsEnabled,
      ch.addressValidationEnabled, ch.collectShippingAddressEnabled,
      ch.storeRadiusEnabled, ch.barcodeEnabled,
      ch.bankAccountValidationEnabled, ch.ibanValidationEnabled
    ].filter(Boolean).length;
    return n > 0 ? `${n} feature(s) configured` : 'Nothing configured yet';
  }
  channelConfigured(ch: ChannelConfig): boolean {
    return [
      ch.fmipEnabled, ch.shippingLabelByGtpEnabled, ch.manufactureCareEnabled,
      ch.shippingMethodEnabled,
      ch.tradeinMethodEnabled, ch.tradeinVerificationEnabled,
      ch.assetDetailConfigs.length > 0, ch.deviceDiagnosticsEnabled,
      ch.addressValidationEnabled, ch.collectShippingAddressEnabled,
      ch.storeRadiusEnabled, ch.barcodeEnabled
    ].some(Boolean);
  }
  hasAnyToggle(ch: ChannelConfig): boolean { return ch.fmipEnabled || ch.shippingLabelByGtpEnabled || ch.manufactureCareEnabled; }
  tradeStatus(ch: ChannelConfig): string { const p = [ch.tradeinMethodEnabled&&`${ch.tradeinMethods.length} method(s)`, ch.tradeinVerificationEnabled&&'OTP on'].filter(Boolean); return p.length ? '● '+p.join(', ') : '○ Not configured'; }
  deviceStatus(ch: ChannelConfig): string { const p = [ch.assetDetailConfigs.length&&`${ch.assetDetailConfigs.length} asset config(s)`, ch.deviceDiagnosticsEnabled&&'Diagnostics on'].filter(Boolean); return p.length ? '● '+p.join(', ') : '○ Not configured'; }
  checkoutOn(ch: ChannelConfig): boolean { return ch.addressValidationEnabled || ch.collectShippingAddressEnabled || ch.storeRadiusEnabled || ch.barcodeEnabled; }
  securityOn(ch: ChannelConfig): boolean { return ch.bankAccountValidationEnabled || ch.ibanValidationEnabled; }
}
