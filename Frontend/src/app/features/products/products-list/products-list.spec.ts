import { cartService } from '../../../core/services/cart-Service';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsList } from './products-list';
import { Productservice } from '../../../core/services/productservice';

describe('ProductsList', () => {
  let component: ProductsList;
  let fixture: ComponentFixture<ProductsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsList],
      providers: [Productservice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
