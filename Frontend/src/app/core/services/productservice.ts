import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  brand?: string;
  gender?: string;
  collection?: string;
  type?: string;
  stockQuantity?: number;
  rating?: number;
}

export interface ProductPage {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class Productservice {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProductList(page: number = 0, size: number = 20): Observable<ProductPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ProductPage>(`${this.apiUrl}/products`, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  searchProducts(query?: string, category?: string, minPrice?: number, maxPrice?: number, gender?: string, brand?: string): Observable<ProductPage> {
    let params = new HttpParams();

    if (query) params = params.set('query', query);
    if (category) params = params.set('category', category);
    if (minPrice) params = params.set('minPrice', minPrice.toString());
    if (maxPrice) params = params.set('maxPrice', maxPrice.toString());
    if (gender) params = params.set('gender', gender);
    if (brand) params = params.set('brand', brand);

    return this.http.get<ProductPage>(`${this.apiUrl}/products/search`, { params });
  }

  getProductsByCategory(category: string, page: number = 0, size: number = 20): Observable<ProductPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ProductPage>(`${this.apiUrl}/products/category/${category}`, { params });
  }

  getProductsByGender(gender: string, page: number = 0, size: number = 20): Observable<ProductPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ProductPage>(`${this.apiUrl}/products/gender/${gender}`, { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`);
  }

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/brands`);
  }

  getFeaturedProducts(): Observable<ProductPage> {
    return this.http.get<ProductPage>(`${this.apiUrl}/products/featured`);
  }

  getNewArrivals(page: number = 0, size: number = 20): Observable<ProductPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ProductPage>(`${this.apiUrl}/products/new-arrivals`, { params });
  }

  getSaleProducts(page: number = 0, size: number = 20): Observable<ProductPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ProductPage>(`${this.apiUrl}/products/sale`, { params });
  }

  getDealsOfTheDay(page: number = 0, size: number = 20): Observable<ProductPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ProductPage>(`${this.apiUrl}/products/deals-of-the-day`, { params });
  }
}
