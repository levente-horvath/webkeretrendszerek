export interface User {
    id: string;
    email: string;
    displayName: string;
    address: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    phoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
    wishlist: string[]; // Product IDs
    orderHistory: string[]; // Order IDs
} 