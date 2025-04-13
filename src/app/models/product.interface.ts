export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    stock: number;
    rating: number;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
    material: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
} 