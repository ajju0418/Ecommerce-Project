import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductListItem } from '../models/product.types';
import { environment } from '../../../environments/environment';

export interface Order {
  id?: string;
  items: ProductListItem[];
  totalAmount: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    contact: number;
    address: string;
  };
  orderDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | string;
  userId?: string;
  productIds?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl + '/orders';

  constructor(private http: HttpClient) {}

  placeOrder(order: Order): Observable<Order> {
    const backendOrder = {
      userId: Number(order.userId),
      totalAmount: order.totalAmount,
      status: order.status || 'pending',
      customerName: order.customerInfo.name,
      customerEmail: order.customerInfo.email,
      customerPhone: order.customerInfo.phone,
      shippingAddress: order.customerInfo.address,
      productIds: order.items.map(item => Number(item.id))
    };
    return this.http.post<Order>(this.apiUrl, backendOrder);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrdersByUser(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/status`, { status }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
