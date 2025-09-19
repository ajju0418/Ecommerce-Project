import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FallbackService {

  constructor() { }

  // Fallback methods for endpoints that don't exist yet
  getAnalytics(): Observable<any> {
    return of({
      sales: [],
      customers: { totalCustomers: 0, newCustomers: 0, returningCustomers: 0 },
      products: { topSellingProducts: [], categoryPerformance: [], inventoryAlerts: [] }
    });
  }

  getNotifications(): Observable<any[]> {
    return of([]);
  }

  searchProducts(query: string): Observable<any> {
    return of({ products: [], totalCount: 0, filters: { categories: [], brands: [], priceRange: { min: 0, max: 0 } } });
  }

  getWishlist(): Observable<any[]> {
    return of([]);
  }
}