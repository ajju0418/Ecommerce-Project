# Services Overview

All services have been updated to use HTTP client requests to the backend. No static data is used anywhere.

## Core Services

### 1. ProductService (`productservice.ts`)
- **Purpose**: Handles all product-related operations
- **Backend Endpoints**:
  - `GET /api/products` - Get paginated products
  - `GET /api/products/{id}` - Get product by ID
  - `GET /api/products/search` - Search products with filters
  - `GET /api/products/category/{category}` - Get products by category
  - `GET /api/products/gender/{gender}` - Get products by gender
  - `GET /api/products/categories` - Get all categories
  - `GET /api/products/brands` - Get all brands
  - `GET /api/products/featured` - Get featured products
  - `GET /api/products/new-arrivals` - Get new arrivals
  - `GET /api/products/sale` - Get sale products
  - `GET /api/products/deals-of-the-day` - Get daily deals

### 2. CartService (`cart-Service.ts`)
- **Purpose**: Manages shopping cart operations
- **Backend Endpoints**:
  - `GET /api/cart/{userId}` - Get user's cart
  - `POST /api/cart/add` - Add item to cart
  - `PUT /api/cart/update` - Update cart item quantity
  - `DELETE /api/cart/remove/{productId}` - Remove item from cart
  - `DELETE /api/cart/clear/{userId}` - Clear entire cart
  - `POST /api/cart/sync` - Sync cart with backend

### 3. UserService (`user-service.ts`)
- **Purpose**: Handles user authentication and management
- **Backend Endpoints**:
  - `POST /api/auth/login` - User login
  - `POST /api/auth/register` - User registration
  - `POST /api/admin/auth/login` - Admin login
  - `GET /api/users/list` - Get all users (admin)
  - `POST /api/users` - Create user
  - `PUT /api/users/{id}` - Update user
  - `DELETE /api/users/{id}` - Delete user

### 4. OrderService (`order-service.ts`)
- **Purpose**: Manages order operations
- **Backend Endpoints**:
  - `POST /api/orders` - Place new order
  - `GET /api/orders` - Get all orders
  - `GET /api/orders/user/{userId}` - Get orders by user
  - `GET /api/orders/{orderId}` - Get order by ID
  - `PATCH /api/orders/{orderId}/status` - Update order status

### 5. ProductInventoryService (`product-inventory.service.ts`)
- **Purpose**: Admin product inventory management
- **Backend Endpoints**:
  - `GET /api/admin/products` - Get all products for admin
  - `GET /api/admin/products/{id}` - Get product by ID
  - `POST /api/admin/products` - Create new product
  - `PUT /api/admin/products/{id}` - Update product
  - `DELETE /api/admin/products/{id}` - Delete product
  - `GET /api/admin/products/status` - Get products by status
  - `GET /api/admin/products/category` - Get products by category
  - `GET /api/admin/products/stats` - Get inventory statistics
  - `PATCH /api/admin/products/{id}/stock` - Update stock quantity

### 6. AdminProductService (`adminproductservice.ts`)
- **Purpose**: Admin product management operations
- **Backend Endpoints**:
  - `GET /api/products` - Get products
  - `GET /api/products/{id}` - Get product by ID
  - `POST /api/products` - Create product
  - `PUT /api/products/{id}` - Update product
  - `DELETE /api/products/{id}` - Delete product

## New Services Added

### 7. AnalyticsService (`analytics.service.ts`)
- **Purpose**: Dashboard analytics and reporting
- **Backend Endpoints**:
  - `GET /api/analytics/sales` - Get sales data
  - `GET /api/analytics/customers` - Get customer analytics
  - `GET /api/analytics/products` - Get product analytics
  - `GET /api/analytics/revenue/category` - Get revenue by category
  - `GET /api/analytics/orders/trends` - Get order trends
  - `GET /api/analytics/dashboard/summary` - Get dashboard summary

### 8. NotificationService (`notification.service.ts`)
- **Purpose**: Real-time notifications management
- **Backend Endpoints**:
  - `GET /api/notifications` - Get notifications
  - `GET /api/notifications/unread/count` - Get unread count
  - `PATCH /api/notifications/{id}/read` - Mark as read
  - `PATCH /api/notifications/read-all` - Mark all as read
  - `DELETE /api/notifications/{id}` - Delete notification
  - `POST /api/notifications` - Create notification

### 9. SearchService (`search.service.ts`)
- **Purpose**: Advanced product search and filtering
- **Backend Endpoints**:
  - `GET /api/search/products` - Search products with filters
  - `GET /api/search/suggestions` - Get search suggestions
  - `GET /api/search/popular` - Get popular searches
  - `GET /api/search/filters` - Get available filters

### 10. WishlistService (`wishlist.service.ts`)
- **Purpose**: User wishlist management
- **Backend Endpoints**:
  - `GET /api/wishlist/{userId}` - Get user wishlist
  - `POST /api/wishlist/add` - Add to wishlist
  - `DELETE /api/wishlist/remove/{userId}/{productId}` - Remove from wishlist
  - `DELETE /api/wishlist/clear/{userId}` - Clear wishlist

## Updated Services

### 11. AdminAuthService (`admin-auth.service.ts`)
- **Added Backend Integration**:
  - `POST /api/admin/auth/validate` - Validate admin token
  - `GET /api/admin/profile` - Get admin profile
  - `POST /api/admin/auth/logout` - Admin logout

### 12. SharedDataService (`shared-data.service.ts`)
- **Removed Static Data**: Now fetches from backend
- **Backend Endpoints**:
  - `GET /api/products` - Get products
  - `GET /api/orders` - Get orders

### 13. AdminSyncService (`admin-sync.service.ts`)
- **Added Real-time Sync**: Periodic data refresh from backend
- **Backend Endpoints**:
  - `GET /api/products` - Get products
  - `GET /api/admin/dashboard/stats` - Get dashboard stats
  - `GET /api/admin/dashboard/activity` - Get recent activity

## Environment Configuration

All services use the API Gateway configuration:
```typescript
environment.apiUrl = 'http://localhost:8080/api'
```

## Microservices Architecture

**API Gateway**: `http://localhost:8080`
- Routes all requests with `/api/` prefix to appropriate microservices
- Handles CORS for frontend at `http://localhost:4200`

**Available Microservices**:
- **Product Service**: Handles all product operations
- **User Service**: Handles authentication and user management  
- **Admin Service**: Handles admin operations and dashboard
- **Cart Service**: Handles shopping cart operations
- **Order Service**: Handles order management

**Service Discovery**: Eureka Server at `http://localhost:8761`

## Key Features

1. **No Static Data**: All data comes from backend APIs
2. **Error Handling**: Graceful fallback to localStorage when backend is unavailable
3. **Real-time Updates**: Periodic sync for admin dashboard
4. **Authentication**: JWT token-based authentication with interceptors
5. **Caching**: Local storage fallback for offline functionality
6. **Type Safety**: Full TypeScript interfaces for all data models

## Usage

Each service is injectable and can be used in components:

```typescript
constructor(
  private productService: Productservice,
  private cartService: cartService,
  private userService: UserService
) {}
```

All services return Observables for reactive programming patterns.