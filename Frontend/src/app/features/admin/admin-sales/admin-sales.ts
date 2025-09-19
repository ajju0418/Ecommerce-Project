import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../../core/services/order-service';

@Component({
  selector: 'app-admin-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-sales.html',
  styleUrl: './admin-sales.css'
})
export class AdminSales implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders || [];
      },
      error: (error: any) => {
        console.error('Failed to load orders:', error);
        this.orders = [];
      }
    });
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTotalSales(): number {
    return this.orders.reduce((total, order) => total + order.totalAmount, 0);
  }

  getCompletedOrders(): number {
    return this.orders.filter(order => order.status === 'completed').length;
  }

  getAverageOrderValue(): number {
    if (this.orders.length === 0) return 0;
    const total = this.getTotalSales();
    return total / this.orders.length;
  }

  getTodaysOrders(): number {
    const today = new Date().toDateString();
    return this.orders.filter(order =>
      new Date(order.orderDate).toDateString() === today
    ).length;
  }

  acceptOrder(order: Order) {
    if (confirm(`Accept order ${order.id}?`) && order.id) {
      this.orderService.updateOrderStatus(order.id, 'processing').subscribe({
        next: () => this.loadOrders(),
        error: (error: any) => console.error('Failed to update order status:', error)
      });
    }
  }

  rejectOrder(order: Order) {
    if (confirm(`Reject order ${order.id}?`) && order.id) {
      this.orderService.updateOrderStatus(order.id, 'cancelled').subscribe({
        next: () => this.loadOrders(),
        error: (error: any) => console.error('Failed to update order status:', error)
      });
    }
  }

  completeOrder(order: Order) {
    if (confirm(`Mark order ${order.id} as completed?`) && order.id) {
      this.orderService.updateOrderStatus(order.id, 'completed').subscribe({
        next: () => this.loadOrders(),
        error: (error: any) => console.error('Failed to update order status:', error)
      });
    }
  }

  getPendingOrdersCount(): number {
    return this.orders.filter(order => order.status === 'pending').length;
  }

  getPaymentStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'processing': return 'status-processing';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
