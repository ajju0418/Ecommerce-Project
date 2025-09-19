export interface ProductListItem {
  id: string,
  name: string,
  price: number,
  imageUrl: string,
  rating: number,
  quantity?: number,
  category?: string,
  originalPrice?: number,
  brand?: string,
  description?: string,
  stock?: number,
  status?: string,
  collection?: string,
  type?: string,
  gender?: string
}
