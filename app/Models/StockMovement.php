<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
    public const TYPE_STOCK_OUT = 'stock_out';

    public const REASON_CUSTOMER_SALE = 'Customer Sale';

    public const REASON_INTERNAL_REQUEST = 'Internal Request';

    public const STOCK_OUT_REASONS = [
        self::REASON_CUSTOMER_SALE,
        self::REASON_INTERNAL_REQUEST,
    ];

    protected $fillable = [
        'product_id',
        'user_id',
        'quantity',
        'type',
        'reason',
        'reference',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
