import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Account, ApiFailure, Campaign, ApiPromotion, PricingRecord, CustomerQuery,
         AccountStatus, CampaignType, CampaignStatus, QueryStatus } from '../models';
import { TREND_DATA, TREND_DATA_CHART, TREND_MONTHS_CHART } from '../constants';

@Injectable({ providedIn: 'root' })
export class MockDataService {

  readonly accounts: Account[] = [
    { id:1, program:'Samsung Global', account:'Samsung UK Online',  channels:['Online','API'],          equipTypes:['Phone','Tablet'],              shipping:['Self-Mail','Box Kit'],                 payment:['PayPal','Bank Transfer'],  idv:true,  blk:false, retailUsers:0,   stores:0,  status:AccountStatus.Active   },
    { id:2, program:'EE Telecom',     account:'EE Retail UK',       channels:['Retail','Online'],       equipTypes:['Phone'],                       shipping:['Store Drop-off','Courier Collection'], payment:['Bill Credit','Gift Card'],  idv:true,  blk:true,  retailUsers:312, stores:45, status:AccountStatus.Active   },
    { id:3, program:'EE Telecom',     account:'EE Online Portal',   channels:['Online','Widget'],       equipTypes:['Phone','Laptop'],              shipping:['Self-Mail'],                           payment:['PayPal','Voucher'],         idv:false, blk:false, retailUsers:0,   stores:0,  status:AccountStatus.Active   },
    { id:4, program:'Rogers Canada',  account:'Rogers Fido BBTI',   channels:['API','B2B/Enterprise'], equipTypes:['Phone','Tablet','Headphones'], shipping:['Box Kit','Courier Collection'],        payment:['Bill Credit'],             idv:false, blk:true,  retailUsers:0,   stores:0,  status:AccountStatus.Active   },
    { id:5, program:'Samsung Global', account:'Samsung SDS Legacy', channels:['Online'],               equipTypes:['Phone'],                       shipping:['Self-Mail'],                           payment:['Bank Transfer'],           idv:false, blk:false, retailUsers:0,   stores:0,  status:AccountStatus.Inactive },
  ];

  readonly apiFailures: ApiFailure[] = [
    { id:1, timestamp:'2026-03-13 14:32:11', vendor:'Recipero',      endpoint:'/api/v2/imei/validate',         method:'POST', status:503, error:'Service temporarily unavailable — upstream timeout after 30s',     account:'EE Retail UK'       },
    { id:2, timestamp:'2026-03-13 12:18:44', vendor:'Jumio',         endpoint:'/api/netverify/v2/initiations', method:'POST', status:401, error:'Invalid API token — credentials may have expired',                account:'Samsung UK Online'  },
    { id:3, timestamp:'2026-03-13 09:55:02', vendor:'Apple API',     endpoint:'/devicecheck/v1/query_two_bits',method:'GET',  status:500, error:'Internal server error — Apple DeviceCheck infrastructure fault',  account:'EE Online Portal'   },
    { id:4, timestamp:'2026-03-12 23:41:37', vendor:'SmartyStreets', endpoint:'/street-address',              method:'GET',  status:422, error:'Unprocessable entity — address line 2 exceeds maximum length',    account:'Rogers Fido BBTI'   },
    { id:5, timestamp:'2026-03-12 18:07:19', vendor:'Onfido',        endpoint:'/v3.6/applicants',             method:'POST', status:429, error:'Rate limit exceeded — retry after 60 seconds',                    account:'Samsung UK Online'  },
  ];

  readonly campaigns: Campaign[] = [
    { id:1, name:'Spring Trade Boost 2026', type:CampaignType.Automatic, coupon:null,        start:'2026-03-01', end:'2026-05-31', basis:'Trade Date', status:CampaignStatus.Active    },
    { id:2, name:'EE Loyalty Coupon Q1',    type:CampaignType.Coupon,    coupon:'EELOY25',   start:'2026-01-15', end:'2026-03-31', basis:'Quote Date', status:CampaignStatus.Active    },
    { id:3, name:'Samsung Promo Winter',    type:CampaignType.Automatic, coupon:null,        start:'2025-12-01', end:'2026-02-28', basis:'Trade Date', status:CampaignStatus.Expired   },
    { id:4, name:'Fido Device Refresh',     type:CampaignType.Coupon,    coupon:'FIDO10OFF', start:'2026-04-01', end:'2026-06-30', basis:'Quote Date', status:CampaignStatus.Scheduled },
  ];

  readonly apiPromotions: ApiPromotion[] = [
    { source:'GTP',          externalId:'EXT-88421', tradeId:'TRD-20940', device:'iPhone 15 Pro',     imei:'35****081234561', amount:'£125.00', created:'2026-03-10' },
    { source:'MarketPlacer', externalId:'MP-00341',  tradeId:'TRD-20811', device:'Samsung S24 Ultra', imei:'86****091238872', amount:'£210.00', created:'2026-03-08' },
  ];

  readonly pricing: PricingRecord[] = [
    { id:1, make:'Apple',   model:'iPhone 16 Pro',    sku:'APPL-IP16P-256', variant:'256GB Natural Titanium', price:625, start:'2026-01-01', end:'2026-12-31' },
    { id:2, make:'Apple',   model:'iPhone 15',        sku:'APPL-IP15-128',  variant:'128GB Black',            price:380, start:'2026-01-01', end:'2026-12-31' },
    { id:3, make:'Samsung', model:'Galaxy S24 Ultra', sku:'SAMS-S24U-256',  variant:'256GB Titanium Gray',    price:580, start:'2026-01-01', end:'2026-12-31' },
    { id:4, make:'Samsung', model:'Galaxy S23',       sku:'SAMS-S23-128',   variant:'128GB Phantom Black',    price:290, start:'2026-01-01', end:'2026-12-31' },
    { id:5, make:'Apple',   model:'iPad Air M2',      sku:'APPL-IPAM2-64',  variant:'64GB Space Grey',        price:420, start:'2026-02-01', end:'2026-12-31' },
    { id:6, make:'Google',  model:'Pixel 9 Pro',      sku:'GOOG-PX9P-128',  variant:'128GB Obsidian',         price:350, start:'2026-03-01', end:'2026-12-31' },
  ];

  // FIX #3: full 12-point TREND_DATA from constants (spec §3); chart uses last 6 (Oct–Mar, spec §5.5)
  readonly trendDataFull  = [...TREND_DATA];
  readonly trendData      = TREND_DATA_CHART;
  readonly trendMonths    = TREND_MONTHS_CHART;

  readonly queries: CustomerQuery[] = [
    { id:1, account:'EE Retail UK',      reason:'Price Dispute',    customer:'James Holden', tradeId:'TRD-20112', status:QueryStatus.Open,     created:'2026-03-11' },
    { id:2, account:'Samsung UK Online', reason:'Device Condition', customer:'Naomi Nagata', tradeId:'TRD-19988', status:QueryStatus.Pending,  created:'2026-03-09' },
    { id:3, account:'Rogers Fido BBTI',  reason:'Payment Delay',    customer:'Amos Burton',  tradeId:'TRD-20044', status:QueryStatus.Open,     created:'2026-03-07' },
    { id:4, account:'EE Online Portal',  reason:'IDV Failure',      customer:'Clarissa Mao', tradeId:'TRD-19802', status:QueryStatus.Resolved, created:'2026-02-28' },
  ];

  readonly commsData: Record<string, Record<string, [boolean, boolean]>> = {
    'Samsung UK Online': { 'Trade Confirmation':[true,false],  'Trade Cancellation':[true,true],   'On Hold – Variance':[false,false], 'Quote Expiration':[true,false],  'Trade Expiration':[true,false],  'Acceptance/Rejection':[true,true]   },
    'EE Retail UK':      { 'Trade Confirmation':[true,true],   'Trade Cancellation':[true,false],  'On Hold – Variance':[true,true],   'Quote Expiration':[false,false], 'Trade Expiration':[true,true],   'Acceptance/Rejection':[true,false]  },
    'EE Online Portal':  { 'Trade Confirmation':[true,false],  'Trade Cancellation':[false,false], 'On Hold – Variance':[true,false],  'Quote Expiration':[true,true],   'Trade Expiration':[false,false], 'Acceptance/Rejection':[false,false] },
  };

  getAccounts():     Observable<Account[]>       { return of(this.accounts);     }
  getApiFailures():  Observable<ApiFailure[]>    { return of(this.apiFailures);  }
  getCampaigns():    Observable<Campaign[]>      { return of(this.campaigns);    }
  getApiPromotions():Observable<ApiPromotion[]>  { return of(this.apiPromotions);}
  getPricing():      Observable<PricingRecord[]> { return of(this.pricing);      }
  getQueries():      Observable<CustomerQuery[]> { return of(this.queries);      }
}
