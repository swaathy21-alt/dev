// ── Enums ─────────────────────────────────────────────────────────────────────
export enum AccountStatus    { Active = 'active', Inactive = 'inactive' }
export enum QueryStatus      { Open = 'open', Pending = 'pending', Resolved = 'resolved' }
export enum CampaignType     { Automatic = 'Automatic', Coupon = 'Coupon' }
export enum CampaignStatus   { Active = 'active', Scheduled = 'scheduled', Expired = 'expired' }
export enum IneligibleAction { Abandon = 'abandon', Deflect = 'deflect' }
export enum Currency         { GBP = 'GBP', USD = 'USD', EUR = 'EUR', KRW = 'KRW', CAD = 'CAD' }
export enum MeasurementUnit  { Miles = 'Miles', Kilometres = 'Kilometres' }
export enum IdvProvider      { Jumio = 'Jumio', Onfido = 'Onfido', StripeIdentity = 'Stripe Identity', Veriff = 'Veriff' }
export enum IdvTrigger       { Always = 'Always', OnGradeFail = 'On Grade Fail', OnPriceThreshold = 'On Price Threshold' }
export enum WebhookStrategy  { GTPWebhook = 'GTPWebhook', MarketPlacer = 'EE MarketPlacer' }

// ── Data Models ───────────────────────────────────────────────────────────────
export interface Account {
  id: number; program: string; account: string;
  channels: string[]; equipTypes: string[]; shipping: string[]; payment: string[];
  idv: boolean; blk: boolean; retailUsers: number; stores: number; status: AccountStatus;
}

export interface ApiFailure {
  id: number; timestamp: string; vendor: string;
  endpoint: string; method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  status: number; error: string; account: string;
}

export interface Campaign {
  id: number; name: string; type: CampaignType;
  coupon: string | null; start: string; end: string; basis: string; status: CampaignStatus;
}

export interface ApiPromotion {
  source: string; externalId: string; tradeId: string;
  device: string; imei: string; amount: string; created: string;
}

export interface PricingRecord {
  id: number; make: string; model: string; sku: string;
  variant: string; price: number; start: string; end: string;
}

export interface CustomerQuery {
  id: number; account: string; reason: string; customer: string;
  tradeId: string; status: QueryStatus; created: string;
}

export interface KvPair { key: string; value: string; }

export interface EquipIdentifier {
  identifierType: string; requirement: 'Required' | 'Optional'; validation: string;
}

export interface GradingQuestion {
  // FIX #8: added lang property + renamed deductionType to match spec
  lang: string;
  deductionType: '%' | '£';
  deductionAmt: string;
  appliedOn: 'Negative Answer' | 'Positive Answer';
  langData: Record<string, {
    questionText: string; helpText: string; positiveAnswer: string; negativeAnswer: string;
  }>;
}

export interface ConditionCategory {
  key: string;
  // FIX #7: added open + lang UI state properties
  open: boolean;
  lang: string;
  langData: Record<string, { name: string; help: string; }>;
  questions: GradingQuestion[];
}

export interface IdvConfig { provider: IdvProvider; trigger: IdvTrigger; threshold: string; }
export interface GeneratedUrl { label: string; url: string; }
export interface UrlSet {
  label: string; domain: string; key: string;
  urls: GeneratedUrl[]; savedAt: number; savedAtDisplay: string;
  confirmDel?: boolean;
}

// ── Setup Form (all ~50 state variables from spec §7) ─────────────────────────
export interface SetupForm {
  programMode: 'existing' | 'new'; existingProgram: string; newProgramName: string;
  // FIX #11: phoneMarkup/Markdown properly typed
  phoneMarkup: number | null; phoneMarkdown: number | null;
  tabletMarkup: number | null; tabletMarkdown: number | null;
  accountName: string; status: 'In Progress' | 'Approved';
  country: string; currency: Currency; measurementUnit: MeasurementUnit;
  startDate: string; endDate: string; languages: string[]; channels: string[];
  urlDomain: string; urlKey: string; generatedUrls: GeneratedUrl[]; savedUrlSets: UrlSet[];
  showWebhookConfig: boolean;
  webhookStrategy: WebhookStrategy; endpointType: string; endpointUrl: string;
  bodyKV: KvPair[]; headerKV: KvPair[];
  dsEventName: string; dsUrl: string; dsHeaders: KvPair[];
  webhookEvents: string[]; isMockProvider: boolean;
  equipTypes: string[]; equipIdentifiers: Record<string, EquipIdentifier[]>;
  shipOptions: string[]; payOptions: string[];
  allowZeroDevices: boolean; zeroStoreCollection: boolean; zeroShipToWarehouse: boolean;
  useContractType: boolean;
  tradeInMin: string; tradeInFailAction: IneligibleAction;
  tradeUpMin: string; tradeUpFailAction: IneligibleAction;
  ineligibleAction: IneligibleAction;
  ineligibleMessages: Record<string, string>; ineligibleUrls: Record<string, string>;
  tradeInOptions: string[];
  receiptBarcodeEnabled: boolean; receiptBarcodeType: 'QR Code' | 'Barcode';
  defaultSearchRadius: number; enableDoorToStore: boolean; storeSearchRadius: number;
  collectShippingAddress: boolean; disableBackOffice: boolean; enableRQPos: boolean;
  addrValidationEnabled: boolean; addrValidationPlugin: string;
  addrAutofillEnabled: boolean; addrAutofillService: string;
  conditionCategories: ConditionCategory[];
  quoteExpiryPerChannel: Record<string, number>;
  quoteReminderCount: number; quoteReminderIntervals: number[];
  tradeExpiryDays: number; tradeReminderCount: number; tradeReminderIntervals: number[];
  unlockDays: number; unlockReminderCount: number; unlockReminderIntervals: number[];
  priceAcceptDays: number; priceReminderCount: number; priceReminderIntervals: number[];
  smsUpdatesEnabled: boolean; smsEvents: string[];
  diagnosticsEnabled: boolean; diagCategories: string[];
  charityEnabled: boolean; charityName: string; charityPercents: string[];
  idvEnabled: boolean; idvConfigs: IdvConfig[];
  deferredTradeEnabled: boolean; deferredContractTypes: string[];
  priceAdjustRefDate: 'quote' | 'current';
  // FIX #4: tivEmail and tivMobile added to interface
  tivEmail: boolean;
  tivMobile: boolean;
}

export interface ApiResponse<T> { data: T; message: string; success: boolean; }
export interface AccountListFilter { status?: AccountStatus; search?: string; }
export interface PricingFilter { search?: string; startDate?: string; endDate?: string; }
