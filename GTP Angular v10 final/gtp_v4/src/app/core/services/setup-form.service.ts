import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  defaultSetupForm, defaultChannelConfig,
  ChannelConfig, PaymentTypeConfig, PayoutConfig,
  QuestionCategory, VarianceResolutionConfig, RecycleProvider,
  DiagTestConfig, DiagChannelType, DiagCategory,
  AssetDetailConfig, TivEntry, TradeinMethod, URL_TYPES,
  DeviceTypeQuestions, GradingQuestion, PossibleAnswer, HelpText, QuestionLocale, AnswerLocale
} from '../constants';

@Injectable({ providedIn: 'root' })
export class SetupFormService {

  private _step$ = new BehaviorSubject<number>(0);
  get step(): number { return this._step$.value; }

  readonly form = defaultSetupForm();

  goTo(n: number): void { this._step$.next(n); }
  next(): void { if (this.step < 4) this._step$.next(this.step + 1); }
  back(): void { if (this.step > 0) this._step$.next(this.step - 1); }

  toggle(arr: string[], item: string): void {
    const i = arr.indexOf(item);
    if (i > -1) arr.splice(i, 1); else arr.push(item);
  }

  // ── URL Generator ─────────────────────────────────────────────────────────
  generateUrls(): void {
    if (!this.form.urlDomain) return;
    const base = `https://${this.form.urlDomain}/${this.form.urlKey || 'account'}`;
    this.form.generatedUrls = URL_TYPES.map(u => ({ label: u.label, url: base + u.suffix }));
  }
  autoSlugKey(): void {
    if (!this.form.urlKey) {
      this.form.urlKey = this.form.accountName
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
  }

  // ── Popular Devices ───────────────────────────────────────────────────────
  addPopularDevice(): void { this.form.popularDevices.push({ name: '', rank: this.form.popularDevices.length + 1 }); }
  removePopularDevice(i: number): void { this.form.popularDevices.splice(i, 1); }

  // ── Question Categories ───────────────────────────────────────────────────
  addQuestionCategory(): void {
    this.form.questionCategories.push({ questionCategoryType: '', order: this.form.questionCategories.length + 1, defaultPriceTier: '', externalQuestionCategoryType: '' });
  }
  removeQuestionCategory(i: number): void { this.form.questionCategories.splice(i, 1); }

  // ── Channels ──────────────────────────────────────────────────────────────
  hasChannel(type: string): boolean { return this.form.channels.some(c => c.channelType === type); }
  toggleChannel(type: string): void {
    const idx = this.form.channels.findIndex(c => c.channelType === type);
    if (idx >= 0) this.form.channels.splice(idx, 1);
    else this.form.channels.push(defaultChannelConfig(type));
  }
  getChannel(type: string): ChannelConfig | undefined { return this.form.channels.find(c => c.channelType === type); }

  // ── Channel — Tradein Methods ─────────────────────────────────────────────
  addTradeinMethod(ch: ChannelConfig): void { ch.tradeinMethods.push({ imageUrl: '', resourceName: '', descResourceName: '' }); }
  removeTradeinMethod(ch: ChannelConfig, i: number): void { ch.tradeinMethods.splice(i, 1); }

  // ── Channel — TIV Entries ─────────────────────────────────────────────────
  addTivEntry(ch: ChannelConfig): void { ch.tivEntries.push({ fieldName: 'Email', verificationType: 'OTP', expiresInMins: 30 }); }
  removeTivEntry(ch: ChannelConfig, i: number): void { ch.tivEntries.splice(i, 1); }

  // ── Channel — Asset Detail Configs ────────────────────────────────────────
  addAssetDetailConfig(ch: ChannelConfig): void { ch.assetDetailConfigs.push({ assetTypes: [], requiredFields: [], optionalFields: [] }); }
  removeAssetDetailConfig(ch: ChannelConfig, i: number): void { ch.assetDetailConfigs.splice(i, 1); }

  // ── Channel — Diagnostics ─────────────────────────────────────────────────
  addDiagTestConfig(ch: ChannelConfig): void { ch.diagTestConfigs.push({ assetTypes: [], channelTypes: [], categories: [] }); }
  removeDiagTestConfig(ch: ChannelConfig, i: number): void { ch.diagTestConfigs.splice(i, 1); }
  addDiagChannelType(tc: DiagTestConfig): void { tc.channelTypes.push({ channelType: '', diagnosticsPriority: '' }); }
  removeDiagChannelType(tc: DiagTestConfig, i: number): void { tc.channelTypes.splice(i, 1); }
  addDiagCategory(tc: DiagTestConfig): void { tc.categories.push({ categoryName: '', enabledTests: [] }); }
  removeDiagCategory(tc: DiagTestConfig, i: number): void { tc.categories.splice(i, 1); }

  // ── Payment Options ───────────────────────────────────────────────────────
  addPaymentType(): void {
    this.form.paymentTypes.push({ paymentType: '', vendorIntegrationAvailable: false, payoutConfigurations: [] });
  }
  removePaymentType(i: number): void { this.form.paymentTypes.splice(i, 1); }
  addPayoutConfig(pt: PaymentTypeConfig): void {
    pt.payoutConfigurations.push({ payUpfront: false, tradeOwnershipType: '', varianceOwnBy: '', varianceRiskMitigationMethod: '', paidBy: '' });
  }
  removePayoutConfig(pt: PaymentTypeConfig, i: number): void { pt.payoutConfigurations.splice(i, 1); }

  // ── Variance Resolution ───────────────────────────────────────────────────
  addVarianceConfig(): void { this.form.varianceResolutionConfigs.push({ assetTypes: [], resolutionTypes: [], defaultResolutionType: '' }); }
  removeVarianceConfig(i: number): void { this.form.varianceResolutionConfigs.splice(i, 1); }

  // ── Recycle Providers ─────────────────────────────────────────────────────
  addRecycleProvider(): void { this.form.recycleProviders.push({ name: '', redirectUrl: '', rule: '' }); }
  removeRecycleProvider(i: number): void { this.form.recycleProviders.splice(i, 1); }

  // ── Grading Questions ───────────────────────────────────────────────────────
  addDeviceTypeQuestions(): void {
    this.form.gradingQuestions.push({ deviceType: 'Phone', questions: [] });
  }
  removeDeviceTypeQuestions(i: number): void { this.form.gradingQuestions.splice(i, 1); }

  addGradingQuestion(dtq: DeviceTypeQuestions): void {
    dtq.questions.push({
      questionCategoryType: '', questionType: '', questionCode: '',
      deduction: 0, deductionType: 'Amount', diagnosticsTests: [],
      warehouseQuestionCode: '', externalQuestionCode: '',
      sortOrder: dtq.questions.length + 1,
      tradeOwnershipTypes: [], isAdditionalQuestion: false,
      helpTexts: [], questionLocales: [], possibleAnswers: []
    });
  }
  removeGradingQuestion(dtq: DeviceTypeQuestions, i: number): void { dtq.questions.splice(i, 1); }

  addHelpText(q: GradingQuestion): void { q.helpTexts.push({ displayText: '', locale: '' }); }
  removeHelpText(q: GradingQuestion, i: number): void { q.helpTexts.splice(i, 1); }

  addQuestionLocale(q: GradingQuestion): void { q.questionLocales.push({ displayText: '', locale: '' }); }
  removeQuestionLocale(q: GradingQuestion, i: number): void { q.questionLocales.splice(i, 1); }

  addPossibleAnswer(q: GradingQuestion): void {
    q.possibleAnswers.push({ answerCode: '', sortOrder: q.possibleAnswers.length + 1, warehouseAnswerCode: '', answerCodeLocales: [], isPositiveAnswer: false });
  }
  removePossibleAnswer(q: GradingQuestion, i: number): void { q.possibleAnswers.splice(i, 1); }

  addAnswerLocale(a: PossibleAnswer): void { a.answerCodeLocales.push({ displayText: '', locale: '' }); }
  removeAnswerLocale(a: PossibleAnswer, i: number): void { a.answerCodeLocales.splice(i, 1); }

  // ── Step completeness ─────────────────────────────────────────────────────
  // Returns true if the step has the minimum required fields filled.
  // Used by setup.component for step bar visual only — not a hard block.
  stepComplete(step: number): boolean {
    const f = this.form;
    if (step === 0) return !!f.priceModel && !!f.priceMismatchAction && (f.programMode === 'existing' ? !!f.existingProgram : !!f.newProgramName.trim());
    if (step === 1) return !!f.accountName.trim() && !!f.country.trim() && !!f.currency;
    if (step === 2) return f.channels.length > 0;
    if (step === 3) return true; // all optional
    return true;
  }
}
