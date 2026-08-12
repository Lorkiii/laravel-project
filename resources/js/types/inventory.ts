export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type StockOutReason = 'Customer Sale' | 'Internal Request';

export type InventoryItem = {
    id: number;
    name: string;
    sku: string;
    quantity: number;
    minimum_stock: number;
    is_active: boolean;
    stock_status: StockStatus;
};

export type StockMovement = {
    id: number;
    product: {
        name: string;
        sku: string;
    };
    quantity: number;
    reason: StockOutReason;
    reference: string | null;
    notes: string | null;
    recorded_by: string;
    created_at: string;
};
