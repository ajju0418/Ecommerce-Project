import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WishlistItem {
  id: number;
  productId: number;
  userId: number;
  addedDate: Date;
  product?: any;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = environment.apiUrl + '/wishlist';
  private wishlistItemsSubject = new BehaviorSubject<WishlistItem[]>([]);
  public wishlistItems$ = this.wishlistItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.getWishlistFromBackend(userId).subscribe({
        next: (items) => this.wishlistItemsSubject.next(items),
        error: () => this.loadWishlistFromStorage()
      });
    } else {
      this.loadWishlistFromStorage();
    }
  }

  private loadWishlistFromStorage(): void {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      this.wishlistItemsSubject.next(JSON.parse(stored));
    }
  }

  private saveWishlistToStorage(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItemsSubject.value));
  }

  private getCurrentUserId(): number | null {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.id ? Number(user.id) : null;
  }

  private getWishlistFromBackend(userId: number): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.apiUrl}/${userId}`);
  }

  addToWishlist(productId: number): Observable<any> {
    const userId = this.getCurrentUserId();
    
    if (userId) {
      return this.http.post(`${this.apiUrl}/add`, { userId, productId }).pipe(
        tap(() => {
          const currentItems = this.wishlistItemsSubject.value;
          const newItem: WishlistItem = {
            id: Date.now(),
            productId,
            userId,
            addedDate: new Date()
          };
          this.wishlistItemsSubject.next([...currentItems, newItem]);
          this.saveWishlistToStorage();
        }),
        catchError(() => {
          // Fallback to local storage
          const currentItems = this.wishlistItemsSubject.value;
          const newItem: WishlistItem = {
            id: Date.now(),
            productId,
            userId: userId || 0,
            addedDate: new Date()
          };
          this.wishlistItemsSubject.next([...currentItems, newItem]);
          this.saveWishlistToStorage();
          return of(null);
        })
      );
    } else {
      // Guest user - use local storage only
      const currentItems = this.wishlistItemsSubject.value;
      const newItem: WishlistItem = {
        id: Date.now(),
        productId,
        userId: 0,
        addedDate: new Date()
      };
      this.wishlistItemsSubject.next([...currentItems, newItem]);
      this.saveWishlistToStorage();
      return of(null);
    }
  }

  removeFromWishlist(productId: number): Observable<any> {
    const userId = this.getCurrentUserId();
    
    if (userId) {
      return this.http.delete(`${this.apiUrl}/remove/${userId}/${productId}`).pipe(
        tap(() => {
          const currentItems = this.wishlistItemsSubject.value;
          const filtered = currentItems.filter(item => item.productId !== productId);
          this.wishlistItemsSubject.next(filtered);
          this.saveWishlistToStorage();
        }),
        catchError(() => {
          const currentItems = this.wishlistItemsSubject.value;
          const filtered = currentItems.filter(item => item.productId !== productId);
          this.wishlistItemsSubject.next(filtered);
          this.saveWishlistToStorage();
          return of(null);
        })
      );
    } else {
      const currentItems = this.wishlistItemsSubject.value;
      const filtered = currentItems.filter(item => item.productId !== productId);
      this.wishlistItemsSubject.next(filtered);
      this.saveWishlistToStorage();
      return of(null);
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItemsSubject.value.some(item => item.productId === productId);
  }

  getWishlistCount(): number {
    return this.wishlistItemsSubject.value.length;
  }

  clearWishlist(): Observable<any> {
    const userId = this.getCurrentUserId();
    
    if (userId) {
      return this.http.delete(`${this.apiUrl}/clear/${userId}`).pipe(
        tap(() => {
          this.wishlistItemsSubject.next([]);
          this.saveWishlistToStorage();
        }),
        catchError(() => {
          this.wishlistItemsSubject.next([]);
          this.saveWishlistToStorage();
          return of(null);
        })
      );
    } else {
      this.wishlistItemsSubject.next([]);
      this.saveWishlistToStorage();
      return of(null);
    }
  }
}