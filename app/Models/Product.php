<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'sku',
        'category_id',
        'brand',
        'model',
        'description',
        'price',
        'quantity',
        'minimum_stock',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'minimum_stock' => 'decimal:2',
            'quantity' => 'integer',
            'status' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * @return 'in_stock'|'low_stock'|'out_of_stock'
     */
    public function stockStatus(): string
    {
        $quantity = (int) $this->quantity;

        if ($quantity === 0) {
            return 'out_of_stock';
        }

        if ($quantity <= (float) $this->minimum_stock) {
            return 'low_stock';
        }

        return 'in_stock';
    }
}
