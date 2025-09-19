import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Header } from '../../../layout/header/header';
import { Footer } from '../../../layout/footer/footer';
import { ProductsList } from '../products-list/products-list';

@Component({
  selector: 'app-product-page',
  imports: [ProductsList, Header, Footer],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css'
})
export class ProductPage implements OnInit {
  categoryFilter: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Listen for category changes from query parameters
    this.route.queryParams.subscribe(params => {
      this.categoryFilter = params['category'] || '';
    });
  }
}
