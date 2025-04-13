export interface Category {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    parentCategoryId?: string;
    subCategories: string[]; // Category IDs
    productCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    displayOrder: number;
} 