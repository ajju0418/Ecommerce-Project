
import { Routes } from '@angular/router';
import { NotFound } from './pages/not-found/not-found';
import { Home } from './pages/home/home';
import { CartComponent } from './features/cart/cart/cart';
import { ProductPage } from './features/products/product-page/product-page';
import { UserLogin } from './features/auth/user-admin-login/user-login';
import { UserRegister } from './features/auth/user-register/user-register';
import { AboutUs } from './pages/about-us/about-us';
import { ContactUs } from './pages/contact-us/contact-us';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { AdminDashboardOverview } from './features/admin/admin-dashboard-overview/admin-dashboard-overview';
import { AdminProducts } from './features/admin/admin-products/admin-products';
import { AdminSales } from './features/admin/admin-sales/admin-sales';
import { AdminCustomers } from './features/admin/admin-customers/admin-customers';
import { Adminlogin } from './features/auth/adminlogin/adminlogin';
import { OrderSummaryComponent } from './features/orders/order-summary/order-summary';
import { OrderHistoryComponent } from './features/orders/order-history/order-history';
import { TrackOrderComponent } from './features/orders/track-order/track-order';
import { OrderDetailsComponent } from './features/orders/order-details/order-details';
import { UserProfile } from './features/user/user-profile/user-profile';
import { UnsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { AuthGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: UserLogin },
  { path: 'register', component: UserRegister, canDeactivate: [UnsavedChangesGuard] },

  // Protected user routes
  { path: 'home', component: Home,},
  { path: 'home/cart', component: CartComponent, },
  { path: 'products-page', component: ProductPage,  },
  { path: 'aboutus', component: AboutUs, },
  {
  path: 'contact-us',
  component: ContactUs,
  canDeactivate: [UnsavedChangesGuard]
},

  {
  path: 'order-summary',
  component: OrderSummaryComponent,

  canDeactivate: [UnsavedChangesGuard]
},
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'order-details/:id', component: OrderDetailsComponent },
  { path: 'track-order/:id', component: TrackOrderComponent },
  { path: 'profile', component: UserProfile, canActivate: [AuthGuard] },
  { path: 'adminlogin', component: Adminlogin },
  {
  path: 'admin',
  component: AdminDashboard,
  canActivate: [AdminGuard],
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: AdminDashboardOverview },
    { path: 'products', component: AdminProducts },
    { path: 'sales', component: AdminSales },
    { path: 'customers', component: AdminCustomers }
  ]},
  { path: '**', component: NotFound }
];
