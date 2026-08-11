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
    model: string;
};

export type ProductFormValues = {
    name: string;
    brand: string;
    model: string;
    category_id: string;
    description: string;
    price: number | string;
    quantity: number | string;
    minimum_stock: number | string;
    status: boolean;
};
