import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id: number;
  imageUrl: string;
  name: string;
  category: string;
  brand?: string;
  price: number;
  stockQuantity: number;
  status: 'Active' | 'Inactive' | 'Out of Stock';
  description?: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProductInventoryService {
  private apiUrl = environment.apiUrl + '/admin/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, updates: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, updates);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getProductsByStatus(status: string): Observable<Product[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<Product[]>(`${this.apiUrl}/status`, { params });
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const params = new HttpParams().set('category', category);
    return this.http.get<Product[]>(`${this.apiUrl}/category`, { params });
  }

  getInventoryStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  updateStock(id: number, quantity: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/stock`, { stockQuantity: quantity });
  }
}
