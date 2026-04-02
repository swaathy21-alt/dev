import { Currency, MeasurementUnit, IneligibleAction, WebhookStrategy } from './models';

// ── All values sourced directly from GTP screenshots ─────────────────────────

// Confirmed from pricing_model_type screenshot (Program Features)
export const PRICE_MODEL_TYPES = ['CumulativeDeduction','HighestDeduction','Tier','Grade'] as const;

// Confirmed from submit_assessment_price_asof_date_type screenshot
export const PRICE_ASOF_DATE_TYPES = ['CurrentDate','QuoteCreatedDate'] as const;

// Confirmed from price_miss_match_action screenshot
export const PRICE_MISMATCH_ACTIONS = ['Accepted','Rejected'] as const;

// Confirmed from question_category screenshots
export const QUESTION_CATEGORY_TYPES = ['Perfect','Excellent','Good','Damaged','Fair','Recycled'] as const;
export const DEFAULT_PRICE_TIERS = ['Grade_A','Grade_B','Grade_C','Grade_D','Grade_E'] as const;

// Confirmed from Questions screenshots
export const QUESTION_TYPES = ['Screen','Buttons','Power','CameraOperation','SIMTray','InternalScreen','OuterCasing','Battery','Display'] as const;
export const DEDUCTION_TYPES = ['Amount','Percentage'] as const;
export const DEFECT_TYPES = [
  'CosmeticDamage','BrokenDisplay','CantCharge','DisplayNotWorkingProperly',
  'ButtonNotWorkingProperly','WontTurnOn','CameraNotWorking','BluetoothNotWorking',
  'WaterDamage','CasingCrackedOrDamaged','BackGlassBreak',
  'Malfunction_CantHearThroughEarphoneOrSpeaker','CertainApplicationsDontWork',
  'CantActivateItOnMyCarriersNetwork','MicrophoneDoesntWork','ProblemsWithReception',
  'KeepsTurningOnAndOff','FreezesOrWontRespond','CoolingFansNotWorking',
  'SystemCrashesFrequently','StrangeNoise','HDMIUSBOrPortIsntWorking',
  'ShutsOffOrRebootsItself','StoppedFunctioning','MotorIsNotWorking',
  'PedalsNotWorking','ItemStoppedWorking','LooseOrBrokenPart',
  'SeamSeparationOrRipped','TouchScreenIsNotWorking','CompletelyDestroyed',
  'CorruptedByVirus','IntentionalDamage','DamagedInWar',
  'BadReplacementOrPoorRepair','PhysicalDamage','CrashedDuetoNewInstallation',
  'BatteryDoesNotHoldCharge','Other'
] as const;

// All diagnostic tests — confirmed from Questions + device_diagnostics screenshots
export const ALL_DIAG_TESTS = [
  'DeviceButtonHome','DeviceButtonPower','DeviceButtonMute','DeviceButtonSide',
  'DeviceButtonVolumeDown','DeviceButtonVolumeUp','DevicePixels','DeviceMirror',
  'DeviceTouch','DeviceBatteryCharging','DeviceBatteryCondition','DeviceBatteryDrain',
  'DeviceBatteryStatus','Speaker','Microphone','FrontCamera','BackCamera',
  'Gyroscope','UnlockSensor'
] as const;

// Confirmed from shipping_method screenshot
export const SHIPPING_METHOD_TYPES = ['ShippingLabel','BoxKit','None','Store'] as const;

// Confirmed from address_validation Channel Types checkboxes (same list for diagnostics Channel Type)
export const ALL_CHANNEL_TYPES = [
  'Unknown','Website','SelfService','IVR','PointofSale','WebService',
  'RetailWeb','RetailMobile','EnrollmentService','EquipmentOwnerDataFeed',
  'MobileApp','PSS','ContactCenter','CallCenter','Migration',
  'RedemptionService','ChatBot','Alexa','EnrollmentPortal'
] as const;

// Confirmed from asset_details screenshot
export const ASSET_TYPES = [
  'Phone','Tablet','Laptop','Smartwatch','Watch',
  'Headphone','WirelessHeadphones','PortableGaming','eReader'
] as const;

// Confirmed from asset_details screenshot
export const IDENTIFIER_FIELDS = ['IMEI','SerialNumber'] as const;

// Confirmed from barcode screenshot
export const BARCODE_TYPES = ['UPCA','UPCE','QRCODE','EAN13'] as const;

// Confirmed from collect_shipping_address screenshot
export const TRADE_OWNERSHIP_TYPES = ['Customer','Retail','Enterprise'] as const;

// Confirmed from bank_account_validation screenshot — Addressy is only option
export const BANK_VALIDATION_TYPES = ['Addressy'] as const;

// Confirmed from device_diagnostics screenshots
export const DIAG_CATEGORY_NAMES = ['Button','Screen','Battery','Speaker','Microphone','Camera','Sensor'] as const;
// Diagnostics Priority is FREE TEXT — no dropdown options to define

export const DIAG_TESTS: Record<string, string[]> = {
  Button:     ['DeviceButtonHome','DeviceButtonPower','DeviceButtonMute','DeviceButtonSide','DeviceButtonVolumeDown','DeviceButtonVolumeUp'],
  Screen:     ['DevicePixels','DeviceMirror','DeviceTouch'],
  Battery:    ['DeviceBatteryCharging','DeviceBatteryCondition','DeviceBatteryDrain','DeviceBatteryStatus'],
  Speaker:    ['Speaker'],
  Microphone: ['Microphone'],
  Camera:     ['FrontCamera','BackCamera'],
  Sensor:     ['Gyroscope','UnlockSensor'],
};

// Confirmed from payment_options screenshot
export const PAYMENT_TYPES = [
  'BillCredit','Check','DigitalGiftCard','StoreCredit','BankDraft',
  'PayPal','IBAN','SwiftBankDraft','InStoreVoucher','DevicePlanCredit',
  'AirtimeCredit','CustomerPlanCredit','O2HardwareAccountNumber'
] as const;

export const VARIANCE_OWN_BY       = ['Customer','Client','Likewize'] as const;
export const VARIANCE_RISK_METHODS = ['Unknown','CreditCardCharge'] as const;
export const PAID_BY_OPTS          = ['Client','Likewize'] as const;

// Confirmed from expiry screenshots — TWO SEPARATE dropdowns with different options
export const POST_INSPECTION_VARIANCE_ACTIONS = ['Accept','ReturnToCustomer'] as const;
export const POST_INSPECTION_LOCK_ACTIONS     = ['Accept','Reject'] as const;

// Confirmed from variance_resolution_options screenshot
export const VARIANCE_RESOLUTION_TYPES = ['AcceptAdjustedValue','ReturnItForFree','DecideLater'] as const;

// Confirmed from device_recycle_enabled screenshot
export const RECYCLE_RULES = ['BasePriceBased','DiagnosticsBased'] as const;

// Confirmed from tradein_verification screenshot
export const TIV_FIELD_NAMES = ['Email','PhoneNumber'] as const;

// Existing programs — only Apple-Korea confirmed from screenshot, rest are placeholders
export const EXISTING_PROGRAMS = ['Apple-Korea','Barclays Trade','Costco','DPTestPrg-1','EEFlex','EEMarketPlacer','EnterpriseTrade'] as const;

export const CURRENCIES  = ['GBP','USD','EUR','KRW','CAD'] as const;
export const LANGUAGES   = ['EN','FR','DE','ES','IT','NL','KO','JA','ZH'] as const;

export const URL_TYPES = [
  { label: 'Trade Web URL',    suffix: '/trade' },
  { label: 'Config Web URL',   suffix: '/config' },
  { label: 'Customer Web URL', suffix: '/customer' },
  { label: 'Auth Web URL',     suffix: '/auth' },
  { label: 'Retail Login URL', suffix: '/retail/login' },
  { label: 'Return Web URL',   suffix: '/return' },
  { label: 'Protect Web URL',  suffix: '/protect' },
  { label: 'Payment Web URL',  suffix: '/payment' },
] as const;

export const WEBHOOK_EVENTS = [
  'trade.confirmed','trade.cancelled','trade.on_hold','trade.completed',
  'quote.created','quote.updated','quote.expired','price.accepted',
  'payment.processed','idv.triggered'
] as const;

// ── Step labels ───────────────────────────────────────────────────────────────
export const SETUP_STEPS = [
  'Program & Pricing',
  'Account',
  'Channels & Features',
  'Account Features',
  'Review',
] as const;

// ── Nav ───────────────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',    icon: '⊞' },
  { id: 'accounts',  label: 'Accounts',     icon: '🏢', badge: 5,  badgeClass: 'neutral' },
  { id: 'setup',     label: 'Guided Setup', icon: '⚙' },
  null,
  { id: 'campaigns', label: 'Campaigns',    icon: '📢', badge: 2,  badgeClass: 'green' },
  { id: 'pricing',   label: 'Pricing',      icon: '💷' },
  null,
  { id: 'failures',  label: 'API Failures', icon: '⚠', badge: 5,  badgeClass: 'red' },
  { id: 'queries',   label: 'Open Queries', icon: '❓', badge: 3,  badgeClass: 'red' },
  null,
  { id: 'comms',     label: 'Comms',        icon: '📨' },
] as const;

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface QuestionCategory {
  questionCategoryType: string;
  order: number;
  defaultPriceTier: string;
  externalQuestionCategoryType: string;
}

export interface PayoutConfig {
  payUpfront: boolean;
  tradeOwnershipType: string;
  varianceOwnBy: string;
  varianceRiskMitigationMethod: string;
  paidBy: string;
}

export interface PaymentTypeConfig {
  paymentType: string;
  vendorIntegrationAvailable: boolean;
  payoutConfigurations: PayoutConfig[];
}

export interface RecycleProvider {
  name: string;
  redirectUrl: string;
  rule: string;
}

export interface VarianceResolutionConfig {
  assetTypes: string[];
  resolutionTypes: string[];
  defaultResolutionType: string;
}

export interface DiagChannelType {
  channelType: string;
  diagnosticsPriority: string; // free text
}

export interface DiagCategory {
  categoryName: string;
  enabledTests: string[];
}

export interface DiagTestConfig {
  assetTypes: string[];
  channelTypes: DiagChannelType[];
  categories: DiagCategory[];
}

export interface AssetDetailConfig {
  assetTypes: string[];
  requiredFields: string[];
  optionalFields: string[];
}

export interface TivEntry {
  fieldName: string;
  verificationType: string;
  expiresInMins: number;
}

export interface TradeinMethod {
  imageUrl: string;
  resourceName: string;
  descResourceName: string;
}

// Questions screen interfaces
export interface AnswerLocale {
  displayText: string;
  locale: string;
}

export interface PossibleAnswer {
  answerCode: string;
  sortOrder: number;
  warehouseAnswerCode: string;
  answerCodeLocales: AnswerLocale[];
  isPositiveAnswer: boolean;
}

export interface HelpText {
  displayText: string;
  locale: string;
}

export interface QuestionLocale {
  displayText: string;
  locale: string;
}

export interface GradingQuestion {
  questionCategoryType: string;
  questionType: string;
  questionCode: string;
  deduction: number;
  deductionType: string;
  diagnosticsTests: string[];
  warehouseQuestionCode: string;
  externalQuestionCode: string;
  sortOrder: number;
  tradeOwnershipTypes: string[];
  isAdditionalQuestion: boolean;
  helpTexts: HelpText[];
  questionLocales: QuestionLocale[];
  possibleAnswers: PossibleAnswer[];
}

export interface DeviceTypeQuestions {
  deviceType: string;
  questions: GradingQuestion[];
}

// Per-channel configuration — one object per selected channel
export interface ChannelConfig {
  channelType: string;
  enabled: boolean;

  // address_validation
  addressValidationEnabled: boolean;
  addressValidationDisabledChannels: string[];

  // asset_details
  assetDetailConfigs: AssetDetailConfig[];

  // bank_account_validation
  bankAccountValidationEnabled: boolean;
  bankAccountValidationType: string;

  // barcode
  barcodeEnabled: boolean;
  barcodeType: string;

  // collect_shipping_address
  collectShippingAddressEnabled: boolean;
  collectShippingAddressOwnershipTypes: string[];

  // device_diagnostics
  deviceDiagnosticsEnabled: boolean;
  diagnosticsCodeExpiryMins: number;
  diagnosticsPollIntervalMins: number;
  diagnosticsAppStoreUrl: string;
  diagnosticsPlayStoreUrl: string;
  diagnosticsAppRedirectionUrl: string;
  diagTestConfigs: DiagTestConfig[];

  // FMIP_Plugin
  fmipEnabled: boolean;

  // iban_validation
  ibanValidationEnabled: boolean;
  ibanValidationType: string; // options not confirmed from screenshot
  ibanCurrencyCode: string;
  ibanCountryCode: string;

  // manufacture_care_eligibility
  manufactureCareEnabled: boolean;
  manufactureCareUrl: string;

  // shipping_label_generate_by_gtp
  shippingLabelByGtpEnabled: boolean;

  // shipping_method (new)
  shippingMethodEnabled: boolean;
  shippingMethodType: string;
  additionalBoxKitRequest: boolean;
  additionalBoxKitRequestInterval: number;
  additionalBoxKitRequestCount: number;

  // store_radius
  storeRadiusEnabled: boolean;
  storeRadius: number;

  // tradein_method
  tradeinMethodEnabled: boolean;
  tradeinMethods: TradeinMethod[];

  // tradein_verification
  tradeinVerificationEnabled: boolean;
  tivEntries: TivEntry[];
}

export function defaultChannelConfig(channelType: string): ChannelConfig {
  return {
    channelType,
    enabled: true,
    addressValidationEnabled: false,
    addressValidationDisabledChannels: [],
    assetDetailConfigs: [],
    bankAccountValidationEnabled: false,
    bankAccountValidationType: '',
    barcodeEnabled: false,
    barcodeType: '',
    collectShippingAddressEnabled: false,
    collectShippingAddressOwnershipTypes: [],
    deviceDiagnosticsEnabled: false,
    diagnosticsCodeExpiryMins: 0,
    diagnosticsPollIntervalMins: 0,
    diagnosticsAppStoreUrl: '',
    diagnosticsPlayStoreUrl: '',
    diagnosticsAppRedirectionUrl: '',
    diagTestConfigs: [],
    fmipEnabled: false,
    ibanValidationEnabled: false,
    ibanValidationType: '',
    ibanCurrencyCode: '',
    ibanCountryCode: '',
    manufactureCareEnabled: false,
    manufactureCareUrl: '',
    shippingLabelByGtpEnabled: false,
    shippingMethodEnabled: false,
    shippingMethodType: '',
    additionalBoxKitRequest: false,
    additionalBoxKitRequestInterval: 0,
    additionalBoxKitRequestCount: 2,
    storeRadiusEnabled: false,
    storeRadius: 0,
    tradeinMethodEnabled: false,
    tradeinMethods: [],
    tradeinVerificationEnabled: false,
    tivEntries: [],
  };
}

// ── Default form ──────────────────────────────────────────────────────────────
export function defaultSetupForm() {
  return {
    // STEP 1: Program & Pricing
    programMode: 'existing' as 'existing' | 'new',
    existingProgram: 'Apple-Korea',
    newProgramName: '',
    priceModel: '',
    priceAsofDateType: 'QuoteCreatedDate',
    priceMismatchAction: '',
    phoneMarkup: null as number | null,
    phoneMarkdown: null as number | null,
    tabletMarkup: null as number | null,
    tabletMarkdown: null as number | null,
    popularDevices: [] as { name: string; rank: number }[],
    popularDeviceLookbackDays: 90,
    popularDeviceS3Url: '',
    popularDeviceCount: 12,
    questionCategoryEnabled: false,
    questionCategories: [] as QuestionCategory[],
    gradingQuestions: [] as DeviceTypeQuestions[],
    idVerificationEnabled: false,
    storeInspectionEnabled: false,

    // STEP 2: Account
    accountName: '',
    status: 'In Progress' as 'In Progress' | 'Approved',
    country: '',
    currency: 'CAD',
    measurementUnit: 'Miles' as 'Miles' | 'Kilometres',
    startDate: '',
    endDate: '',
    languages: ['EN'] as string[],
    urlDomain: '',
    urlKey: '',
    generatedUrls: [] as { label: string; url: string }[],

    // STEP 3: Channels
    channels: [] as ChannelConfig[],

    // STEP 4: Program Defaults
    paymentOptionsEnabled: false,
    paymentTypes: [] as PaymentTypeConfig[],
    defaultPaymentType: 'StoreCredit',
    expiryEnabled: false,
    storeDropOffExpiryDays: 0,
    quoteExpiryHours: 0,
    tradeExpiryDays: 0,
    tradeExpiryReminderDays: 0,
    postInspVarianceReminderDays: 0,
    postInspLockNotificationDays: 0,
    postInspVarianceExpiryDays: 0,
    postInspVarianceAction: 'ReturnToCustomer',
    postInspLockExpiryDays: 0,
    postInspLockAction: 'Reject',
    boxkitGracePeriodDays: 0,
    extendQuoteExpiryDays: 0,
    workflowName: '',
    varianceResolutionEnabled: false,
    varianceResolutionConfigs: [] as VarianceResolutionConfig[],
    deviceRecycleEnabled: false,
    recycleProviders: [] as RecycleProvider[],
    deviceSearchLimitEnabled: false,
    deviceSearchMaxLimit: 50,
    deferredSubmissionEnabled: false,
    smsEnabled: false,
    charityEnabled: false,
    externalPromoEnabled: false,
    tradeTermsEnabled: false,
    tradeTermsDesc: '',
    tradeTermsUrl: '',
  };
}

// Dashboard trend data (kept for dashboard component compatibility)
export const TREND_DATA         = [380,395,402,430,461,490,505,540,568,590,610,625] as const;
export const TREND_MONTHS       = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'] as const;
export const TREND_DATA_CHART   = TREND_DATA.slice(6)   as unknown as number[];
export const TREND_MONTHS_CHART = TREND_MONTHS.slice(6) as unknown as string[];
