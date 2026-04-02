import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupFormService } from '../../core/services/setup-form.service';
import { SETUP_STEPS } from '../../core/constants';
import { Step0Component } from './steps/step0.component';
import { Step1Component } from './steps/step1.component';
import { Step2Component } from './steps/step2.component';
import { Step3Component } from './steps/step3.component';
import { Step4Component } from './steps/step4.component';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, Step0Component, Step1Component, Step2Component, Step3Component, Step4Component],
  templateUrl: './setup.component.html',
})
export class SetupComponent {
  readonly steps = SETUP_STEPS;
  validationError = '';
  submitted = false;
  submitError = '';

  readonly stepSubs = [
    'Pricing engine & grading rules',
    'Carrier branding & URL',
    'Journey-level feature config',
    'Account-level feature defaults',
    'Check & confirm',
  ];

  constructor(public svc: SetupFormService) {}
  get step() { return this.svc.step; }

  goTo(i: number) {
    if (i < this.step) {
      this.svc.goTo(i);
      this.scrollTop();
    }
  }

  next() {
    const err = this.validate(this.step);
    if (err) { this.validationError = err; return; }
    this.validationError = '';
    this.svc.next();
    this.scrollTop();
  }

  back() {
    this.validationError = '';
    this.svc.back();
    this.scrollTop();
  }

  private scrollTop() {
    const el = document.querySelector('.content') || document.documentElement;
    el.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Validation per step — only confirmed required fields
  validate(step: number): string {
    const f = this.svc.form;
    if (step === 0) {
      if (f.programMode === 'new' && !f.newProgramName.trim())
        return 'Program Name is required when creating a new program.';
      if (!f.priceModel)
        return 'Price Model is required.';
      if (!f.priceMismatchAction)
        return 'Price Mismatch Action is required.';
    }
    if (step === 1) {
      if (!f.accountName.trim())
        return 'Account Name is required.';
      if (!f.country.trim())
        return 'Country is required.';
      if (!f.currency)
        return 'Currency is required.';
    }
    if (step === 2) {
      if (f.channels.length === 0)
        return 'At least one channel must be selected.';
    }
    return '';
  }

  stepClass(i: number): string {
    if (i < this.step)   return this.svc.stepComplete(i) ? 'done' : 'done incomplete';
    if (i === this.step) return 'active';
    return 'pending';
  }

  createAccount(): void {
    // Placeholder — replace with this.api.createAccount(this.svc.form) when backend is ready
    const payload = JSON.stringify(this.svc.form, null, 2);
    console.log('[TTP] Create Account payload:', payload);
    this.submitted = true;
    this.submitError = '';
  }
}
