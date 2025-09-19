import { Component, OnInit } from '@angular/core';
import { Productservice, Product } from '../../../core/services/productservice';
import { ProductListItem } from '../../../core/models/product.types';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { cartService } from '../../../core/services/cart-Service';
import { ProductDetailComponent } from '../product-detail/product-detail';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-products-list',
  standalone: true,
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.css'],
  imports: [CurrencyPipe,  FormsModule, CommonModule, ProductDetailComponent],
  providers: [Productservice]
})
export class ProductsList implements OnInit {
  products: ProductListItem[] = [];
  filteredProducts: ProductListItem[] = [];
  selectedProduct: ProductListItem | null = null;
  loading: boolean = false;
  error: string = '';

  searchTerm: string = '';
  selectedCollection: string = 'All';
  selectedType: string = 'All';
  selectedGender: string = 'All';
  categoryFilter: string = '';

  collections: string[] = ['All'];
  types: string[] = ['All'];
  genders: string[] = ['All', 'Men', 'Women'];
  categories: string[] = [];
  brands: string[] = [];

  private searchSubject = new Subject<string>();

  constructor(
    private productService: Productservice,
    private router: Router,
    private cartService: cartService,
    private route: ActivatedRoute
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadProducts();
    });
  }

  ngOnInit(): void {
    this.loadFilterOptions();
    this.route.queryParams.subscribe(params => {
      this.categoryFilter = params['category'] || '';
      if (this.categoryFilter === 'men') {
        this.selectedGender = 'Men';
      } else if (this.categoryFilter === 'women') {
        this.selectedGender = 'Women';
      } else if (this.categoryFilter === 'kids') {
        this.selectedGender = 'Kids';
      } else if (this.categoryFilter === 'accessories') {
        this.selectedType = 'Accessories';
        this.selectedGender = 'All';
      }
      this.loadProducts();
    });
  }

  loadFilterOptions(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.types = ['All', ...categories];
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.types = ['All', 'Shirts', 'T-Shirts', 'Trousers', 'Accessories'];
      }
    });

    this.productService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.collections = ['All', ...brands];
      },
      error: (err) => {
        console.error('Error loading brands:', err);
        this.collections = ['All', 'New Arrivals', 'Sale', 'Deal of the Day', 'Best Seller'];
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    const searchQuery = this.buildSearchQuery();
    
    this.productService.searchProducts(
      searchQuery.query,
      searchQuery.category,
      searchQuery.minPrice,
      searchQuery.maxPrice,
      searchQuery.gender,
      searchQuery.brand
    ).subscribe({
      next: (response) => {
        this.products = response.content.map(this.convertToProductListItem);
        this.filteredProducts = this.products;
        this.loading = false;
      },
     
    });
  }


  private applyClientFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesGender = this.selectedGender === 'All' || product.gender === this.selectedGender;
      const matchesCollection = this.selectedCollection === 'All' || product.collection === this.selectedCollection;
      const matchesType = this.selectedType === 'All' || product.type === this.selectedType;
      
      let matchesCategory = true;
      if (this.categoryFilter) {
        if (this.categoryFilter === 'men') matchesCategory = product.gender === 'Men';
        else if (this.categoryFilter === 'women') matchesCategory = product.gender === 'Women';
        else if (this.categoryFilter === 'kids') matchesCategory = product.gender === 'Kids';
        else if (this.categoryFilter === 'accessories') matchesCategory = product.type === 'Accessories';
      }
      
      return matchesSearch && matchesGender && matchesCollection && matchesType && matchesCategory;
    });
  }

  private buildSearchQuery(): any {
    const query: any = {};
    
    if (this.searchTerm.trim()) {
      query.query = this.searchTerm.trim();
    }
    
    if (this.selectedType !== 'All') {
      query.category = this.selectedType;
    }
    
    if (this.selectedGender !== 'All') {
      query.gender = this.selectedGender;
    }
    
    if (this.selectedCollection !== 'All') {
      query.brand = this.selectedCollection;
    }
    
    if (this.categoryFilter) {
      if (this.categoryFilter === 'accessories') {
        query.category = 'Accessories';
      } else if (this.categoryFilter === 'men') {
        query.gender = 'Men';
      } else if (this.categoryFilter === 'women') {
        query.gender = 'Women';
      } else if (this.categoryFilter === 'kids') {
        query.gender = 'Kids';
      }
    }
    
    return query;
  }

  private convertToProductListItem(product: Product): ProductListItem {
    return {
      id: product.id?.toString() || '0',
      name: product.name || 'Unnamed Product',
      price: product.price || 0,
      imageUrl: product.imageUrl || '/assets/images/product1.avif',
      rating: product.rating || 4.0,
      category: product.category || 'General',
      brand: product.brand || 'Unknown Brand',
      description: product.description || 'No description available',
      stock: product.stockQuantity || 0,
      gender: product.gender || 'Unisex',
      collection: product.collection || product.brand || 'General',
      type: product.type || product.category || 'General'
    };
  }

  onProductClick(product: ProductListItem): void {
    this.selectedProduct = product;
  }

  addToCart(product: ProductListItem): void {
    this.cartService.addToCart(product).subscribe({
      next: () => {
        this.router.navigate(['/home/cart']);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        // Still navigate to cart even if sync fails
        this.router.navigate(['/home/cart']);
      }
    });
  }

  closeDetail(): void {
    this.selectedProduct = null;
  }

  onSearch(): void {
    if (this.error) {
      this.applyClientFilters();
    } else {
      this.searchSubject.next(this.searchTerm);
    }
  }

  onCollectionChange(collection: string): void {
    this.selectedCollection = collection;
    if (this.error) {
      this.applyClientFilters();
    } else {
      this.loadProducts();
    }
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    if (this.error) {
      this.applyClientFilters();
    } else {
      this.loadProducts();
    }
  }

  onGenderChange(gender: string): void {
    this.selectedGender = gender;
    if (this.error) {
      this.applyClientFilters();
    } else {
      this.loadProducts();
    }
  }

  clearCategoryFilter(): void {
    this.categoryFilter = '';
    this.selectedGender = 'All';
    this.selectedType = 'All';
    this.selectedCollection = 'All';
    this.searchTerm = '';
    this.router.navigate(['/products-page']);
  }



  trackByProduct(index: number, product: ProductListItem): string {
    return product.id;
  }
}
