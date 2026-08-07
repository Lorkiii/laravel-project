import type { Product } from '@/types/product';

export const productFixtures: Product[] = [
    { id: 1, name: 'Wireless Keyboard', sku: 'ACC-WK-001', description: 'Compact wireless keyboard.', price: 49.99, quantity: 84, minimum_stock: 20, status: 'active', category_id: 1, category: 'Accessories', brand: 'Keychron' },
    { id: 2, name: 'USB-C Hub 7-in-1', sku: 'ACC-HB-002', description: 'Multi-port USB-C connectivity hub.', price: 39.5, quantity: 32, minimum_stock: 15, status: 'active', category_id: 1, category: 'Accessories', brand: 'Anker' },
    { id: 3, name: '27-inch 4K Monitor', sku: 'DIS-MN-003', description: 'Professional 4K monitor.', price: 449, quantity: 12, minimum_stock: 10, status: 'active', category_id: 2, category: 'Displays', brand: 'Dell' },
    { id: 4, name: 'Ergonomic Office Chair', sku: 'FUR-CH-004', description: 'Adjustable mesh office chair.', price: 299, quantity: 7, minimum_stock: 10, status: 'active', category_id: 3, category: 'Furniture', brand: 'Herman Miller' },
    { id: 5, name: 'Laptop Stand', sku: 'FUR-LS-005', description: 'Aluminum adjustable laptop stand.', price: 64.95, quantity: 46, minimum_stock: 12, status: 'active', category_id: 3, category: 'Furniture', brand: 'Rain Design' },
    { id: 6, name: 'Noise Cancelling Headphones', sku: 'AUD-NC-006', description: 'Over-ear wireless headphones.', price: 349, quantity: 23, minimum_stock: 8, status: 'active', category_id: 4, category: 'Audio', brand: 'Sony' },
    { id: 7, name: 'Portable SSD 1TB', sku: 'STO-SS-007', description: 'Fast portable solid-state drive.', price: 109.99, quantity: 61, minimum_stock: 15, status: 'active', category_id: 5, category: 'Storage', brand: 'Samsung' },
    { id: 8, name: 'Mechanical Mouse', sku: 'ACC-MS-008', description: 'Precision wireless mouse.', price: 79, quantity: 4, minimum_stock: 10, status: 'active', category_id: 1, category: 'Accessories', brand: 'Logitech' },
    { id: 9, name: 'Standing Desk', sku: 'FUR-SD-009', description: 'Electric height-adjustable desk.', price: 599, quantity: 16, minimum_stock: 5, status: 'active', category_id: 3, category: 'Furniture', brand: 'FlexiSpot' },
    { id: 10, name: 'Webcam Pro', sku: 'VID-WC-010', description: 'Full HD conference webcam.', price: 129, quantity: 29, minimum_stock: 8, status: 'active', category_id: 6, category: 'Video', brand: 'Logitech' },
    { id: 11, name: 'HDMI Cable 2m', sku: 'ACC-HM-011', description: 'High-speed HDMI cable.', price: 18.5, quantity: 112, minimum_stock: 25, status: 'active', category_id: 1, category: 'Accessories', brand: 'Belkin' },
    { id: 12, name: 'Document Scanner', sku: 'OFF-SC-012', description: 'Compact duplex document scanner.', price: 279, quantity: 0, minimum_stock: 5, status: 'inactive', category_id: 7, category: 'Office Equipment', brand: 'Epson' },
    { id: 13, name: 'Bluetooth Speaker', sku: 'AUD-BS-013', description: 'Portable water-resistant speaker.', price: 89.99, quantity: 38, minimum_stock: 10, status: 'active', category_id: 4, category: 'Audio', brand: 'JBL' },
];

export const productCategories = [...new Set(productFixtures.map((product) => product.category))].sort();
