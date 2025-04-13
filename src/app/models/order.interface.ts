export interface Order {
    id: string;
    userId: string;
    items: {
        productId: string;
        quantity: number;
        priceAtPurchase: number;
    }[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    createdAt: Date;
    updatedAt: Date;
    estimatedDeliveryDate: Date;
    trackingNumber?: string;
} 