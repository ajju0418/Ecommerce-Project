import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { FallbackService } from './fallback.service';

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface CustomerData {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
}

export interface ProductAnalytics {
  topSellingProducts: any[];
  categoryPerformance: any[];
  inventoryAlerts: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = environment.apiUrl + '/analytics';

  constructor(private http: HttpClient, private fallback: FallbackService) { }

  getSalesData(startDate?: string, endDate?: string): Observable<SalesData[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    
    return this.http.get<SalesData[]>(`${this.apiUrl}`, { params }).pipe(
      catchError(() => this.fallback.getAnalytics())
    );
  }

  getCustomerAnalytics(): Observable<CustomerData> {
    return this.http.get<CustomerData>(`${this.apiUrl}/customers`);
  }

  getProductAnalytics(): Observable<ProductAnalytics> {
    return this.http.get<ProductAnalytics>(`${this.apiUrl}/products`);
  }

  getRevenueByCategory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/revenue/category`);
  }

  getOrderTrends(period: string = '30d'): Observable<any[]> {
    const params = new HttpParams().set('period', period);
    return this.http.get<any[]>(`${this.apiUrl}/orders/trends`, { params });
  }

  getDashboardSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/summary`);
  }
}