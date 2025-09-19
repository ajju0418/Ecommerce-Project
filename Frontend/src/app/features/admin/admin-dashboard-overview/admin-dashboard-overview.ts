import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../../core/services/order-service';
import { SharedDataService } from '../../../core/services/shared-data.service';

@Component({
  selector: 'app-admin-dashboard-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-overview.html',
  styleUrl: './admin-dashboard-overview.css'
})
export class AdminDashboardOverview implements OnInit {
  orders: Order[] = [];
  products: any[] = [];
  stats: any[] = [];
  recentOrders: any[] = [];
  topProducts: any[] = [];

  constructor(
    private orderService: OrderService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit() {
    this.orderService.getAllOrders().subscribe((response: any) => {
      this.orders = Array.isArray(response) ? response : (response.content || []);
      this.products = this.sharedDataService.getProducts();
      this.updateStats();
      this.updateRecentOrders();
      this.updateTopProducts();
    });
  }

  private updateStats() {
    const totalSales = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const uniqueCustomers = new Set(this.orders.map(order => order.customerInfo.email)).size;

    this.stats = [
      { title: 'Total Sales', value: `₹${totalSales.toLocaleString()}`, change: '+12.5%', icon: '💰', color: 'bg-green-500' },
      { title: 'Total Orders', value: this.orders.length.toString(), change: '+8.2%', icon: '📦', color: 'bg-blue-500' },
      { title: 'Total Customers', value: uniqueCustomers.toString(), change: '+15.3%', icon: '👥', color: 'bg-purple-500' },
      { title: 'Total Products', value: this.products.length.toString(), change: '+5.7%', icon: '🏷️', color: 'bg-orange-500' }
    ];
  }

  private updateRecentOrders() {
    this.recentOrders = this.orders
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 4)
      .map(order => ({
        id: order.id,
        customer: order.customerInfo.name,
        product: order.items[0]?.name || 'Multiple Items',
        amount: `₹${order.totalAmount.toLocaleString()}`,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1)
      }));
  }

  private updateTopProducts() {
    const productSales = new Map();

    this.orders.forEach(order => {
      order.items.forEach((item: any) => {
        if (productSales.has(item.name)) {
          const existing = productSales.get(item.name);
          existing.sales += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          productSales.set(item.name, {
            name: item.name,
            sales: item.quantity,
            revenue: item.price * item.quantity
          });
        }
      });
    });

    this.topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)
      .map(product => ({
        ...product,
        revenue: `₹${product.revenue.toLocaleString()}`
      }));
  }
}
