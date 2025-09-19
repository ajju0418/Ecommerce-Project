import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order-service';
import { Header } from "../../../layout/header/header";
import { Footer } from "../../../layout/footer/footer";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, DatePipe, Header, Footer],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistoryComponent implements OnInit, OnDestroy {

  orders: Order[] = [];
  private ordersSubscription!: Subscription;

  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.loadOrders();
    // Refresh orders every 30 seconds to show status updates
    setInterval(() => this.loadOrders(), 30000);
  }

  private loadOrders(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = user.id?.toString();
    
    if (userId) {
      // Always fetch orders from backend for logged-in users
      this.orderService.getOrdersByUser(userId).subscribe({
        next: (orders) => {
          this.orders = orders;
        },
        error: () => {
          // Fallback to local orders only if backend fails
          const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
          this.orders = localOrders.filter((order: any) => order.userId === userId);
        }
      });
    } else {
      // TODO: Integrate backend API for guest orders when available
      // Currently using static localStorage data for guest users
      const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      this.orders = localOrders;
    }
  }

  ngOnDestroy(): void {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
  }

  // Method to view the order details page
  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/order-details', orderId]);
  }

  // Method to view the track order page
  trackOrder(orderId: string): void {
    this.router.navigate(['/track-order', orderId]);
  }
}
