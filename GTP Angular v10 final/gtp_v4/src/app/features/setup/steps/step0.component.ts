import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SetupFormService } from '../../../core/services/setup-form.service';
import {
  EXISTING_PROGRAMS, PRICE_MODEL_TYPES, PRICE_ASOF_DATE_TYPES,
  PRICE_MISMATCH_ACTIONS, QUESTION_CATEGORY_TYPES, DEFAULT_PRICE_TIERS,
  QUESTION_TYPES, DEDUCTION_TYPES, DEFECT_TYPES,
  ALL_DIAG_TESTS, ASSET_TYPES, TRADE_OWNERSHIP_TYPES,
  DeviceTypeQuestions, GradingQuestion, PossibleAnswer
} from '../../../core/constants';

@Component({
  selector: 'app-step0',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="fade-in">

  <!-- Hierarchy banner -->
  <div class="hierarchy-banner" [class.collapsed]="hierCollapsed">
    <button class="hier-toggle" (click)="hierCollapsed=!hierCollapsed" title="{{hierCollapsed?'Expand':'Collapse'}} hierarchy guide">
      {{hierCollapsed ? '▶ Show hierarchy' : '▼ Hide'}}
    </button>
    <div class="hier-tier tier-program">
      <div class="tier-icon">🏛</div>
      <div class="tier-label">Program</div>
      <div class="tier-desc">Pricing engine, grading rules, question catalogue.<br>Shared across all carrier accounts on this program.</div>
    </div>
    <div class="hier-arrow">→</div>
    <div class="hier-tier tier-account">
      <div class="tier-icon">🏢</div>
      <div class="tier-label">Account</div>
      <div class="tier-desc">One carrier / brand instance.<br>Inherits program defaults. Overrides branding &amp; URL.</div>
    </div>
    <div class="hier-arrow">→</div>
    <div class="hier-tier tier-channel">
      <div class="tier-icon">📡</div>
      <div class="tier-label">Channel</div>
      <div class="tier-desc">Operational context: Online, Retail, Care, API.<br>Inherits account defaults. Overrides per-journey features.</div>
    </div>
  </div>

  <div class="step-header">
    <div class="step-header-label tier-program-tag">PROGRAM LEVEL</div>
    <h2 class="step-header-title">Program &amp; Pricing</h2>
    <p class="step-header-desc">Configure the pricing engine and grading rules that apply globally across all carrier accounts and all channels on this program. Set once — accounts and channels inherit, but cannot change these values.</p>
  </div>

  <!-- ── Program Selection ─────────────────────────────────────── -->
  <div class="wizard-section">
    <div class="wsec-header">
      <span class="wsec-title">Program Selection</span>
    </div>
    <div class="wsec-body">
      <div class="radio-cards">
        <label class="radio-card" [class.sel]="f.programMode==='existing'" (click)="f.programMode='existing'">
          <input type="radio" name="pmode" [checked]="f.programMode==='existing'" style="display:none">
          <div class="rc-icon">📋</div>
          <div class="rc-label">Use Existing Program</div>
          <div class="rc-desc">Link this account to a program already in GTP</div>
        </label>
        <label class="radio-card" [class.sel]="f.programMode==='new'" (click)="f.programMode='new'">
          <input type="radio" name="pmode" [checked]="f.programMode==='new'" style="display:none">
          <div class="rc-icon">✨</div>
          <div class="rc-label">Create New Program</div>
          <div class="rc-desc">Set up a new program with its own pricing rules</div>
        </label>
      </div>
      <div class="form-row-gap" style="margin-top:16px">
        <div class="form-group" *ngIf="f.programMode==='existing'" style="max-width:320px">
          <label class="form-label">Program</label>
          <select class="form-select" [(ngModel)]="f.existingProgram">
            <option *ngFor="let p of programs" [value]="p">{{p}}</option>
          </select>
        </div>
        <div class="form-group" *ngIf="f.programMode==='new'" style="max-width:400px">
          <label class="form-label">Program Name <span class="req">*</span></label>
          <input class="form-input" [(ngModel)]="f.newProgramName" placeholder="e.g. Carrier BBTI Programme 2024"/>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Pricing Model ─────────────────────────────────────────── -->
  <div class="wizard-section" [class.wsec-configured]="!!f.priceModel">
    <div class="wsec-header">
      <div>
        <span class="wsec-title">Price Model</span>
        <span class="wsec-key">pricing_model_type</span>
      </div>
      <span class="wsec-badge" [class.badge-set]="!!f.priceModel">{{f.priceModel || 'Not set'}}</span>
    </div>
    <div class="wsec-body">
      <p class="wsec-guide">Defines how deductions are calculated across all channels. <strong>Cannot be changed at account or channel level.</strong></p>
      <div class="grid-cols-2" style="max-width:640px;margin-top:12px">
        <label *ngFor="let m of priceModels" class="option-tile" [class.sel]="f.priceModel===m" (click)="f.priceModel=m">
          <div class="ot-name">{{m}}</div>
          <div class="ot-desc">{{priceModelDescriptions[m]}}</div>
        </label>
      </div>
    </div>
  </div>

  <!-- ── Price Assessment Reference Date ──────────────────────── -->
  <div class="wizard-section" [class.wsec-configured]="!!f.priceAsofDateType">
    <div class="wsec-header">
      <div>
        <span class="wsec-title">Price Assessment Reference Date</span>
        <span class="wsec-key">submit_assessment_price_asof_date_type</span>
      </div>
      <span class="wsec-badge badge-set">{{f.priceAsofDateType}}</span>
    </div>
    <div class="wsec-body">
      <p class="wsec-guide">Whether the assessed price uses today's date or the original quote creation date.</p>
      <div class="radio-row" style="margin-top:10px">
        <label class="radio-pill" *ngFor="let d of priceAsofDateTypes" [class.sel]="f.priceAsofDateType===d" (click)="f.priceAsofDateType=d">{{d}}</label>
      </div>
    </div>
  </div>

  <!-- ── Price Mismatch Action ─────────────────────────────────── -->
  <div class="wizard-section" [class.wsec-configured]="!!f.priceMismatchAction">
    <div class="wsec-header">
      <div>
        <span class="wsec-title">Price Mismatch Action</span>
        <span class="wsec-key">price_miss_match_action</span>
      </div>
      <span class="wsec-badge" [class.badge-set]="!!f.priceMismatchAction">{{f.priceMismatchAction || 'Not set'}}</span>
    </div>
    <div class="wsec-body">
      <p class="wsec-guide">What happens when the warehouse-assessed value differs from the quoted value.</p>
      <div class="radio-row" style="margin-top:10px">
        <label class="radio-pill" *ngFor="let a of priceMismatchActions" [class.sel]="f.priceMismatchAction===a" (click)="f.priceMismatchAction=a">{{a}}</label>
      </div>
    </div>
  </div>

  <!-- ── Markup / Markdown ─────────────────────────────────────── -->
  <div class="wizard-section">
    <div class="wsec-header">
      <span class="wsec-title">Markup / Markdown Defaults</span>
    </div>
    <div class="wsec-body">
      <p class="wsec-guide">Percentage adjustments applied to base pricing per asset type. Applied uniformly across all channels.</p>
      <div class="grid-cols-2" style="max-width:600px;margin-top:12px">
        <div class="inset-card">
          <div class="inset-card-title">📱 Phone</div>
          <div class="grid-cols-2">
            <div class="form-group"><label class="form-label">Markup %</label><input type="number" class="form-input" [(ngModel)]="f.phoneMarkup" placeholder="0"/></div>
            <div class="form-group"><label class="form-label">Markdown %</label><input type="number" class="form-input" [(ngModel)]="f.phoneMarkdown" placeholder="0"/></div>
          </div>
        </div>
        <div class="inset-card">
          <div class="inset-card-title">💻 Tablet</div>
          <div class="grid-cols-2">
            <div class="form-group"><label class="form-label">Markup %</label><input type="number" class="form-input" [(ngModel)]="f.tabletMarkup" placeholder="0"/></div>
            <div class="form-group"><label class="form-label">Markdown %</label><input type="number" class="form-input" [(ngModel)]="f.tabletMarkdown" placeholder="0"/></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Popular Devices ───────────────────────────────────────── -->
  <div class="wizard-section" [class.wsec-configured]="f.popularDevices.length>0">
    <div class="wsec-header">
      <div>
        <span class="wsec-title">Popular Devices</span>
        <span class="wsec-key">popular_device</span>
      </div>
      <span class="wsec-badge" [class.badge-set]="f.popularDevices.length>0">{{f.popularDevices.length>0 ? f.popularDevices.length+' devices' : 'None added'}}</span>
    </div>
    <div class="wsec-body">
      <p class="wsec-guide">Ranked list of devices shown across all channels. Driven by program-level trade-in volume data.</p>
      <div class="form-row-gap" style="margin-top:12px">
        <div class="form-group" style="width:130px"><label class="form-label">Look Back Days</label><input type="number" class="form-input" [(ngModel)]="f.popularDeviceLookbackDays" placeholder="90"/></div>
        <div class="form-group" style="width:160px"><label class="form-label">Number to Display</label><input type="number" class="form-input" [(ngModel)]="f.popularDeviceCount" placeholder="12"/></div>
        <div class="form-group" style="flex:1"><label class="form-label">S3 Bucket URL</label><input class="form-input" [(ngModel)]="f.popularDeviceS3Url" placeholder="s3://..."/></div>
      </div>
      <div *ngFor="let d of f.popularDevices; let i=index" class="list-entry">
        <input class="form-input" [(ngModel)]="d.name" placeholder="e.g. Galaxy S24 Ultra 512GB" style="flex:4"/>
        <input type="number" class="form-input" [(ngModel)]="d.rank" placeholder="Rank" style="width:80px"/>
        <button class="icon-btn icon-btn-danger" (click)="svc.removePopularDevice(i)" title="Remove">✕</button>
      </div>
      <button class="add-btn" (click)="svc.addPopularDevice()">+ Add Popular Device</button>
    </div>
  </div>

  <!-- ── Question Categories ───────────────────────────────────── -->
  <div class="wizard-section" [class.wsec-configured]="f.questionCategoryEnabled">
    <div class="wsec-header">
      <div>
        <span class="wsec-title">Question Categories</span>
        <span class="wsec-key">question_category</span>
      </div>
      <label class="toggle-switch">
        <input type="checkbox" [(ngModel)]="f.questionCategoryEnabled">
        <span class="ts-track"><span class="ts-thumb"></span></span>
        <span class="ts-label">{{f.questionCategoryEnabled ? 'Active' : 'Inactive'}}</span>
      </label>
    </div>
    <div class="wsec-body">
      <p class="wsec-guide">Defines grade buckets (e.g. Excellent, Good, Damaged) and what price tier each maps to. Works in conjunction with the grading questions below.</p>
      <div *ngIf="f.questionCategoryEnabled" style="margin-top:14px">
        <div *ngFor="let qc of f.questionCategories; let qi=index" class="item-row">
          <div class="grid-cols-4" style="flex:1">
            <div class="form-group" style="margin:0">
              <label class="form-label">Category Type <span class="req">*</span></label>
              <select class="form-select" [(ngModel)]="qc.questionCategoryType">
                <option value="">-- Select --</option>
                <option *ngFor="let t of qcTypes" [value]="t">{{t}}</option>
              </select>
            </div>
            <div class="form-group" style="margin:0">
              <label class="form-label">Order <span class="req">*</span></label>
              <input type="number" class="form-input" [(ngModel)]="qc.order" placeholder="1"/>
            </div>
            <div class="form-group" style="margin:0">
              <label class="form-label">Default Price Tier <span class="req">*</span></label>
              <select class="form-select" [(ngModel)]="qc.defaultPriceTier">
                <option value="">-- Select --</option>
                <option *ngFor="let t of priceTiers" [value]="t">{{t}}</option>
              </select>
            </div>
            <div class="form-group" style="margin:0">
              <label class="form-label">External Category Type</label>
              <input class="form-input" [(ngModel)]="qc.externalQuestionCategoryType" placeholder="optional"/>
            </div>
          </div>
          <button class="icon-btn icon-btn-danger" (click)="svc.removeQuestionCategory(qi)" title="Remove">✕</button>
        </div>
        <button class="add-btn" (click)="svc.addQuestionCategory()">+ Add to Question Categories</button>
        <p class="req-note">* = required fields</p>
      </div>
    </div>
  </div>

  <!-- ── Grading Questions ─────────────────────────────────────── -->
  <div class="wizard-section" [class.wsec-configured]="f.gradingQuestions.length>0">
    <div class="wsec-header">
      <div>
        <span class="wsec-title">Grading Questions</span>
        <span class="wsec-key">questions (Trade → Questions)</span>
      </div>
      <span class="wsec-badge" [class.badge-set]="f.gradingQuestions.length>0">
        {{f.gradingQuestions.length>0 ? totalQuestions+' question(s)' : 'None configured'}}
      </span>
    </div>
    <div class="wsec-body">
      <p class="wsec-guide">The actual assessment questions shown to the customer or agent to determine which grade category a device falls into. Organised by device type. Each question carries a deduction when answered negatively.</p>
      <div *ngFor="let dtq of f.gradingQuestions; let di=index" class="device-block">
        <div class="device-block-header">
          <div class="form-group" style="margin:0">
            <label class="form-label">Device Type</label>
            <select class="form-select" [(ngModel)]="dtq.deviceType" style="width:180px">
              <option *ngFor="let a of assetTypes" [value]="a">{{a}}</option>
            </select>
          </div>
          <div class="device-block-meta">{{dtq.questions.length}} question(s)</div>
          <button class="text-btn text-btn-danger" (click)="svc.removeDeviceTypeQuestions(di)">Remove device type</button>
        </div>
        <div *ngFor="let q of dtq.questions; let qi=index" class="question-card">
          <div class="question-card-header" (click)="openQ[di+'-'+qi]=!openQ[di+'-'+qi]" style="cursor:pointer">
            <div style="display:flex;align-items:center;gap:8px;flex:1">
              <span class="question-num">Q{{qi+1}}</span>
              <span class="q-summary" *ngIf="!openQ[di+'-'+qi]">
                {{q.questionCategoryType || '—'}} · {{q.questionType || '—'}} · {{q.questionCode || '—'}}
              </span>
              <span class="q-expand-hint" *ngIf="!openQ[di+'-'+qi]">▶ expand</span>
              <span class="q-expand-hint" *ngIf="openQ[di+'-'+qi]">▼ collapse</span>
            </div>
            <button class="icon-btn icon-btn-danger" (click)="$event.stopPropagation();svc.removeGradingQuestion(dtq, qi)" title="Remove">✕</button>
          </div>
          <div *ngIf="openQ[di+'-'+qi]">
          <div class="grid-cols-3" style="margin-bottom:12px">
            <div class="form-group">
              <label class="form-label">Category Type <span class="req">*</span></label>
              <select class="form-select" [(ngModel)]="q.questionCategoryType">
                <option value="">-- Select --</option>
                <option *ngFor="let t of qcTypes" [value]="t">{{t}}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Question Type <span class="req">*</span></label>
              <select class="form-select" [(ngModel)]="q.questionType">
                <option value="">-- Select --</option>
                <option *ngFor="let t of questionTypes" [value]="t">{{t}}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Question Code <span class="req">*</span></label>
              <select class="form-select" [(ngModel)]="q.questionCode">
                <option value="">-- Select --</option>
                <option *ngFor="let d of defectTypes" [value]="d">{{d}}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Deduction <span class="req">*</span></label>
              <input type="number" class="form-input" [(ngModel)]="q.deduction" placeholder="0"/>
            </div>
            <div class="form-group">
              <label class="form-label">Deduction Type <span class="req">*</span></label>
              <select class="form-select" [(ngModel)]="q.deductionType">
                <option *ngFor="let t of deductionTypes" [value]="t">{{t}}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Sort Order <span class="req">*</span></label>
              <input type="number" class="form-input" [(ngModel)]="q.sortOrder"/>
            </div>
            <div class="form-group">
              <label class="form-label">Warehouse Question Code</label>
              <input type="number" class="form-input" [(ngModel)]="q.warehouseQuestionCode" placeholder="e.g. 101"/>
            </div>
            <div class="form-group">
              <label class="form-label">External Question Code</label>
              <input type="number" class="form-input" [(ngModel)]="q.externalQuestionCode" placeholder="e.g. 201"/>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Trade Ownership Types <span class="req">*</span></label>
            <div class="chip-row">
              <label *ngFor="let t of ownershipTypes" class="check-chip" [class.checked]="q.tradeOwnershipTypes.includes(t)" (click)="toggle(q.tradeOwnershipTypes, t)">{{t}}</label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Diagnostics Tests</label>
            <div class="chip-row">
              <label *ngFor="let t of allDiagTests" class="check-chip check-chip-sm" [class.checked]="q.diagnosticsTests.includes(t)" (click)="toggle(q.diagnosticsTests, t)">{{t}}</label>
            </div>
          </div>
          <label class="check-label"><input type="checkbox" [(ngModel)]="q.isAdditionalQuestion"> Is Additional Question</label>
          <!-- Question display text -->
          <div class="sub-section" style="margin-top:10px">
            <div class="sub-section-title">Question Text <span class="sub-section-hint">(per locale)</span></div>
            <div *ngFor="let ql of q.questionLocales; let qli=index" class="locale-row">
              <input class="form-input" [(ngModel)]="ql.displayText" placeholder="e.g. Does the device power up and function normally?" style="flex:4"/>
              <input class="form-input" [(ngModel)]="ql.locale" placeholder="en-US" style="width:100px"/>
              <button class="icon-btn icon-btn-danger" (click)="svc.removeQuestionLocale(q, qli)">✕</button>
            </div>
            <button class="add-btn add-btn-sm" (click)="svc.addQuestionLocale(q)">+ Add to Question</button>
          </div>
          <!-- Help text -->
          <div class="sub-section">
            <div class="sub-section-title">Help Text <span class="sub-section-hint">(per locale)</span></div>
            <div *ngFor="let ht of q.helpTexts; let hti=index" class="locale-row">
              <input class="form-input" [(ngModel)]="ht.displayText" placeholder="Help text..." style="flex:4"/>
              <input class="form-input" [(ngModel)]="ht.locale" placeholder="en-US" style="width:100px"/>
              <button class="icon-btn icon-btn-danger" (click)="svc.removeHelpText(q, hti)">✕</button>
            </div>
            <button class="add-btn add-btn-sm" (click)="svc.addHelpText(q)">+ Add to Help Text</button>
          </div>
          <!-- Possible answers -->
          <div class="sub-section">
            <div class="sub-section-title">Possible Answers</div>
            <div *ngFor="let pa of q.possibleAnswers; let pai=index" class="answer-card">
              <div class="answer-card-header">
                <span style="font-size:11px;font-weight:700;color:var(--text-muted)">Answer {{pai+1}}</span>
                <button class="icon-btn icon-btn-danger" (click)="svc.removePossibleAnswer(q, pai)">✕</button>
              </div>
              <div class="grid-cols-3" style="margin-bottom:8px">
                <div class="form-group" style="margin:0"><label class="form-label" style="font-size:10px">Answer Code <span class="req">*</span></label><input class="form-input" [(ngModel)]="pa.answerCode" placeholder="e.g. Yes"/></div>
                <div class="form-group" style="margin:0"><label class="form-label" style="font-size:10px">Sort Order <span class="req">*</span></label><input type="number" class="form-input" [(ngModel)]="pa.sortOrder"/></div>
                <div class="form-group" style="margin:0"><label class="form-label" style="font-size:10px">Warehouse Answer Code <span class="req">*</span></label><input class="form-input" [(ngModel)]="pa.warehouseAnswerCode" placeholder="e.g. A1"/></div>
              </div>
              <label class="check-label" style="margin-bottom:8px"><input type="checkbox" [(ngModel)]="pa.isPositiveAnswer"> Is Positive Answer</label>
              <div class="sub-section-title" style="font-size:10px;margin-bottom:4px">Answer Code Locale</div>
              <div *ngFor="let al of pa.answerCodeLocales; let ali=index" class="locale-row">
                <input class="form-input" [(ngModel)]="al.displayText" placeholder="Display Text" style="flex:3"/>
                <input class="form-input" [(ngModel)]="al.locale" placeholder="en-US" style="width:100px"/>
                <button class="icon-btn icon-btn-danger" (click)="svc.removeAnswerLocale(pa, ali)">✕</button>
              </div>
              <button class="add-btn add-btn-sm" (click)="svc.addAnswerLocale(pa)">+ Add to Answer Code Locale</button>
            </div>
            <button class="add-btn" (click)="svc.addPossibleAnswer(q)">+ Add to Possible Answers</button>
          </div>
          <p class="req-note">* = required fields</p>
          </div><!-- end openQ -->
        </div>
        <button class="add-btn" (click)="svc.addGradingQuestion(dtq);openQ[di+'-'+(dtq.questions.length-1)]=true">+ Add to Questions</button>
      </div>
      <button class="add-btn" style="margin-top:8px" (click)="svc.addDeviceTypeQuestions()">+ Add Device Type</button>
    </div>
  </div>

  <!-- ── Simple Program-Level Toggles ─────────────────────────── -->
  <div class="wizard-section">
    <div class="wsec-header">
      <span class="wsec-title">Program-Level Feature Toggles</span>
    </div>
    <div class="wsec-body">
      <p class="wsec-guide">These apply globally to all accounts and channels. No additional configuration required.</p>
      <div class="toggle-list" style="margin-top:12px">
        <div class="toggle-list-item" [class.tli-on]="f.idVerificationEnabled">
          <div>
            <div class="tli-name">ID Verification</div>
            <div class="tli-key">id_verification_enabled</div>
          </div>
          <label class="toggle-switch"><input type="checkbox" [(ngModel)]="f.idVerificationEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label>
        </div>
        <div class="toggle-list-item" [class.tli-on]="f.storeInspectionEnabled">
          <div>
            <div class="tli-name">Store Inspection</div>
            <div class="tli-key">store_inspection_enabled</div>
          </div>
          <label class="toggle-switch"><input type="checkbox" [(ngModel)]="f.storeInspectionEnabled"><span class="ts-track"><span class="ts-thumb"></span></span></label>
        </div>
      </div>
    </div>
  </div>


</div>`,
  styles: [`
    .hierarchy-banner { display:flex; align-items:stretch; gap:0; background:#fff; border:1px solid var(--border); border-radius:12px; overflow:hidden; margin-bottom:24px; }
    .hier-tier { flex:1; padding:16px 18px; border-right:1px solid var(--border); }
    .hier-tier:last-child { border-right:none; }
    .tier-program { background:#fffbeb; }
    .tier-account { background:#eff6ff; }
    .tier-channel { background:#f5f3ff; }
    .hier-arrow { display:flex; align-items:center; padding:0 2px; color:#c4b5fd; font-size:20px; background:#fff; }
    .tier-icon { font-size:20px; margin-bottom:4px; }
    .tier-label { font-weight:700; font-size:13px; margin-bottom:4px; }
    .tier-desc { font-size:11px; color:var(--text-muted); line-height:1.5; }

    .step-header { margin-bottom:24px; }
    .step-header-label { display:inline-block; font-size:10px; font-weight:700; letter-spacing:1px; padding:3px 10px; border-radius:20px; margin-bottom:8px; }
    .tier-program-tag { background:#fef9c3; color:#854d0e; border:1px solid #fde047; }
    .tier-account-tag { background:#dbeafe; color:#1e40af; border:1px solid #93c5fd; }
    .tier-channel-tag { background:#ede9fe; color:#5b21b6; border:1px solid #c4b5fd; }
    .step-header-title { font-size:20px; font-weight:700; color:var(--text); margin-bottom:6px; }
    .step-header-desc { font-size:12px; color:var(--text-muted); line-height:1.6; max-width:680px; }

    .wizard-section { background:#fff; border:1px solid var(--border); border-radius:12px; margin-bottom:12px; overflow:hidden; transition:border-color .2s; }
    .wizard-section.wsec-configured { border-color:var(--accent); }
    .wsec-header { display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid var(--border-light); gap:12px; }
    .wsec-title { font-weight:700; font-size:13px; color:var(--text); }
    .wsec-key { display:inline-block; font-family:monospace; font-size:10px; color:var(--text-faint); background:#f1f5f9; padding:1px 6px; border-radius:4px; margin-left:8px; }
    .wsec-badge { font-size:11px; font-weight:600; color:var(--text-faint); white-space:nowrap; padding:3px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; }
    .wsec-badge.badge-set { background:var(--accent-glow); border-color:var(--accent); color:var(--accent); }
    .wsec-body { padding:14px 18px; }
    .wsec-guide { font-size:12px; color:var(--text-muted); line-height:1.6; }

    .radio-cards { display:flex; gap:12px; flex-wrap:wrap; }
    .radio-card { flex:1; min-width:200px; border:2px solid var(--border); border-radius:10px; padding:14px 16px; cursor:pointer; transition:all .15s; user-select:none; }
    .radio-card:hover { border-color:var(--accent); background:var(--accent-glow); }
    .radio-card.sel { border-color:var(--accent); background:var(--accent-glow); }
    .rc-icon { font-size:22px; margin-bottom:6px; }
    .rc-label { font-weight:700; font-size:13px; margin-bottom:4px; }
    .rc-desc { font-size:11px; color:var(--text-muted); }

    .option-tile { display:flex; flex-direction:column; border:2px solid var(--border); border-radius:10px; padding:12px 16px; cursor:pointer; transition:all .15s; user-select:none; }
    .option-tile:hover { border-color:var(--accent); }
    .option-tile.sel { border-color:var(--accent); background:var(--accent-glow); }
    .ot-name { font-weight:700; font-size:13px; }
    .ot-desc { font-size:11px; color:var(--text-muted); margin-top:4px; line-height:1.4; }

    .radio-row { display:flex; gap:8px; flex-wrap:wrap; }
    .radio-pill { display:inline-flex; align-items:center; padding:7px 16px; border:1px solid var(--border); border-radius:20px; font-size:12px; cursor:pointer; user-select:none; transition:all .15s; }
    .radio-pill.sel { border-color:var(--accent); background:var(--accent-glow); color:var(--accent); font-weight:700; }
    .radio-pill:hover:not(.sel) { border-color:var(--accent); }

    .chip-row { display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
    .check-chip { display:inline-flex; align-items:center; padding:4px 11px; border:1px solid var(--border); border-radius:12px; font-size:11px; cursor:pointer; user-select:none; transition:all .15s; }
    .check-chip.checked { border-color:var(--accent); background:var(--accent-glow); color:var(--accent); font-weight:600; }
    .check-chip-sm { font-size:10px; padding:3px 8px; }

    .toggle-switch { display:inline-flex; align-items:center; gap:6px; cursor:pointer; }
    .ts-track { width:36px; height:20px; border-radius:10px; background:#e2e8f0; position:relative; transition:background .2s; display:block; }
    input:checked + .ts-track { background:var(--accent); }
    .ts-thumb { width:14px; height:14px; border-radius:50%; background:#fff; position:absolute; top:3px; left:3px; transition:left .2s; display:block; box-shadow:0 1px 3px rgba(0,0,0,.2); }
    input:checked + .ts-track .ts-thumb { left:19px; }
    .ts-label { font-size:12px; font-weight:600; color:var(--text-muted); }

    .toggle-list { border:1px solid var(--border); border-radius:10px; overflow:hidden; }
    .toggle-list-item { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:1px solid var(--border-light); background:#fff; transition:background .15s; }
    .toggle-list-item:last-child { border-bottom:none; }
    .toggle-list-item.tli-on { background:#f0fdf4; }
    .tli-name { font-size:13px; font-weight:600; }
    .tli-key { font-family:monospace; font-size:10px; color:var(--text-faint); margin-top:2px; }

    .inset-card { background:#faf9ff; border:1px solid var(--border); border-radius:8px; padding:14px; }
    .inset-card-title { font-weight:700; font-size:12px; color:var(--text-muted); margin-bottom:10px; }

    .form-row-gap { display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap; }
    .grid-cols-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .grid-cols-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
    .grid-cols-4 { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:10px; }

    .list-entry { display:flex; gap:8px; align-items:center; margin-bottom:8px; }
    .item-row { display:flex; align-items:flex-start; gap:10px; padding:12px; background:#faf9ff; border:1px solid var(--border-light); border-radius:8px; margin-bottom:8px; }

    .device-block { background:#faf9ff; border:1px solid var(--border); border-radius:10px; padding:16px; margin-bottom:12px; }
    .device-block-header { display:flex; align-items:center; gap:16px; padding-bottom:12px; border-bottom:1px solid var(--border-light); margin-bottom:12px; }
    .device-block-meta { font-size:11px; color:var(--text-faint); font-weight:600; }

    .question-card { background:#fff; border:1px solid var(--border); border-radius:8px; padding:14px; margin-bottom:10px; }
    .q-summary { font-size:11px; color:var(--text-muted); font-family:monospace; }
    .q-expand-hint { font-size:10px; color:var(--accent); font-weight:600; margin-left:4px; }
    .question-card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
    .question-num { font-size:11px; font-weight:700; color:var(--accent); background:var(--accent-glow); padding:2px 10px; border-radius:12px; }

    .sub-section { margin-top:12px; padding-top:10px; border-top:1px solid var(--border-light); }
    .sub-section-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.4px; margin-bottom:8px; }
    .sub-section-hint { font-weight:400; text-transform:none; letter-spacing:0; }
    .locale-row { display:flex; gap:8px; align-items:center; margin-bottom:6px; }

    .answer-card { background:#faf9ff; border:1px solid var(--border-light); border-radius:8px; padding:12px; margin-bottom:8px; }
    .answer-card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }

    .icon-btn { width:28px; height:28px; border-radius:6px; border:none; cursor:pointer; font-size:13px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
    .icon-btn-danger { background:#fdecea; color:#c0182c; }
    .icon-btn-danger:hover { background:#fca5a5; }

    .add-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 14px; background:#f0fdf4; color:#0a7a4b; border:1px solid #a7f3d0; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; transition:all .15s; margin-top:6px; }
    .add-btn:hover { background:#dcfce7; }
    .add-btn-sm { padding:4px 10px; font-size:11px; margin-top:4px; }

    .text-btn { background:none; border:none; cursor:pointer; font-size:12px; font-family:inherit; padding:4px 0; }
    .text-btn-danger { color:#c0182c; }

    .check-label { display:inline-flex; align-items:center; gap:6px; font-size:12px; cursor:pointer; }
    .req { color:#c0182c; }
    .req-note { font-size:10px; color:var(--text-faint); margin-top:10px; }
  `]
})
export class Step0Component {
  readonly programs            = [...EXISTING_PROGRAMS];
  readonly priceModels         = [...PRICE_MODEL_TYPES];
  readonly priceAsofDateTypes  = [...PRICE_ASOF_DATE_TYPES];
  readonly priceMismatchActions = [...PRICE_MISMATCH_ACTIONS];
  readonly qcTypes             = [...QUESTION_CATEGORY_TYPES];
  readonly priceTiers          = [...DEFAULT_PRICE_TIERS];
  readonly questionTypes       = [...QUESTION_TYPES];
  readonly deductionTypes      = [...DEDUCTION_TYPES];
  readonly defectTypes         = [...DEFECT_TYPES];
  readonly allDiagTests        = [...ALL_DIAG_TESTS];
  readonly assetTypes          = [...ASSET_TYPES];
  readonly ownershipTypes      = [...TRADE_OWNERSHIP_TYPES];

  hierCollapsed = false;
  openQ: Record<string, boolean> = {};
  readonly priceModelDescriptions: Record<string, string> = {
    CumulativeDeduction: 'All negative answers are added together. Total deduction = sum of all individual deductions.',
    HighestDeduction:    'Only the single highest deduction applies. Other defects are ignored in pricing.',
    Tier:                'Price is determined by which tier band the device falls into based on its condition score.',
    Grade:               'Price is mapped from a grade (Grade_A through Grade_E) defined in Question Categories.',
  };

  constructor(public svc: SetupFormService) {}
  get f() { return this.svc.form; }
  get totalQuestions(): number { return this.f.gradingQuestions.reduce((s, d) => s + d.questions.length, 0); }
  toggle(arr: string[], item: string): void { const i = arr.indexOf(item); if (i >= 0) arr.splice(i, 1); else arr.push(item); }
}
