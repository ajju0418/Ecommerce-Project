import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { OrderService, Order } from './order-service';
import { ProductListItem } from '../models/product.types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminSyncService {
  private apiUrl = environment.apiUrl;
  private adminProductsSubject = new BehaviorSubject<ProductListItem[]>([]);
  public adminProducts$ = this.adminProductsSubject.asObservable();

  private newOrdersSubject = new BehaviorSubject<Order[]>([]);
  public newOrders$ = this.newOrdersSubject.asObservable();

  constructor(
    private http: HttpClient,
    private orderService: OrderService
  ) {
    this.initializeSync();
    this.startPeriodicSync();
  }

  private initializeSync(): void {
    this.refreshData();
  }

  private startPeriodicSync(): void {
    interval(30000).subscribe(() => {
      this.refreshData();
    });
  }

  private refreshData(): void {
    this.orderService.getAllOrders().subscribe((orders: Order[]) => {
      this.newOrdersSubject.next(orders);
    });

    this.getProductsFromBackend().subscribe((products: ProductListItem[]) => {
      this.adminProductsSubject.next(products);
    });
  }

  private getProductsFromBackend(): Observable<ProductListItem[]> {
    return this.http.get<ProductListItem[]>(`${this.apiUrl}/products`);
  }

  syncProducts(products: ProductListItem[]): void {
    this.adminProductsSubject.next(products);
  }

  getAdminProducts(): Observable<ProductListItem[]> {
    return this.adminProducts$;
  }

  getNewOrders(): Observable<Order[]> {
    return this.newOrders$;
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/dashboard/stats`);
  }

  getRecentActivity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/dashboard/activity`);
  }

  redirectToAdmin(orderId: string): void {
    sessionStorage.setItem('adminOrderId', orderId);
    window.open('/admin/dashboard', '_blank');
  }
}
