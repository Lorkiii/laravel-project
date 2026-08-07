export type ProductStatus = 'active' | 'inactive';

export type Product = {
    id: number;
    name: string;
    sku: string;
    description: string | null;
    price: number;
    quantity: number;
    minimum_stock: number;
    status: ProductStatus;
    category_id: number;
    category: string;
    brand: string;
};

export type ProductFormValues = {
    name: string;
    sku: string;
    brand: string;
    category: string;
    description: string;
    price: string;
    quantity: string;
    minimum_stock: string;
    status: boolean;
};

