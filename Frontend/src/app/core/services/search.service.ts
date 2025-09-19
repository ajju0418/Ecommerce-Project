import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  gender?: string;
  rating?: number;
  sortBy?: 'price' | 'name' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  products: any[];
  totalCount: number;
  filters: {
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
  };
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = environment.apiUrl + '/search';
  private recentSearchesSubject = new BehaviorSubject<string[]>([]);
  public recentSearches$ = this.recentSearchesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadRecentSearches();
  }

  searchProducts(filters: SearchFilters, page: number = 0, size: number = 20): Observable<SearchResult> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof SearchFilters];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<SearchResult>(`${this.apiUrl}/products`, { params });
  }

  getSearchSuggestions(query: string): Observable<string[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<string[]>(`${this.apiUrl}/suggestions`, { params });
  }

  getPopularSearches(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/popular`);
  }

  addToRecentSearches(query: string): void {
    if (!query.trim()) return;
    
    const recent = this.recentSearchesSubject.value;
    const filtered = recent.filter(item => item !== query);
    const updated = [query, ...filtered].slice(0, 10);
    
    this.recentSearchesSubject.next(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }

  clearRecentSearches(): void {
    this.recentSearchesSubject.next([]);
    localStorage.removeItem('recentSearches');
  }

  private loadRecentSearches(): void {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      this.recentSearchesSubject.next(JSON.parse(stored));
    }
  }

  getAvailableFilters(): Observable<any> {
    return this.http.get(`${this.apiUrl}/filters`);
  }
}