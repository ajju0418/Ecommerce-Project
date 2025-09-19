import { Component, OnInit } from '@angular/core';
import { CanComponentDeactivate } from '../../../core/guards/unsaved-changes.guard';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order-service';
import { ProductListItem } from '../../../core/models/product.types';
import { Header } from '../../../layout/header/header';
import { Footer } from '../../../layout/footer/footer';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './order-summary.html',
  styleUrls: ['./order-summary.css']
})
export class OrderSummaryComponent implements OnInit, CanComponentDeactivate {

  orderDetails: ProductListItem[] = [];
  totalAmount: number = 0;
  customerName: string = '';
  contactInfo: string = '';
  shippingAddress: string = '';
  isFormSubmitted: boolean = false;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    // Try to get order details from navigation state or localStorage
    const nav = history.state;
    if (nav && nav.orderDetails && nav.totalAmount) {
      this.orderDetails = nav.orderDetails;
      this.totalAmount = nav.totalAmount;
    } else {
      // Fallback: try to get from localStorage (if you want to support refresh)
      const storedOrder = localStorage.getItem('orderSummary');
      if (storedOrder) {
        const parsed = JSON.parse(storedOrder);
        this.orderDetails = parsed.items;
        this.totalAmount = parsed.totalAmount;
      } else {
        alert('No order to display. Redirecting to cart.');
        this.router.navigate(['/home/cart']);
      }
    }
  }

  proceedToPay(form: NgForm): void {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }
    alert(`Payment of ₹${this.totalAmount.toFixed(2)} is done.`);
    const customerDetails = {
      name: this.customerName,
      email: this.customerName.toLowerCase().replace(/\s+/g, '') + '@example.com',
      phone: this.contactInfo,
      contact: this.contactInfo,
      address: this.shippingAddress
    };
    // Create guest user session if no user exists
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user.id) {
      user = {
        id: Date.now(),
        username: this.customerName,
        email: customerDetails.email,
        phone: this.contactInfo,
        gender: '',
        password: ''
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    const order = {
      items: this.orderDetails,
      totalAmount: this.totalAmount,
      customerInfo: {
        ...customerDetails,
        contact: Number(this.contactInfo)
      },
      orderDate: new Date(),
      status: 'pending',
      userId: user.id.toString()
    };
    this.orderService.placeOrder(order).subscribe({
      next: (response) => {
        // Store order locally as backup
        const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        localOrders.push({ ...order, id: response.id || Date.now().toString() });
        localStorage.setItem('userOrders', JSON.stringify(localOrders));
        
        this.isFormSubmitted = true;
        alert('Order placed successfully!');
        this.router.navigate(['/order-history']);
      },
      error: (error) => {
        console.error('Order placement failed:', error);
        // Fallback: save order locally
        const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        localOrders.push({ ...order, id: Date.now().toString() });
        localStorage.setItem('userOrders', JSON.stringify(localOrders));
        
        this.isFormSubmitted = true;
        alert('Order saved locally. Will sync when backend is available.');
        this.router.navigate(['/order-history']);
      }
    });
  }

  canDeactivate(): boolean {
    const hasUnsavedChanges = !this.isFormSubmitted &&
      (this.customerName || this.contactInfo || this.shippingAddress);
    return hasUnsavedChanges
      ? confirm('You have unsaved changes. Are you sure you want to leave this page?')
      : true;
  }
}
