import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Body } from "../../shared/body/body";
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ProductGrid } from '../../features/products/product-grid/product-grid';


@Component({
  selector: 'app-home',
  imports: [ Body,Header,Footer,ProductGrid,RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
