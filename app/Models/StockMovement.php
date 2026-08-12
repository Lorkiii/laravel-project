<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
    public const TYPE_STOCK_IN = 'stock_in';

    public const TYPE_STOCK_OUT = 'stock_out';

    public const TYPE_ADJUSTMENT = 'adjustment';

    public const TYPES = [
        self::TYPE_STOCK_IN,
        self::TYPE_STOCK_OUT,
        self::TYPE_ADJUSTMENT,
    ];

    public const REASON_PURCHASE = 'Purchase';

    public const REASON_RETURN = 'Return';

    public const REASON_TRANSFER_IN = 'Transfer In';

    public const REASON_OTHER = 'Other';

    public const STOCK_IN_REASONS = [
        self::REASON_PURCHASE,
        self::REASON_RETURN,
        self::REASON_TRANSFER_IN,
        self::REASON_OTHER,
    ];

    public const REASON_CUSTOMER_SALE = 'Customer Sale';

    public const REASON_INTERNAL_REQUEST = 'Internal Request';

    public const STOCK_OUT_REASONS = [
        self::REASON_CUSTOMER_SALE,
        self::REASON_INTERNAL_REQUEST,
    ];

    public const REASON_CYCLE_COUNT = 'Cycle Count';

    public const REASON_DAMAGE = 'Damage';

    public const REASON_CORRECTION = 'Correction';

    public const ADJUSTMENT_REASONS = [
        self::REASON_CYCLE_COUNT,
        self::REASON_DAMAGE,
        self::REASON_CORRECTION,
        self::REASON_OTHER,
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
