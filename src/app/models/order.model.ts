export interface Order {
  id: string;
  userId: string;
  products: { productId: string; quantity: number }[];
  totalAmount: number;
  orderDate: Date;
}
