import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductListItem } from '../../../core/models/product.types';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
  imports: [CurrencyPipe]
})
export class ProductDetailComponent {
  @Input() product!: ProductListItem;
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<ProductListItem>();

  onClose(): void {
    this.close.emit();
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
