import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order-service';
import { Header } from "../../../layout/header/header";
import { Footer } from "../../../layout/footer/footer";

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, DatePipe, Header, Footer],
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.css']
})
export class OrderDetailsComponent implements OnInit {

  order: Order | undefined;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderById(orderId).subscribe({
        next: (order) => {
          this.order = order;
        },
        error: () => {
          console.error('Order not found!');
          // Optional: Redirect to order history or show a message
        }
      });
    }
  }
}
