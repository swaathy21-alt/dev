import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Account, ApiFailure, Campaign, PricingRecord, CustomerQuery, SetupForm, ApiResponse, AccountListFilter, PricingFilter } from '../models';

/**
 * TTPApiService — all backend HTTP endpoints.
 * Set environment.apiUrl to point at your backend.
 * Swap MockDataService.getX() calls for these methods once backend is live.
 */
@Injectable({ providedIn: 'root' })
export class TTPApiService {
  private readonly base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // Accounts
  getAccounts(filter?: AccountListFilter): Observable<Account[]> {
    let params = new HttpParams();
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.search) params = params.set('search', filter.search);
    return this.http.get<Account[]>(`${this.base}/accounts`, { params });
  }
  getAccount(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.base}/accounts/${id}`);
  }
  createAccount(form: SetupForm): Observable<ApiResponse<Account>> {
    return this.http.post<ApiResponse<Account>>(`${this.base}/accounts`, form);
  }
  updateAccount(id: number, form: Partial<SetupForm>): Observable<ApiResponse<Account>> {
    return this.http.put<ApiResponse<Account>>(`${this.base}/accounts/${id}`, form);
  }
  cloneAccount(id: number): Observable<ApiResponse<Account>> {
    return this.http.post<ApiResponse<Account>>(`${this.base}/accounts/${id}/clone`, {});
  }

  // Failures
  getApiFailures(filters?: { vendor?: string; method?: string; account?: string; dateFrom?: string; dateTo?: string }): Observable<ApiFailure[]> {
    let params = new HttpParams();
    if (filters) Object.entries(filters).forEach(([k, v]) => { if (v) params = params.set(k, v); });
    return this.http.get<ApiFailure[]>(`${this.base}/api-failures`, { params });
  }
  retryRequest(id: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.base}/api-failures/${id}/retry`, {});
  }

  // Campaigns
  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.base}/campaigns`);
  }
  createCampaign(campaign: Partial<Campaign>): Observable<ApiResponse<Campaign>> {
    return this.http.post<ApiResponse<Campaign>>(`${this.base}/campaigns`, campaign);
  }

  // Pricing
  getPricing(filter?: PricingFilter): Observable<PricingRecord[]> {
    let params = new HttpParams();
    if (filter?.search)    params = params.set('search', filter.search);
    if (filter?.startDate) params = params.set('startDate', filter.startDate);
    if (filter?.endDate)   params = params.set('endDate', filter.endDate);
    return this.http.get<PricingRecord[]>(`${this.base}/pricing`, { params });
  }
  exportPricing(): Observable<Blob> {
    return this.http.get(`${this.base}/pricing/export`, { responseType: 'blob' });
  }
  importPricing(file: File): Observable<ApiResponse<{ imported: number }>> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<ApiResponse<{ imported: number }>>(`${this.base}/pricing/import`, form);
  }

  // Queries
  getQueries(): Observable<CustomerQuery[]> {
    return this.http.get<CustomerQuery[]>(`${this.base}/queries`);
  }
  replyToQuery(id: number, message: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.base}/queries/${id}/reply`, { message });
  }

  // Dashboard
  getDashboardSummary(): Observable<{ activeAccounts: number; inactiveAccounts: number; apiFailures: number; activeCampaigns: number; openQueries: number; pricingRecords: number; }> {
    return this.http.get<any>(`${this.base}/dashboard/summary`);
  }
}
