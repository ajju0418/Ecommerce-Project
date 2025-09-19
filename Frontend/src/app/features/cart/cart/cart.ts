import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { cartService } from '../../../core/services/cart-Service';
import { OrderService } from '../../../core/services/order-service';
import { Header } from "../../../layout/header/header";
import { Footer } from "../../../layout/footer/footer";
import { ProductListItem } from '../../../core/models/product.types';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: ProductListItem[] = [];
  savedItems: any[] = [];
  couponCode: string = '';
  appliedDiscount: number = 0;
  totalAmount: number = 0;
  customerName: string = '';
  customerEmail: string = '';
  customerPhone: string = '';
  showCheckoutForm: boolean = false;

  cartSubscription!: Subscription;

  constructor(
    private cartService: cartService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  changeQuantity(index: number, delta: number): void {
    const item = this.cartItems[index];
    const newQty = (item.quantity ?? 0) + delta;

    if (newQty >= 1 && newQty <= 5) {
      this.cartService.updateQuantity(index, delta);
    } else if (newQty > 5) {
      alert('Maximum quantity allowed is 5.');
    }
  }
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (sum, item) => sum + (item.price * (item.quantity || 1)),
      0
    );

    if (this.appliedDiscount > 0) {
      this.totalAmount -= this.appliedDiscount;
    }
  }
  applyCoupon(): void {
    const code = this.couponCode.trim().toUpperCase();

    if (code === 'SAVE50') {
      this.appliedDiscount = 50;
      alert('Coupon applied: ₹50 off!');
    } else if (code === 'DISCOUNT10') {
      const subtotal = this.cartItems.reduce(
        (sum, item) => sum + (item.price * (item.quantity || 1)),
        0
      );
      this.appliedDiscount = subtotal * 0.1;
      alert('Coupon applied: 10% off!');
    } else {
      alert('Invalid coupon code.');
      this.appliedDiscount = 0;
    }

    this.calculateTotal();
  }

  confirmRemove(index: number): void {
    if (window.confirm('Are you sure you want to remove this item?')) {
      this.removeItem(index);
    }
  }
  removeItem(index: number): void {
    this.cartService.removeItem(index);
    this.calculateTotal();
  }

  saveForLater(index: number): void {
    const item = this.cartItems[index];
    this.savedItems.push(item);
    this.cartService.removeItem(index);
    alert(`${item.name} has been saved for later.`);
  }

  toggleCheckoutForm(): void {
    this.showCheckoutForm = !this.showCheckoutForm;
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
  }
  payNow(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    // Prepare order object
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const order = {
      items: this.cartItems,
      totalAmount: this.totalAmount,
      customerInfo: {
        name: this.customerName,
        email: this.customerEmail,
        phone: this.customerPhone,
        contact: Number(this.customerPhone), // ensure number
        address: ''
      },
      orderDate: new Date(),
      status: 'pending',
      userId: user.id ? user.id.toString() : undefined
    } as import('../../../core/services/order-service').Order;
    this.orderService.placeOrder(order).subscribe({
      next: () => {
        this.cartService.clearCart();
        alert('Order placed successfully!');
        this.router.navigate(['/order-summary']);
      },
      error: () => {
        alert('Failed to place order. Please try again.');
      }
    });
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Store order data for order-summary component
    localStorage.setItem('orderSummary', JSON.stringify({
      items: this.cartItems,
      totalAmount: this.totalAmount
    }));

    this.router.navigate(['/order-summary'], {
      state: {
        orderDetails: this.cartItems,
        totalAmount: this.totalAmount
      }
    });
  }
}
