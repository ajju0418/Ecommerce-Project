import { cartService } from '../../../core/services/cart-Service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedDataService } from '../../../core/services/shared-data.service';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.css'
})
export class ProductGrid implements OnInit {
  products: any[] = [];

  constructor(private sharedDataService: SharedDataService,private cartService: cartService) {}

  ngOnInit() {
    this.sharedDataService.products$.subscribe(products => {
      this.products = products.map(product => ({
        image: product.imageUrl,
        link: '/products-page',
        brand: product.name,
        originalPrice: product.originalPrice || product.price * 1.5,
        discountedPrice: product.price
      }));
    });
  }

  }

