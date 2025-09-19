import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { ProductListItem } from '../models/product.types';
import { OrderService } from './order-service';
import { AdminSyncService } from './admin-sync.service';
import { environment } from '../../../environments/environment';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product?: any;
}

export interface Cart {
  id?: number;
  items: CartItem[];
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class cartService {
  private apiUrl = environment.apiUrl;
  private initialCartItems: ProductListItem[] = [];
  private cartItemsSubject = new BehaviorSubject<ProductListItem[]>(this.initialCartItems);
  cartItems$: Observable<ProductListItem[]> = this.cartItemsSubject.asObservable();

  get cartCount(): number {
    return this.cartItemsSubject.value.reduce((count, item) => count + (item.quantity || 0), 0);
  }

  get cartCount$(): Observable<number> {
    return new BehaviorSubject(this.cartCount).asObservable();
  }

  constructor(
    private http: HttpClient,
    private orderService: OrderService,
    private adminSyncService: AdminSyncService
  ) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    this.getCartFromBackend().subscribe({
      next: (cart) => {
        if (cart && cart.items) {
          const productItems = cart.items.map(item => ({
            id: item.productId.toString(),
            name: item.product?.name || '',
            price: item.price,
            imageUrl: item.product?.imageUrl || '',
            rating: item.product?.rating || 0,
            quantity: item.quantity
          }));
          this.cartItemsSubject.next(productItems);
        }
      },
      error: () => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          this.cartItemsSubject.next(JSON.parse(storedCart));
        }
      }
    });
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
  }

  private getCartFromBackend(): Observable<Cart> {
    const userId = this.getCurrentUserId();
    return this.http.get<Cart>(`${this.apiUrl}/cart/${userId}`);
  }

  private getCurrentUserId(): string {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.id ? user.id.toString() : 'guest';
  }

  addToCart(product: ProductListItem): Observable<any> {
    const cartItem = {
      productId: Number(product.id),
      quantity: 1
    };

    return this.http.post(`${this.apiUrl}/cart/add`, cartItem).pipe(
      tap(() => {
        const currentItems = this.cartItemsSubject.value;
        const existingItem = currentItems.find(item => item.id === product.id);

        if (existingItem) {
          existingItem.quantity = (existingItem.quantity || 0) + 1;
        } else {
          const newItem = { ...product, quantity: 1 };
          currentItems.push(newItem);
        }

        this.cartItemsSubject.next([...currentItems]);
        this.saveCartToStorage();
        this.adminSyncService.syncProducts(currentItems);
      }),
      catchError(() => {
        const currentItems = this.cartItemsSubject.value;
        const existingItem = currentItems.find(item => item.id === product.id);

        if (existingItem) {
          existingItem.quantity = (existingItem.quantity || 0) + 1;
        } else {
          const newItem = { ...product, quantity: 1 };
          currentItems.push(newItem);
        }

        this.cartItemsSubject.next([...currentItems]);
        this.saveCartToStorage();
        return of(null);
      })
    );
  }

  private syncCartWithBackend(): Observable<any> {
    const cartItems = this.cartItemsSubject.value.map(item => ({
      productId: item.id,
      quantity: item.quantity || 1
    }));

    return this.http.post(`${this.apiUrl}/cart/sync`, { items: cartItems });
  }

  getCartItems(): ProductListItem[] {
    return this.cartItemsSubject.value;
  }

  updateQuantity(index: number, change: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems[index];

    const newQuantity = (item.quantity ?? 0) + change;
    if (newQuantity < 1) return;

    const updateData = {
      productId: Number(item.id),
      quantity: newQuantity
    };

    this.http.put(`${this.apiUrl}/cart/update`, updateData).pipe(
      tap(() => {
        item.quantity = newQuantity;
        this.cartItemsSubject.next([...currentItems]);
        this.saveCartToStorage();
        this.adminSyncService.syncProducts(currentItems);
      }),
      catchError(() => {
        item.quantity = newQuantity;
        this.cartItemsSubject.next([...currentItems]);
        this.saveCartToStorage();
        return of(null);
      })
    ).subscribe();
  }

  removeItem(index: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems[index];

    this.http.delete(`${this.apiUrl}/cart/remove/${item.id}`).pipe(
      tap(() => {
        currentItems.splice(index, 1);
        this.cartItemsSubject.next([...currentItems]);
        this.saveCartToStorage();
        this.adminSyncService.syncProducts(currentItems);
      }),
      catchError(() => {
        currentItems.splice(index, 1);
        this.cartItemsSubject.next([...currentItems]);
        this.saveCartToStorage();
        return of(null);
      })
    ).subscribe();
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  }

  // Remove any usage of createOrder, use placeOrder from OrderService instead where needed.
  // If you have a method like checkout or placeOrder, update it to use this.orderService.placeOrder(order)
  // Example:
  // placeOrder(items: ProductListItem[], totalAmount: number, customerInfo: any) {
  //   const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  //   const order = {
  //     items,
  //     totalAmount,
  //     customerInfo,
  //     orderDate: new Date(),
  //     status: 'pending',
  //     userId: user.id ? user.id.toString() : undefined
  //   };
  //   return this.orderService.placeOrder(order);
  // }

  clearCart(): void {
    const userId = this.getCurrentUserId();
    
    this.http.delete(`${this.apiUrl}/cart/clear/${userId}`).pipe(
      tap(() => {
        this.cartItemsSubject.next([]);
        this.saveCartToStorage();
        this.adminSyncService.syncProducts([]);
      }),
      catchError(() => {
        this.cartItemsSubject.next([]);
        this.saveCartToStorage();
        return of(null);
      })
    ).subscribe();
  }
}
