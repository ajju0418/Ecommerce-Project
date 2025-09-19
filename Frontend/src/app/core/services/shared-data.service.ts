import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductListItem } from '../models/product.types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private apiUrl = environment.apiUrl;
  private productsSubject = new BehaviorSubject<ProductListItem[]>([]);
  private ordersSubject = new BehaviorSubject<any[]>([]);

  products$ = this.productsSubject.asObservable();
  orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadDataFromBackend();
  }

  private loadDataFromBackend() {
    this.getProductsFromBackend().subscribe(products => {
      this.productsSubject.next(products);
    });

    this.getOrdersFromBackend().subscribe(orders => {
      this.ordersSubject.next(orders);
    });
  }

  private getProductsFromBackend(): Observable<ProductListItem[]> {
    return this.http.get<ProductListItem[]>(`${this.apiUrl}/products`);
  }

  private getOrdersFromBackend(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }

  getProducts(): ProductListItem[] {
    return this.productsSubject.value;
  }

  refreshProducts(): Observable<ProductListItem[]> {
    return this.getProductsFromBackend();
  }

  updateProducts(products: ProductListItem[]) {
    this.productsSubject.next(products);
  }

  getOrders(): any[] {
    return this.ordersSubject.value;
  }

  refreshOrders(): Observable<any[]> {
    return this.getOrdersFromBackend();
  }

  updateOrdersFromService(orders: any[]) {
    this.ordersSubject.next(orders);
  }
}