import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order-service';
import { Header } from '../../../layout/header/header';
import { Footer } from "../../../layout/footer/footer";

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './track-order.html',
  styleUrls: ['./track-order.css']
})
export class TrackOrderComponent implements OnInit {
  orderId: string | null = null;
  order: Order | null = null;
  trackingStatus: string = 'pending';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.loadOrderDetails();
    }
  }

  loadOrderDetails() {
    if (this.orderId) {
      this.orderService.getOrderById(this.orderId).subscribe({
        next: (order) => {
          this.order = order;
          this.trackingStatus = order.status;
        },
        error: () => {
          this.order = null;
          this.trackingStatus = 'pending';
        }
      });
    }
  }

  isStepCompleted(step: string): boolean {
    const steps = ['pending', 'processing', 'completed'];
    const currentIndex = steps.indexOf(this.trackingStatus);
    const stepIndex = steps.indexOf(step);
    return stepIndex <= currentIndex && this.trackingStatus !== 'cancelled';
  }

  getStatusMessage(): string {
    switch (this.trackingStatus) {
      case 'pending': return 'Order placed and waiting for confirmation';
      case 'processing': return 'Order confirmed and being prepared';
      case 'completed': return 'Order delivered successfully';
      case 'cancelled': return 'Order has been cancelled';
      default: return 'Order status unknown';
    }
  }
}
