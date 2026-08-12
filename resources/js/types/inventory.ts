export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type StockMovementType = 'stock_in' | 'stock_out' | 'adjustment';

export type StockInReason = 'Purchase' | 'Return' | 'Transfer In' | 'Other';

export type StockOutReason = 'Customer Sale' | 'Internal Request';

export type StockAdjustmentReason =
    | 'Cycle Count'
    | 'Damage'
    | 'Correction'
    | 'Other';

export type InventoryItem = {
    id: number;
    name: string;
    sku: string;
    quantity: number;
    minimum_stock: number;
    is_active: boolean;
    stock_status: StockStatus;
};

export type StockMovementProductOption = {
    id: number;
    name: string;
    sku: string;
    quantity: number;
    is_active: boolean;
    selectable: boolean;
};

export type StockMovement = {
    id: number;
    product: {
        name: string;
        sku: string;
    };
    type: StockMovementType;
    quantity: number;
    reason: string | null;
    reference: string | null;
    notes: string | null;
    recorded_by: string;
    created_at: string;
};
