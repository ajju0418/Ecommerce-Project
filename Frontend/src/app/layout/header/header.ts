import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../core/services/user-service';
import { User } from '../../core/models/user.model';
import { FormsModule } from '@angular/forms';
import { cartService } from '../../core/services/cart-Service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, OnDestroy {
  open = false;
  currentUser: User | null = null;
  cartCount = 0;
  showUserDropdown = false;
  private userSub!: Subscription;
  private cartSub!: Subscription;

  constructor(public router: Router, private userService: UserService, private cartService: cartService) {}

  ngOnInit(): void {
    // Initialize user from service first
    this.currentUser = this.userService.getCurrentUser();
    console.log('Header: Initial user from service:', this.currentUser);

    // Subscribe to user changes
    this.userSub = this.userService.currentUser$.subscribe(user => {
      console.log('Header: User service updated:', user);
      this.currentUser = user;
    });

    // Subscribe to cart changes
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((count, item) => count + (item.quantity || 0), 0);
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  hideUserDropdown() {
    this.showUserDropdown = false;
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/landing-page']);
    this.hideUserDropdown();
  }
}
